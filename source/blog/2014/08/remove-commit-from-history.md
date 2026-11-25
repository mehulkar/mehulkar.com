---
title: "Cherry pick commit OUT of history"
date: 2014-08-22 00:00:00
tags:
  - programming
---

If you have commits:

```
1 2 3 4 5
```

and you want to get rid of commit 3, do this:

```bash
# currently on master branch
git checkout -b tmp
git format-patch 4..HEAD --stdout > patch.diff # gets all the commits you want
git reset --hard 2 # go back to good times (before you had commit 3).
git am < patch.diff # apply the patch you generated (this is not squished)

# now you're back to happy times. Depending on what you're
# trying to do, you can:
# 1. delete your master branch and rename tmp to master
# 1. make tmp your feature branch and make PR from it
# 1. or hard reset your master branch and merge tmp into it.

# clean up
rm patch.diff
```

This happened to me just now when I merged a branch `foo` into `master` locally because
I didn't want to wait for a PR to get merged. Now, every time I checkout new branch `bar`
from `master`, it includes commits from `foo`. Now, when I create a PR from `bar` into
upstream, it includes `foo` commits. Which would be OK if `foo` got merged right away.
BUT, I ended up changing history on `foo` (squash/rebase/amend/whatever), so that now
`bar` and `foo` have divergent histories and you end up having merge conflicts even
if `bar` and `foo` don't touch the same files.

NOW YOU KNOW.
