---
title: Ember Object Model extend vs create
date: 2017-12-07
categories: programming, ember.js
---

I learned something new the other day in the course of development.

I had a piece of code that took an object and used `Object.assign` to merge it with another
object and but I noticed that none of the properties were being copied over.

```javascript
someObject.someProperty
// => "I'm here!"
const merged = Object.assign({}, someObject, { foo: 'bar' });
merged.foo
//=> 'bar'
merged.someProperty
//=> undefined
```

This was very confusing, so I set a `debugger` right before the `Object.assign` and discovered
that `someObject` was an `Ember.Object`. My first thought was that maybe Ember objects don't
behave the same way as regular POJOs with Object.assign, so I tested out the theory:

```javascript
const someObject = Ember.Object.create({
  someProperty: "I'm here!"
});

const merged = Object.assign({}, someObject, { foo: 'bar' });
merged.someProperty
//=> "I'm here!"
```

Wait, a second. That seemed to work fine? What is going on.

So I dug a little deeper and I noticed that `someObject` was coming from a different library
and it was actually defined like this:

```javascript
const someObject = Ember.Object.extend({
  someProperty: "I'm here!"
}).create();
```

I was confused for a second, but a coworker explained to me that the object
passed to `Ember.Object.extend()` adds properties to the prototype, not the instance and
`Object.assign()` does not iterate over the entire prototypal chain when copying properties.

So I had to test that also:

```javascript
function CustomObject() {};
CustomObject.prototype.someProperty = "I'm here!";
const someObject = new CustomObject();
const merged = Object.assign({}, a, { foo: 'bar' });
merged.someProperty;
//=> undefined
```

It wasn't surprising to me that a property on the prototype isn't copied over by `Object.assign`,
so this made sense to me, but it *was* surprising that `Ember.Object.extend({foo: 'bar'}).create()`
and `Ember.Object.extend().create({foo: 'bar})` were not equivalent.

Over the years of working in Ember.js, I've never really had to care about how the object model
works, because it just works. For all intents and purposes, when I define a controller or a route
or any custom object by extending the core classes, I never had to think about where all my functions
and properties lived. In fact, I've mostly been able to think of the framework language as
a completely separate DSL from vanilla Javascript and treat it as a black box. Pulling back the
curtain on this abstraction has been a long time coming!

One notable effect of this discovery is that copying an Ember.Object (or any object
that extends it), will not copy any default attributes of that object. For example,
duplicating an object using `Object.assign` is a bad idea, because any default properties
will be on the prototype and won't be carried over to the duplicate.

```javascript
Post = DS.Model.extend({
  author: 'me'
});

const post = Post.create({
  title: 'New post',
  body: 'Lorem ipsum'
});

const duplicate = Object.assign({}, post);

duplicate.author
//=> undefined

// !!!!
```
