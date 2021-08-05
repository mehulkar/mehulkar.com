---
title: "Terser vs esbuild: Ember app case study"
date: 2021-08-05
categories: programming, frontend, javascript
---

Over the last couple of weeks, I've been trying to improve the amount of time
my ember apps take to build. The [perf-guide in the ember-cli repo][1] is a bit old
but the suggestions for how to analyze it still worked for me:

[1]: https://github.com/ember-cli/ember-cli/blob/master/docs/perf-guide.md#broccoli-viz

1. `BROCCOLI_VIZ=1 ember build --environment production`
1. Open `instrumentation.0.build.json` in https://heimdalljs.github.io/heimdalljs-visualizer/#/flame.
1. Stare at it forever until it starts to make some sense.

I asked coworkers what I'm supposed to do with a flame chart and one pointed me
to look at "Self time". The flame chart in the visualizer doesn't make it easy
to see the nodes that had the largest `time.self` value, but you can hover over
each bar and look for larger values.

[![flame chart](/images/blog/terser-flame-chart.png)](/images/blog/terser-flame-chart.png)

I noticed that `TerserWriter` was taking ~20s and thought it might be useful to
try out alternatives for minification. Ember CLI's architecture is pretty confusing,
but `TerserWriter` is located inside `broccoli-terser-sourcemap` which is a
dependency of `ember-cli-terser`<sup>1</sup>. Digging into it, I found the line that actually
runs the underlying `terser` tool:

```js
await terser.minify(src, options);
```

