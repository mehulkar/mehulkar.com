---
title: Node 14 and npm 7 upgrade gotchas
date: 2021-07-08
tags:
- programming
- javascript
---

I recently upgraded our servers and frontend app builds to run on Node 14 and `npm@7`
and ran into several interesting things that are worth documenting.

I used [volta][7] across projects. This was extremely helpful because I was
running `npm install` and `npm ci` quite a bit for testing and, before using `volta pin`,
about half the time I had the wrong version of Node or npm was
active, changing `package-lock.json`, and possibly the structure of `node_modules/`.

Although `npm@7` generates an entirely different package-lock.json (indicated
by the `"lockfileVersion": "2"` key), I realized that:

-   `npm@6` can run `npm ci` with a v2 package-lock.json
-   `npm@7` can run `npm ci` with a v1 package-lock.json

This was nice to know, but without Volta installed and socialized to the rest of
the team, I was worried that depending on these two *un*happy paths could result
in non-deterministic `node_modules/` directories, causing a lot of confusion and
red herrings if any bugs came up.

During this upgrade, I ran into a few relatively minor issues that I spent some
time chasing down that I felt were worth sharing.

## Username and password authentication

Authenticating with username and password to private registries doesn't work
past `v7.10.0`. There's an [issue open that looks similar][1], but I am not 100%
sure if it accurately describes our issue. `volta pin npm@7.10.0` works for now.

## Node Sass

I didn't figure out exactly what was going on, but in our CI system, our app
build would throw complaining that `node_moduless/node-sass/vendor` wasn't available.
This only reproduced in projects that installed `node-sass` as a top level dependency.

`node-sass@4.14` has a [`postinstall` script][2] that runs a custom script:
`node scripts/build.js`. I found that if I ran `npm rebuild node-sass` in my
_project's_ `postinstall` script, it fixed the issue. The only difference I
see is that `npm rebuild` (which, under the hood simply runs `node-sass`'s `build`
script), runs [`node scripts/build.js --force`][3]. I didn't go further down
this rabbit hole, but my latest hunch is that our CI system was somehow caching
the `node_modules/` directory (or some other directory where `node-sass` is built),
and the `--force` command cleared it? This doesn't quite
satisfy me for a few reasons:

-   I tried clearing the CI system's cache to no avail
-   I heard from others that they had issues with `npm@7` not running `postinstall`
    scripts at all (which I was not able to reproduce locally at least).
-   I wasn't able to reproduce the missing `vendor` directory at all locally.

I think the answer is in some combination of these observations, but 🤷🏽.

## `npm outdated`

We use `npm outdated --json` to make automated pull requests to update dependencies.
In `npm@6` this command has an exit code `1` if there are outdated dependencies.
This was a bit odd to me, but I know [@izs][8] has a strong Unix background and
has designed the `npm` CLI very intentionally. If I squint, it almost makes sense
that having outdated dependencies is considered a "failure" exit code, so I didn't
question it for too long. I just wrote my code to handle the oddity:

```javascript
function getOutdatedModules() {
    let out = "{}";
    try {
        runCommand("npm outdated --json");
    } catch (e) {
        // `npm outdated --json` returns non-zero exit
        // which means runCommand() will throw and the information
        // will be in the throw error's stdout.
        out = e.stdout.toString();
    }
    return JSON.parse(out);
}
```

In `npm@7`, the exit code changed to 0, which meant that my function always
returned an empty object.

## `--progress`

I noticed that in our CI system, `npm ci` output got a lot noisier and included
colors and progress indicators. I know this happens when CLI's
try to show progress in non-interactive terminals, so I looked up the `progress`
config to see what was going on. I couldn't chase down the code difference,
but the docs had been updated from [v6][4] to [v7][5].

```diff
- "Default: true, unless TRAVIS or CI env vars set."
+ Default: true unless running in a known CI system
```

Our CI sets a `CI=true` environment variable, so my hunch is that the
heuristics for determining CI removed this signal. I was able to fix the logs by
changing our command to `npm ci --no-progress`. This is also backwards compatible
with `npm@6`, because it's a more deterministic way of getting the same behavior
we already had.

## `ERR_SOCKET_TIMEOUT`

After upgrading to `npm@7`, I noticed that every few CI runs errored out with
`ERR_SOCKET_TIMEOUT` on some non-deterministic package. I found an issue that
[mentions this error code][6], and points me to the fact that it's a network
error related to `agentkeepalive`. Fingers crossed this one is really just bad
timing from my CI's network connectivity while I was doing this work and will go
away on its own.

Edit: [I'm not the only one that ran into this][9].

[1]: https://github.com/npm/cli/issues/3284
[2]: https://github.com/sass/node-sass/blob/v4.14.1/package.json#L32
[3]: https://github.com/sass/node-sass/blob/v4.14.1/package.json#L35
[4]: https://docs.npmjs.com/cli/v6/using-npm/config#progress
[5]: https://docs.npmjs.com/cli/v7/using-npm/config#progress
[6]: https://github.com/npm/cli/pull/3498
[7]: https://volta.sh
[8]: https://twitter.com/izs
[9]: https://github.com/npm/cli/issues/3078
