---
title: Federated meetups at Apple
date: 2022-12-26
tags:
  - apple
  - fediverse
---

When I was at Apple, I created an internal tool to organize events called meetups.apple.com. The tool was roughly based on meetup.com with events and groups and rsvps, and it gained significant traction in the years I was there. By the time I left, the tool had been used to plan over 10,000 events around the world (although some of them were undoubtedly events created solely for the purpose of testing the tool). Numerous people told me (and I also believe this) that it helped push parts of Apple's siloed culture internally into an new era of open collaboration.

One of the most important decisions I made early on to accelerate this change was to make it impossible to create private events. I believed creating a private events feature was a bad idea for three reasons:

1. Events wouldn't really be private because app admins (like myself) would always have database access, and infrastructure admins (the team that hosted the PaaS where my tool was deployed) would have root access to the container/VM/machine.
2. Private events would invite scrutiny from the Infosec teams that take Apple's security very seriously, and this dinky little web app that I maintained in my spare time could not stand up to that scrutiny. I was afraid it would open a pandora's box against the tool before it had the chance to really flourish.
3. Most importantly, the purpose of the tool was to create possibilities for cross-team pollination. I believed that although private events could increase adoption, that growth would necessarily have to remain private, hampering further growth, and also making the handicapping the tool's core purpose. I didn't want to just make a popular tool, I wanted the popularity itself to be a feature.

To satisfy the many, many demands for this private events feature, one idea I toyed with was to create "unlisted events", which would make events private in name, but still allow the tool to advertise the popularity of the tool. I didn't implement this because I thought it would be (1) hard to teach those who actually wanted private events that "unlisted" does not mean private and (2) easier to teach those that didn't _really_ need private that working in public has merits also.

Getting to the meat of this post now...After using Mastodon for the last few weeks, I remembered another idea I had a few years ago.

I wanted to build a feature where `meetups.apple.com` could communicate with other deployments of the codebase. I imagined that if I made it easy to deploy, teams could deploy their own instances of the codebase on, say, `events.my-team.apple.com`, and _broadcast_ their events to the "home" instance. I imagined the architecture not to be totally peer-to-peer, but with one leader and several smaller instances that could choose to share or hide their events. I thought this would be an elegant way for teams who wanted private events to be "mostly public, but occasionally private". With some deliberate attention to the UX, I could encourage people to generally create broadcasted events. I believed I could use this architecture to fulfill the customer need, but also my own agenda and philosophies on how folks inside Apple should think about internal collaboration.

Although I never built the feature, I am reminded of this idea with how the Fediverse communicates between instances. I am still learning about the ActivityPub protocol, but it already feels like it could be useful in ways that I haven't thought of yet.
