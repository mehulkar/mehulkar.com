---
title: "Ember Octane: Default Values"
date: 2019-12-06
tags:
  - programming
  - frontend
  - ember.js
---

The Octane upgrade has introduced one notable complication into Ember apps that
is worth talking about: default values for component arguments. There are a number
of variables to the scenario your app could be in, so I thought I'd document them.

## Classic components

This "just works", because properties assigned by EmberObject.extend()
are assigned to the Javascript object prototype, and any arguments passed
into the component at invocation override those properties. For example:

```js
import Component from "@ember/component";

export default Component.extend({
  foo: "default foo",
});
```

```hbs
<MyComponent @foo="override" />
```

## Classic Component defaults in `init`

This also "just works" because `init` assigns properties after the component
instance has been created, and has access to the arguments passed at invocation time.

Note that the example code below is contrived because I'm sticking to simple strings as values, but
it is a valid technique for assigning arrays and objects as defaults. Assigning
an array/object to the prototype (as in the _first_ example) can lead to bugs because, as mentioned
above, the array/object would be assigned to the object's prototype and shared by reference
across all instances of the component.

```js
import Component from "@ember/component";

export default Component.extend({
  init() {
    this._super(...arguments);
    this.foo = this.foo || "default foo";
  },
});
```

```hbs
<MyComponent @foo="override" />
```

## Classic Components with Native Class

```js
import Component from "@ember/component";

export default class MyComponent extends Component {
  foo = "default foo";
}
```

```hbs
<MyComponent @foo="override" />
```

This also "just works" because the [native class field][1] is assigned _per_ instance of
the class, and passing in an override at invocation will override the value.

## Classic Component with Native Class and `contructor`

```js
import Component from "@ember/component";

export default class MyComponent extends Component {
  constructor() {
    super(...arguments);
    this.foo = this.foo || "default argument";
  }
}
```

```hbs
<MyComponent @foo="override" />
```

This infamously does NOT work because a native class's `constructor` does not have access
to the arguments passed to it by the invocation. That means that that when this component
is invoked, it will always assign the `'default argument'` to `foo`, and then, when the props
are passed to it, it will reassign it again.

The big problem this creates is that the default value does NOT get picked up if falsey or undefined
values are passed at invocation.

```hbs
<MyComponent @foo={{undefined}} />
```

### Workarounds

There are 3 workarounds that I know of:

- create a getter and use _that_ instead:

  ```js
  import Component from "@ember/component";

  export default class MyComponent extends Component {
    get fooWithDefault() {
      return this.foo || "default argument";
    }
  }
  ```

  The downside to this workaround is that you have to remember never to use `this.foo` and always
  use `this.fooWithDefault`.

- Use `init` instead of `constructor` to assign the default:

  ```js
  import Component from "@ember/component";

  export default class MyComponent extends Component {
    init() {
      this._super(...arguments);
      this.foo = this.foo || "default argument";
    }
  }
  ```

  This works, but it's unclear if this is encouraged or discouraged at the moment, because it violates
  the `ember/classic-decorator-hooks` rule.

- `@classic` decorator and `init`

  ```js
  import Component from "@ember/component";
  import classic from "ember-classic-decorator";

  @classic
  export default class MyComponent extends Component {
    init() {
      this._super(...arguments);
      this.foo = this.foo || "default argument";
    }
  }
  ```

  This also works, but the `@classic` decorator requires installing the `ember-classic-decorator`
  and I ran into [a bug that I couldn't workaround](https://github.com/emberjs/ember-classic-decorator/issues/31).

## Classic Components Computed Properties

A classic component that implements a default value as a computed property can be overriden
at invocation, but it logs a deprecation warning:

```js
import Component from "@ember/component";
import { computed } from "@ember/object";

export default Component.extends({
  foo: computed(function () {
    return "default argument";
  }),
});
```

```hbs
<MyComponent @foo="override" />
```

The deprecation recommends implementing the computed property in the get/set syntax, but I am
not sure why that is. (If you know please let me know and I'll update this!)

```js
import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extends({
    foo: computed({
        get() {
            return 'default argument';
        }
    }
})
```

## Glimmer Components

Glimmer Compnents have a bit of magic sauce that mitigates the problems of Classic componnts
as native classes: `this.args`. The `args` API allows Glimmer components to access component
properties in the constructor and assign defaults easily:

```js
import Component from "@glimmer/component";

export default class MyComponent extends Component {
  constructor() {
    super(...arguments); // super must be called first.
    this.foo = this.args.foo || "default argument";
  }
}
```

```hbs
<MyComponent @foo="override" />
<!-- override works -->
<MyComponent />
<!-- will fall back to default -->
<MyComponent @foo={{undefined}} />
<!-- alls falls back to default -->
```

This is the Happy Path&trade;, but because migrating existing components to Glimmer Components
require other changes as well, it isn't always immediately possible to immediately use this.

Note: I haven't made a point of this in the other examples, but assigning deafult values in
the `constructor` (or `init`) means that the default value will not get applied if arguments
change. If that's needed, use a getter instead (which can also use the `this.args` API).

```js
import Component from "@ember/component";

export default class MyComponent extends Component {
  get foo() {
    return this.args.foo || "default argument";
  }
}
```

## Template Only Components

All of the examples above assume that the template for `MyComponent` uses `this.foo`. However,
components that do not have a backing JS class do not have any of these problems. There is no
official API for default valuea of arguments in Template Only components at the moment, but
one possbile solution is to use the `or` helper from `ember-truth-helpers` (or define your own)
to do something like this:

```hbs
<h1>{{or @foo "default arg"}}</h1>
```

```hbs
<MyComponent @foo="override" />
<MyComponent @foo={{undefined}} />
```

Other approaches for an "official" API are being discussed in Discord, but there is no conclusive
solution yet.

## Conclusion

These are the places I reference when I get confused:

- The Octane cheatsheet: [https://ember-learn.github.io/ember-octane-vs-classic-cheat-sheet/](https://ember-learn.github.io/ember-octane-vs-classic-cheat-sheet/)
- A page in the ember-decorators addon docs: [https://ember-decorators.github.io/ember-decorators/docs/native-class-basics](https://ember-decorators.github.io/ember-decorators/docs/native-class-basics)
- Native classes primer im the Octane preview guides: [https://octane-guides-preview.emberjs.com/release/working-with-javascript/native-classes/](https://octane-guides-preview.emberjs.com/release/working-with-javascript/native-classes/)

This is a pretty basic thing that has caused me a lot of confusion as I move my app towards Octane
paradigms. I think the future is bright but the path to upgrade is also long and covered in peril.
This post probably does not cover all the possible variations of default values in component instances.
If you think of more let me know and I'll add them here!

[1]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Class_fields
