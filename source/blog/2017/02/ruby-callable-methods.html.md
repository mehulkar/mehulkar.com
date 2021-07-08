---
title: Ruby callable methods
date: 2017-02-10
categories: programming, ruby
---

I wish Ruby had some semantic difference between methods that define
functions and methods that define properties.

For me, the difference between the two is that a function _does_ something
and a property is a tool for introspection. In other words, a property _returns_
state or data, and a function _operates on_ state or data.

For example, in the `Dog` class below, the `bark` method
is a function and `age` is a method.

```ruby
class Dog
  def bark
    puts 'woof'
  end

  def age
    10
  end
end
```

In Ruby, there is no difference between the definition of a function
and a property.

For example, in a Javascript object, properties and functions are
defined and called differently.

```javascript
var dog = {
    age: 10,
    bark: () => {
        console.log("woof");
    },
};

dog.age;
dog.bark();
```

Ruby defines properties using instance variables (variables preceded by
an `@` sign) which can be shared internally inside a class, and externally
using get/set methods (or shorthand using `attr_reader` and `attr_writer`).
This is a great feature and gets us 95% of the way there.

However, from outside an object, `attr_reader` is indistinguishable from
properties that are disguised as methods, and therefore, indistinguishable from
functions.

For example, in Ruby, if you were to see this code:

```ruby
garfield = Cat.new
garfield.present
```

it is impossible to know if if `Cat#present` is a function or a property.
It is ambiguous whether `Cat#present` is intended to show off `garfield`
(e.g. to the Queen), or if it's intended to see what kind of treats he likes.

Granted, this example is contrived based on a confusing word that
can mean multiple things, but in Javascript, for example, the caller of
`Cat#present` would know if a property or a function was being accessed.

```javascript
garfield = Cat();
garfield.present; // is a property
garfield.present(); // is a function
```

As you can see, the additional detail here is the `()` parentheses at the time
of invocation. A function must be called with `()` or else it returns
the function itself. (Python has the same requirement, for the record).
Properties, on the other hand, are like Ruby's `attr_reader`.

Now, of course, a function in Javascript and Python can be used to simply introspect
and properties in Ruby can be set to callable anonymous functions, but the
goal isn't to discover the flexibility of the language--the
more powerful the better, I say--the goal is to make it easier to declare intent.

The interesting thing here is that Ruby already has examples of caring about
declaring intent. Predicate method (ending with `?`) and Bang methods (ending with `!`)
both exist to declare intent; the former to indicate a boolean return type,
the latter to indicate that a safer version of the method exists.

I've seen code that gets around this ambiguity in Ruby methods by including
nouns or verbs in method names. For example, `object.to_json` indicates a function,
while `object.json` is more likely a property with some data.

But in reality, without spelunking into the objects, it is not safe to assume
what a method is or does, making it ever-so-slightly harder to create
abstractions and simply expose APIs and contracts and interfaces.

The goal also isn't to advocate for Javascript or Python over Ruby.
Javascript ES6 classes, for example, have the same issue as far as I understand.
And my examples comparing Ruby and Javascript were not entirely analogous.

But it is notable that functions and properties are different things and
Ruby methods can be used to make the difference invisible. Not only does that
add some insecurity on the part of the users of objects, it creates decisions
for the writers of objects and classes also.
