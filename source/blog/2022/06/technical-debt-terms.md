---
title: Technical Debt Terms
date: 2022-06-07
categories: programming
---

When most people use the metaphor of technical debt to describe their choices in programing,
they conveniently leave out the second half of the metaphor. I occured  to me recently
that this could be the key to actually make the metaphor work.

When you take on debt in the real world (car loan, home loan, student loan, credit card, etc),
it doesn't come for free. The issuer of the debt attaches terms that describe *how* the debt
should be repaid, *when* it should be repaid, and *what* happens if it isn't repaid. These are
essential parts of the agreement between the lender and borrower.

When we take on "technical debt" (or at least when we take shortcuts and call it
technical debt 🙄🤣), we're "borrowing against future debt". I like this description
from Richard Dalton<sup>1</sup>:

<blockquote class="twitter-tweet" data-dnt="true"><p lang="en" dir="ltr">Technical Debt is not a catch-all term for bad code.<br><br>It is deliberate borrowing against future productivity. You must know when you&#39;re doing it and why.<br><br>Bad code that bites you long after you&#39;ve written it can&#39;t be retrospectively labelled Technical Debt. It&#39;s just bad code.</p>&mdash; Richard Dalton (@richardadalton) <a href="https://twitter.com/richardadalton/status/1111366432686833664?ref_src=twsrc%5Etfw">March 28, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

I like the framing of "against future debt", but for the purpose of this post,
we'll hand wave over the actual point of the tweet about retroactively labeling
bad code. (In fact, later in this post, I'll be saying something close to the
opposite of that 😅).

When teams use the technical debt metaphor, instead of discussing how it will be
paid off, it is common to just *document* the debt for some future re-evaluation,
i.e. some future sprint planning session. Imagine asking a bank to approve a loan
and telling them that you'll come back to the part about how (or if) you'll pay it
back!

So how do you talk about the terms for tech debt?

Nat Bennett writes about taking on new work in the [Simpler Machines newsletter][3]:

> Ask, "How will we know that this does what we intend?" before beginning a piece
> of work, whether it's a line of code or an architectural design. Ask, "How can
> we build a prototype for this?" before you spend more than a few days working on
> a design document. If a technical discussion lasts more than a few minutes, ask,
> "How could we get some more information that would help us make this decision?"

This context in Nat's post is about testing strategies, but we can adapt the same
mindset to normalize asking "how will we come back to this?" when we talk about
technical debt.

Of course, we cannot know how how we'll pay back debt if we don't know what
we're taking on (or worse, if we fail to identify when we're taking it on).
That's the hard part. In fact, most of the time I've been involved in conversations
about technical debt, it's when someone describes *existing* code needing to pay off debt,
rather than the point at which the debt was incurred. This is interesting,
because existing debt without a payment plan can live indefinitely. After all,
nobody is asking to pay it off, and the uneasy feeling we get when we think about
the mounting debt can be buried in the bug tracker.

In these situations, it's easy to shift the goal post and start reframing debt
as the status quo. This mental trickery turns a conversation about a payment
plan into a conversation about an "engineering project", which, as we all know, is
pronounced "non-customer facing work", or, in some dialects: "no business value".
In other words, sloppy usage and practice of the debt metaphor is a downward spiral
into "everything is terrible and we can't have nice things."

**But there is hope!**

If can fool ourselves into turning technical debt into engineering
projects, we can also do the opposite! There are two ways to tune yourself into this
mindset:

1. When you hear talk of engineering projects (often called infrastructural projects),
    see if you can trace the origins of the demand for this project. Why now? What
    socio-technical decisions led to the need for this project. Was it preventable?
    How?

    This is the part where I directly contradict Richard's tweet above. In theory,
    you can't retroactively call "bad code" (or bad decisions) technical debt after the
    fact. But in practice, I'm not sure it's useful to be dogmatic about this. In practice,
    all sorts of things are labeled technical debt, and it *rarely* seems to happen
    consciously at the point it's taken on. So why shouldn't we work backwards from
    the demand for engineering work to the point at which it could have been a conscious
    decision? Why shouldn't this retroactive labeling be a tool in our kits for justifying
    and accounting for engineering work?

2. When you hear the words "we'll come back to this" or "for now", ask "when" and "how".
    Press yourself and your team to make a plan and get project managers involved.

    <blockquote class="twitter-tweet" data-dnt="true"><p lang="en" dir="ltr">If you&#39;re looking for where tech debt comes from, look for the words &quot;for now&quot; and &quot;workaround&quot;. <br><br>If you&#39;re looking for why features are moving slowly, look for the words &quot;long term&quot; and the sanctimonious &quot;the REAL fix&quot;.</p>&mdash; Mehul Kar (@mehulkar) <a href="https://twitter.com/mehulkar/status/1172279670894522368?ref_src=twsrc%5Etfw">September 12, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

    This is easier said than done, but at some scales, I think it has promise.

## Epilogue

Writing this post sparked some new ideas that are worth thinking about.
Notably: taking on debt isn't *bad* per se. In fact, taking on debt
is [a common technique to *increase* total value][4]. This is also a significant
part of the conversation, both at the point of incurring it (will this increase
future returns?), and when it's noticed (did this increase returns?). These
are tricky questions and I don't know of a way to answer them. But the truth is
that even in the world of finance, quantifying risk and return have some element
of subjectivity. Financial models work not because they're absolutely true, but when
they're applied consistently. If we are to take technical debt seriously, I think we
can go a lot further with how we talk about it, and part of that is getting over the
hump of thinking that code quality is too subjective to measure.

---

## Footnotes

1. I see tweets about techincal debit all the time, and I found this one
    by searching twitter with [`filter:follows "technical debt"`][1]. Surprisingly,
    Twitter's [advanced search documentation][2] doesn't show how to do this
    kind of query.


[1]: https://twitter.com/search?q=filter%3Afollows%20technical%20debt&src=typed_query&f=top
[2]: https://help.twitter.com/en/using-twitter/twitter-advanced-search
[3]: https://www.simplermachines.com/test-first/
[4]: https://en.wikipedia.org/wiki/Leverage_(finance)