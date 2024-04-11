---
title: stdout vs stderr
date: 2017-11-20
tags:
- programming
---

I'm not sure where I first learned this, but I thought it was a non-discoverable piece of information
that also changed how I thought about writing programs.

I've always thought that `stderr` for a program is to display errors and `stdout` is for "everything
else". But it turns out `stdout` is meant to be program _output_ and `stderr` is meant to be...
"everything else". This was conceptually difficult for me until I thought of an example.

For example, in a calculator program, if I input `1 + 1`, the output is `2`. This should
be printed to `stdout`. However, if there is internal logging, that should be printed to `stderr`.
E.g. "Gathering input", "initializing adding machine", etc.

This understanding was paradigm-shifting for me in two ways:

1. Not every program needs to print something to `stdout`.

    This is best illustrated by the ["Command vs Query"][1] Object Oriented principle that says that
    methods should either send a command or a query, but never both. If we extrapolate this to
    the program level, we can get a similar principle that says that if a program is a
    query, it should print to `stdout`, but if it's a command, then it should print to `stderr`.
    For example, if I have a program that sends an email, a "Done" message is a progress update,
    not the output of the program and should be printed to stderr.

1. Printing progress updates to `stderr` allows the user instead of the programmer to identify errors.

    As a programmer, it's impossible to unilaterally determine what the user considers a bug and what
    they consider behavior<sup>1</sup>. I think `stderr` is a perfect illustration of this idealogy.
    All program status is displayed in a single stream and it is up to the user to determine what
    they consider an erroneous behavior. Additionally, this also provides a nice separation of
    concerns between what is an "exception" and what is an "error". Note that, as a programmer, I
    may choose to handle exceptions and display that handling in `stderr`, but then my message
    should convey that I handled the exception, rather than that an exception occurred.

Understanding this difference between `stdout` and `stderr` has also allowed me to better frame the
purpose of my programs and functions.

**Footnotes**

1. There's a whole other blog post in this statement.

[1]: https://en.wikipedia.org/wiki/Command–query_separation
