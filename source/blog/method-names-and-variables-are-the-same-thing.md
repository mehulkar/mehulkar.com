---
title: "Method Names And Variables Are The Same Thing"
date:  2012-03-17
categories: programming
---

I discovered something interesting today. Kudos to Craig for leading me to this discovery.

Method names and variables are really the same thing. Both point to some object that is being returned. This makes more sense now that I know it, but we proved it in IRB below.

We first create a class Person that is initialized with a name property and make the name accessible outside.

```ruby
class Person
  attr_accessor :name
  def initialize(name)
    @name = name
  end
end
```

We define a method that returns a string “Bob”

```ruby
def get_name
  "Bob"
end
```

And then we initialize an instance of the Person class with the get_name method.

```ruby
bob = Person.new(get_name)
#=> #<Person:0x00000002ad78a0 @name=“Bob”>
```

When we call the name property of the instance, we see that it doesn’t return “get_name” which is what we initialized the class with. We get the value that the method returned.

```ruby
bob.name
#=> “Bob"
```

Taking this one step further, suppose we update our get_name method

```ruby
def get_name
  "Sally”
end
```

Now, the name property of bob, our instance of the Person class, remains “Bob” because the method wasn’t called again. It returned “Bob” only once when the instance was initialized.

```
bob.name
#=> “Bob"
 ```

This nuance may or may not seem important until you think about storing these properties in a database. For example, imagine a 3rd party company that handles customer service for B2Cs. When the 3rd party company hires a new employee, they ask him or her to fill out a form indicating their gender. Based on the gender, they assign a random pseudonym to that employee for all their interactions with customers on the phone or email, etc. One way to assign and store these pseudonyms would be to create two different tables for male and female employees and instantiate records with "Bob” or “Sally” names. There’s no reason to have two different tables other than that, as far as I can tell.

Or, you could have one class and instead of instantiating records with a string, instantiate with a method that assigns “Bob” or “Sally” based on the gender from the input form. The method could also provide extra flexibility and have a set of names instead of having every male employee being assigned “Bob” and every female employee “Sally.”

If I made a mistake in my reasoning above, or if you can add to this, comment below!
