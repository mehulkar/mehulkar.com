---
title: "#EmberJS2019: Roadmap Response"
tags:
  - programming
  - frontend
  - ember.js
date: 2019-06-10
---

This post is in response to [Ember 2019 Call for Blog Posts][1].

## Intro

I've been using Ember since 0.8.7 (~2012), so I'm fairly comfortable with the public API and have
mostly kept up-to-date with the programming model. I've been pretty happy with the developer experience,
and feel like I can accomplish pretty much anything with the framework, so the perspective of
this post is from the the difficulty I have in convincing others in my team and company to use it.

The resistance to using Ember generally falls into these three tags:

1. React/Vue are clearly more popular
1. Bundle size and flexibility
1. Difficult to learn

I'll try to address the first two briefly, but the focus of this post is on the last category.

## React/Vue are clearly more popular

There are no _great_ argument for using Ember over React and Vue. Those who default to
these frameworks, do so because these frameworks are _en vogue_, and as far as JS frameworks go,
I think that's pretty good justification for the 80% case. The official marketing response for
Ember is "convention over configuration" or "batteries included". I think that's a strong argument
for teams that develop multiple large apps (e.g. consulting companies or internal tooling teams),
but for the majority of teams developing for the web, _en vogue_ is a fine place to start.

In other words, justifying the need for a "mature" framework for a hypothetical future where
the app might benefit from it is a hard sell. Only the very experienced or the very
inexperienced optimize for that.

So the challenge here is to [become _en vogue_][3], rather than to address specific developer
concerns.

## Bundle size and flexibility

Another common resistance against Ember is that it ships too much code. From what I can tell,
only _some_ of this sentiment is based on actual analysis of bundle size in context with user
patterns. For that small percentage, I think Ember is well poised, but should have a more official
story for:

- dynamic imports (`ember-auto-import`)
- code splitting / tree shaking ([Embroider][4])
- Web Components

For others, however, I think the "size" sentiment is more based on API size, rather than bundle
size. Although this larger API size enables a more complex (or _complete_) programming paradigm,
there are parts of it that can be boiled down so that newcomers can more easily understand an Ember
Application, how it works, and how to tear it apart. That is the focus of the next section.

## Difficult to learn

Others have already written about how to make Ember's programming model easier to get
started with. The new hotness in the Octane Edition (native classes and decorators) helps
get rid of Ember's Object model, but I don't think it solves the difficulty of learning Ember
for most people. For example, native classes are great, but from a learning standpoint,
it's not that different from `EmberObject.extend` either; the intricacies of `this._super()` vs
`super()` are only important in edge cases.

In real life, here are some things that could help people understand Ember better, in no particular
order:

### Container operations

The core of Ember's "convention over configuration" philosophy is the file structure. Components
live in `app/components`, services live in `app/services`, etc. What's hidden between these lines
though is that components and services are _required_ to live in these places or they are unusable
by Ember. More specifically, modules that aren't exported in the right place cannot be found by
Ember's built in resolver, and cannot be registered into the container, which means they aren't
available at runtime.

Ember CLI has had the ability to plugin in a custom resolver for a very long time now. In
theory, this enables users to change the file structure, but I believe this is the wrong abstraction.
Instead what we need is a lower level primitive to take ES6 modules and register them into Ember's
runtime "container". This will not only make it easier for developers to understand why the file
structure matters and is used internally, but will also enable new patterns such as co-locating
related modules and communicating intent for usage.

Some concrete use cases for this low-level primitive are:

- Defining and registering a `Helper` in a Component's JS file to indicate that it is only meant
  to be used in that component. (Locally scoping helpers defined in this way is a separate but
  related problem.)
- Enabling addons to explicitly register components/services rather than relying on merging them
  into the app's tree for the benefit of the resolver (more on this later).
- Registering "inner" components in the same place as the user facing API to them.
  (For example `focusing-outlet` and `focusing-inner` in ember-a11y) or default components for
  each part of `ember-power-select`.

An `app.register()` primitive would be just fine to accomplish this, and I'm sure it
already exists if you dig deep into the resolver.

### Route Hooks

Today, `Route` classes have three hooks: `beforeModel`, `model`, and `afterModel` to load
data, cancel or replace transitions, or do anything else to block rendering of the template.
The only justification for three separate hooks (as far as I can tell) is because the `model` hook
is sometimes skipped. There is also a communication win to be able to say that the return value of
the `model` hook is the "primary" data for a route's template, but this is an aesthetic concern and
is just as easy to abuse as it is to respect. A `model` hook that both requires the developer to
setup the controller context and also operate on the resolved value of async data would be just
fine. A hand-wavy example:

