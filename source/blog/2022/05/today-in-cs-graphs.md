---
title: "Today in CS: Graphs"
date: 2022-05-09
categories: programming, programming-journal
---

Today, I learned about graphs and directed graphs, and DAGs. I learned
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
B -> A -> C
```

A is connected to B and C, and B and C are both only connected to A.

Graphs can represent dependency chains. In this example, A depends on B and C,
B depends on A and C depends on A.

If we think about A, B, and C as tasks, a useful thing to know is the order
in which the tasks must be executed such that the dependencies of each task
are executed before the task itself. In this case, the order could be A, B, C,
or A, C, B. Both satisfy the requirement.

This ordering is called a topological sort.

