---
title: Auto Closing Data Selectors?
date: 2018-04-11
categories: javacript, css, frontend
---

I discovere something weird the other day. It turns out that in Chrome and Firefox, data attribute
selectors will automatically be closed. Consider this example:

```js
// <div some-attr>hello</div>
const selector = '[some-attr]';
document.querySelector(selector);
```

Notice the opening and closing square brackets that form the valid selector.

Now see this selector:

```js
// <div some-attr>hello</div>
const selector = '[some-attr';
document.querySelector(selector);
```

Notice the missing closing square bracket.

In Chrome 66 and Firefox 59, this selector will still work. But in Safari, it does not work.

I was even able to get selectors with values to work without closing quotation marks:

```js
// <div some-attr-with-value="1">hello</div>
const goodSelector = '[data-test-foo="bar"]';
const badSelector = '[data-test-foo="bar';

document.querySelector(goodSelector); // finds the element
document.querySelector(badSelector); // finds the element in Chrome and Firefox, but not Safari
```

This is super strange behavior and I have not tracked down why it is the way it is.
If anyone knows, please twitter me!
