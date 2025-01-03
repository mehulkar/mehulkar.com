---
title: How I Do Project Management
date: 2025-01-03
tags:
  - engineering
  - project-management
---

## What is a project?

A project is known thing you deliver at some point. It is not an ongoing effort
or a northstar or a set of tasks. Delivering a project does not mean the outcome
you want is achieved — the _success_ of a project will determine that.
Delivering a project simply means a coherent set of tasks were finished. You can
disagree with this, but you're likely just using a different word for what I'm
talking about here. At some point, things boil down to getting a set of tasks
done. When those tasks are organized into something that can be executed, that
is called a project.

## What makes a project?

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

Depending on the project, you can use Milestones or a flat list of prioritized
Issues. Issue management is sometimes a painful chore<sup>1</sup>, and the
amount of detail to track varies for many reasons (who's working on it and their
personal likes, how long a project is expected to be active, the nature of the
tasks themselves, etc), so I don't have a prescription for that.

### Slack

Slack is a real-time communication for outsiders to drive-by, peek in, or offer
solicited (or unsolicited) opinions. The key is that it's unstructured, which
makes room for creativity, and a staging ground for parsing into work that must
be done. Every project should have a dedicated Slack channel that is archived
after the project is completed. The archival process must include a follow-on
strategy<sup>2</sup> for people to know where to go for support after said
project is "done".

There is a unique connection between Slack and Linear, that is really the
connection between a burndown and communication that must be called out. A
project is healthy if it communicates at a regular cadence with its audience.
For this, I use Linear's Project Update feature and auto-post that into a
connected Slack channel. Predicatable in cadence and format. You can add/remove
docs and meetings as you want, those are optional and depend on the project.

## What am I optimizing for

To me, these elements of a project are obvious, but I'm coming from somewhere
and I'm optimizing for something. This may not match what you're optimizing for,
so let me make it more explicit. When I think about project management, I am
optimizing for (in no particular order):

### Shipping

"Shipping" doesn't have a single definition&mdash;you have to know when to call
something shipped. That means knowing the definition of done, where "done"
actually means "paused".

### Building Trust

Trust is predictability. Using the same tools across projects builds trust
amongst those who are not intimately involved in the project (and even those who
are). This is vital to the success of projects, and not just among
stakeholders&mdash;casual observers can become stakeholders somewhat
unpredictably.

### Marketing

Using tools forces you to give projects a name and makes it ~~easier~~ possible
to talk about a project. If you can't talk about a project, you can't get it
done. Put another way: if you aren't marketing the project coherently and consistently,
you can't define what done looks like.

### Measuring progress

We have to be able to keep tabs on progress in a predictable fashion. This has
the dual effect of marketing a project (consistently appearing in the collective
mindshare) and creating incentives to iterate in small chunks. Ironically this
also creates the reverse influence of creating progress where there might not
have been any. Conversely, measuring progress consistently also finds problems
sooner. For example, if there are no updates for a period of time, is the
project even active?. It's better to know that, debug it, and make a clear
decision to pause, cancel, or pivot the project.

### Staffing

Finishing projects means you can start other projects. This doesn't mean you
have to stop iterating, it means you can shuffle people and priorities at a
predictable time. This is vital to healthy teams, both from an organizational
standpoint (we need to know that a team is shipping) and a personnel standpoint
(we need to reduce knowledge concentration and offer people the chance to od
other things).

### Promotions / Reviews

Reviewing someone's performance will always include some form of "Person X
{led|worked on|} on Project Y". At this point, the definition of Project Y or
the degree of Person X's involvement should not be contentious. It should also
not be hard for a person in charge of promotions to get a list of these
statements. We have tools for that.

---

## Footnotes

1. For people who are not masochists like me, I mean.

2. "Follow-on" is a strategy I learned from Apple's Radar bug tracking system.
   Radar has "components" as a categorization mechanism for issues (or, as
   they're called: radars). When a component is closed, it is recommended to
   provide a follow-on component where issues can go instead.
