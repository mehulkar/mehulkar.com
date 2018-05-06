---
title: Switching to Functional CSS
date: 2017-03-06
categories: programming, frontend
---

I just switched over to tachyons on one of my projects. [Tachyons][1] is a functional
CSS library, which means that it gives you a ton of pre-written classes, each of which
do only one thing and are organized in easily guessable patterned names. For example,
the class `.mb1` means "apply a `margin-bottom` rule of scale `1`. The scale
`1` is a relative measure

Converting to tachyons was a pretty fun process, so I'd like to document some
key learnings:

- I was able to throw away most of the rules I had written for margins, padding,
    borders, colors, font sizes and weights. There were surprisingly a lot of these,
    and they were inconsistently and sloppily organized.
- Applying a bunch of classes to a single element feels almost like inline
    styles, except you get relative scales and shorthand syntax. For example,
    `<span class='pa3 mb4 f1 red'>text</span>` applies a:
      - `padding` on all sides of relative scale 3
      - `margin-bottom` of relative scale 4
      - `font-size` of relative scale 1 (the biggest)
      - `color` of red
- Not being able to create a `.special-class` that encapsulates styles, like I
    would be able to with more of a component approach, forced me to look for template
    abstractions and partials, which ended up being a really good for design
    consistency.
- I probably introduced some inconsistencies because of typos or by accidentally
    using `pv2` instead of `pv3` (`pv` is shorthand for both `padding-top` and
    `padding-bottom`), but these inconsistencies were a thousand times easier to
    debug than delving into CSS.
- I had to add a couple colors in the same style as the ones provided by the
    library to get my brand colors. I just added the rules I needed, not ALL possible
    uses for the color.
- I was able to completely get rid of bootstrap library and a bootstrap theme.
    and reduce my CSS down from almost 1MB to 200kb to achieve a near identical look
    and feel on the website.
- Since I was writing SCSS in a Rails app, in development mode,
    my styles were being compiled on page load on every change. This compile step
    takes longer the more files of SCSS you have. I had a bunch of these files (one
    for each "component"), but since I was able to delete a lot of my styles,
    my development flow became much quicker (from about ~4 seconds to load to
    under 1 second to load a page after changing a custom CSS rule).
- There was a little bit of a learning curve, but I was able to learn the
    patterns of class names pretty quickly. I also downloaded the source for the
    tachyons website and docs, and did a global search in it in my text editor to
    find the class names that corresponded to certain rules. This worked pretty well
    since I was working on my migration offline on a plane.

I feel pretty confident that a new contributor would be able to pick up on these
patterns and apply the same styles much more quickly than if they were to try to
look through my code.

Another thing I noticed is that writing CSS in a component approach requires me
to be very disciplined about doing things The Right Way™, and constantly looking
for abstractions. With this functional approach, I was able to throw a bunch
of classes at an element and not only did it do what I wanted it to do, it was
also already at a very low level of entropy. I think optimizing for laziness is
a good thing.

[1]: http://tachyons.io
