---
title: Stop Extending Ember's Built In Components
date: 2020-07-06
categories: ember.js
---

One of the existential problems facing Ember today is about how to move
past Ember.Component and lean into the leaner `GlimmerComponent`s.

One of the things stopping this from happening is that Ember provides three
built-in components built on top of Ember.Component. Because these have public APIs allowing them to be extended (namely `.extend`, `.reopen`, and `reopenClass`):

1. `<Input />`
1. `<TextArea />`
1. `<LinkTo />`

`GlimmerComponent`s do not support these APIs so these components
cannot simply be refactored without breaking changes. And because these built in
components cannot be refactored away, and the framework itself depends on the Ember.Component class (and all its dependencies),
it cannot make a case for dropping it out of the vendor.js bundle.

To workaround these issues, significant effort is being put into treeshaking (on a technical
level) and in a conversation about how to deprecate things from Ember with the least amount
of disruption to existing apps. Both of these efforts are important and necessary, but it is also important for app developers to get ahead of the curve.

Step 1 is to stop extending these components!

If you find your addon extends these components, please comment on this issue!

https://github.com/emberjs/rfcs/issues/587
