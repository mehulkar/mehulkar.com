---
title: AI as QA Agent
date: 2024-06-16
tags: programming, ai, testing
---

A really useful way to apply AI could be to automate usage of your web app to
catch bugs. This is typically something engineers write code to do or humans
write test plans to do. But I wonder if, given a corpus of normal usage of your
site (via web traffic analytics and client-side instrumentation), AI could
simulate a real person using your app. It would arguably be better than
hardcoded tests, because humans don’t behave predictably when using software
either, so AI’s unpredictable nature would be a feature rather than a bug
(unlike when we ask AI to do, say, math, where predictability is a bit more
important).

An AI agent could presumably simulate usage across regions and languages and
browsers and devices and create an incentive to build or integrate observability
tools instead of testing tools. This kind of QA is expensive to do and it could
be a perfect task for AI: low risk, high reward.

Maybe someone’s already working on this.
