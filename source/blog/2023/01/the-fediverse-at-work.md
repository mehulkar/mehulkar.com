---
title: The Fediverse at Work
date: 2023-01-13
tags: fediverse
---

One of the advantages of the Fediverse is the interoperability of services through the ActivityPub
and ActivityStream protocols. The promise is that a Twitter (I.e Mastodon) user could follow a Instagram
(ie Pixelfed) user and both could favorite content from a YouTube (ie PeerTube) user. This is “cool”,
and it’s politically and philosophically superior to break down walled gardens, but it’s not that
personally compelling to me. I’ve been trained for 20 some years to have different user accounts for
different services, and I actually find it annoying when videos show up in my Twitter feed.
I may be able to “update” (link to Scouts Mindset) to appreciate this interoperability, but in the
meantime, I don’t see a practical or desirable use case.

Until now, that is.

One of the patterns I've noticed at work is that conversations are splintered across many different
platforms. Here's a pretty typical workflow for me as a software engineer:

1. I write an RFC in Notion or Quip
2. Open a prototype pull request in Github
3. Post links in Slack to each of these asking for comments
4. When UI work is needed, a designer will sometimes record a video in Loom
5. The Pull Request deploys and launches a Vercel Preview with Comments

Teammates can leave comments on each of these platforms over time. There is often confusion about
the "home" of a feature. Is it a dedicated slack channel? Is it the RFC document? Is it next to the
code in the Pull Request? There is often no good answer, and everyone just need to track that
context mentally when they think about my work. They have to remember which slack thread contains
which piece of feedback or which resolved comment in Notion contains a decision from leadership.

It's pretty cool that all of these platforms are linkable by URLs -- after all that was the promise
of the World Wide Web! But because each platform has their on concept of "objects of interest"
and activities upon those, the web of information has to be tied together by humans.

Can we use the ActivityPub protocol to solve this problem?

What if, instead of using URLs to link to entities and activities across platforms, we could access
those entities and activities directly *across* platforms?

Instead of consciously trying to *pick* a home for a piece of work, you could start *anywhere*,
because it didn't matter? For example:

1. I write an RFC document in Notion
2. My coworker, from their Slack account, sends a reply to this document
3. Another coworker, from their Loom account, sends a video walkthrough of a prototype
4. I, from my Github account, open a Pull Request
5. And so on...

Or alternatively:

1. I open a Pull Request in Github
2. My coworker comments on it from Slack
3. And so on...

As someone who cares quite a bit

- Rakesh’s startup to do comments on anything. You *know* that eventually people will want to link to that

How does Fediverse help? Or does it at all?

It doesn’t create a “source of truth”, it’s *actually* a multiplayer system. You can like and reply
to entities from multiple places and each client can present it the way it wants to. Of course,
here lies Zalgo. If clients present differently , conversations can get lost. If federation limits
clients, things can get lost.

And what about business incentives? Does fediverse participation require partnerships among entities?
(Slack will only federate with Figma if they pay $$? Who’s the bigger player and who “wins”?)

<GH activity streams toot link>


[1]: https://www.w3.org/TR/activitystreams-vocabulary/#dfn-inreplyto

