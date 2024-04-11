---
title: Ember core classes cheatsheet
date: 2017-12-04
tags:
  - programming
  - frontend
  - ember.js
---

A brief cheatsheet on when to use each of `Ember`'s core classes

- `Component`
  - encapsulating a part of your web page
  - enhancing native DOM elements
  - capturing and responding to user input
- `Service`
  - network calls that aren't in the route transition hierarchy (e.g. on user interaction)
  - stuffing data or state that is shared across the app
- `Controller`
  - gluing together components and services
  - to stuff things when you don't have time to think about architecture
- `View`
  - don't
- `Route`
  - making network requests that are required by the page
- `Object`
  - when you want `{}` or ES6 Class, but with all the get/set/computed goodness of Ember
- `Helper`

  - formatting parts of what's displayed on the page

- `DS.Model`
  - giving shape to network responses so they are more usable
- `DS.Store`
  - making network requests for defined objects, so that they get auto-added and available
- `DS.Adapter`
  - changing network address of defined objects when network calls are made
- `DS.Serializer`
  - munging data to and from the server
- `DS.Transform`
  - defining primitive types that you want to serialize network requests to and from
