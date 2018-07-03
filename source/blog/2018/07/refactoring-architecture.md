---
title: 5 Strategies To Refactoring Architecture
date: 2018-07-02
categories: programming
---

Refactoring code architecture often means touching a large number of files. In most code bases,
this can be a difficult thing to approach for several reasons. For example, it can be difficult and
risky, it can interfere with other work, and it can disrupt the work of other team members.

However, even when architectural changes are not necessary, refactoring at the architectural level
can be a valuable learning exercise, and can also reveal potential improvements or pitfalls.

Here are five strategies I use when approaching these kinds of refactorings.

## 1. Keep a physical notebook on my desk

One of the hardest things to do when I'm down the rabbit hole of refactoring is to know *how many*
of these holes to go down. Very few are guaranteed to bring me back full circle to where I started
with it. To help with this, I keep a simple lined notebook on my desk and write down each thing
that I want to come back to later. It is satisfiying to have a physical copy of these instead of
putting them into a bug tracker because:

- it's faster
- it doesn't get lost
- I don't have to explain its content or merit to anyone else
- I get have the satisfaction of coming back to it later

Sometimes line items from this notebook get promoted into the official bug tracker, but usually
they do not.

## 2. Make cosmetic changes

Architectural refactors feel difficult to me because they are often associated with unfamiliar code.
Some people are able to and are content with reading code to understand it. I am not. I think
with my hands as I rearrange, nudge and, coddle code. In many situations, this ends up being
valuable to the code base, but more importantly, this allows me to *feel* my way through code,
bit by bit. I:

- expand or simplify variable names
- hoist guard statements
- pull out data as configuration
- add or remove whitespace
- re-order functions or methods
- change directory structure
- add code comments to explain my understanding of code

These types of changes (and others) can feel like unnecessary churn to others, but to me,
massaging code like this not only makes it easier for me to speak its language, it almost always
reveals a path to the bigger goal.

## 3. Craft my commits

One thing I like to do (especially when making cosmetic changes) is to be extremely dogmatic
about my commits. I soemtimes spend long amounts of time crafting the perfect chunks of diffs
together (all hail `git add -p`!), so that as I work and draw out the essence of what I want
to accomplish, I can move unrelated diffs to separate branches and submit them separately.
Being religous about this grants me the luxury of making as many changes as possible, without the
fear of compromising for one goal vs another.

I also use `git rebase` and `git rebase -i` diligently to both split and squash commits. Some people
think of this as rewriting history; I think of it as polishing the narrative I want to tell about
this refactor.

I try to be strict about tests passing at each commit, so if I break the build
with a commit, and fix it later, I make sure to combine those changes into a single commit.

## 4. Pair program code review

I don't typically pair program day-to-day, but I do enjoy pairing for code reviews. Refactoring
architecture usually means large diffs, and thus, large pull requests (although it is very possible
to submit small changes at a time and make incremental improvements). I personally don't like to
review large pull requests that touch many different parts of the codebase, and I suspect that
others don't either.

It helps a lot to schedule 1:1 time with a team member to do reviews. Set a meeting on the calendar,
find a way to sit next to each other (I'm sure this is possible in a distributed setting, but
I have not tried it yet), go through the diff line by line, and add review comments as you go.

Doing a code review in real time makes it much easier to handle differences of opinion, mitigate
possible risk, quickly find and fix bugs, and recruit support if the refactor breaks things
in the future.

## 5. Be Patient

This is the hardest strategy for me. When I start refactoring, I don't always
know the end goal. When I *do* know the end goal, I don't know the path to get there. So every
refactoring on the architectural level is a meandering journey that can last any amount of time.
Many things can happen along this journey:

- Sometimes I discover entirely unrelated changes that I want to solve and re-base on.
- Sometimes I discover that the change I wanted to make introduces other problems.
- Sometimes I discover that teammates are opposed to certain patterns.
- Sometimes more important things come up that take me away for days
- Sometimes those days turn into weeks and my branch gets so old it's too much of a pain to rebase
so I throw it away.
- Sometimes I simply get stuck or bored and throw away my work

These all test my ability and desire to stick with a refactor, but if I stay
patient, I can usually get to a point where the refactor can either be merged or thrown away.

---

In conclusion, refactoring at the architectural level is a long term project. I do not often know
exactly how to get to my goals, but if I start small, stay organized, and be patient, it can be
extremely satisfying and fun.
