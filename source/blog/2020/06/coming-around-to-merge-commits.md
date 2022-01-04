---
title: Coming around to merge commits
date: 2020-06-10
categories: git, github
---

Ever since I learned how to rebase and rebase interactively, I've avoided git merge. One of the big reasons for this is that I have `git l` aliased to a custom `git log --graph` (that I undoubtedly copy-pasted from somewhere on the internet):

```bash
git log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset'--abbrev-commit --date=relative
```

This command spits out a nice view of commits, but reading a git graph gets really hard
when there are lots of branches and merge commits. I've never really gotten
good at reading those illustrations of git that try to explain how commits stack
on top of each other and merges bring branches back into each other. So I avoid them altogether.
`git rebase` is a fantastic way of doing that, because it helps retain a single line of development.
Every project I've worked on has only had a handful
of people working on it at a time, so it's never been hard to either use the Rebase and Merge
button on Github or to rebase on my machine and then `git push -f`.

But I'm finally coming around to appreciating merge commits--if not yet using them religiously--for a couple of reasons:

1. Rewriting commits

    The textbook reason for not using rebase is because commits get rewritten during the process.
    All that means is that the sha is different. (If you're unfamiliar with how rebasing works, don't worry, I didn't get it till I got it either. It's similar to checking out a new
    branch and cherry picking commits off another branch. The commit's author name and date
    stay the same, but the committer name and date change. And the sha changes also.)

    For most of the projects I've worked on, this doesn't matter. It doesn't matter if the commit
    sha changes. The change in commit date sometimes make it hard to understand the order in which
    commits were applied, because a sha could be _authored_ a long time ago, but _committed_ recently.
    Becuase we keep branches relatively small and short-lived, this also doesn't matter.

    The straw that finally seems to be adding undue pressure to the camel's back though is another set
    of git aliases:

    ```bash
    [alias]
        pr = remote prune
        del-merged = "!f() { git branch --merged | grep -v '\\*\\|master\\$' | xargs -n 1 git branch --delete;  }; f"

        up = "!f() { git del-merged && git pr origin; }; f"
    ```

    `git up` is my handy shortcut for deleting all local branches that are already merged and then
    also deleting references to branches that were deleted on the `origin` remote.

    My workflow with git is typically:

    1. checkout branch `new-branch`
    1. Do work
    1. fetch master and rebase `new-branch` on it
    1. Push and make pull request
    1. Merge PR and delete branch from Github UI
    1. git checkout master
    1. `git up` (the alias from above)

    This used to work fine, because I made sure to rebase the new branch before making the PR. But if
    any more commits go into master before the Rebase and Merge button in Github, commits
    get rewritten! This means that after my PR is merged, `git up` does not work, because `git branch --merged`
    won't include my branch. `git branch -d new-branch` won't work either, because git doesn't know
    if those commits were merged (becuase a totally new set of commits were merged). I've been
    working around this for the longest time by doing _another_ rebase locally after pulling down master (with
    the PR merged). Since the diffs are the same, git is able to do a merge and the new branch becomes
    up to date with master and `git up` works. This extra step is getting plain silly and annoying now,
    so I've been doing `git branch -D` instead, which is risky because it means I could accidentally
    delete a branch that was not yet merged.

1. Github PR's force push UI

    The other textbook response from git merge enthusiasts is that when you rebase (and rewrite commits),
    the only way to push those commits to a remote where the branch has already been pushed is to force
    push. And FORCE PUSH BAD. I still don't buy into this, as it's one of those things that only hurts when
    it hurts, but the pain is easily avoidable if you're using it in limited circumstances.
    Force pushing is absolutely "bad" for branches where multiple people apply commits (e.g. `master`), but
    for any other branches, if only one person is going to work on it until it's merged (or if the branch is only
    pushed to a fork), it's not a big deal!

    But I found a real reason to avoid force pushes even in the cacoon of my "small team, slow project"
    world, that is gently cajoling me towards merge commits.
    The Github UI shows activity in a pull request by timestamp. So if someone leaves a comment (or review)
    on your PR, and then you force push, the commits appear _after_ the comment. This makes it really hard
    to know if comments are still relevant. Or if any commits _specifically_ addressed those comments.
    For PRs with small diffs and few commits, this is not a big deal because you can usually see what changed
    in the diff. Or see a new commit (if there was only one commit before, for example). But for faster moving
    projects, with many open PRs, it gets really hard really fast to keep track of this kind of stuff.

    If PRs usually don't need multiple rounds of review, this problem can stay dormant for a long time.
    But projects where PRs get multiple reviews (either multiple from the same person, or one from many people),
    the second or third review can find it difficult to see the previous reviews prompted any changes.

You'll notice that the reasons for my aversion to merge commits have not really changed or been addressed.
And I didn't suddenly discover that the usually-cited problems of rebase are now applicable.
Rather, I seem to have uncovered a totally new set of tangentially-related problems caused by rebasing.
Will I change my entire philosophy for these papercuts? STAY TUNED.