```js
async model() {
  //
  if (this.authentication.loggedIn) {
    this.replaceWith('login');
  }
  // some semantics for skipping the model hook
  if (this.previouslyLoaded) {
    return this.controller.model;
  }

  const res = await Promise.resolve({ data: [1, 2, 3] });

  if (res.data.length === 1) {
    this.transitionWithModel('post', res.data[0])
  } else {
    this.controller.set('model', res);
    this.set('previouslyLoaded', true);
  }
}
```

### Application boot

Initializers are currently defined in one function per file in `app/initializers` and
`app/instance-initializers`. In `app/app.js`, however, you'll see that the entry point to loading
and running these functions is `loadInitializers`, which procedurally finds and runs the
initializers. I think this is unnecessary complexity masquerading as an "abstraction".
Instead, I think we can replace the `loadInitializers` function with an `onLoad()` and
`onLoadInstance()` function in `Application.extend()`. Users can choose how to organize this
function and continue to export one-function-per-file from the aforementioned directories if they
want. Initializers from addons will also need to be explicitly used, and I think that is a win-win
tradeoff.

### Dependency injection

Injecting services into controllers/components/helpers, etc as a string is really nice, but I
think it's a vestige of pre-ES6 modules and adds another reason to have a Resolver that
expects a certain file structure. I think it would be just as nice to do this:

```js
import FooService from "app/anywhere/foo";
import Component from "@ember/component";

export default Component.extend({
  foo: FooService.create(), // or whatever semantics are required to lazily instantiate
});
```

### The Addon Ecosystem

The Ember Addon ecosystem feels a bit weird to me these days. It exists as a special
subset of all NPM modules, and attempts to solve these problems:

- Modifying Ember CLI's build pipeline with bespoke hooks
- Wrapping 3rd party libraries that are either exported in an unsupported module format or unsafe
  to use without wrapping in Ember's Runloop.
- Packaging and shipping shared "core class" functionality like Components and Services in a
  specific directory structure.

I think these problems are largely solvable in other ways and we should move towards thinking of
addons as plain old NPM packages. The fact that they depend on `ember-source` is already defined
in `package.json`.

### Installing addons

`ember install` is the CLI incantation to install Ember addons. But we already have a CLI
incantation for this: `npm install`. The Ember variant:

> ...also runs the default blueprint, which is used quite a bit by addons that wrap
> other libraries, to install a dependency in the consuming app.
>
> [source][2]

Translation: `ember install` runs a script after the initial npm install.

Ember is not the only ecosystem that has modules that like to generate files, and having a bespoke
mechanism for this unnecessarily deviates Ember from the rest of the JS community, adds uncertainty
to developer workflows and maintenance overhead for the Ember CLI project. The only benefit is
that an invisible script is run at install time. This not only doesn't seem like it's worth the
tradeoff, it doesn't seem like a benefit at all.

### Core class addons

Addons can provide functionality built on top of "core classes" like `Ember.Component` and
`Ember.Service`, by packaging modules in a specific directory structure. For example, the "components"
directory in an addon is automatically merged into the application and thus registered into the
container. This is a convenient way to share functionality ("Just pull these files out into
another repository and `npm publish`!"), but it would be better to instead provide more
primitive functions that accomplish the same thing. (See the "Container Operations" section above.)
Addon authors can either be given a hook to register these components or provide instructions to
users to manually import and register modules they are providing.

### Build time addons

Addons that perform build time operations are inaccessible to most developers because the API
documentation is sparse and offers little guidance of what hooks to use when. Build time addons
(and addons in general) are somewhat inherently complex because the build process is complex, but
I think the pain can be alleviated quite a bit by improving the docs. While we're talking about
build time, I think Ember also needs a way to define build time steps at the application
level (and documenting how to do that), rather than having to do it at the addon level.

### A note on controllers

Pretty much every one of these posts I've read so far has asked for controllers to go away.
I personally still find the Route-Controller-Template hierarchy a pretty useful one, as it prevents
me from making components before I actually need them. If every template is a component, we just
end up with an overloaded `app/components` directory with absolutely no hierarchy or guiding
principles, and I think that takes away from Ember's folder structure conventions.

## Summary

The Octane edition will be great for performance and developer ergonomics, but it doesn't
fundamentally bolster (or change) the selling points of Ember. I think we need to aggressively
reduce the API surface area at every level from core classes to CLI tooling, converge into
the JS ecosystem and "the platform", and make the application's inner workings more explicit by
both providing low level primitives _and_ using them in an obvious way.

[1]: https://blog.emberjs.com/2019/05/20/ember-2019-roadmap-call-for-posts.html
[2]: https://github.com/emberjs/rfcs/issues/453#issuecomment-466138926
[3]: https://emberjs.com/editions/
[4]: https://github.com/embroider-build/embroider
