---
title: "Unit Testing: Interface vs. Implementation"
tags:
  - programming
date: 2015-05-26
---

Disclosure: This is probably obvious to some people. It wasn't to me.

Writing tests is pretty great. I don't really care about the differences
between unit and integration testing, but I've become acutely aware of the
difference between testing the _interface_ vs testing the _implementation_.

Below is an example of a testing pattern that I've used in the past
that breaks down pretty quickly. I'll use Rspec, because that's what I'm
most familiar with, but it might as well be pseudo code because we're
really just talking about assertions.

```ruby

describe Cat do
  describe '#talk' do
    it 'should make a meow sound' do
      expect(Cat.new.talk).to match(/meow/)
    end

    it 'should not make a bark sound' do
      expect(Cat.new.talk).not_to match(/bark/)
    end
   end
end
```

In this example, you can see that the tests only care about the `.talk` method.
They don't care about how it is implemented. Let's say we decide to implement
this `Cat` class like this:

```ruby
class VoiceBox
  def initialize(animal)
    @animal = animal
  end
  def talk
    "Meow"
  end
end

class Cat
  def talk
    VoiceBox.new(self).talk
  end
end
```

or like this:

```ruby
class Cat
  def talk
    make_a_meowwww
  end

private
  def make_a_meowwww
    "Meow"
  end
end
```

or like this:

```ruby
class Animal
  def talk
    if self.class.name == "Cat"
      "Meow"
    end
  end
end

class Cat < Animal
end
```

The point is, I could do make a cat talk a hundred different ways, but my tests
expect the interface of my `Cat` class to always be the same.

This is important from a number of different perspectives:

1. Tests inform design:

   When I write my tests with the interface (or API) of my objects in mind,
   I'm forced to think about how my objects will be used by the rest of my application.
   I'm forced to design objects with a usable API in mind. In a language like
   Ruby, where you get to make arbitrary decisions about public / private methods,
   this is really useful.

   For example, in a typical Rails scenario, if my application allows users to click
   a button to make a cat meow, the `CatController` will call this `Cat.new.talk` method.
   Or maybe I have it wired up so that every time the dog barks, the cat also meows.
   In both of these use cases, when I write my tests to assert against the `talk` method,
   I can guarantee that I have a working interface. I could almost compare this to
   type checking at compile time.

1. Implementations change, expectations remain the same:

   Today, I only have a cat. Tomorrow, I might have a duck and a pig. Or maybe
   I'll dress up my cat as a horse and send it as a decoy to an ancient civilization.
   And to do all this, I might have to change code in the `Cat` class.
   But I'll still expect my cat to meow. So if my changes break that expectation,
   my tests should tell me.

1. Service level agreements

   In this world of microservices or modular design or single responsibility,
   or whatever you want to call it, objects interact with each other through
   contracts. The more objects a program has, the more important it is that breaking
   changes to these contracts are kept to a minimum. I used to think that that the fuss
   over 'breaking changes' was overrated. 'Just update your code when something changes,'
   I would silently say. This is mostly fine. Except when it isn't. Which is usually the
   case in any decent sized program over any decent length of time with any decent number of
   contributors. Maintaining these contracts makes everyone's lives easier, because it
   allows the developer to focus on a single piece at a time and trust that the other
   pieces will at least interact in the same way as they did yesterday. Whether or
   not they behave (i.e. are implemented) in the same way, is an entirely different
   topic.

To end, here's an example of a test that tests the implementation, rather than
the interface. I have both written these kinds of tests and seen it in the wild.
They don't seem particularly harmful at first. But they are.

```ruby
describe Cat do
  describe '#talk' do
    it 'calls the VoiceBoxer' do
      mock_box = double("VoiceBox")
      allow(VoiceBox).to receive(:new).and_return(mock_box)
      expect(mock_box).to receive(:talk)
      Cat.new.talk
    end
  end
end
```

Here's another one:

```ruby
describe Cat do
  describe '#talk' do
    it 'calls make_a_meowwww' do
      expect_any_instance_of(Cat).to receive(:make_a_meowwww)
      Cat.new.talk
    end
  end

  # this test also prevents us from making this method private
  # which means we have to expose more cat API. Nobody wants
  # that much cat API.
  describe '#make_a_meowwww' do
    it 'prints meow' do
      expect(Cat.new.make_a_meowwww).to match(/meow/)
    end
  end
end
```
