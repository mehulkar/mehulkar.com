---
title: Investigating Signal Handling in Node.js
date: 2023-01-16
tags:
- programming
- node.js
- unix
---

<aside>
    Warning: This post may reveal just how little I know about what this post is about.
</aside>

I spent an exorbitant amount of time trying to write some code where two processes
comunicate with each other through unix signals in Node.js, and I seem to have hit a dead
end. But I feel really good, because I've learned a thing or two.

I've written before about using [unix signals to trigger recursion][1]. Since then,
I've been noodling with the idea of using this to trigger side effects in build tools. Specifically,
using signals to notify a parent process that some milestone has been reached. For example,
if my program starts a dev server in a subprocess, the dev server could send a signal to its
parent when the server is ready and listening. The parent could then react to this signal by
pointing another process at it (like a test script). In practical terms, the code would look like
this:

```js
// parent.mjs
import process from "process";
import { execa } from "execa";

function sideEffects() {
    console.log("triggering downstream work of child")
}

process.on("SIGUSR1", () => sideEffects);

// IIFE that launches a child process
function launchChild() {
  // could have used child process, I didn't want to
  const { stdout, stderr } = execa("node", ["./child.mjs"]);
  stdout.pipe(process.stdout);
  stderr.pipe(process.stderr);
}

launchChild();

while(true) {
  // keep alive
}
```

```js
import process from "process";
import os from "os";

function main() {
  consoe.log("do some work, then send the parent a signal");
  process.kill(process.ppid, os.constants.signals.SIGUSR1);
}

// Every 1 second, do the work
setInterval(main, 1000)
```

The cool thing about this approach is that the parent doesn't need to know
what "done" means for the child&mdash;it can expect a standardized notification.

But as I worked on this code above, I realized an important issue. In order to make this useful,
the parent process needed to know _which_ child process was sending the signal. That's how
it would know _what_ to do when the child was "done" or "ready" or whatever.

And so the rabbit hole began.

First I looked in the Node.js documentation for [`process`][4] and [`os.constants.signals`][5].
I was looking for anything that might tell me how to access the process ID (i.e. the "pid") of the
child process that was sending the signal. Sadly, I wasn't able to find anything.

Then, I helplessly searched the internet for "unix signals" on DuckDuckGo, becuase I didn't know what to look for. Then I got a little smarter, and searched for "unix signal send data",
"unix signal get sender information", and "how to send data from child to parent process in linux".
I tried appending "node.js" to these search queries, but that made search results worse.

Finally, I landed at [this StackOverflow answer][2] that answered the question "How can I tell in Linux
which process sent my process a signal". Although I didn't really understand the answer,
it pointed to the documentation for something called [`sigaction(2)`][3], which then took me to
the docs for [`signal(7)`][6]. It took me a few times, but after reading parts of these pages,
I understood that `sigaction` is a system call that can register a function handler for signals.
And if I register this function handle _Just Right_, I can get access to the PID of the process
that sent the signal. Why this doesn't just always happen, I don't know!

Next, I needed to see if Node.js's `process.on()` implementation registers this callback _Just Right_.
Since the documentation doesn't say<sup>1</sup>, I cloned [`nodejs/node`][7] to search. I searched
blindly for filenames that included `process` and `signal` in the `src/` directory, but didn't know
how to recognize the implementation code for the Node.js API. It wasn't as straightforward as searching
for `process.on`.

Then I remembered that Ethan had [recently tweeted][8] asking for advice about how to read through the
Node.js codebase. I checked the replies and [Colin recommended][9] reading `src/README.md`, which,
DUH...<sup>2</sup>. This README states:

> The other major dependency of Node.js is libuv, providing
> the event loop and other operation system abstractions to Node.js.

So onto the `libuv` codebase<sup>3</sup>. I cloned that and found what I was looking for:

```c
static int uv__signal_register_handler(int signum, int oneshot) {
  /* When this function is called, the signal lock must be held. */
  struct sigaction sa;

  /* XXX use a separate signal stack? */
  memset(&sa, 0, sizeof(sa));
  if (sigfillset(&sa.sa_mask))
    abort();
  sa.sa_handler = uv__signal_handler;
  sa.sa_flags = SA_RESTART;
  if (oneshot)
    sa.sa_flags |= SA_RESETHAND;

  /* XXX save old action so we can restore it later on? */
  if (sigaction(signum, &sa, NULL))
    return UV__ERR(errno);

  return 0;
}
```

[source](https://github.com/libuv/libuv/blob/39f9189f345d0661af64d6f29b47d19f3cd70c0c/src/unix/signal.c#L224-L242)

The `sigaction` docs say that to get the sender PID,

- `sa_flags` must include `SA_SIGINFO`
- `sa_sigaction` rather than `sa_handler` must be set

As you can see in the code above, in the `libuv` implementation, neither of these things are true. Rather,
`sa_handler` is set, and `sa_flags` only includes `SA_RESTART`.

So what next?

I searched the Node.js Issues for `sigaction`, and came across [this Pull Request][10] that attempts to add the `SA_SIGINFO` flag. It patches a totally different file
than what I was looking at, but regardless, the PR was abandoned a couple years ago.

I stopped here, because I _think_ I have a good understanding of what needs to happen, and I also feel confident that the child process _isn't_ available for my
prototype (I was thinking it may be available somewhere else other than the arguments
for the signal handler I registered with `process.on`).

I've filed [an issue][12] in the Node.js Help repository to get an understanding of how I would "make
it work" locally, if I needed to.

If you are reading this and know Node.js and/or Unix, please tell me if you have
more information about any of this!

## Footnotes

1. I later looked briefly at Rust and Golang implementations, and found that [a popular Rust library](https://docs.rs/signal-hook/latest/signal_hook/#signal-masks) in Rust _does_ document that it uses `sigaction` under the hood. So I felt validated that Node.js docs could have mentioned this also.
2. To be fair, the `src/` directory is quite large, and I didn't scroll down enough on Github to even
realize there was a README file in there.
1. Turns out all of libuv is embedded in the Node.js codebase in the [`deps/uv` directory][11], so I could have found it there.

[1]: /blog/2017/02/neat-recursion-trick-with-unix-signals
[2]: https://stackoverflow.com/a/8400532/986415
[3]: https://man7.org/linux/man-pages/man2/sigaction.2.html
[4]: https://nodejs.org/api/process.html#signal-events
[5]: https://nodejs.org/api/os.html#signal-constants
[6]: https://man7.org/linux/man-pages/man7/signal.7.html
[7]: https://github.com/nodejs/node
[8]: https://twitter.com/ArrowoodTech/status/1573388734514745346
[9]: https://twitter.com/cjihrig/status/1573396979954380801
[10]: https://github.com/nodejs/node/pull/34648
[11]: https://github.com/nodejs/node/tree/main/deps/uv
[12]: https://github.com/nodejs/help/issues/4075
