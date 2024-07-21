---
title: Antitrust in Software
date: 2023-07-20
tags:
  - books
  - software
  - draft
image: /images/blog/books/the-curse-of-bigness.jpg
---

<picture>
    <source type="image/jpeg" src="/images/blog/books/the-curse-of-bigness.jpg">
    <source type="image/webp" src="/images/blog/books/the-curse-of-bigness.webp">
    <img width="322" height="483" class="book-cover" src="/images/blog/books/the-curse-of-bigness.jpg">
</picture>

I just<sup>1</sup> finished reading _The Curse of Bigness_ by Tim Wu. The book is a history
of American antitrust law, starting from the ideas of Louis Brandeis to how
those ideas were dismantling by The Chicago School in the 1960s(??) to where we
are in present day.

I learned that Brandeis' ideas of "antitrust" (as in, _anti_ the Trust Movement)
came from the belief that large businesses are market manipulators, and make
promises of efficiency and economies of scale that they can't actually keep.
Brandeis believed that private firms that grew too large and centralized not
only weren't efficient, but they could influence government, crush competition,
and squash innovation. This, he believed, was anti-American democracy, and
antitrust law was the cure.

In the 1960s, the laws that originated from this idea were re-interpreted from
an economic viewpoint. Lawyers with economic backgrounds pushed the idea that
the question isn't "is a business too big?", the question is "is it bad for
consumers?" In other words, does the existence of this monopoly increase prices?

I think the book is fascinating, but I couldn't help but connect it to software
architecture.

In programming, we have the concept of a
[God object](https://en.wikipedia.org/wiki/God_object), an object or interface
that it contains essentially the whole program. Or at leas the most important
parts of it.

In Turborepo (a tool that runs your tasks), for example, until recently `run.go`
was over 1000 lines of code. In a previous job, a large monorepo had a class
simply called "BusinessLogic".

I used to think "God" classes got their name because they are large and connect
to everything. But after reading about the origins of antitrust, I now also see
how they have _undue_ influence over the rest of the codebase or system. We
often see that monolithic pieces of code can be difficult to maneuver around.

Putting all our code in a single line script is surely more efficient up to a
certain point, but at some point it fails to deliver on the promise of that
efficiency.

A recurring problem for software engineers is that "too big" is not a defensible
reason to refactor. It's subjective, hard to enforce, and frankly, an annoying
standard to maintain over time.

<img src="/images/blog/2023/compared-to-what.jpg">

The Chicago School took advantage of this Too Hard To Enforce practicality, when
it suggested that the only measure of the "bigness" is whether or not it hurts
consumers. Lawyers and judges love this argument because it is an easier metric
to optimize for.

In the software world, "breaking up" big classes is viewed from the same lens:
"does it hurt end users?" The underlying sentiment is that "too big" is a
subjective measure and if it's getting the job done, then why does it matter?

I like this parallel because it gives me the vocabulary to talk about The Curse
of Bigness. On a philosophical level, Brandeis, and Tim Wu believe that Trusts
run afoul of the American idea of decentralized power with checks and balances.
We can compare this to the Single Responsibility Principle: do one thing and do
it well. This serves us well in theory.

On a practical level, centralization yields subpar products, and kills
innovation. Wu explores this from the antitrust case of AT&T in 1970s. When the
telecom juggernaut was broken up, Wu contends that it gave rise to whole new
technology, new products, and new industries.

In software, you can see the same power dynamic with monolithic code. Monolithic
code contains general-purpose logic that is so tangled with its surrounding that
it cannot easily be reused. Or monolith code, just by being big, slows down
anything sitting next to it (e.g. slower CI). Or monolithic code is so central
to the codebase that anything that interacts with it has to play by its rules.

---

Note to reader: _The Curse of Bigness_ proposes solutions to these problems too, but I've
sat on this post for long enough now that I wanted to optimize for publishing
instead of getting the perfect content.

---

### Footnotes

1. "Just" is somewhat inaccurate now. I read the book early in 2023, and started writing
   this post and didn't feel satisfied enough to publish. I still don't feel satisfied, but
   am publishing anyway, since it's unlikely that I make more progress on this.
