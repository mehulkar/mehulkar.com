---
title: "Today in CS: Graphs"
date: 2022-05-09
tags:
  - programming
  - programming-journal
---

Today, I learned about graphs, directed graphs, and DAGs. I learned
about topologically sorting these via adjacency lists / matrices.

A graph data structure can be representated with arrays like this:

```js
{
    "A": ["B", "C"],
    "B": ["A"],
    "C": ["A"],
}
```

This is called an adjacency list. It represents a graph:

```shell
B - A - C
```

A is connected to B and C, and B and C are both only connected to A.

We could turn this into a directed graph by adding arrows.

```shell
B -> A <- C
```

A directed graph can represent dependency chains. In this case, both B and C depend
on A, and A doesn't depend on anything. This could be represented with a similar
adjacency list:

```js
{
    "A": [],
    "B": ["A"],
    "C": ["A"],
}
```

If we think about A, B, and C as tasks, a useful thing to know is the order
in which the tasks must be executed such that the dependencies of each task
are executed before the task itself. In this case, the order could be:

1. C
1. B
1. A

or

1. B
1. C
1. A

Both orders satisfy the graph. This ordering is called a topological sort.
A key piece of sorting a directed graph is the adjacency list; i.e. a data
structure that we can iterate through.

A directed acyclic graph (DAG) is a directed graph that doesn't contain
any cycles. This is a requirement for dependency chains. If a graph
contains cycles (A depends on B and B depends on A), we cannot do a topological
sort, because the requirements can never be satisfied.
