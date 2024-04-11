---
title: The Senior Software Engineer - Reading Log
date: 2016-10-07
tags:
- books
---

## Friday, October 7, 2016

**Start page:** 209<br />**End page:** 243 (finish)

-   Production is all that matters. 24-hr hack in production is better than polished product in dev, because it is driving value and $.
-   Lots of tips on mature practices for production: aggregated/searchable logs, fault tolerant code, etc
-   A section on “responsible refactoring”: it’s not worth it to refactor unless it drives a feature. Easy to conflate code you don’t understand with code that is poorly designed--be cautious about “cleaning up” working, production code.

## Thursday, September 22, 2016

**Start page:** 181<br />**End page:** 209

-   A chapter on delivery process that covered agile practices: don’t commit to firm dates, have a way to track progress, trade inaccurate estimates for honest updates on progress with stakeholders.
-   Building “software right” vs the “right software” is tricky. Developers do the first, product managers/business analysts do the second. At some point these two ends have to cooperate and collaborate--it’s easier for a developer to understand the domain than for a product manager to become technically proficient.
-   Understanding the domain and knowing what to build (or at least having opinions on what to build) is the mark of a senior engineer and will be the most effective way to prove their value.

## Tuesday, June 18th, 2016

**Start page:** 161<br />**End page:** 181

-   Some great tips on managing interruptions. Poll at set time interval rather than letting notifications interrupt you. Send accurate signals about availability (door closed when unavailable and vice versa)
-   Another observation that the desire to be single-minded is not sustainable. To be senior, you have to be able to manage and organize multiple things at the same time. But that doesn’t mean you have to do all of the things at the same time.

## Tuesday, June 21st, 2016

**Start page:** 140<br />**End page:** 161

-   How to write: use twitter and write a blog. Interesting advocate for using Twitter to practice brevity. That has been one of the things I’ve learned most from Twitter also.
-   How to do interviews: not too much unusual in this chapter. Strong advocacy of take-home assignments. I’m generally not a fan of doing these because it takes a lot of work and it’s hard to know the appropriate amount of time to put in, but author’s reasoning is solid. It does put the candidate at ease, if they’re willing to put in the effort.

## Tuesday, June 14th, 2016

**Start page:** 113<br />**End page:** 140

-   Learn how to basic devops. Deploy to production as soon as possible and use experience to make tech stack decisions. E.g. your infrastructure might not support a language or a version that you would have used. Better to find out early.
-   Great coverage of how to write good emails. Especially liked that this was called out and had its own dedicated section. Call to Action first. Ask for one thing per email. Provide specific options if response is required. Default option should be most optimal for you and require the least effort from others. Etc.

## Thursday, June 9th, 2016

**Start page:** 92<br />**End page:** 113

-   A list of logical fallacies to watch out for when making technical arguments.
-   A whole chapter on bootstrapping new projects and how to do that effectively. A lot of emphasis on choosing a technology (the company’s “blessed stack” vs. something else) and how to convince your team / stakeholders on it. Also a caveat about how sometimes you might be wrong or you might be right but will still not get your way and how that’s ok.

## Tuesday, June 7th, 2016

**Start page:** 64<br />**End page:** 92

-   Great distinction between technical debt and technical slop. Debt is a tradeoff made between an implementation that recognizes that the current set of assumptions might (or will definitely) change in the future. Slop is just bad or incomplete coding that wasn’t refactored or has poorly named variables.
-   Finished another chapter about making technical arguments and the first piece was empathizing with others and understanding their priorities. Those dang soft skills.

## Friday, May 27th, 2016

**Start page:** 35<br />**End page:** 64

-   Heavy advocacy of TDD
-   Read a section on implementing larger features and there was an additional planning step with ‘systems thinking’. Roughly translates to the ‘architecture’ phase. Decent summary
-   A great analogy of how professional cooks always have a clean kitchen because they clean as they go. Reminded me of Sandi Metz’s “make the change easy, and then make the easy change”--which is my favorite adage about programming ever.
-   Getting code review section didn’t really address teams that have lots of projects and code reviews are a burden, especially if the technology stack is different among projects. This might be an edge case though for most teams? Or, more likely, this book isn’t about code reviews or project management.

## Thursday, May 26th, 2016

**Start page:** 17<br />**End page:** 35

-   Read kind of like a sermon and felt a little patronizing in the beginning. Might just be my own insecurity and projection though.
-   Learned one cool thing: In the Red/Green/Refactor cycle. Don’t think of, or tell anyone, that you’re done at the Green phase. Saying you’re “just cleaning up” is inaccurate, misleading, and sets you up for failure because you don’t know how long the Refactor phase will take.
-   Didn’t like that he encouraged putting names and conversations into commit messages. The issues brought up in conversations should be recorded so it’s easier to track down why certain decisions were made, but not so much who those issues and decisions came from.

## Monday, May 23rd, 2016

**Start page:** 1<br />**End page:** 17

-   Seemed a little out of touch with what an amateur developer goes through
-   Steps to fixing bugs: understand the problem, TDD, commit. Doesn’t work with projects that don’t have a test suite set up or with new languages or old frameworks or difficult to reproduce setups
-   Found more than a few typos, which I like and don’t like at the same time. Like because it looks like the person who wrote it is a real person who makes mistakes and I can identify with that more. Don’t like it because it looks like the book is less legit. Neither are blockers to getting value out of the book though.
