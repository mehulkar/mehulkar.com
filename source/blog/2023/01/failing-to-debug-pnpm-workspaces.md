---
title: Failing to Debug pnpm Workspaces
date: 2023-01-20
tags:
  - programming
  - debugging
  - programming-journal
---

I wish this was [one of those posts where I write about debugging an issue](/blog/category/debugging)
and figuring it out. This is the other kind. Where I debug something and eventually give up.

## How it started

I was debugging [a Turborepo issue][1] that came up because of a "small fix" I did in the last release.
My fix was for an obscure issue that I don't even remember anymore. The fact that it broke some
people's experience was rightly embarassing. So I jumped into debugging and, turns out, the fix
revealed another subtle problem. So I was pretty happy about that.

Turns out that with a pnpm workspace configuration that looks like this:

```yaml
packages:
  - apps/**
```

the double `**` glob expands to all subdirectories that include a `package.json` file. This is
wrong because because some inner directories are build directories that also have this
manifest file.

## The thing I wanted to debug

I know why this happens in Turborepo, but I wanted to see if this is a general issue for
`pnpm` also. After all `pnpm exec` is supposed to execute in all workspaces. So there must
be code somewhere that expands this `apps/**` glob into a list of paths!

## How I did it

I set out to try this out with close to 0 experience with pnpm&mdash;my knowledge of pnpm
is limited to `pnpm i`&mdash;but gave up for a three reasons:

- `pnpm` has no top level command to just list all the workspaces it knows about.

  There is `pnpm ls`, but it lists installed packages (e.g. `dependencies` and `devDependencies`),
  not the list of workspaces.

  There is also an example on the website to use `pnpm exec` and use a magic `PNPM_PACKAGE_NAME`
  environment variable:

  ```bash
  pnpm -rc exec pnpm view $PNPM_PACKAGE_NAME
  ```

  This seems to work, but it crashes when it gets to a workspace that isn't published to npm,
  since `pnpm view` can't look it up.

  So I tried

  ```bash
  pnpm -rc exec echo $PNPM_PACKAGE_NAME
  ```

  But that strangely prints blank lines, as if the variable isn't set at all anymore.

- I can’t figure out where pnpm installed on my machine is, so I can go add a console.log somewhere

  My next idea was to look in `pnpm`'s source code to see a place where it might
  have a list of workspaces. I think I found it too. It would be [somewhere here][2].

  But sadly, I have [`corepack`][3] installed, which creates a shim around package managers,
  so I can't just `which pnpm` my way to this source code and `vim` to add my `console.log`
  temporarily. (This was my favorite thing about `npm i -g` since the beginning, btw&mdash;
  that I can change source code on my machine to quick test bug fixes without going through
  a million toolchains to recompile / rebuild / reinstall tools)

  Halfway through reading line 16,202 of `vim ~/.nvm/versions/node/v18.13.0/bin/corepack`
  (which is where the shim invokes the real thing), I realized this is madness and I don't need
  to be doing this.

  I have to say, having all these toolchains is cool and helpful, until it's not.

- I can’t figure out how to build pnpm locally so I can add the console logs

  Next, I figured, I could clone the `pnpm` source code, build locally, and invoke `pnpm`
  from a specific location (rather than the one on my `$PATH`, which is installed globally
  through corepack).

  This is also one of my favorite parts of modern software engineering. _Most_ codebases are
  on Github and I have full access to build locally. It's amazing!

  I pulled it down, glanced at `CONTRIBUTING.md`, which is where most projects keep their "building"
  instructions, and ran `pnpm i && pnpm compile`. This took about 5-10 mins, as each of those
  steps takes ~some~ time, and I switched away to other tabs in the meantime. When it was done,
  I couldn't figure out what had happened. Did it build the binary somewhere?

  I also tried the `pnpm dev-setup` command, blindly stabbing in the dark for something that might
  Just Work&trade;, and this one looked like it had something to do with symlinking a local copy?
  I don't know, it's past midnight.

WHen each of these three tries ended in dead ends, I called it done, and wrote this article instead.

## Why Write This

I write this because sometimes it's hard to remember where the time goes. I spent ~3-4 hours on debugging
the custome issue and then devolving into Learning `pnpm` The Hard Way. I usually enjoy this part of
debugging, because one thing leads to another, and at least the next step is usually visible. But sometimes
you just have to stop and get some rest.

## End Notes

- This post may _sound_ like I'm frustrated at pnpm or corepack or any of the other tools mentioned.
  But that is not the case! I think tools can always improve, but as someone who just had a
  hard time with an open source project, I believe it's up to me to suggest improvements. There are
  at-least-a-few improvements that I could suggest based on just this post!
- I am pretty sure that if I looked a little bit harder, I would find the answers I was missing
  during this process.
- I'm new to pnpm, but I'm pretty sure that what I refer to as "workspaces" in this post, I think pnpm calls "packages".
  I didn't read the docs all the way front-to-back, but I got the impression, that an entire repo is a
  "Workspace", and individual packages are...packages. This is also supported by the fact that `pnpm-workspace.yml`
  has a top level key called "packages". I called them "workspaces" in this post, because in Turborepo
  land, we also call portions of monorepos workspaces.

[1]: https://github.com/vercel/turbo/issues/3340
[2]: https://github.com/pnpm/pnpm/blob/5bede17edb5359daf6078bf69d488069b1b2ceba/exec/plugin-commands-script-runners/src/exec.ts#L100-L131
[3]: https://nodejs.org/api/corepack.html
