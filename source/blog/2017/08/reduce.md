---
title: 'Reduce'
date: 2017-08-14
categories: programming, javascript
---

I've always thought of a `reduce` function as a way to create an aggregation.
For example, to add up all the numbers in a list:

```javascript
[1, 2, 3].reduce((memo, i) => memo + i);
//=> 6
```

Because of this, I've always assumed that the first argument to
the `reduce` function callback (`memo`) is *mutated* in each iteration
of the function and so, at the end of the iterations, `memo` becomes the final
mutated value.

Last week I learned that `memo` isn't being mutated, it's being *replaced*
by the return value of the previous loop.

That means that `reduce` isn't simply an aggregator function, it can be used
in other flexible ways:

For example:

```javascript
[1, 2, 3].reduce((memo, i) => 2);
// => 2
```

```javascript
[1, 2, 3].reduce((memo, i) => i);
// => 3
```

So you can apply arbitrary logic to your `memo` value:

```javascript
[1, 2, 3].reduce((memo, i) => {
  let returnValue;
  switch(i) {
    case 1:
      returnValue = memo + i;
      break;
    case 2:
      returnValue = memo - i;
      break;
    case 3:
      returnValue = memo * i;
      break;
    default:
      returnValue = memo / i;
  }
  return returnValue;
}, 0);
// => -3
```

To understand this flexibility, t helps me to replace the `memo` moniker with `previousReturnValue` instead.
