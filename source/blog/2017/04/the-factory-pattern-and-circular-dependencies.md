---
title: The Factory Pattern and Circular Dependencies
date: 2017-04-19
categories: programming
---

Say I'm writing the code for a treat dispenser for my pets that dispenses a
treat. In the simplest sense, this would look like this:

```python
pet = recognize_pet()
dispense_treat_for(pet.treat())
```

To be able to implement the `pet.treat()` method, I need to first know which pet
it is. If I were to follow a polymorphic, object oriented, duck-typed<sup>1</sup>
approach, I would need `recognize_pet()` to return an object that responds to `.treat()`,
but I wouldn't really care what the return type was.

Say I decided to make `recognize_pet()` smart and return an object based on the _sounds_
it heard nearby. For example, if it heard a meow, it would return a `Cat()` instance which
would response appropriately to `treat()`.

Let's look at `recognize_pet()` then:

```python
def recognize_pet():
  sound = mic_input()
  if sound = 'woof':
    Dog()
  elif sound == 'meow':
    Cat()
  elif sound == 'trumpet':
    Horse()
```

Let's ignore `mic_input()` for this post.

This code is kind of procedural and I've just learned about the Factory Pattern. I'd
like to write something like this:

```python
def recognize_pet():
  sound = mic_input()
  return Animal.from_sound(sound)
```

But I still want to return instances of `Cat` and `Dog` and `Horse`, so they
can each respond to `treat()` differently.

Here's how I might define these classes:

```python
class Animal():
  @classmethod
  def from_sound(cls, sound):
    if sound == 'woof':
      return Dog()
    elif sound == 'meow':
      return Cat()
    elif sound == 'horse':
      return Horse()

  def treat(self):
    raise 'implement me in subclass'

class Cat(Animal):
  def treat(self):
    return 'cat candy'

class Dog(Animal):
  def treat(self):
    return 'dog candy'
```

Ok, so we haven't really gotten rid of our procedural code, but at least we've
contained it --we can pull out this mapping into a data file or even an in-memory
map later.

Let me get to the point<sup>2</sup>.

I typically prefer having one class per file in my projects, so this is how I would
try to organize this code:

1. in `animal/__init__.py`

    ```python
    from animal.cat import Cat
    from animal.dog import Dog

    class Animal():
      @classmethod
      def from_sound(sound)
        # omitted, see above
        # returns an instance of something that inherits from Animal
    ```
1. In `animal/cat.py`

    ```python
    from animal import Animal
    class Cat(Animal):
      # omitted
    ```
1. In `animal/dog.py`

    ```python
    from animal import Animal
    class Dog(Animal):
      # omitted
    ```
1. and so on for each animal type...

Here's the problem... `animal/__init__.py` imports `Cat` from `animal/cat.py`, and
`animal/cat.py` imports `Animal` from `animal/__init__.py`.

This creates a circular dependency making this pattern kind of annoying to use.

The problem, is that importing a class from a module means evaluating the
whole file. So any imports will also be evaluated. One solution is to move an
import in a place that won't be evaluated when the module is loaded; i.e. inside
a method.

```python
class Animal():
  @classmethod
  def from_sound(cls, sound):
    if sound == 'woof':
      from animal.dog import Dog
      return Dog()
    elif sound == 'meow':
      from animal.cat import Cat
      return Cat()
    elif sound == 'horse':
      from animal.horse import Horse
      return Horse()
```

This is the only decent solution I've found for this problem.

For what it's worth, I'm seeing this problem in Ruby also, and I can't imagine it would be
different in other environments.

**Footnotes**

1. Could I duck-type a treat for a duck if I had one?
1. I really got carried away with the whole pet-feeding use-case for the factory pattern there...
