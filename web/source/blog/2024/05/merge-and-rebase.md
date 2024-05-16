---
title: Merge and Rebase
date: 2024-05-15
tags:
  - git
  - programming
---

I have two general rules for working across branches in a git repo these days:

- squash merge feature branch into main (or rebase, sometimes)
- merge main into feature branches

https://twitter.com/mehulkar/status/1790822175638765856

## squash merge feature branches into main

For most people, I imagine this is done via Pull/Merge Requests on your git
hosting provider (e.g. Github or Gitlab), but if you work in one of those
projects that merges locally and pushes to `main` to close out our PR, same goes
for you too.

I like Squash & Merge because:

- it keeps `main` (or whatever your default branch is) free of merge commits.
  Merge commits are fine, and it's not the end of the world to have them, but
  they are harder to work with when you're viewing history, rebasing, or
  bisecting. And for someone just tracing file histories, they are really just
  extra noise.
- It lets you forgo writing good commit messages until the point of merging. The
  hard truth is that 99% of people don't care about most of your commit messages
  in your branches. (There is a very important caveat to this that I'll get to
  in the next section). But in `main`, your commit messages _do_ matter. So it's
  important that when you merge into `main`, you write one good one. Squashing
  all your commits from your branch into one lets you do that.

I like Rebase and Merge on select occasions when I _have_ taken the time to
craft individual commits. That means that the commit message and body is well
written and useful to have in main, and the contents are atomic (i.e. cleanly
reversible) and a logical portion of work that someone could/should digest
independently. I've worked with probably <5 people in my 15 year career that
actually organized their work into good commits, and I'm one of them. So it's
rare.

These days it mostly comes in handy when I don't want to pay the CI cost of
submitting those individual commits in separate PRs. PRs are expensive because
CI is often slow and flakey and that is just a fact of life these days for most
codebases. So instead of making 5 PRs, I like to submit 5 commits in a PR, smile
and wink at the reviewer, and then Rebase & Merge to keep the history and
separation intact in `main`.

I like Rebase and Squash Merges both because they keep a single line of commits
in `main`.

## merge main into feature branches

I've written about [this before][1], but not very succinctly. The main purpose
of using Rebase/Squash when merging _into_ main is to keep a linear history.
Oddly enough the purpose of `git merge main` into the feature branch is the
same: a linear history! The difference is that feature branches have more
"events" in their history than just commit messages. Feature branches are often
submitted as Pull/Merge Requests. And Pull Requests have comments and reviews.
Each of these are part of a timestamped history of the artifact. Rebasing
destroys this history. You cannot tell after a rebase if a comment was submitted
before or after a commit. Reviewers have to review the entire diff again to see
whether their comments were addressed when new commits are added. For this
reason, I prefer merge commits in my feature branches. Admittedly, that gets
messy and I have to start over with a `git reset --soft main`, but that's pretty
rare. These merge commits show up in your PR, but then if you Squash and merge,
they don't travel into `main`, so there is no real harm there. They are also easier
to do on a feature branch, because conflicts only have to be resolved once.

The only caveat to this is if you work on a team where more than one person works
on the same feature branch. This has been exceedingly rare in my career, so I never
have to think about it. If I do work like that on occasion, I just treat the feature
branch like `main` and make pull requests into it, and the same rules apply.

[1]: https://www.mehulkar.com/blog/2020/06/coming-around-to-merge-commits/
