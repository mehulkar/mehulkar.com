---
title: npmgraph
date: 2024-02-07
tags: javascript, npm
---

I've started to loosely try to get involved in [James Garbutt's][1] npm
ecosystem cleanup effort, and in that process I came across
<https://npmgraph.js.org>. This project can analyze a published npm module or a
standalone package.json and visualize all its dependency tree. More importantly,
it can find multiple versions of the same dependency and deprecated
dependencies, giving your team easy grunt work to do.

In my experience, one of the hardest problems in programming is identifying,
taskifying, and then prioritizing maintenance work that doesn't have direct
payoff. While npmgraph can't change your organization workflow for
prioritization, it can certainly help identify and taskify work that your team
can do to maintain your software.

Clear checklists that you can burn down to Inbox Zero is extremely valuable for
distributing and tracking work, and I think npmgraph fits that niche very well.
Try it out on your own project!

You can also run it from CLI:

```bash
npm i -g npmgraph-cli
npmgraph -f ./path/to/package.json
```

This will open a browser with a URL that contains your package.json with the same
results as if started from the browser.

[1]: https://twitter.com/43081j
