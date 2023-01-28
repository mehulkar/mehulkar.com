---
title: A Test Suite & Design System For My Blog
date: 2022-12-28
tags: frontend, testing, design-system, qa, meta
---

I'm no designer, but every once in a while, I tinker with the CSS on this website to make things
look "good". But I often break the rendering of things, because, frankly, I'm not trying that hard
to organize the CSS in a way that is maintainable until I really need to.

For example, Alex told me recently that inline code snippets were invisible in dark mode (thank you Alex!).
I had noticed this myself some time ago, but forgot to do anything about it. Oops.

<iframe
    src="https://mastodon.social/@alexlafroscia/109589017728591937/embed"
    class="mastodon-embed"
    allowfullscreen="allowfullscreen"
></iframe>

So this article is effectively a test suite and a design system.

Much like a test suite, if this article looks ok, I can assume the website is ok. And even more like
a test suite, if I notice something on the website that _doesn't_ look ok, I will incorporate that
_type_ of thing into this article. In the words of Steve Maguire<sup>1</sup>:

> Never allow the same bug to bite you twice

Like a design system, I will also expect the elements of this page to look ok on different screen
sizes, in dark mode, etc. If I was to overengineer this effort, I could write custom components
and setup something like Storybook, but I think this will also work just fine.

I considered making a Lorem Ipsum type page, but I figured it's more interesting to read this as an
article while being my test page? And it would be fun for me to try to incorporate elements from across
all the articles into a single article. (Although let's be honest, most of the content on this site
is all the most common HTML elements).

## Checklist

Here's a list of things this article accounts for:

<aside>Note to self: if you update this article, be sure to update the ✔️ in this check list also</aside>

- Plain text
  - italic text (with surrounding underlines in markdown)
- Links
  - with inline code
- Aside (i.e. the &lt;aside&gt; element)
- Lists
  - ordered
  - unordered
  - nested paragraphs
  - nested block code
  - nested lists
- Headings: 2, 3
- Embeds
  - Mastodon
- In-line code
- Block code
- Footnotes

### TODO

And a list of things I haven't incorporated yet:

- Bold text
- Images
- Headings: 4
- Embeds:
  - Twitter
  - YouTube

## How to Use This Article

To use this article as a test suite, I will read it in:

1. light mode
2. dark mode
3. a phone
4. a computer

(in that order, because I needed an ordered list on this page 😅.)

I could also do some more advanced things like

- Set the browser/OS to an Right to Left (RTL) language

  This is also kind of possible by setting `dir=rtl` attribute on the `<html>` element.

  There isn't any *content* on this website that is in an RTL language,
  but doing this test can be helpful if these pages were ever viewed by someone in, say, Israel,
  with their browser language set to Hebrew.

  The way to fix this is to generally use [CSS logical properties][1]. For example, to customize
  the spacing for unordered lists:

  ```diff
  ul {
  -  margin-left: 3rem;
  +  margin-inline-start: 3rem;
  }
  ```

  Logical properties can also help when browsers are using vertical scripts and you want to set
  [`writing-mode: vertical-lr`][2].

- Disable JavaScript

    I'm not sure testing styles with JS disabled is going to do much, since I don't
    apply any styles dynamically on the client. And if I did, this page doesn't currently
    test for it, but it's a wild world [anything can happen][3].

- Stylesheets disabled

    Safari has the ability to disable stylesheets from the `Develop` menu. This can be a
    good way to check things like the downloaded image size and whether your html is semantic.

---

Foototes

1. I definitely DuckDuckGo'd "quotes about software testing" so I could use a `blockquote`.

[1]: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Logical_Properties
[2]: https://developer.mozilla.org/en-US/docs/Web/CSS/writing-mode
[3]: /blog/2022/01/debugging-a-flash-of-unstyled-text/
