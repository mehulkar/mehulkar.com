---
title: 50-Line Patches
date: 2024-01-31
tags:
  - programming
  - product
---

Somebody shared a screenshot of Linus Torvalds email-yelling at
someone for a technical contribution. I hate the whole thing and
it makes me want to quit software:

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">linus still going hard <a href="https://t.co/E81SBincrs">pic.twitter.com/E81SBincrs</a></p>&mdash; JUST ALE𝕏 (e/acc) (@testaccountoki) <a href="https://twitter.com/testaccountoki/status/1752595456083832961?ref_src=twsrc%5Etfw">January 31, 2024</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

But I read some of the surrounding conversation and saw [a followup][1] from
Linus:

> If somebody goes "I want to tar this thiing [sic] up", you should laugh in their
> face…not say "sure, let me whip up a 50-line patch to make this fragile thing
> even more complex".

I think Linus has a point here. Obviously not the one about laughing in
someone's face, but that accounting for edge cases with fixes is not a
requirement for software maintainers. We are absolutely allowed to set the
boundaries of "happy" conditions. We do this already for many things, but
somehow are happy to add "50-line patches" for many customers that ask for them.

Just because something is easy, does not make it a requirement to do.

Here's [the original email][2] the screenshot is from

[1]: https://lkml.iu.edu/hypermail/linux/kernel/2401.3/04265.html
[2]: https://lkml.iu.edu/hypermail/linux/kernel/2401.3/04208.html
