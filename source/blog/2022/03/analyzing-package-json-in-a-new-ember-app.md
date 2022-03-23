---
title: Analyzing package.json in a new Ember app
date: 2022-03-13
categories: programming, frontend, javascript, ember.js
---

The first thing I notice is that there are no `dependencies`, only `devDependencies`. That seems
normal for a frontend app, as this is not an `npm` package, and we are not publishing an artifact.
Every dependency is used at build time, even though it may be creating a production build.

In this post, I look at every dependency and attempt to explain what it does. My goal is to
understand why Ember apps have 37 top-level dependencies, and, in some cases, propose how they
could be cut down.

Note that I'm _only_ concerned with top-level dependencies in this post. A low number of
top-level dependencies does *not* inherently mean a smaller `node_modules/` directory, a smaller
JS bundle for end-users, or even a small number of overall dependencies.

If some meaning were to be drawn from this post, it would be somewhere along
the lines of developer experience for application maintainers (i.e. the customers
of the framework). The DX matters here for two reasons: (1) maintaining dependencies
(and their compatibilities), and (2) composition patterns for build tooling.

For comparison, here are some other frameworks:

| Framework                      | `devDependencies` | `dependencies` |
| ------------------------------ | ----------------- | -------------- |
| Ember                          | 37                | 0              |
| Vue (yes to all options)       | 20                | 3              |
| Angular (yes to all options)   | 12                | 11             |
| SvelteKit (yes to all options) | 15                |                |
| Svelte                         | 8 (+1)            |                |
| SvelteKit                      | 3                 | 1              |
| Create React App               | 0                 | 7              |

So let's begin.

---

First, here's the output of a fresh ember-app with the latest versions:

```bash
npx ember-cli@4 new ember-deps
```

```json
{
  "devDependencies": {
    "@ember/optional-features": "^2.0.0",
    "@ember/test-helpers": "^2.6.0",
    "@glimmer/component": "^1.0.4",
    "@glimmer/tracking": "^1.0.4",
    "babel-eslint": "^10.1.0",
    "broccoli-asset-rev": "^3.0.0",
    "ember-auto-import": "^2.4.0",
    "ember-cli": "~4.2.0",
    "ember-cli-app-version": "^5.0.0",
    "ember-cli-babel": "^7.26.11",
    "ember-cli-dependency-checker": "^3.2.0",
    "ember-cli-htmlbars": "^6.0.1",
    "ember-cli-inject-live-reload": "^2.1.0",
    "ember-cli-sri": "^2.1.1",
    "ember-cli-terser": "^4.0.2",
    "ember-data": "~4.2.0",
    "ember-export-application-global": "^2.0.1",
    "ember-fetch": "^8.1.1",
    "ember-load-initializers": "^2.1.2",
    "ember-page-title": "^7.0.0",
    "ember-qunit": "^5.1.5",
    "ember-resolver": "^8.0.3",
    "ember-source": "~4.2.0",
    "ember-template-lint": "^4.2.0",
    "ember-welcome-page": "^6.1.0",
    "eslint": "^7.32.0",
    "eslint-config-prettier": "^8.4.0",
    "eslint-plugin-ember": "^10.5.9",
    "eslint-plugin-node": "^11.1.0",
    "eslint-plugin-prettier": "^4.0.0",
    "eslint-plugin-qunit": "^7.2.0",
    "loader.js": "^4.7.0",
    "npm-run-all": "^4.1.5",
    "prettier": "^2.5.1",
    "qunit": "^2.18.0",
    "qunit-dom": "^2.0.0",
    "webpack": "^5.69.1"
  }
}
```

## The Runtime (5 packages)

These packages are the meat of an Ember.js application.

- `ember-source`

  This is the real meat of the Ember.js runtime. It contains the base Application class that
  reads the URL, initializes the router, and chooses the Javascript to run when the script
  executes in an HTML file. It also contains the abstractions (in the form of base classes)
  for developers to write UI components, singleton services, and "helpers" for HTMLBars templates.

- `@glimmer/component`

  This contains the new `Component` base class. I am vaguely aware that it was an explicit
  decision to publish this as a separate package, but that decision does not benefit
  end-users starting a new Ember app today. In fact, it adds a fair amount of complication,
  because it is not clear if addons that contain UI components should declare this package
  as a dependency. If they do, there is always the chance of a conflict with the parent app.
  If they don't, the parent app would be required to have this dependency. It is technically
  possible to use this package outside of Ember applications, but it is not a common use case.

- `@glimmer/tracking`

  This contains a JS `@decorator` that can make class fields reactive. [Simplistically][1], it wraps
  values in a `Proxy` object and bookkeeps `set`s, so it can notify `get`s that the value
  has changed. This was designed to be used outside Ember, but it's not clear to me if
  it's designed to be used with the glimmer VM.

- `ember-data`

  This is an abstraction over `fetch` and a client-side database. It has some low-level
  and high-level abstractions around how to interact with your server. It allows you to
  define schemas for record types, and then some query methods with some sophisticated
  reconciliation methods. For example, `store.findRecord('post', 1)` will only hit the
  network once.

