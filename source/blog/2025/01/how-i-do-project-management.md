---
title: How I Do Project Management
date: 2025-01-03
tags:
  - engineering
  - project-management
---

## What is a project?

A project is a known thing you deliver at some point. It is _not_ an ongoing
effort or a "North Star". Delivering a project does not mean the outcome you
want is achieved (the _success_ of a project determines that), it simply means a
coherent set of tasks were finished. You can disagree with this, but you're
likely just using a different word for the same thing. At some point, things
boil down to getting a set of tasks done. When those tasks are organized into
something that can be executed, that is called a project.

## Elements of a project

Every project has two elements: the Burndown and the Collaboration. You need
both of these elements to predictably complete projects. For me, Linear is the
burndown tool and Slack is the collaboration tool. You can substitute any ticket
tracker for Linear and any free-form chat tool (even email) for Slack, but this
is what I use today at Vercel, and I like it. It is my silver bullet.

### Linear

Linear as a burndown tool is a dumping ground for tasks. I use them freely to
track tasks, code changes, things to remember, etc. It's completely fine to
break them up, combine, or cancel issues later. As an old colleague would say:
"Tickets are cheap".

You can use Milestones or a flat list of prioritized issues depending on the
project. I don't have a prescription for this because issue management can
easily become a painful chore<sup>1</sup>, so it's better to vary how you do it
based on who's involved and their personal tastes, how long a project is
expected to be active, the nature of the tasks themselves, etc.

### Slack

Every project should have a dedicated Slack channel that is archived after the
project is completed. The archival process should include a follow-on
strategy<sup>2</sup> pointing to where to go for support after the project is
marked done.

Slack is two-way communication: for outsiders to offer opinions and for insiders
to riff on ideas or work in progress. The key is that it's unstructured, which
makes room for creativity, and a creates a staging ground to turn conversations
into executable tasks.

### Slack + Linear

The burndown and communication tools should be connected in two ways:

- Conversations that yield workable tasks should be linked. The Slack Linear
  integration makes this easy with the "Create Issue" feature. Threads are linked
  to issues and are notified when the issue is done.

- A regular update of the burndown should be posted into the communication tool.
  Linear makes this easy with the Project update feature that can be auto-posted to
  Slack. It's visually different from the rest of the conversation, and can
  includes the `%` completion of the burndown list.

This two-way integration between the elements of a project creates a predictable
dynamic that enables teams to execute a project to done.

### Other Tools

Outside of a burndown list and a communication tool, you can add/remove docs and
synchronous meetings as you want. I think these depend on the nature and health
of the project, who's involved, and who's paying attention.

## What I'm optimizing for

To me, these elements of a project are obvious, but I'm coming from somewhere
and I'm optimizing for something. This may not match what you're optimizing for,
so I'll make it more explicit. When I think about project management, I am
optimizing for (in no particular order):

### Shipping

Shipping doesn't have a single definition&mdash;you have to know when to call
something shipped. That means knowing the definition of done, where "done"
actually means paused.

### Building Trust

Trust is predictability. Using the same tools across projects builds trust
amongst those who are not intimately involved (and even those who are).

### Marketing

We have to talk about projects frequently to get them done. Talking about
projects frequently builds mind share, then alignment, and then support. Tools
make this easier. A secondary effect of using consistent tools is that it forces
you to give projects coherent (and consistent) names.

### Measuring Progress

We have to be able to keep tabs on progress in a predictable fashion. This has
the dual effect of marketing a project (see above) and creating incentives to
iterate in small chunks.

Measuring progress also finds problems sooner. For example, if there are no
updates for a period of time, is the project actually active?. It's better to
know that, debug it, and make a clear decision to pause, cancel, or pivot the
project.

### Staffing

Finishing projects means you can start other projects. This doesn't mean you
have to stop iterating, it means you have a pivot point to shuffle people and
priorities. This is vital from an organizational standpoint (we want to know how
teams are performing) and a personnel standpoint (we want to reduce knowledge
concentration and offer people the chance to do other things).

### Performance Reviews

Performance reviews will always include some form of "Person X {led|worked on}
Project Y". At this point, the definition of Project Y or the degree of Person
X's involvement should not be under question. It should also be easy for the
person in charge of reviews to get this information.

---

## Footnotes

1. For people who are not masochists like me, I mean.

2. "Follow-on" is a strategy I learned from Apple's Radar bug tracking system.
   Radar has "components" as a categorization mechanism for issues (or, as
   they're called: radars). When a component is closed, it is recommended to
   provide a follow-on component where issues can go instead.
