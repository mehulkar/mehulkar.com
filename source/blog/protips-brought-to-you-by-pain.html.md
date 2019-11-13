---
title: "Protips: brought to you by pain"
date:   2014-09-30 22:42:35
categories: programming
---

These are probbaly not news to anyone who has any experience,
but I've learned a few things the hard way in the wee hours of the
morning. Making a list.


### DevOps

1. Before you reboot a machine, be sure that the sshd server is starts on startup.
1. If a runs a job repeatedly, always implement a sensible queuer.
1. Never remove a file, always `mv $file $file.bak` or similar. Better, use version control as much as possible.
1. Increase your shell's history size. Increase it more. You'll forget how you set things up. Increase it more.

### Architecture

1. Don't skip the design process. Understand the requirements, then model the objects based on the API you'd like to use. Name the methods.

### Programming

1. Don't use pre 1.0 software if you can help it. Related: Don't upgrade unless you absolutely need a new feature.
1. Don't be afraid to write non DRY code.
1. Don't refactor when you're adding new features. It's fine to copy-paste 99% of a method and abstract it later.

### Workflow

1. Each commit should be describable in one sentence. If it's not easy to write a commit message summary, the diff is too large or unorganized.
1. Don't push new code without testing first (automated or otherwise). Even if it's a one character diff.
1. Branch aggressively. Clean old branches aggressively. Rebase aggressively.

### Documentation

1. Be a stickler for typos, grammar, and clarity. The more time you spend now, while you still get it, the less time you'll spend re-reading the code/spec when you revisit a few weeks/months later.

### Testing

1. Don't skimp on the test suite. Definitely write all the easy tests. They will save you some day.
1. Extract helper methods when you can. Refactoring test suites is just as important as refactoring code.
