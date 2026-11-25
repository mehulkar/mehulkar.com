---
title: Eng Log 0001
date: 2024-11-23
tags:
  - engineering
  - journal
---

One of the biggest reasons I don't write more often is because I have trouble
figuring out what to call it. But I want to make more room for just writing
things and worrying less about form. So instead of coming up with a title, I'm
just going to index it by a number. I've seen other writers do this also.
Normally at this point I would try to find evidence of these other writers and
reference them and their thoughts about this style, but I'm shedding that burden
too. So anyway, the reason I made these decisions is to write down a thought I
had. `/preamble`.

Last week, some folks from Sentry reached out about a flakey test detection
product. My team owns our backend codebase and flakey tests had been a problem
recently, so our CTO put us in touch with these nice folks.

We don't really see a lot of flakey tests in our CI anymore. But I realized the
reason for that is that we fixed a totally orthogonal problem: our package
graph. We have a large monorepo that uses `turbo` to determine which tests to
run based on the files changed in each pull request.

Previously, almost every pull request invalidated all 500 packages in the
monorepo, which meant that every test would have to run. When we started
tracking this data, we saw that ~60% of CI runs had to run the whole suite.
_After_ we fixed our package graph, that's down to 3% of CI runs. That means
that many tests are just not running as frequently now. There are a few reasons
this means that "flakey tests aren't a problem" anymore. Because fewer tests
run,

- we just don't run into the problem as much, all else being the same
- flakiness due to resource contention (e.g. timing problems) is gone
- the likelihood of tests that only fail in certain orders and combinations is reduced

So for the most part, we haven't fixed flaky tests, but by fixing a different
problem, we changed how often it surfaces, and how much we need to care about it
right now.

This is interesting in the world of engineering and project management, because
it's hard to communicate the relationship between two seemingly unrelated
problems. If we had done a better job of communicating the impact of a bad
package graph and the effect of fixing it, it's possible that we'd never even
have been introduced to Sentry to take this call.

`/end`
