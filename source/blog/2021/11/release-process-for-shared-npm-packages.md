---
title: Release Process for Shared npm Packages
date: 2021-11-19
tags:
- programming
- javascript
---

I've been using these steps to maintain/release ~20 internal packages. It's
not the most sophisticated approach, and there's almost no automation, but
it's worked pretty well for over a year now.

1. **Merge PR with bugfix** (this is the actual work you're doing)
1. **Evaluate any open PRs** or check with coworkers if there are other things that can be done/merged soon and if it makes sense to group them into the next release. Take into context any urgent needs or difficulties that projects will have, when adopting a new release.
1. **Choose the new version** to be published. We follow SemVer, but even with SemVer you have to make some judgement calls. Many things can be both bugfixes or enhancements/new features, depending on how you see it. If it's not clear, consider how you want the change to be adopted (patch versions are more easily adopted), or how difficult it will be to adopt the change (does it require QA in the parent app?). Bumping the minor version will get more attention than bumping a patch version.
1. **Add a CHANGELOG.md** entry for the new version. You can make a new PR if you want a review (clear and consistent writing is just as important clear and consistent code), or you can commit to `main` locally. Changes will get pushed up in the next few steps.
1. **Ensure a clean local state.** Make sure you're on the `main` branch and CHANGELOG.md is updated. `git status` should be clean, no untracked files, etc. Anything in `$PWD` will get published in the next step, so watch out for this.
1. **Run `npm version <something>`** based on the version you chose. If you're doing a patch release for example, run `npm version patch`. This will update the version in package.json and package-lock.json, and create a new commit and a git tag at current `HEAD`.
1. **Check package.json for a `postpublish`** npm script set to `git push --follow-tags` . Most of our packages have this, but if they don't, you'll have to run this step manually later.
1. **Run `npm publish`**. Assuming credentials are setup, this should publish the package. Read the output!
1. If there was no `postpublish` script in package.json, run `git push --follow-tags`. You can do this a second time even if it already happened. But note that normal git push rules apply. This will push to your `origin` remote. Change the command if your `origin` is set to a fork repo.
