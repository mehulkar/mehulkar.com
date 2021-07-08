---
title: How Rails Works
date: 2014-10-04 12:06:45
categories: programming, rails
---

You should read the one about [how websites work](/blog/what-is-a-website) first.

Did you read it? Because I'll assume you read it. So don't tell me you didn't
understand something because you totally should.

Just kidding, if you don't understand something, it's definitely my fault.
I often (everyday) feel stupid when I don't understand documentation,
and I want to make it clear that (1) that's a fine way to feel and (2),
[Will, it's not your fault][1]. Look at me, son.

[1]: https://www.youtube.com/watch?v=GtkST5-ZFHw

## What to expect

You won't be writing any code in this tutorial for two reasons:

-   Installing Ruby on Rails can be a pain because installing Ruby is a pain.
-   So I can write another post about actual code and get more pageviews and earn
    $0 dollars again from the lack of ads on this page.

## So, Ruby on Rails

So you know [how websites work](/blog/what-is-a-website) (it's a request-response cycle, remember?).

The Ruby on Rails framework makes it easy to handle the things that
happen between the request and the response.

There are 3 important things:

1. Routes,
1. Controllers,
1. Views

### Routes

Rails defines a set of routes. This is simply a list, that says:

> Hey buddy, when someone asks for "myserver.com/bananas", forward the request
> to this piece of code.
>
> Hey buddy, when someone asks for "myserver.com/apples", forward the request
> to this other piece of code.

There's a file in your Rails project that you can edit that will define these
directions. But don't worry about that. Just trust me for now. I know, I know
"that's what they all say".

PS, Guess what happens if you don't have a definition for a particular "route"?
For example, see: [google.com/idontexist](https://www.google.com/idontexist).
That's a 404. It means the route wasn't found.

### Controllers

Rails does a really good job of compartmentalizing code. Actually, that's not
a Rails-specific thing, this is a design pattern that is used in many places
with slight variations depending on the programmer(s) who were in that place.

When a Rails route says "forward this request to this other piece of code",
that other piece of code is a Controller. The controller has the particular
logic needed to respond to all requests at that particular route.

For example, if you as for `myserver.com/bananas`, you could have a
`BananasController`. This controller could for example have code that
responds with a message saying "You are such a monkey. Why are you such a
monkey". And that would be that. (It cannot serve you real bananas to eat,
though. Wouldn't that be something?)

### Views

Typically in a web application, when someone makes a request, they want to
see something on the page. For example, when you request
[twitter.com/codenewbies](//twitter.com/codenewbies), you expect to see a page
that shows stuff about @codenewbies. You could say you want to "VIEW" a page.

VOILA!

Rails has this cool way of displaying stuff on a page and it calls these files
"View" files. That's where you put your HTML and CSS and Javascript. If you
don't know what any of these are, AHA, I have another thing to write about!
[Tell me!](//twitter.com/mehulkar).

So that's what a view is: It contains content that should be displayed in a browser.

### All together

Let's put it together, shall we?

1. Someone opens up a web browser on their computer and types in `myserver.com/bananas`.
1. Your Rails application is running on `myserver.com` listening for requests to it.
1. Your Rails application defines a `/bananas` route that forwards to the `BananasController`.
1. Your `BananasController` says, when someone "calls" on me, find the `bananas` view and respond with it.
1. Your `bananas` view is an HTML file called `bananas.html` and it has a picture of a banana on it.
1. Your `BananasController` sends `bananas.html` back to where the request came from.
1. The user sees a picture of a banana in their browser.

### The big missing piece: Models

There's another huge part of Rails: Models. These are the mechanism by which Rails
interacts with a database. This introduces the concept of "persistence" and I'm going
to leave it for another episode. But here's the thing:

In Rails, Views and Controllers can both access the database. And they do this by way
of Models. That's all you need to know for now.

Happy Birthday!