[source](https://github.com/ember-cli/broccoli-terser-sourcemap/blob/8e5decf32384f85003c10d25d85cbbe0775fea4a/lib/process-file.js#L50).

and replaced it with `esbuild`:

```js
await esbuild.build({
  entryPoints: [inFile],
  bundle: false, // False because the files are already bundled at this point.
  minify: true,
  outfile: outFile,
});
```

I had to make some minor adjustments such as removing all the source map things and adjusted
debug logs to adapt to the result, but all in all this did produce a production `dist`/ that looked
roughly the same. But `TerserWriter`'s self time grew to twice the size to 45 seconds!

One thing that stuck out to me in the [esbuild docs](https://esbuild.github.io/getting-started/#build-scripts) was:

> The `build` function runs the esbuild executable in a child process and returns
> a promise that resolves when the build is complete.

While reading the source for `broccoli-terser-sourcemap`, I noticed that it also
parallelizes each file it feeds to `terser`. Without any explicit configuration,
it defaults to the number of CPUs on the machine (minus one to account for the leader
process):

```js
this.concurrency =
  Number(process.env.JOBS) ||
  this.options.concurrency ||
  Math.max(require("os").cpus().length - 1, 1);

// create a worker pool using an external worker script
this.pool = workerpool.pool(path.join(__dirname, "lib", "worker.js"), {
  maxWorkers: this.concurrency,
  workerType: "auto",
});
```

[source](https://github.com/ember-cli/broccoli-terser-sourcemap/blob/8e5decf32384f85003c10d25d85cbbe0775fea4a/index.js#L47-L53)

I thought it might be worthwhile to try without this parallelization, to reduce
the number of factors, so I ran my build with `JOBS=1`. This time, the numbers
were more aligned with my expectations for esbuild (which claims to be 10x-100x faster<sup>2</sup>).

TerserWriter dropped to 4seconds--5x faster than parallelized terser! Running
the original _terser_ implementation with `JOBS=1` on the other hand went up to 53 seconds<sup>3</sup>.

## Raw Data

I wanted to see a smaller breakdown of how long it took to minify each file, so
I used the logging in `broccoli-terser-sourcemap` to construct this table:

| File                       | Size       | terser | JOBS=1 terser | esbuild | JOBS=1 esbuild |
| -------------------------- | ---------- | ------ | ------------- | ------- | -------------- |
| chunk.0                    | 23.778KB   | 749ms  | 151ms         | 23708ms | ⭐ **7ms**     |
| chunk.1                    | 6.625KB    | 383ms  | 31ms          | 23715ms | ⭐ **5ms**     |
| chunk.5                    | 7.775KB    | 416ms  | 44ms          | 29765ms | ⭐ **7ms**     |
| chunk.6                    | 28.27KB    | 696ms  | 74ms          | 23715ms | ⭐ **7ms**     |
| chunk.7                    | 1.805KB    | 162ms  | 5ms           | 14966ms | ⭐ **4ms**     |
| chunk.8                    | 2.217KB    | 181ms  | ⭐ **4ms**    | 14927ms | 5ms            |
| chunk.10                   | 18.248KB   | 500ms  | 58ms          | 26881ms | ⭐ **6ms**     |
| chunk.9                    | 45.707KB   | 867ms  | 138ms         | 18170ms | ⭐ **8ms**     |
| ember-fetch/fetch-fastboot | 2.736KB    | 179ms  | 14ms          | 14969ms | ⭐ **7ms**     |
| auto-import-fastboot       | 134.432KB  | 1542ms | 750ms         | 23719ms | ⭐ **125ms**   |
| my-app-fastboot            | 8729.123KB | 4808ms | 3797ms        | 3848ms  | ⭐ **392ms**   |
| my-app                     | 3452.765KB | 7899ms | 4779ms        | 6483ms  | ⭐ **183ms**   |
| vendor                     | 4428.068KB | 9941ms | 7267ms        | 9429ms  | ⭐ **294ms**   |

If you look closely, `JOBS=1 esbuild` is the fastest on each individual file, but `JOBS=1 terser`
wasn't too bad either for all the smaller files--it even bested esbuild in one case! But for larger
files, the results were noticeably different. esbuild outperformed terser by 10x.

I've decided to come out of the rabbit hole here, but one possible avenue for further
exploration would be to investigate how terser works and see if it checks out that
it is not an O(N) operation. Another possible way to reduce variables and run
each of these 13 files in a deterministic order to see if that changes the results.
I was pretty happy to stop here.

## Even More Raw Data

### terser

```
assets/chunk.7.19a220231751adc6f9e7.js (1.805KB) -> 1.805KB in 162ms
ember-fetch/fetch-fastboot-e28194c4f1288a25de407aad6f7fab09.js (2.736KB) -> 0.887KB in 179ms
assets/chunk.8.d3bc007e86beb3f59722.js (2.217KB) -> 2.217KB in 181ms
assets/chunk.1.c5058b8350a7f92f058d.js (6.625KB) -> 6.596KB in 383ms
assets/chunk.5.3a7fac165fb83163b87a.js (7.775KB) -> 7.775KB in 416ms
assets/chunk.10.f25d9a8ef2fb4d803961.js (18.248KB) -> 18.101KB in 500ms
assets/chunk.6.229a8539512008cb285f.js (28.27KB) -> 28.219KB in 696ms
assets/chunk.0.988c362969b0fa064219.js (23.778KB) -> 23.63KB in 749ms
assets/chunk.9.a258d4fae07a2ac42ad7.js (45.707KB) -> 45.553KB in 867ms
assets/auto-import-fastboot-ff24d50b4bf7b63ea1c3d7ef54babf53.js (134.432KB) -> 133.896KB in 1542ms
assets/my-app-fastboot-4cdd3aa8b913c28d1628c1be6e682271.js (8729.123KB) -> 8718.29KB in 4808ms
assets/my-app-f629a42d2456316e9837ead6ff7cd404.js (3452.765KB) -> 1616.631KB in 7899ms
assets/vendor-8f243fb0c9b9c8f88fd94a5782813287.js (4428.068KB) -> 1828.842KB in 9941ms
```

### esbuild

```
assets/chunk.10.f25d9a8ef2fb4d803961.js (18.248KB) -> 18.272KB in 26881ms
assets/chunk.5.3a7fac165fb83163b87a.js (7.775KB) -> 7.766KB in 29765ms
assets/chunk.0.988c362969b0fa064219.js (23.778KB) -> 23.822KB in 23708ms
assets/chunk.1.c5058b8350a7f92f058d.js (6.625KB) -> 6.602KB in 23715ms
assets/chunk.6.229a8539512008cb285f.js (28.27KB) -> 28.258KB in 23715ms
assets/auto-import-fastboot-ff24d50b4bf7b63ea1c3d7ef54babf53.js (134.432KB) -> 134.748KB in 23719ms
assets/chunk.8.d3bc007e86beb3f59722.js (2.217KB) -> 2.208KB in 14927ms
assets/chunk.7.19a220231751adc6f9e7.js (1.805KB) -> 1.804KB in 14966ms
ember-fetch/fetch-fastboot-e28194c4f1288a25de407aad6f7fab09.js (2.736KB) -> 0.886KB in 14969ms
assets/chunk.9.a258d4fae07a2ac42ad7.js (45.707KB) -> 45.54KB in 18170ms
assets/vendor-8f243fb0c9b9c8f88fd94a5782813287.js (4428.068KB) -> 1880.165KB in 9429ms
assets/my-app-f629a42d2456316e9837ead6ff7cd404.js (3452.765KB) -> 1686.537KB in 6483ms
assets/my-app-fastboot-4cdd3aa8b913c28d1628c1be6e682271.js (8729.123KB) -> 12331.092KB in 3848ms
```

### esbuild (with JOBS=1)

```
assets/auto-import-fastboot-ff24d50b4bf7b63ea1c3d7ef54babf53.js (134.432KB) -> 134.748KB in 125ms +1ms
assets/chunk.0.988c362969b0fa064219.js (23.778KB) -> 23.822KB in 7ms +0ms
assets/chunk.1.c5058b8350a7f92f058d.js (6.625KB) -> 6.602KB in 5ms +1ms
assets/chunk.10.f25d9a8ef2fb4d803961.js (18.248KB) -> 18.272KB in 6ms +0ms
assets/chunk.5.3a7fac165fb83163b87a.js (7.775KB) -> 7.766KB in 7ms +0ms
assets/chunk.6.229a8539512008cb285f.js (28.27KB) -> 28.258KB in 7ms +0ms
assets/chunk.7.19a220231751adc6f9e7.js (1.805KB) -> 1.804KB in 4ms +0ms
assets/chunk.8.d3bc007e86beb3f59722.js (2.217KB) -> 2.208KB in 5ms +0ms
assets/chunk.9.a258d4fae07a2ac42ad7.js (45.707KB) -> 45.54KB in 8ms +1ms
assets/vendor-8f243fb0c9b9c8f88fd94a5782813287.js (4428.068KB) -> 1880.165KB in 294ms +1ms
assets/my-app-f629a42d2456316e9837ead6ff7cd404.js (3452.765KB) -> 1686.537KB in 183ms +1ms
assets/my-app-fastboot-4cdd3aa8b913c28d1628c1be6e682271.js (8729.123KB) -> 12331.092KB in 392ms +0ms
ember-fetch/fetch-fastboot-e28194c4f1288a25de407aad6f7fab09.js (2.736KB) -> 0.886KB in 7ms +0ms
```

### terser (with JOBS=1)

```
assets/auto-import-fastboot-ff24d50b4bf7b63ea1c3d7ef54babf53.js (134.432KB) -> 133.896KB in 750ms +0ms
assets/chunk.0.988c362969b0fa064219.js (23.778KB) -> 23.63KB in 151ms +154ms
assets/chunk.1.c5058b8350a7f92f058d.js (6.625KB) -> 6.596KB in 31ms +32ms
assets/chunk.10.f25d9a8ef2fb4d803961.js (18.248KB) -> 18.101KB in 58ms +59ms
assets/chunk.5.3a7fac165fb83163b87a.js (7.775KB) -> 7.775KB in 44ms +45ms
assets/chunk.6.229a8539512008cb285f.js (28.27KB) -> 28.219KB in 74ms +74ms
assets/chunk.7.19a220231751adc6f9e7.js (1.805KB) -> 1.805KB in 5ms +5ms
assets/chunk.8.d3bc007e86beb3f59722.js (2.217KB) -> 2.217KB in 4ms +5ms
assets/chunk.9.a258d4fae07a2ac42ad7.js (45.707KB) -> 45.553KB in 138ms +139ms
assets/vendor-8f243fb0c9b9c8f88fd94a5782813287.js (4428.068KB) -> 1828.842KB in 7267ms +7s
assets/my-app-f629a42d2456316e9837ead6ff7cd404.js (3452.765KB) -> 1616.631KB in 4779ms +5s
assets/my-app-fastboot-4cdd3aa8b913c28d1628c1be6e682271.js (8729.123KB) -> 8718.29KB in 3797ms +4s
ember-fetch/fetch-fastboot-e28194c4f1288a25de407aad6f7fab09.js (2.736KB) -> 0.887KB in 14ms +56ms
```

---

### Footnotes

1. I wish ember-cli consumed the broccoli plugin directly instead of wrapping it
   in yet another package :(.
2. To be fair, esbuild is meant for bundling _and_ minification, and in this study
   I'm _only_ using it for minification.
3. The big caveat here is that I ran all these test builds on my machine and only a
   couple times to validate that they weren't flukes. In a more rigorous study, I would
   want to run the builds more times under different conditions and hardwares and use
   medians to validate the results.
