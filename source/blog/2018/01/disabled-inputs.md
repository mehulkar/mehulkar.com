---
title: Disabled Inputs
date: 2018-01-12
categories: programming, frontend
---

Today, I learned that an `<input>` element (or any other form control) can be disabled
by wrapping in a `fieldset` element and disabling the `fieldset`. For example:

```html
<form>
    <fieldset disabled="true">
        <input />
    </fieldset>
</form>
```

The markup above will display an text `input` element that cannot be interacted with.
However, there are some intricacies to this, that are perhaps surprising.

1. The `disabled` content attribute on the `input` does not get set.

    ```js
    document.querySelector("input[disabled]");
    //=> null
    ```

1. The `input` element node does not set its `.disabled` IDL attribute<sup>1</sup>.

    ```js
    document.querySelector("input").disabled;
    // false
    ```

1. The `input` element is selectable by the `:disabled` pseudo selector.

    ```js
    document.querySelector("input:disabled");
    //=> <input>
    ```

I discovered this while trying to write a test that asserted that an `input` element was,
in fact, disabled. When I queried for the `input` and checked the `.disabled` property,
it returned `false` when I could clearly see in the rendered markup that it _looked_ disabled.

Digging a little deeper, it turns out that "disabled behavior" of a form control can be broken down
into 3 things:

-   the state, which determines if the user can interact with the element
-   the content attribute, which would show up in the HTML
-   the IDL attribute, which is the javascript property on the DOM node

The spec says that the IDL attribute should always reflect the content attribute, but it
does not say anything (that I could find, at least) about how to synchronize with the state.

I would normally consider this a bug, but bugs are not errant behavior, bugs are deviations from
the spec. In this case, since the spec doesn't define correct behavior, it is likely that this
is not a bug and is up to browser vendors to implement.

Further reading:

1. [Input Element MDN Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input)
1. [Disabled spec](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#concept-fe-disabled)
1. [Disabled pseudo selector spec](https://drafts.csswg.org/selectors-4/#disabled-pseudo)

**Footnotes**

1. "Properties" on a DOM node are called ["IDL attributes"][1]. I learned so much stuff today!

[1]: https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes#Content_versus_IDL_attributes
