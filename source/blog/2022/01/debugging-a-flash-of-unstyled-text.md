---
title: Debugging a Flash of Unstyled Text
date: 2022-01-20
categories: programming, debugging, javascript, ember
---

Sometimes, it's hard for me to explain (even to myself) what I do all do at my
job. I maintain some pretty simple, static web pages at my job that *should* be low
effort to maintain. But recently, I created and fixed a bug that involved so many
unexpected things, and manifested in a weird enough way that I thought it would be
useful to demonstrate the complexity of a frontend engineer's job.

## The Situation

Over the past couple months, my team has been merging two codebases into the same
Github repo. The process was fairly simple: two Ember Apps that can be merged into
one. The apps have a few differences that can be handled with some `if` statements
or by consolidating behaviors. For example, if they use different versions of a
dependency, it's easy enough to pick the more recent one, test and move on.

## The Bug

When testing this code in a QA environment, we notice that the navigation bar
appears unstyled for a brief second, but only in Mozilla Firefox. Safari and Chrome
seem to work fine.

## Debugging: The Hunch

Since this is, as they say, *NotMyFirstRodeo*, my first hunch is that server side
rendering is broken, skipping a `<link rel=stylesheet>` tag injection at runtime.
I've seen this happen before, and I've just fixed a JS exception in SSR the day before.
I'm unable to cursorily reproduce the bug, so I send it back to the originator and move on
with my day. The next day, I get the same bug back. *Not Fixed*.

This time I reach out to the originator and they point out that the bug only
reproduces in Firefox. I had missed that in the report the day before!

This time, I put in a little more effort. I build the production server locally.
FastBoot has a different app server for local builds (using a middleware that
injects into the regular development `ember server`), and a different server for
prodution `fastboot-app-server`. They're both roughly the same and the meat of
the SSR is the same package `fastboot`. But as luck would have it, The `fastboot`
package in our production server is v3 and and the one in `ember-cli-fastboot`
is v2. It hasn't happened yet, but I'm always paranoid that some day this will
cause that special flavor of "works on my machine bug" that we *love* (eye roll)
to see as developers.

So I build the production server and spin it up.

DOES. NOT. REPRODUCE.

At this moment, if I had sleeves I would have rolled them up. It's time to dig
into the QA environment. See the belly of the beast.

I `ssh` into one of the hosts and tail the server logs. These logs should be
forwarded to Splunk, but I want to see them in realtime and I have no idea how
the Splunk team's synchronization works, or how long it takes.

The issue is apparent. `FastBoot.require('some-package')` is throwing an exception.
That's a red flag if I ever saw one! That would definitely break the server side
render and cause an flash of unstyled text. I still have two remaining mysteries:
why can't I reproduce this locally? and why *only* Firefox? A server side crash
has no bearing on the browser.

Looking at the code, it's clear that `some-package` is in the `devDependencies`,
and `fastbootDependencies` keys. For it to be part of the available dependencies
in the production server, it needs to be in `dependencies`.

## An Aside on FastBoot

During `ember run build`, the `ember-cli-fastboot` addon [programmatically generates][1]
a `package.json` based on the actual source `package.json` file. But it needs
packages to be in _both_ the `dependencies` section (to get the version) and the
`fastbootDependencies` section. (to allow list it for `FastBoot.require()` at
runtime). Only putting a packag into `devDependencies` is *no bueno*.

## Back to Debugging

So why doesn't it reproduce locally?

Well, it turns out that `FastBoot.require()` [wraps Node's `require`][2], which can
snake up your directory tree to find modules in `node_modules/` in parent directories.

Try this in an empty directory

```bash
## create a directory tree
mkdir -p parent-directory/middle-directory/leaf-directory

## create a pseudo package in the top level of that tree
mkdir -p parent-directory/node-modules/bliggity-bloo
echo "module.exports.default = 'what up council!'" >> parent-directory/node-modules/bliggity-bloo/index.js`

## go into the leaf directory
cd parent-directory/middle-directory/leaf-directory

## evaluate some code to exercise the pseudo package
##
## The -e flag is to evaluate JS without entering the Node repl.
## You can also enter the Node repl and require('bliggity-bloo') for the
## same effect.
node -e "console.log(require('bliggity-bloo').default)"
```

Notice that the `bliggity-bloo` package is two directories above, but it's
still available!

So that explains why I couldn't reproduce the bug locally. My `dist` directory
was nested inside my app code directory, which has its own `node_modules` that
include development dependencies. So when running the production server using
from `my-app/dist/`, `FastBoot.require()` worked just fine on my machine even
with the production server!

But if I `mv my-app/dist ~/ && cd ~/dist`, I could reproduce the exception.

## Debugging: Firefox vs Chrome

Why does the bug only reproduce in Firefox?

I haven't figured this out, but what I did notice is that I could reproduce
in Chrome by [simulating a slower CPU][3]. My hunch here is that the Firefox
prioritizes the `<link>` injection and then the resource download slightly differently
than Chrome. Without CPU throttling, the flash of unstyled text was not observable
to the human eye.

I would [love to know][4] if someone has an idea!

## Zooming out

So why do we inject a `<link>` stylesheet in the first place? The navigation
on our website is built by a different team that provides JS and CSS assets as
a package. To render it, we have to find the right version for the right locale
at runtime and inject that into the DOM. We can usually do this during SSR, but
when that fails, the functionality falls back to inject it client side.

## Conclusion

Sometimes things are more complicated than they seem! Sometimes we make them
more complicated than they need to be. Sometimes the truth is somewhere in the
middle and complications arise from constraints that we can't control or are too
not worth changing.

[1]: https://github.com/ember-fastboot/ember-cli-fastboot/blob/v3.2.0-beta.5/packages/ember-cli-fastboot/lib/broccoli/fastboot-config.js#L55-L56
[2]: https://github.com/ember-fastboot/ember-cli-fastboot/blob/v3.2.0-beta.5/packages/fastboot/src/fastboot-schema.js#L170-L171
[3]: https://developer.chrome.com/docs/devtools/evaluate-performance/#simulate_a_mobile_cpu
[4]: https://twitter.com/intent/tweet?text=@mehulkar%20hey%20hey%20hey
