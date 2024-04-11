---
title: "What is a website?"
date: 2014-09-26 17:29:48
tags:
- programming
---

A website is basically you being all bored on your computer and wanting to get stuff
that's on another computer. So you go to a website and it fetches stuff that's on some other
computer and you can watch it, hear it, read it, play it, whatever. Sometimes you can even
send stuff back to the other computer. Like a tweet. When you tweet, you're sending a piece
of text to the other computer and it stores it away. And then weirdly enough other people
around the word are like "wait I want to hear what Lucy (I'm assuming that's your name) tweeted!"
And the other computer is like... "ok! here you go".

So that's what a website is.

---

### The other computer

As a programmer, you're the person who writes code that runs on the other computer.
Let's call this other computer a "server". Totally random, I know. But not really because
it "serves" Lucy's tweets to all the crazy people who want to read them.

---

### Can I Haz Website (Requests)

Ok, so there's this thing called a "Request-response cycle". It's what it sounds like.
Lucy makes a request. The server responds with some information. That's like 1 year of a
CS degree right there. Maybe. I don't have one so I could be totally wrong.

Think of it like going to the drug store and going up to the counter
and asking the guy in the white lab coat (who is totally a real doctor)
for something. You're making a _request_ for a resource. And the lab-coat-person
has to listen to you and understand what you want and then _respond_ with medication.

If the lab-coat is any good at their job, they will give you the medication
you really need. But they could also be bad at their job and give you the wrong
thing. Or they could be REALLY bad at their job and give everyone the same
medication no matter what they're asking for. There's nothing really you can
do about it. The doctor is the middleman between you and the resource you're after.

So that's what an application is. It receives requests, interprets them, and
then responds with whatever. Usually the response has something to do with
the request. But it could also be a random response. Or it could always
be the same response. It's really up to the programmer (i.e. YOU) who trains
the lab-coat. I mean server. Wait, what?

---

### Databases

Databases. What a buzz word right? You've probably heard of a database. It's not really that
big of a deal. In fact, forget about database altogether. Think of it as storage space. So
remember when Lucy tweeted that thing about monkeys? Well, in order for me to go see it
later, the server has to store it somewhere. The easiest thing for the server would be to
write her text to a file, and then read the file when I request it. Turns out reading and
writing files is slow. So that's why we have database. Also because they have some advantages
in terms of organization. It doesn't really matter. It's all the same in the end.

---

### Complete picture

So I'm sitting at home bored and I open up my browser and type in
`twitter.com/codenewbies`. My computer figures out what server `twitter.com` is sitting on
(how it figures that out is a different topic) and sends it a request that contains some information
about me, and what I'm asking for [@codenewbies page](https://twitter.com/codenewbies). The
`twitter.com` server looks up `@codenewbies` in their database. Fetches all the tweets out of some
database, and replies with a bunch of text and images and styles. My browser takes all this
stuff and renders it on the screen for me.
