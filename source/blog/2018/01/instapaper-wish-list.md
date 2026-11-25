---
title: Instapaper Wish List
date: 2018-01-02
tags:
  - product
---

I use Instapaper a lot these days. I switched from Pocket a while ago for the simpler
interface and because Pocket's priorities are fundamentally the same as those of
Facebook: "get the user to stay in Pocket for as long as possible and throw ads at them".
I much prefer Instapaper's "Read it Later" focus that works cross browser and cross platform.

As a regular user, here's a list of improvements that I would make if I had the source
code for Instapaper:

- Persist sort

  The rate at which I add articles to Instapaper greatly exceeds the rate at which I read
  them<sup>1</sup>. The default sorting, is "Newest Saved". This means that my reading queue
  operates on the LIFO methodology, and I end up never reading many of my saves. My guess is that
  if I switched to a FIFO queue, I would be more likely to read more content. This sort option
  exists, but since it doesn't persist (or sync between web and iOS), there is too much friction
  to use it.

  **EDIT**: It turns out that [persisting sort on iOS is possible][2]!

- Make link to source more obvious

  About once in every 10 articles, I want to look at the original source of my saved articles.
  Every time I want to do this, I have to guess how to get to it. The header portion of each
  Instapaper article contains the title, the date, and the domain. I never know at first glance
  which one will take me to the original article (it's the domain, if you're wondering), so I
  always end up clicking all of them. On web, these links do have a hover state, but visually
  distinguishing the default state would also be useful.

- Bookmarklet for "I read this article"

  I want to track _everything_ I read online, but sometimes it's easier to read the article at
  the original source when I find it, instead of first adding it to my queue, then going to the
  queue to read it, and then archiving it. A bookmarklet that sends things directly
  to my Archive would greatly improve this flow.

- Notes on public profile

  [Public profiles][1] currently show a list of "Liked" articles. I rarely use the "Like" feature
  on Instapaper, because I rarely want to read or find an entire article again<sup>2</sup>. On the
  other hand, I use the highlight feature to take notes fairly often. I think being able to share
  these notes publicly, would encourage me to not only take more notes, but to make more
  conscientious notes. Additionally, I think being able to make my notes browsable directly on
  my profile would give my friends and family a reason to visit Instapaper and expose them to
  the service.

- iOS app icon badge

  I'm a little torn on this one. In some ways, I like that Instapaper doesn't have an icon
  badge indicating the length of my queue. It means that the app isn't begging for my attention
  by default, which is rare these days. On the other hand, although I know my queue is _always_
  going to be too long to get to "inbox zero" on any given day, it can be handy to see relative
  changes at a glance. I know that I'm constantly adding articles to my queue, so if I see the
  badge icon hover around the same number over time, I can also feel good that I'm getting
  my reading in also. If that number consistently increases, I know that something probably
  needs to change.

- Statistics

  My reading goals are to (1) read more articles and (2) read longer articles. Exposing the number of
  articles I'm reading every week or month would help me improve the former and
  exposing the word count of each article (or, bonus: the median word count of each article in
  my Archive per week) would help me improve the latter.

[1]: https://www.instapaper.com/p/mehulkar
[2]: https://twitter.com/InstapaperHelp/status/948264703687405568

**Footnotes**

1. My workflow is to scroll through Twitter in the iOS app until I drop dead,
   3D Touch links and swipe up for preview, click "Share via" and tap the
   Instapaper icon, which I've conveniently added to the front of the Share options.

1. I _do_ "like" articles occasionally when I read something so good that I would like to
   stumble on it again, but I never intentionally visit my liked articles. Sometimes I chance upon
   them and am delighted by these favorites.
