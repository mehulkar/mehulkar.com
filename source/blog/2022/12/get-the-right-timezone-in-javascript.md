---
title: Get The Right Timezone in Javascript
date: 2022-12-17
tags:
- programming
- frontend
- web
- time
---

I've [been][1] [hacking][2] on an app that submits a web form and I wanted
to collect timestamps with those submissions. Initially, I natively  collect a `Date()` object
in Javascript like this:

```js
new Date().toLocaleTimeString()
```

But as anyone with any experience working with Time in Javascript will tell you: here lie dragons.

The main issue here is that `new Date()` and `toLocaleTimeString()` returns
the date in the machine's local time (what you'd get by running `date` in your shell, for example).

My "app" is deployed in Vercel, and I'm collecting this timestamp in
a Serverless function. These functions run in a machine/environment owned by Vercel, and timezones
are set to UTC. This is a good choice by Vercel, but it means that when I run `vercel dev` locally
and invoke those serverless functions, this code behaves differently.

In Vercel, the time is 8 hours ahead:

```js
new Date().toLocaleString()
// 12/18/2022, 5:41:27 AM
```

Locally:

```js
new Date().toLocaleString()
// 12/17/2022, 9:41:27 PM
```

Because I'm storing this value as a string (in Google Spreadsheets), I need it to be consistent,
and I only really want it in my timezone -- Pacific Time.

<aside>
    ⚠️ Generally when programming with time, you want to store timestamps
    in UTC and convert timezones when displaying. In my use case, once the timestamp is stored
    , I never need to interpret it again as a timestamp, it is only every displayed as-is,
    so I <em>want</em> to store as a string in Pacific Time.
</aside>

## Previous Solution

In the past, I've used a number of techniques to get `new Date()`, and convert it to the right
timezone by converting to milliseconds and adding or subtracting an offset. For example,
in Vercel, I could:

```js
// I know this is in UTC
const utc = new Date();
// subtract (8 hours in ms)
const pt = d.getTime() - 8 * 60 * 1000
new Date(pt).toLocaleString()
```

This code is brittle for at least a few reasons:

1. `8` hours is not consistent all year round
2. `new Date(pt)` works, but it's not _actually_ a Pacific Time date object, it's still a UTC
    date object from 8 hours ago. This can cause other issues downstream (e.g. when trying to get
    the timezone from this object, or when passing it into `Intl.DateTimeFormat`).

These issues can be accounted for in various ways, but it's brittle.

## Better Solution

I'm happy to say I found a much more elegant solution today!

```js

const formatter = new Intl.DateTimeFormat("en-US", {
    dateStyle: "short",
    timeStyle: "medium",
    timeZone: "America/Los_Angeles",
});

formatter.format(new Date());
// '12/17/22, 11:58:47 PM'
```

This will _always_ return a string that reflects the value in California Pacfiic Time. If I change
my machine's timezone, or if Vercel lets me set a different timezone, it will still return PT
time.

I'm pretty happy with this solution.

## Other Notes

Another solution that could help me at the framework level is if `vercel dev` would set the timezone
the same as my production environment when running locally, so that Serverless functions executed
locally are more similar to production. I've opened [a discussion][3] here for that!

[1]: /blog/2022/12/first-developer-experience-with-htmx/
[2]: /blog/2022/12/one-hour-with-enhance/
[3]: https://github.com/vercel/vercel/discussions/9093