- `ember-resolver`

  This package interacts with Ember's Dependency Injection system. It gives Ember itself
  and app developers a way to inject and retreive objects from each other. DI has some benefits
  in an Object Oriented Programming and I won't pretend to be knowledgeable about those, but
  in Ember, _much_ of the interaction between objects happens through this system
  and ember-resolver provides the means to do this. The class is passed to the `Ember.Application`
  when the latter is created, and that's the last we see of it. This could probably be built
  into `ember-source`, as there is very little need to customize it.

## Nice to Haves (8 packages)

- `ember-load-initializers`

  Loads the code in `app/initializers` and `app/instance-initializers/` directories,
  and makes it available for the Ember Application to run.

- [`ember-cli-app-version`](https://github.com/ember-cli/ember-cli-app-version)

  Adds a version number into the built JS based on `package.json`, or git `HEAD` into
  the config object at build time. This config object is available as an import to the
  application, other addons, and as a `<meta>` tag in the build HTML. This functionality could
  trivially be inlined into `ember-cli`.

- `@ember/optional-features`

  This is a transitional package that allowed the Ember team to let the community
  experiment with behavior changes without causing breaking changes. The package also
  adds an `ember feature` CLI tool, and codemods associated with the four "features" it
  currently hosts. While remarkable that Ember apps have been around long enough to need
  migrational tools, this could be part of the main `ember-cli` package. New features would
  need to be part of the regular release cycle, but that si already true.

- `ember-cli-sri`

  Configures and adds subresource integrity hashes to assets that are added to `index.html`.
  This is a nice feature, especially when deploying JS/CSS assets to a third party server,
  but there is no need for this package to be exposed to the application developer. It would
  be just as useful to be able to turn it off with configuration.

- `ember-fetch`

  Wrapper around `fetch` that works on web and in node. Should not be a separate package.

- `ember-export-application-global`

  Makes available (or not) the application's name as a global. Should not be a separate package.

- `ember-welcome-page`

  A component with a welcome message for new apps. Other than being a canonical example of an
  addon, there is no benefit to maintaining this package. In addition to a UI Component, this package
  contains a build script that prevents the UI component from being included in the production
  build. If the component were places in `app/components/` instead, it would be even more
  obvious to end users (especially in a new app) that they need to delete it.

- [`ember-page-title`](https://github.com/ember-cli/ember-page-title)

  A package with a Ember "Helper" that updates `<title>` on route transition.
  This was built as an accessibility feature, but it's not clear why it wasn't built
  into `ember-source`; either in its current form as `page-title` or as an API on `Route`
  classes.

## Building `dist/` (7 packages)

- `ember-cli`

  CLI commands, incorporating "addons", blueprints for generating new files.

- `ember-cli-babel`

  A collection of babel transforms, some specific to Ember, some more generic (including `@babel/preset-env`).
  Should be part of `ember-cli`.

- `ember-auto-import`

  Started as a community package and became part of the default blueprint. The original purpose
  was to make `import` and `import()` work. It works as a babel plugin that transforms imports
  into working code. All modern apps require this addon.

- `ember-cli-htmlbars`

  ??

- `broccoli-asset-rev`

  Fingerprints built JS and CSS assets and updates references everywhere it can find via a
  regex and string manipulation. Notable that this is `broccoli-*` package, as opposed to `ember-*`.
  Should be built into `ember-cli`.

- `ember-cli-terser`

  This injects `terser` into the right part of the pipeline. While it's _possible_
  to remove this dependency and forgo minification of your built JS assets, it's not really a
  supported path. A more useful pattern would be to build this into `ember-cli` and provide
  a hook, or other options.

- `webpack`

  This is required as a top level dependency for "compatibility with `ember-auto-import@2`.
  If you aren't paying close attention and don't have an intricate knowledge of the build,
  you can basically ignore this. But sadly, you still have to manage this dependency. In
  some future utopia, you may have the ability to configure webpack manually for your entire
  build.

## Testing (4 packages)

- `@ember/test-helpers`
- `ember-qunit`
- `qunit`
- `qunit-dom`

## Linting (9 packages)

- `ember-template-lint`

  Template linting. Includes rules for correctness, accessibility, and formatting.

- `eslint-plugin-ember`

  Contains eslint rules specific to Ember, which happy paths for development. These
  lint rules generally signal upcoming changes in the framework, and have the advantage
  of being able to flag potential problems by static analysis, but framework-level
  runtime warnings and/or deprecations would be just as useful.

- `eslint`
- `babel-eslint`
- `eslint-plugin-node`
- `eslint-plugin-qunit`
- `eslint-config-prettier`
- `eslint-plugin-prettier`
- `prettier`

## Grab Bag (4 packages)

- [`ember-cli-inject-live-reload`](https://github.com/ember-cli/ember-cli-inject-live-reload)

  Used by the `ember s` dev server for live reload. Useful feature, but should be built into
  `ember-cli`. There is no reason _not_ to have this package installed.

- `npm-run-all`
- `loader.js`
- `ember-cli-dependency-checker`

[1]: /blog/2017/09/simple-vs-simplistic/
