---
title: Auto Closing Attribute Selectors?
date: 2018-04-11
categories: javascript, css, frontend
---

I discovered something weird the other day. It looks like in Chrome and Firefox, attribute
selectors will automatically be closed. Consider this example:

```js
// <div some-attr>hello</div>
const selector = '[some-attr]';
document.querySelector(selector);
```

Notice the opening and closing square brackets that form the valid selector. Now see this selector:

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
const goodSelector = '[some-attr-with-value="1"]';
const badSelector = '[some-attr-with-value="1';

document.querySelector(goodSelector); // finds the element
document.querySelector(badSelector); // finds the element in Chrome and Firefox, but not Safari
```

This is super strange behavior and I have not tracked down why it is the way it is.
If anyone knows, please twitter me!

Here's an interactive example on JSFiddle: [https://jsfiddle.net/mehulkar/1mobjpre/22/][1]

[1]: https://jsfiddle.net/mehulkar/1mobjpre/22/
