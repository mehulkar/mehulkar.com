---
title: Typescript
date: 2024-03-22
tags:
---

I had my first "I wish this was Typescript moment" this week. I was working on a
script that takes the output from a [`turbo --dry=json`][1] run and groups the packages into
shards. This is mostly irrelevant, but I was creating some simple objects with
properties and then add/removing props as I got more information. For example:

```json
[
  {
    "pkg": "foo",
    "directory": "packages/foo"
  },
  // ...
];
```

turned into

```diff
[
  {
    pkg: "foo",
    directory: "packages/foo",
+    services: {}
  },
  // ...
];
```

and so on.

As I was iterating on this code, it became really annoying to
remember what properties I had or didn't have and whether or not they could be
`null` or `undefined` at any given moment.

I added types to my data structure and completely solved the problem.

```ts
interface PackageInfo {
  pkg: string;
  directory: string;
}

// adds in another field
interface DecoratedPackageInfo extends PackageInfo {
  other: Record<string, string>;
}

// drops directory
type UsefulPackageInfo = Omit<DecoratedPackageInfo, "directory">;
```

[1]: https://turbo.build/repo/docs/reference/command-line-reference/run#--dry----dry-run
