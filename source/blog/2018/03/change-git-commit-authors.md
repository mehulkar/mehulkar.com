---
title: Change Git Commit Authors
date: 2018-03-09
tags:
  - programming
  - git
---

Here's a quick script to rewrite the git author/commiter in a repo. I mess this up all
the time if I'm on a work computed making changes to a personal project (e.g. this website),
and I want my commit history to use my personal email address, rather than the globally
configured work email.

```bash
#!/bin/sh

git filter-branch -f --env-filter '

OLD_EMAIL="<addthis>"
CORRECT_NAME="<addthis>"
CORRECT_EMAIL="<addthis>"

if [ "$GIT_COMMITTER_EMAIL" = "$OLD_EMAIL" ]
then
    export GIT_COMMITTER_NAME="$CORRECT_NAME"
    export GIT_COMMITTER_EMAIL="$CORRECT_EMAIL"
fi
if [ "$GIT_AUTHOR_EMAIL" = "$OLD_EMAIL" ]
then
    export GIT_AUTHOR_NAME="$CORRECT_NAME"
    export GIT_AUTHOR_EMAIL="$CORRECT_EMAIL"
fi
' --tag-name-filter cat -- --branches --tags
```

Note that since this changes git history, if anyone else has a fork of this project,
they are going to have a bad time. Use responsibly!
