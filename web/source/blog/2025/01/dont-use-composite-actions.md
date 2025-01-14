---
title: "Don't Use Composite Actions"
date: 2025-01-14
tags: engineering
---

## TL;DR:

I switched one of our Github Workflows from using a Composite Action to using a
Workflow with `workflow_call` to get a better UI in Github Actions, and a
breakdown of steps in Datadog. There was 0 downsides.

## Background

Our `deploy` Github workflow has a Composite Action to share a series of shared
steps. The steps include things like: run a smoke build, install some
dependencies, build a docker image, push it to a registry, etc. This worked, but
it had a major flaw: a Composite Action is used as a "step" in an existing
workflow:

```yaml
jobs:
  my_job:
    name: "Job 1"
    runs-on: ubuntu-latest
    steps:
      - name: Step 1
        uses: ./.github/composite-actions/some-series-of-steps
```

This provides a nice abstraction, but all of `some-action` is collapsed into
"Step 1" in the workflow. Apparently this is
[a long standing issue](https://github.com/orgs/community/discussions/21276).
This means we don't get log collapsing, bubbled up timing, etc for individual
steps in this Composite Action.

## Datadog

I was ok with this while it was just a UI issue. But we use the DataDog
integration to collect CI information from Github Actions. This has been
invaluable to analyze CI and optimize the slow bits. My typical workflow is to
look at a _Pipeline Executions_ (which are runs of a Github Workflow), break it
down by the duration of each _Job_ (which is a Github Job in a Workflow) and
then dig into individual Steps. Because "some-action" is inlined into a single
Step, DataDog just gets a single entry for the entire Composite Action. So you
might know the Composite Action is slow, but have no idea which part.

## The Fix

I replaced this Composite Action with another Workflow and enabled it to be
invoked with a `workflow_call` event:

```
on:
  workflow_call:
```

and then

```
jobs:
  my_job:
    name: "Job 1"
    secrets: inherit
    uses: ./.github/workflows/some-series-of-steps.yml
```

The main difference is that the `uses` key appears at the job level instead of
as a step, and you have to explicitly share `secrets` with it. After this
change, each step in `some-series-of-steps` were individual steps in the Github
Actions UI and also reported to DataDog separately.
