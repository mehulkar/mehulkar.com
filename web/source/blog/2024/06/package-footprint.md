---
title: Package Footprint
date: 2024-06-02
tags: monorepos, javascript, npm
---

I've been working in a large JavaScript codebase, and wrote some
[monorepo tooling][1] scripts to perform some esoteric tasks across across the
repo. It got me thinking about the relative importance of code inside a large
codebase. Most JavaScript codebases use Workspace tooling (via package managers
like pnpm) to define boundaries in the form of packages. But even with
boundaries, it's difficult to know how important a piece of code is.

I'm thinking about how to measure the "footprint" of a package and the following
ideas could help determine the parts of a codebase that need attention and
ownership. Imagine a package in your monorepo with the name `"@internal/foo"`.

## How many packages depend on `@internal/foo`?

This is straightforward to implement by analyzing package.json `dependencies`
and `devDependencies`. It's a good start, but incomplete, because it requires
that dependencies are declared correctly. Packages that don't declare
`@internal/foo` or packages that _do_, but then don't use it, would skew this
measurement.

## How many files import from `@internal/foo`?

This can be implemented via a graph of all the imports. This number captures two
additional qualities about a package:

- The weight of the relationship between two packages. For example, if a package
  declares `@internal/foo` a dependency, but only imports it once, that's useful
  information.
- Packages that are imported _without_ an explicit dependency. For example, if
  `@internal/foo` is installed in the root package.json, it can still be
  imported by other packages. This tooling would capture that relationship.

## How large is `@internal/foo`?

If a package is in many package.json's around the codebase, but it a small in
lines of code, that can be useful information. Such packages may be ubiquitous,
but you still might not consider them to have a large footprint in this scenario.

Another part of this might be, how many lines of code are imported? If a package
is large, but only 10% of it is used, that could lower its footprint.

## How often does `@internal/foo` change?

If it receives a lot of commits (i.e. it's under heavy development), but it
isn't used very much, you may consider it to have a low footprint. Conversely,
if it's used everywhere but it doesn't change very often, it may also have a
very low footprint.

## How often does code from `@internal/foo` execute?

This requires some kind of tracing implementation, but it would be useful to
know how your code is used at runtime. For example, if `@internal/foo` a lot,
but then gets dead code eliminated, it could be considered to have a low footprint.
Or if it's used in frontend pages or backend service endpoints that don't receive
any traffic, that may also be good to know.

---

These are ideas are all a work in progress. I have implemented some proofs of
concept that you can try with:

```bash
npx -p turborepo-tools footprint --directory . --package @your/package
```

where `@your/package` is the `name` of an internal package in your npm/pnpm/yarn
managed JavaScript monorepo.

If you have any ideas, find me on [Twitter!](//twitter.com/mehulkar).

[1]: https://github.com/mehulkar/turborepo-tools
