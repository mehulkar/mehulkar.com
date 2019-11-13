---
title: Ember Services
date: 2019-10-24
categories: frontend, ember
---

Ember’s established pattern of Components for short-lived state and Services for long-lived
state has been working brilliantly for me since Ember 2.0 was released. But there are a couple
of emerging patterns that need to be addressed.

## Tight Coupling with Components

Some services exist solely to manage some long-lived state between component renders. For example:

1. Components that want to keep track of the number of times they were rendered
1. Components that can be rendered from multiple places and need to coordinate their trigger points (e.g. modals)
1. Components that need to coordinate multiple instances of themselves on the same page

Whatever the pattern, there are many possible use cases of this and it’s currently difficult to express this in Ember. Services go in app/services, Components go in app/components.

What would make a lot more sense is a component that defines and registers a Service independently. Something like this would ideally work:

```js
// app/components/foo.js
import Component from '@ember/component';
import Service from '@ember/service';

class MyPrivateService extends Service {}

let registered = false;

export default class FooComponent extends Component {
    service = null;

    constructor(owner) {
        if (!registered) {
            owner.register('service:-my-private-service', MyPrivateService);
            this.service = owner.lookip('service:-my-private-service');
        }
    }
}
```

I have not tried this code, so I’m not sure if it works, but an experienced Ember
developer may understand the intention. There are several shortcomings with this
approach (assuming it works):

- The registered `my-private-service` service is still in the application instance container,
so after this component is instantiated once, it will be available for anyone. In fact it my
just be confusing why it doesn’t appear in the container from the beginnig like all the other
classes in app/services.
- There is no explicit inject call, which breaks the normal Ember pattern of dependency injection;
- It is probably not statically analyzeable. This one is probably fine.

I’m not sure if this is the only way to approach the problem of tightly coupled
components + services. Another possibility could be using a global store with namespaced
slots for components to store state, a la Redux and reducers.

## Services as function buckets

I often see Service classes used to group together functions that seem to belong together.
In many cases, these functions don’t hold any state, and therefore don’t need to be in
services. Although it is not Ember’s responsibility to discourage this (and using this
pattern certainly isn’t wrong), the common alternative to Services is an app/utils
directory with modules that export functions. There are a couple problems with this. First,
`app/utils` is not part of the new app blueprint. Second, once you have this directory, it is
largely up to the developer / team to decide how to organize this directory, and that can get out
of hand pretty quickly.

I don’t think there is a good solution to this problem, but I think Ember can offer more guidance
about when to use a Service, and what it is useful for.

## Services as Initializers

Our team uses this pattern a lot:

```js
// app/services/foo.js
export default Service.extend({
    init() {
        this._super(...arguments);
        window.addEventListener('custom-event', this.handleEvent);
    },

    handleEvent: action(function() {
        // handle the event
    })
})

// app/instance-initializers/eager-init.js
export function initialize(appInstance) {
    appInstance.lookup('service:foo'); // eagerly instantiate the service
}
```

Setting up event listeners in a service, and then eagerly instantiating that service
works pretty well, but there are several shortcomings to this approach:

- The timing of initializers isn’t exactly guaranteed
- The service and instance initializer files live far away from each other, so it’s not
obvious what’s happening
- Setting up a listener as a side effect of a lookup is a pretty obscure way of expressing what
is needed
- I think there are different solutions to each of these shortcomings if taken individually,
but I think the ultumate goal here is to be able to do things after boot and before destroy.
I think this pattern would be best served by something like this:

```js
// app/app.js
function customEventHandler() {}

const App = Application.extend({
    afterInitialize() {},

    beforeDestroy() {},

    afterInstanceInitialize() {
        window.addEventListener('custom-event', customEventHandler);
    },
    beforeInstanceDestroy() {
        window.removeEventListener('custom-event', customEventHandler);
    }
});
```

To be clear, this post is not so much about “problems” with what exist, but about
improvements to Ember paradigms based on the patterns I’ve seen over the last ~7 years of
Ember development. Ember as a framework has always been invaluable in guiding developers
to fall into the “pit of success”. With Octane, I think there are going to be a whole new
set of pits, and some new interesting patterns to define.