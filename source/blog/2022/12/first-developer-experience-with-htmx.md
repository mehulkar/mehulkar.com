---
title: First Developer Experience With htmx
date: 2022-12-16
tags:
  - programming
  - frontend
  - web
---

A few days ago, I tried to build a web form with Enhance.dev and
[ran into enough road blocks that I gave up][1]. Soon after, I came across [`</> htmx`][2].
My first impression was from reading the docs. I was so impressed by how clearly they were written
that I read most of them in one sitting on my phone. They were easy to read, and answered my questions
as I had them.

Aside from the docs, I also thought the idea was especially elegant. `htmx` expects the server
to usually send HTML, even when responding to AJAX requests. One of the typical problems with
replacing HTML on the client is that you lose JS event listeners attached to those DOM nodes.
But with `htmx`, all interactivity is modeled as HTML attributes, so when HTML is replaced, as
long as those attributes are present, you don't have to reattach listeners!

One particularly elegant example is the [progress bar](https://htmx.org/examples/progress-bar/).
Instead of updating an HTML element's width, htmx suggests that you response with an HTML snippet
that (1) has an attribute to re-poll the endpoint for progress updates, and also updates its own width.
No need to write any clunky client-side JavaScript!

So anyway, after reading the docs, I attempted to build my web form with it, and was generally
happy with wiring things up. But I've run into three crucial issues:

1. Swapping multiple pieces of content

   Updating a part of the page that isn't close to the "trigger" is a bit wonky. [An example page][3]
   shows a few techniques for accomplishing this, but they feel like workarounds to the mental model.
   Considering this is a pretty basic use case, it makes me wonder if htmx isn't a good fit for what
   I'm building.

2. In-Flight States

   I want my web form to add a `disabled` attribute somewhere while a request is in flight.
   Although there is a way to show/hide elements [using `hx-indicator` and `hx-request`][4],
   I don't see a way to add/remove HTML attributes. There may be a way to do this with the
   provided events, that I haven't looked into yet.

3. HTML duplication

   My project is just `index.html` and an `api/` directory with some [Serverless Functions][5]
   that are deployed on Vercel. I'm using [`vercel dev`][6] as my development server.
   Because htmx expects HTML snippets in response to update DOM after requests, I have to duplicate
   my HTML in `api/foo.mjs` as template strings, and keep them in sync with `index.html`.
   This feels a bit annoying, and the only workaround I can think of is to add a build system with
   a templating library.

I spent a lot more time with `htmx` than I did [with `Enhance`][1], so this isn't really a
comparison post (although I did attempt to build the same thing with each). Mostly this experience
makes me want to use a "full featured" framework so I can just write my UI and business logic and
be done, but I'm also enjoying experimenting.

[1]: /blog/2022/12/one-hour-with-enhance/
[2]: https://htmx.org/
[3]: https://htmx.org/examples/update-other-content/
[4]: https://htmx.org/docs/#indicators
[5]: https://vercel.com/docs/concepts/functions/serverless-functions
[6]: https://vercel.com/docs/cli/dev
