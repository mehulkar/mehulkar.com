---
title: EventListener objects
date: 2018-01-22
tags:
  - programming
  - frontend
---

Whenever I've used `addEventListener`, I've always passed a function as the second argument. I
assumed that when an event was dispatched, the callback would be fired. For example:

```javascript
element.addEventListener("eventName", () => console.log("hi!"));
```

Today, I learned that you can pass an object that conforms to a particular interface. This was
pretty surprising, because I've always considered Javascript interfaces to be heavily skewed
towards functions and callbacks, and not towards objects.

But not so!

Javascript has fantastic interfaces for Events and EventListeners. The second argument
to `addEventListener` can be anything that responds to `handleEvent`. For example:

```javascript
element.addEventListener("eventName", {
  handleEvent(event) {
    console.log("event happened!");
  },
});
```

You can take this one step further and implement a handler for all kinds of events
by using the `type` property of the `Event` object that is passed to `handleEvent`:

```javascript
const myCustomHandler = {

  // generic handler for events
  handleEvent(event) {
    if (this[event.type]) {
      this[event.type](event);
    }
  },

  // a function that will be called on the mouse click event
  click: () {},

  // a function that will be called on the mouse double click event
  dblClick: () {},
  // etc
};

// attach event listener for both the click and dblClick events.
element.addEventListener('click', myCustomHandler);
element.addEventListener('dblClick', myCustomHandler);
```

Further reading:

- [`addEventListener` docs][1]
- [`EventListener` interface][2]: (the object that is passed to `handleEvent`)
- [`Event` interface][3]: (an interface for your custom handler)

[1]: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
[2]: https://developer.mozilla.org/en-US/docs/Web/API/Event
[3]: https://developer.mozilla.org/en-US/docs/Web/API/EventListener
