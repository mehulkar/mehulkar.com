---
title: CSS Rollover Animation
date: 2023-01-08
tags:
- programming
- frontend
- css
- custom-elements
- web-components
---


I've been browsing the web much more lately, because, turns out, when you have a baby you actually
_use_ the internet for things, rather than just making it or learning how to make it. I found this
cool animation on the [Kudos](https://mykudos.com/) website:

<video controls width="50%">
    <source src="/videos/css-rollover-animation.mov">
</video>

As you roll over the letters, the color changes and then fades back to white.

I thought this might be a cool, tiny way to dip my toes into Custom Elements,
so I did. Here it is:

The markup for the text below is:

```html
<script async src="/javascript/rollover.js"></script>
<my-rollover>Some Text</my-rollover>
```

## Rendered (try rolling over)

<script async src="/javascript/rollover.js"></script>
<my-rollover>Some Text</my-rollover>
