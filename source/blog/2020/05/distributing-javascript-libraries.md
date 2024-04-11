---
title: Distributing Javascript Libraries
date: 2020-05-09
tags:
- programming
- javascript
- node.js
---

I've been learning about bundling, compiling, and distributing Javascript libraries for the last
couple of months, and it is...complicated, to say the least. It's generally good advice to
"use the right tool for the job" and to understand your use case before attempting to solve a technical
problem, but it applies especially well here, because there really isn't a good source of truth or
best practice right now. In other words, it's much more of an "it depends" than any other technical
decision I've had to make in my career.

Here's a list of questions I had to answer as I worked through this:

1. Will this code run in the browser?
    1. Which browsers and which versions?
    1. Will it be bundled into something else?
    1. Will it run via `<script>` tag?
    1. Will it be imported with an browser ESM `import` from another script?
    1. Will it be referenced with `<script type="module">`?
1. Will this code run in Node.js?
    1. Which versions? Do those versions support ESM imports?
1. Will this code go through another bundler (like Rollup or Parcel)?
1. Will this code run through a compiler (like TSC or Babel)?

To narrow the scope of my exploration, I focused only on code that is distributed as a library, will run in a browser, and doesn't touch the DOM--which is an entirely different problem.

This narrow scope sidesteps Node.js complications such as the new ESM imports implementation,
the [`"type": "commonjs"` directive][1], and the `.mjs` file extension. Because my use
cases are all libraries that are consumed by an application with their own build process, I also
removed usage via `<script>` tag from consideration. This sounds like an extremely narrow problem
space, but it is a pretty common situation for most frontend developers today.

The odd thing about this combination of constraints is that it means we have distribute libraries
that are meant to run in the browser, but are compiled/bundled by tools in Node.js. This lead me
to a key realization: Distributing JS libraries for the web cannot be based on browser
versions. There are a few reasons for this.

-   ### App build tools are the source of truth

    The app's build tool is the source of truth, so any JS libraries that choose their own browser support
    will either have to choose a lowest common denominator of targets or be overridden by the app's targets.

    For example, if a library distributes itself with `class` syntax an app that needs to run in
    browsers that don't have classes will compile the library down to older syntax. Conversely,
    if a a library compiles the `class` syntax down to older syntax, any apps that don't need that
    compiled down will incur extra cost from the library.

    This commonly surfaces as the "modern vs. ES5" build debate. Libraries can solve this problem by
    distributing multiple versions of themselves, but that relies on being able to bucket features into
    a finite number of versions. This approach does not scale well and forces both apps and libraries
    into a compatibility dance and turns conversations about optimization into conversations about
    build tooling and its inevitable limitations.

-   ### Outdated Build tools

    Another problem with this approach is that it requires app owners to have detailed knowledge about
    their build tool and its configuration, as well as detailed knowledge about the library source. For
    example, a library that uses optional chaining cannot be used by an app unless the app's build tool
    can compile optional chaining. Either the library maintainer has to spend time documenting this, or
    the app owner has to inspect library source (or wait for their build tool to fail). Neither solution
    scales well.

-   ### Changed Semantics

    Lastly, a library that compiles itself for the browser, but is consumed by a build tool runs the risk
    of changing semantics. For example, `import` statements compiled by WebPack are different from
    `import` statements that run directly in the browser. A library author that distributes code
    for browsers that implement `import` can unwittingly be opted into WebPack's compiled require statements
    instead. This more or less "works" today because of the close collaboration between all the involved
    parties, but seems risky in the long run.

---

While mulling through this, a coworker pointed me to the TypeScript compiler and its `--target` flag.
This triggered a second key idea:

Instead of targeting a list of browsers, JS libraries that target build tools
should compile to a _spec_.

I really like this approach because it allows library authors to provide a real guarantee of what syntax
and features an app and it's build tools can expect.
For example, `tsc` can compile a library to, say, ES2018 and let the app take over
from there. App owners can more easily ensure that their build tools are configured with the plugins required for ES2018 (rather than individual features),
and a library maintainer does not need to worry about browser support.

The downside of libraries distributed this way is that they can not be used directly via a `script` tag, because a spec version is not tied to any specific
browser versions. This seems like an acceptable tradeoff, as bundling app dependencies is a common practice. It also seems weird to use TypeScript to compile non-TypeScript projects.

That said, I think this a scalable approach and greatly
reduces the mental burden for both app and library developers.

[1]: https://medium.com/@nodejs/announcing-core-node-js-support-for-ecmascript-modules-c5d6dc29b663
