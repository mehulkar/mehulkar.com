---
title: "TIL: Creating Globals"
date: 2022-04-18
tags:
- programming
- javascript
---

Today I learned you can create globals by passing unnecessary arguments
to a function in javascript.

For example:

```javascript
function myFunc(a) {
    console.log(a);
}

myFunc(123, (i=100));

console.log(i);
```

Calling this function with that second argument expression will assign
a global `i` to the value 100.
