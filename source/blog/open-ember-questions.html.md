---
title: Open Ember Questions
date: 2016-03-30
categories: programming, frontend, ember.js
---

I have some open questions about Ember that I'd like to talk about.

I don't think these questions have answers, but I'd like to hear
if/how people are addressing these concerns.

1. Acceptance Testing
1. Coupling of UI and Route Hierarchy
1. What is a Component?

*Note:* It's possible that I'm highly misinformed about any/all
of these subjects or that you could help me reframe the problem
in a way that makes the solution obvious.

If you're reading this and it's still EmberConf, I would be very
much interested in talking in person. Find me at [@mehulkar](//twitter.com/mehulkar)
on the tweeter.

Also note that none of these are deal breakers and have various
solutions or workarounds. I am interested in talking about them
anyway.

### Acceptance Testing

How do I organize my UI development so that acceptance tests can
retrieve changes from a rapidly developing API and stay relevant/useful?

Possible answers:

1. Ember CLI Mirage is the touted solution to acceptance testing
at the moment, but I don't think it allows you to consume the actual API
codebase at a revision. I hear it _does_ let you fallback to a live version of
your API, so with the flip of a switch, I could run my tests against
a live API, but the extra overhead to maintain a live API (in a clean state)
seems...hard.
1. Dedicated QA for end-to-end testing. This
is not only expensive, but I think the existence of QA
might also encourage lazy development.
1. Improve communication/cross polination across the UI and API teams and
manually keep API spec changes in sync. This is usually fine,
but manual communication is slower and prone to errors. Also, this is a
cultural solution and will take time to develop.
1. Work on API and UI serially, instead of in parallel, so one project
becomes well defined _before_ the other and can dictate the
constraints and requirements. This is net slower, and creates a less
flexible project plan.
1. A solution I'd _like_ to explore is to generate UI mock endpoints
with a revision of the API codebase directly, and on the fly. This
will inevitably require a closer coupling between API and UI projects.
Possibly even putting them in the same source control repository? (gasp!)

    This is an unpopular opinion because isolating API and UI seems to
    be a popular architectural pattern these days. I think, at least for
    the projects I've worked on, this forced _decoupling_
    has actually been a form of overengineering and doesn't have many benefits
    except the promise that, some day in the future, the separation of projects
    will be useful. I concede that I haven't worked in software
    long enough to have seen this use case.

### Coupling of UI and Route Hierarchy

I've found that the hierarchy of my DOM is very closely tied to the hierarchy
defined by my routes. This is because, by default, an `{{outlet}}` is rendered
_inside_ a DOM element that is rendered by the parent route.

For example, with these routes:

```js
Router.map(function() {
  this.route('post', function() {
    this.route('detail')
  });
});
```

if I navigate to the `post.detail` route and want to render
a set of buttons (upvote, comment, edit, etc), the _easiest_ solution would
be to put the buttons in the `post.detail` template. This feels natural
and works out of box because these buttons will be rendered in the
correct context and scope.

But what if I wanted these buttons to
appear in the app header? Rendering outside the UI hierarchy
defined by the route would involve some manual rendering or
some wiring up of injections in weird places.

Maybe I'm missing something trivial, but if this has never happened to you

- my app structure is either fundamentally <del>wrong</del> different, or
- the various workarounds (like `render` in `Ember.Route`),
are actually the right solution and I need to get over the fact that they feel wrong, or
- there are use cases for decoupling UI hierarchy from route hierarchy.

It's possible that I'm still thinking of my application in terms of the the 1.x
Route + Controller + Template mentality. It's possible that components will
be arbitrarily renderable into any place in the DOM and will be the solution here.

But that brings me to my next question:

### What is a Component?

I've heard of components in two different ways:

In the HTML web component kind of way, where an object encapsulates
behavior and style and can be used in a variety of settings. A good
example is the `{{link-to}}` helper. You could say that this
component is _domain agnostic_.

The other way is a component that is a portion of the application itself.
For example, the `{{about-page}}` component is rendered on the `/about`
route. You could say that this type of component is very much _domain driven_.

To me, this overloads the concept of `Ember.Component` and I'm grappling
to find the balance between domain agnostic and domain driven components.
It seems okay to have both, but I believe that both require their own set
of patterns (and maybe a different set of APIs?)
A good example is that domain driven components could use a `store`
injection to make API calls.

Another open questions about components is that, if _everything_ should be
a component, and `Ember.Controller` is going away, where does the orchestration
of components happen? How do they liaison among each other? Entirely in routes?
Service injections? Does all this liaisoning get pushed into some global
Application state? Does that defeat the purpose of the neat encapsulation
offered by components, in the first place?

---

Just some thoughts.

Find me at [@mehulkar](//twitter.com/mehulkar) to dig deeper /
tell me what I'm missing.
