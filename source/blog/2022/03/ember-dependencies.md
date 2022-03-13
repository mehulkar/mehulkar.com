---
title: Analyzing package.json in a new Ember app
date: 2022-03-13
categories: programming, frontend, javascript, ember.js
---

The first think I notice is that there are no `dependencies`, only `devDependencies`. That seems
normal for a frontend app, as this is not an `npm` package and we are not publishing an artifact.
Every dependency is used at build time, even though it may be used in "production".

In this post, I look at every dependency, attempt to explain what it does, and, in some cases
share my opinion about it. My goal is to understand why Ember apps have _37_ top-level dependencies,
and, in some cases, propose how they could be cut down.

For comparison, here are some other frameworks:

| Framework                      | `devDependencies` | `dependencies` |
| ------------------------------ | ----------------- | -------------- |
| Angular (yes to all options)   | 12                | 11             |
| Vue (yes to all options)       | 20                | 3              |
| SvelteKit (yes to all options) | 15                |                |
| Svelte                         | 8 (+1)            |                |
| SvelteKit                      | 3                 | 1              |
| Create React App               | 0                 | 7              |

Note that this post is _only_ concerned with top-level dependencies, from the
viewpoint of an application developer. I understand that a low number of top-level
dependencies does not inherently mean a smaller `node_modules/`, a smaller
JS bundle for end-users, or even a small number of overall dependencies.

If some meaning were to be drawn from this post, it would be somewhere along
the lines of developer experience for application maintainers (i.e. the customers
of the framework). The DX matters here for two reasons: (1) maintaining dependencies
(and their compatibilities), and (2) composition patterns for build tooling.

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

----

## The Runtime (5 packages)

These packages are the meat of an Ember.js application.

- `ember-source`

    This is the real meat of the Ember.js runtime. It contains the router; base classes for components, helpers,
    controllers, routes; built-in components, etc.

    **TODO*:: Research this more.

- `@glimmer/component`

    This contains the new `Component` base class. I am vaguely aware that it was an explicit
    decision to publish this as a separate package, but that decision does not really benefit
    end-users starting a new Ember app today.

- `@glimmer/tracking`

    This contains a JS decorator that can make class fields "reactive". Simplistically, it wraps
    values in a `Proxy` object such that it can bookkeep `set`s, and notify `get`s that the value
    has changed.

- `ember-data`

    This is an abstraction over `fetch` + a client-side "database". It provides some low-level
    and high-level abstractions around how to interact with your server.

- `ember-resolver`

    This interacts with Ember's Dependency Injection system. It gives Ember itself and app
    developers a way to inject and retreive objects from each other. DI has some benefits in
    an Object Oriented Programming and I won't pretend to be knowledgeable about those, but
    in Ember, _much_ of the interaction between objects happens through this system
    and ember-resolver provides the means to do this.

    **TODO**: Why is this a separate package?
    **TODO**: Look at the package and see the exports, etc.

---

## Nice to Haves

- `ember-load-initializers`
- `ember-cli-app-version`
- `@ember/optional-features`
- `ember-cli-sri`
- `ember-fetch`
- `ember-export-application-global`
- `ember-welcome-page`
- `ember-page-title`

---

## Building `dist/`

- `ember-cli`
- `ember-cli-babel`
- `ember-auto-import`
- `ember-cli-htmlbars`
- `broccoli-asset-rev`
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

---

## Linting

- `babel-eslint`
- `ember-template-lint`
- `eslint`
- `eslint-config-prettier`
- `eslint-plugin-ember`
- `eslint-plugin-node`
- `eslint-plugin-prettier`
- `eslint-plugin-qunit`
- `ember-cli-dependency-checker`
- `prettier`

---

## Testing

- `@ember/test-helpers`
- `ember-qunit`
- `qunit`
- `qunit-dom`

---
## ??

- `ember-cli-inject-live-reload`
- `npm-run-all`
- `loader.js`
