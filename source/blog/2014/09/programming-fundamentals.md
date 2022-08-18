---
title: Programming Fundamentals
date: 2014-09-26 17:29:48
tags: programming
---

### Sequential instructions

Basically, programming is about telling a computer what to do.
Everything that happens is something you told the computer to
do. The rest is about intelligently saying when to do what.

So you could ask a computer to do a thing:

```
1 + 1
```

Then you ask it do another thing

```
reboot
```

And then another thing

```
MAKE ME A COOKIE
```

That's basically what programming is.

--

### 4 common data types

Sometimes different programming languages call these by
different names. (Same as other human languages having
different sounds for the same thing).

**Strings**: These are any set of characters that you type. They are surrounded by quotation marks. They're nice because you can put stuff like greetings and plain text in them.

```
var myString = "hello i'm a string I am so k00l"
```

**Numbers**: These are ... umm... numbers. Sometimes there are limits to how high you can go. If you're a mathematician or physicist or something crazy like that and have a more complex definition of what a number is and isn't, just...stop.

```
var myNumber = 1
```

**Dictionaries**: These are key/value stores usually indicated by curly braces {}. TBH, I didn't really get why/when to use these or why they were important until I really needed to use them, so I'm not going to try to explain it right now. Maybe in an extra credit section or something.

```
var myDictionary = {
  someKey: 'somestring',
  anotherKey: 1
}
```

**Arrays**: These are collections of anything (strings, numbers, dictionaries, and arrays).

```
var myArray = [myString, myNumber, myDictionary]
```

---

### Variables

Think of a variable as a box that you put stuff in. So instead of remembering what you put in it, you just remember that you have a box. And then you can pass around the box and other people can try to use the box and change what's in it.

---

### Loops

If you have a collection of pieces of information, and you want to do something to all of them, you use a loop. You tell your program to do something to "each" thing in your collection. The advantage of this is that you don't need to know how many items are in your collection. If you did, you could manually perform the same operation on each one, one after the other. But that could be a lot of typing. So you use a loop.

---

### Flow control

This is a fancy name for "if...else" statements. "If something is true, do this. Else do this". You can get even fancier and say "If something is true do this, elseif something else is true, do this, else do third thing". Oh you can get even more fancier and say "If something is NOT true, do this"

---

### Functions

If you want to group a bunch of instructions and call them conveniently, group them under a "function". So a function could do these things:

```
bake a cookie
tell you it baked a cookie
throw all the cookies in the trash
watch you cry
```

Wouldn't be the best function, but it's still a function. More seriously, a function could do something like

```
fetch some info from a database
add some lines around it
display it on a web page
```
