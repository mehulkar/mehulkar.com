---
title: UI architecture
date: 2016-08-28
categories: programming, frontend
---

UI architecture seems to be consolidating around components
and some sort of state manager.

React's whole schtick is about declarative components.
Ember's got the `Ember.Component` class that smashes together the View
and Controller layer. Backbone Views kind of had the same _idea_,
but the name implies larger scope objects. Angular 1x doesn't
really have UI encapsulation, but controllers and `$scope` could
be used to group and isolate UI, I guess.

The point is, encapsulating the behavior of visual elements
into objects that directly represent visual elements is
the _in_ thing these days. The HTML Web components spec
is an even lower level API that captures the same sentiment.

The necessary complement for component architecture to work
is an orchestration layer that ties them together and knows
what context they live in--i.e. 'state'. Examples of state are
Redux in React world and Services in Ember world. Point is,
if you have a set of components plopped onto a page, you need
something to tie them togther. Before SPAs, server side provided
this functionality.

I like the general direction this is going, but there are a couple
open questions with this architecture. (To be clear, these questions
haven't been well answered before this architecture either.)

First, how closely should components be tied to application domain?

The nicest components to write are the lower level ones that serve
as either improvements to what's available in native HTML (e.g.
a prettier select box) or additions to native HTML (e.g. toggle
UI). These components are nice because they are, by nature, simple,
encapsulated, and idempotent; pass in some inputs and get the same
behaviour out. Some people compare them to [pure functions][1], I
like to think of them as microservices<sup>1</sup>.

But then there is this other class of components that are
more tightly coupled to your application's domain. An app-header
or app-sidebar component, for example. Or a group of the
previously mentioned low level components that operate together
in a certain way, so it makes sense to create a wrapper component.

This second type of component is a little harder to reason about.
It's hard to design these components, because it's never clear
what state belongs inside and out. But they're sometimes _easier_
to throw together in a first iteration<sup>2</sup>.

The point here is that using the 'component' moniker for both of
these types of objects/UI is a little confusing, both when writing
applications and when talking about frontend architecture.

The other overarching thing I'm missing in this architecture is
styling. The two problems are that (1) components do not include
a spec for styling and (2) there isn't a clear separation of
styles that define the component and styles that are changeable
attributes.

So first, I've seen that JSX (which is used in React components to
inline HTML) can define inline styles. This is a cool concept,
but it feels dirty. Maye I'll come around to it. As I see it,
inline styles have these pros and cons:

**Pros:**

- Completes the encapsulation of a UI component
- Already possible

**Cons**

- Feels dirty to put ALL style inside the HTML `style` attribute.
- Shareability of styles may suffer. This is mostly a nonproblem
since JSX can take advantage of ES6 imports/exports, but outside
JSX, it would still require a solution.

But putting aside the JSX approach of inline styles, another approach
that is exciting would be HTTP 2.0 + CSS Modules. In other words,
a component could specify a CSS module that is fetched on render,
and with an HTTP 2.0 connection, lots of components could fetch
their styles in the same round trip on the network, thus getting
scoped styles without performance loss.


The second problem with components and styling is that it's unclear
which styles _define_ the component, and which styles are _attributes_
of the component. For example, if I changed the background color of
a Button element, does it become a new component, or is it still
a Button that looks different? This answer to this question is
unclear in practice and can cause a lot of architectural design
pains (and therefore complexity).

Even theoretically, I can't think of a great answer to this, other
than a spec that could separate style definitions between these
categories and leaves it to the developer to define their own
conventions.

So to recap, frontend programming on the web is maturing. We've figured
out that thinking about UI in terms of components injected with stateful
services is the way to go and that app state doesn't belong in components.

But we haven't figured out some of the nuances of this approach.
I'm guessing there is some inspiration to be drawn from other GUI
paradigms--this is not a new problem (or is it?).

Either way, I still love working on the Web platform. It's broken
and exciting at the same time and I'm glad for both.

**Footnotes**

1. Microservice architecture is really just an expression of a
pure functions, by the way--at least computational microservices.
2. Sometimes also a good way to contain technical debt, which is
a topic I could write a whole new post on.

[1]: http://www.nicoespeon.com/en/2015/01/pure-functions-javascript/
