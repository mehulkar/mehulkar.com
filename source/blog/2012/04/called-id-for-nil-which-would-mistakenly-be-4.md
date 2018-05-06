---
title: “Called id for nil, which would mistakenly be 4”
date: 2012-04-01
categories: programming, ruby
---

I’ve gotten this error so many times while building Rails applications and it didn’t make any sense.
It usually appeared when I was trying to call Some_Object.id and the object wasn’t assigned correctly,
so in essence I was calling .id on nil. But I had no idea why that would “mistakenly be 4”.

Thanks to [Tim][1], I finally unraveled the mystery.

The first important thing to know is that in Ruby, everything is an object. No really, everything.
Even the class “Object” which contains everything inside it is an object. Think of it like an
index of keywords, and each one has an object_id. The `object_id` for the Object class is 18703980.

This index goes like this:

All odd indexes are integers. E.g. `0.object_id` is 1, `1.object_id` is 3, `2.object_id` is 5, etc.
All immutable objects always have the same object_id (Classes, Symbols, Fixnum, etc). Mutable objects
like strings DON’T have the same object id. E.g. `“apple”.object_id != “apple”.object_id.`
I’m sure there are more rules, but these are the ones I’ve discovered so far.

Getting back to nil

There’s no particular reason for this that I can see, but Ruby was designed so that the first
object in this index is false. So, false.object_id = 0. The next non-integer object is true. And
finally, the third non-integer object is nil.

```ruby
1.9.3p125 :050 > false.object_id
 => 0
1.9.3p125 :051 > true.object_id
 => 2
1.9.3p125 :052 > nil.object_id
 => 4
```

My next question was obviously, how do I find what object is assigned to a given object_id. A quick
search revealed that

```ruby
ObjectSpace._id2ref(object_id)
```

will return the object associated with the given parameter.

Oh and, by the way. the ObjectSpace class also has an object_id. :)

[1]: https://twitter.com/timocratic
