---
title: Replacing Jest with Node test runner
date: 2024-04-16
tags: ["programming", "javascript", "nodejs", "jest"]
---

I tried out the new built-in Node test runner recently and ran into a few
hurdles worth documenting. The existing tests were written in Jest. In one
package Jest tests that took ~2-3 seconds to run now run in ~500ms.

## Typescript

Through some Jest config, we were able to write source and test code in
TypeScript and Jest could directly execute the tests and import the Typescript
source files. I believe this is because Jest uses Babel under the hood to
compile to JS before running. This is slow, but also obfuscates what's actually
going on<sup>1</sup>. Converting to the Node test runner did not work out of box
and it took me a while to figure out how to make this happen:

```bash
pnpm add -D tsx
node --loader tsx --test tests/*.test.ts
```

This works with Node v20.11.1 and `tsx@4.7.2`. Versions are more important in
nascent technology so I document all the patch version. The `--loader` CLI flag
does not work in Node 18, for example, but `--import` does.

I will say that this feels SO MUCH BETTER than Jest's solution of compiling to
JS first. I just don't trust that compilation and also don't trust that the
tests will catch actual user issues with that setup.

## Mocking ES Modules

This is potentially a show stopper for people, but I took the tradeoff. An ES modules exports are
frozen, so you can't mock them. E.g.:

```js
// hello.mjs
export function hello() {}
```

```js
// main.mjs
import { hello } from "./hello.mjs";
hello();
```

```js
// main.test.mjs
import { test, mock } from "node:test";
import * as helloModule from "./hello";

// THIS DOES NOT WORK
mock.method(helloModule, "hello");
```

You cannot mock the `hello` function from the `hello.mjs` module. The only workaround is
to export an _object_ instead and mock that.

```diff
// hello.mjs
- export function hello() {}
+ function hello() {}
+ export default {
+    hello,
+ }
```

## `--import` flag

The `--import tsx` flag doesn't work in Node 18. I think it works as `--loader tsx` though. I just
bumped to Node 20.

## `mock.timer` for Dates on Node 18

After updating to Node 20, I tried to see if I could get Node 18 working also, but one of our
tests was mocking the Date object with a special API that doesn't exist in Node 18.

```js
import { mock } from "node:test";
mock.timers.enable({
  apis: ["Date"],
  now: new Date("2021-01-01T00:00:00.000Z"),
});
```

I did not see any obvious way to polyfill this, but there might be one.

## `test.each`

Jest has an API for running multiple variations of a test like this:

```js
const tests = [
  { input: "", output: "", whatever: "" },
  { input: "", output: "", whatever: "" },
  { input: "", output: "", whatever: "" },
];

test.each(tests)("$input: $whatever", (testCase) => {
  expect(input).toBe(testCase.output);
});
```

This always felt like a weird API since JS can do `forEach` and `for` loops, but I imagine it
existed for backward compatibility reasons. In any case, converting this to `for...of` loops
was easy.

## Floating promises issue

I had to disable a lint rules about floating promises because of what seems like a bug in
Node test runner.

```js
{
  files: ["src/**/*.test.ts"],
  rules: {
    // https://github.com/nodejs/node/issues/51292
    "@typescript-eslint/no-floating-promises": "off"
  },
},
```

## `**` glob doesn't work in Node 20

This finds 0 tests and passes invisibly:

```bash
node --import tsx --test tests/**/*.test.ts
```

Removing the double star works, but I'm not sure if it would find test files in subdirs.

```diff
- node --import tsx --test tests/**/*.test.ts
+ node --import tsx --test tests/*.test.ts
```

`**` should work in Node 21 though.

As a side note, I appreciate Jest's feature of exiting with non-zero exit code when no tests
are found. `--passWithNoTests` is a nice signal that you should double-check whether any tests
are even running.

## Missing matchers

I like the limitation of `assert.equal`, et al. At the end of the day, matchers are just fancy
wrappers around truthy and falsey conditions, so I like that `node:assert` isn't trying to
implement all the matchers. But it was a bit laborious to update the `expect` matchers that we had
from Jest.

---

## Footnotes

1. The entire JS toolchain obfuscates how imports work though, so this is not really a
   Jest-specific problem.
