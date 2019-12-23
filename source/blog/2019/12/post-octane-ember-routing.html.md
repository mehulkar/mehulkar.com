---
title: Post-Octane Ember Routing
date: 2019-12-22
categories: programming, frontend, ember.js
---

[Ember octane is released][1]! The release brings a massive simplification of the component model,
interoperability with native JS features like classes and decorators, and an
inversion of the reactivity model that was so ingrained in my mind that it's almost weird to forget.
Most of these features are fairly standard among other frameworks these days, so it remains to be
seen how it will affect public reception, but existing Ember applications certainly have a lot to
look forward to. It’s pretty remarkable that a framework this old has managed to completely renew
itself over the course of 3 major versions while remaining mostly backwards-compatible. There are
tradeoffs to this idealogy, but I'm glad that I have no compelling reason to rewrite existing apps
into another framework.

Preamble aside, the core team has said that 2020 will be the year of routing. As someone who
has spent a considerable amount of time grappling with the Ember router this year, I wanted to
lay out a vision for what the first few steps should be. As a framework user, rather than a framework
developer, this vision is guided by pain personally felt, so it is possible that it suffers from
repeating mistakes of the past. I hope someone who knows the full history will tell me if that's the case!

The vision for routing begins with a vision for the application lifecycle.

## The year of `app.js`

I’ve contributed in some significant way to 9 Ember apps over the last ~8 years, ranging from v0.87
all the way to v3.14. This year was the first time I paid any attention to the`app/app.js` file.
The more I think about it, the stranger this feels. `app.js` is the entry point to an
Ember application, yet it contains barely a few lines of code and no obvious function call that
looks like it is starting the application. If I were writing `<script>` tags on any other HTML file,
there would very clearly be a function invocation that executes my code. I believe this gap
between how the browser downloads and executes script and the application-writing experience is
a major problem. How does an Ember application boot? What order do the class definitions load in?
Who invokes the first method? How does the `ApplicationRoute` `model` hook get called?

The application's definition is in `app.js`, the app's routes are defined in `router.js`,
but the first time any developer code executes (usually) is in `routes/application.js`. and there's
no way to trace through it. In other words, it's anyone's guess how Ember *begins* the routing
process.

(If you're wondering, the answer is that Ember CLI injects code that calls `Application.create()`
and then on the `DOMReady` event, the created Application calls a `boot()` function that eventually
leads to a handoff to the `Router` class.)

I think the first step to improving routing starts with giving developers control *earlier* in the
boot process and by consolidating the boot process into `app.js`. Here's what that might look like:

```js
import Application from '@ember/application';
import config from './config/environment';

export default class App extends Application {
  routeMap() {
    return function() {
      this.route('about');
    }
  }

  location = config.locationType;
  rootURL = config.rootURL;

  onBoot() {
    // initializer code goes here
    super.onBoot();
  }

  onInstanceBoot(...arguments) {
    // instance-initializer code goes here
    super.onInstanceBoot(...arguments); // this calls the visit() API, which eventually calls Router.transitionTo()
  }
}
```

This approach has multiple benefits, but on the topic of routing it means a few things:

- The `Router` class no longer needs to be exposed to the end user, making room for the
`RouterService` to fully ascend the throne it has been promised for years now. This can eventually
lead to deprecating its existence in the Application container (it's currently available as
`main:router`).
- `routeMap()` is "just a function" and writing it as such can expose new composition patterns or
even new DSLs that may be easier to understand or parse than a long list of `this.route()` calls.
- The end of the `router.js` file which is currently a distracting *second* entry point into the
application.
- You'll notice in the code sample above that the super implementation of `onInstanceBoot` calls
`visit()`. Exposing this hook also exposes an important stack trace and an invitation to explore
the routing stack, which is currently unintuitive.

Which brings us to...

## The Router stack

The second pillar of this vision is about the various classes and packages that consist of the
routing stack. Currently, the anatomy of the stack is:

- `Router` (houses the `map` method for defining the applications routes) and injected as `main:router`
into the Application container.
- `PrivateRouter` an extension of a class from the `router_js` package, instantiated and made available
as a property on `main:router`.
- `Router` class from `router_js` which is the state machine and interacts with `RouteInfo`, `Transition`,
and other low level classes.
- `RouteRecognizer` which is responsible for the DSL exposed to the user for defining routes.
- `RouterService` which is almost the same as `main:router`, but is a proper Ember Service class
that attempts to hide the complexity in the previous four items in this list.

This stack may have made sense at some point, but in 2020, I believe that flattening this out and
exposing each of these layers as public API will give back power to the developer in a way that
is not possible today (short of replacing the entire top level Router class, that is).

We've already seen earlier in this post how it is not necessary to expose `main:router` at all.
I believe that the way forward is to flatten each of the other classes and abstractions into
the `RouterService`. A single `RouterService` places the entire concept of routing squarely into the comfort
zones of 99% of Ember developers who understand and use the component-service architecture everywhere
else in their application. It also allows developers to extend this class as any other Service: by exporting
from `app/services/router.js` and overriding or adding methods.

These initial steps will not solve any of the existing warts of the routing system, but it will make
it much easier to form a mental modal of how the system works and make it easier to explore and debug
that system when the quirks surface. The ideas presented here could take several RFCs and may involve
other discussions, but I think they will be massively beneficial for reasons other routing as well.

[1]: https://blog.emberjs.com/2019/12/20/octane-is-here.html
