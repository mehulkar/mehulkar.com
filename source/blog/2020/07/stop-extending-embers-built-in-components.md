---
title: Stop Extending Ember's Built In Components
date: 2020-07-06
categories: ember.js
---

One of the existential problems facing Ember today is about how to move
past `Ember.Component` and lean into the leaner `GlimmerComponent`s.

One of the things stopping this from happening is that Ember provides three
built-in components built on top of Ember.Component:

1. `<Input />`
1. `<TextArea />`
1. `<LinkTo />`

The `Ember.Component` class has public APIs that enable end users to extend functionality:
(namely `.extend`, `.reopen`, and `reopenClass`). `GlimmerComponent` does _not_ have these
APIs so these components cannot be refactored without breaking changes. And because these built in
components cannot be rewritten away, the framework must continue to ship the Ember.Component
class and all its dependencies. It cannot make a case for deprecating or even shaking out
Ember.Component until it can remove its own internal usage of Ember.Componnet, and move the
Guides and official Tutorial away from these classes.

To workaround these issues, significant effort is being put into treeshaking (on a technical
level) and in a conversation about how to deprecate things from Ember with the least amount
of disruption to existing apps. Both of these efforts are important and necessary, but it is
also important for app developers to get ahead of the curve.

Step 1 is to stop extending the built in components!

If you find your app or addon extends these components, please comment on this issue with your
use case and any road blocks to refactoring away from your existing solution.

<https://github.com/emberjs/rfcs/issues/587>
