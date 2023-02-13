---
title: The Fediverse At Work
date: 2023-02-12
tags: fediverse
---

One of the advantages of the Fediverse is the interoperability of services
through the [ActivityPub](https://www.w3.org/TR/activitypub/) and
[ActivityStream](https://www.w3.org/TR/activitystreams-core/) protocols. The
promise is that a Twitter user could follow an Instagram account, and both could
favorite content from YouTube. Or, rather: a [Mastodon](https://joinmastodon.org/) user could follow a[
Pixelfed](https://pixelfed.org/) account, and both could favorite content on [PeerTube](https://joinpeertube.org/).

This is “cool”--and I'm politically and philosophically amenable to the idea
that a utopian digital society has no walled gardens--but if I'm being honest,
it's not that compelling. For 20 some years, I've been trained to create
separate user accounts for each service, and to use each service for different
things. I may [someday be able to](/blog/2021/07/scout-mindset/) appreciate this
interoperability, but in the meantime, it doesn't seem that practical or
desirable.

But there's another context in which interoperability may be useful. At work!

After working remotely for a few years (thanks pandemic), the lack of
integration across the tools we use at work has become increasingly apparent. As
an individual contributor software engineer, here's a typical representation of
how I work on projects:

1. Write a document describing a project in Notion. Share the link in Slack.
   Receive comments in Slack and on the Notion document.
2. File a Linear Issue with the work that needs to happen and share in Slack.
   Receive comments on both.
3. Open Pull Request on Github, referencing the Notion doc. Share link in Slack.
   Receive Review comments on the PR, and more reactions in Slack.
4. Start a Project channel in Slack and re-link the Notion doc. Share updates
   and discuss open questions. More threads.
5. If it's a project for a website, get a Preview Deploy with a comments widget.
   Share that link also in Slack. Get comments in both places.
6. Notifications. Notitifications everywhere.

Sometimes there are Figma design specs, with their own set of comments. And Loom
walkthroughs, also with comments and likes. And any number of other things over
time.

The combinatorial complexity of these tools across these platforms (not to
mention emails) can be quite messy to track. It's really hard to remember
_where_ a conversation took place. Coworkers often repeat the same text in
multiple places, prefixing with phrases like "Shared this in Notion comment
also, but..." or "Just left a review, but high level: ...".

Maybe it doesn't have to be this way. Maybe the protocols that make up the
Fediverse can help. What if, instead of sharing a Github Pull Request URL in
Slack, your Slack team channel could instead be subscribed to the Github
repository. Maybe new Pull Requests are broadcasted to followers, and replies
from Slack users to those posts are sent as comments to the Pull Request in
addition to being threaded in Slack. Maybe the Notion document is treated the
same way. Maybe the Loom walk through is a *reply* to a Slack thread, and
comments on the video appear in Slack. Maybe the Slack thread is a series of
comments displayed on a Figma design.

---

One of the challenges of the way we track work today is that it's never clear
*where* the Source of Truth is. If you have something to say about a project,
should you comment on the Notion doc that started it all? Should you start a
thread a new thread in Slack? Review the Pull Request? **The fediverse turns
this upside down**. Instead of designating a source of truth among many
platforms, it's *actually* a multiplayer system. You can react and reply to
entities from any platform and each client can present it the way it wants to.
An activity may *start* on a platform, but after that it's a series of
interactions from any client-server combination. Notion can participate. Loom
can participate. Figma and Github can participate. Heck, you could participate
from your command line if you really wanted. That's really the key. Platforms
have their own entity models, but they are *participants* in the same universe.
And they can do this without developing custom integrations for every platform
they want to integrate with.

As an individual contributor, on the other hand, you can participate in this
universe through any of these platforms. if you want to live in Github, you
can--all Slack threads will show up there. If you want to live in Notion you
can, all Github PRs can show up there.

This is powerful for a couple reasons:

- First, if the system works, one thread is one thread. Replies can originate
  from different sources, but remain linked. You can still start unattached, new
  conversations, of course, but it isn't because you're limited by your tools.
- Second, you don't need policies or cultural discussions about "how we work".
  Coworkers can live in the tool they prefer, start work where it makes sense,
  but remain connected.


--------------------------------------------------------------------------------

Every platform has some form of integration with other platforms already. In
fact, many of them have entire teams to support these integrations. Why not
implement a protocol instead? M.G. Siegler says in [an article of the same name][1]:

> Mastodon brought a protocol to a product fight

It's true that end users don't care about protocols, because there is no
economic reason for them to prefer a product that implements a protocol over a
product that doesn't. But a product _team_, that's another story. Maybe,
developing a protocol *is* better than developing a hundred different
integrations.

[1]: https://500ish.com/mastodon-brought-a-protocol-to-a-product-fight-ba9fda767c6a
