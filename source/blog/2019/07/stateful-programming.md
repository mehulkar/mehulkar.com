---
title: Stateful Programming
date: 2019-07-01
tags: programming
---

I’ve heard people say that “state” is the cause of many bugs. This weekend,
I came across a good example of describing a stateful program vs a stateless
program that shows some of the tradeoffs.

## Scenario

You get on a bus from Home and are looking to get off the bus at Baker Street.
You can figure out when to get off the bus in a couple of ways:

1. Figure out the number of stops to Baker Street and get off after the bus has
   stopped that many times.
2. Remember the name of your stop and check every stop to see if it's that one.

If you use the first method, you'll have to remember how many stops have passed.
This is state: remembering information for use later. If you use the second
method, you'll have to pay attention every time the bus stops to see if your
stop has been reached.

## Code

Let's see if we can write this in code. We know the bus route, and we know
where we are getting on and getting off:

```js
const ROUTE = ["Before Home", "Home", "Stop1", "Stop3", "Baker Street"];
const ENDING_STOP = "Baker Street";
const STARTING_STOP = "Home";
```

And we can listen for a `stop` event to decide whether or not we want to get
off like this:

```js
window.addEventListener("stop", (stopName) => {
    // handle the event
});
```

To handle this using the stateful method, we can do something like this:

```js
// calculate the number of stops
const remainingStops = ROUTE[ENDING_STOP] - ROUTE[STARTING_STOP];

function(remainingStops) {
    this.remainingStops = remainingStops;
    window.addEventListener('stop', () => {
        if (this.remainingStops === 1) {
            alert('get off the bus!');
        }
        this.remainingStops--;
    });
};
```

And to handle this in a stateless way, we can:

```js
window.addEventListener("stop", (stopName) => {
    if (stopName === ENDING_STOP) {
        alert("get off the bus!");
    }
});
```

You can see in the stateful example, that the `stopName` at each stop
does not matter and is ignored by the event handler; the handler only cares
about the number of stops remaining. The stateless handler,
however, requires a comparison to the `ENDING_STOP` at every stop.

<aside>
<p>You can try out both of these methods by copying the code into a JS console
and then dispatching events like this:</p>

<pre class="highlight javascript"><code>window.dispatchEvent(new CustomEvent('stop'));</code></pre>

</aside>

## Tradeoffs and Insights

There are many ways for either of these programs to fail and for you to miss
your stop. But some of those ways are specific to the method you use.

For example, if you fall asleep on the bus ride and wake up when the bus is
already past Baker Street, you will have missed your stop regardless of the
method you chose. However, if you fall asleep and wake up _before_ Baker Street,
your count of "remaining stops" is now invalid, but you can still compare each
stop and reach Baker Street safely.

If you calculate the number of remaining stops incorrectly, it's
completely unpredictable what will happen, since any number of other things
could make your counter correct or incorrect. With the stateless method, it's
much more likely that you get off at the right spot.

On the other hand, the stateless method means that every time the bus stops,
you have to look outside the window to see where you are and if it's your stop.
If you forget to look up or can't look up because your coffee just spilled or
you're distracted, you could easily miss your stop. The stateful method in this
case would save you, since you could know that your counter is at 0 without
looking up.

By now, it should be fairly obvious to most people that counting down the number
of stops and looking out the window are not mutually exclusive ways of determining
whether you've reached your stop. You may use a combination of the two methods,
such as looking outside every third stop to get your bearings and revalidating
your counter. You may use heuristics such as knowing the approximate length
of the ride to determine how long you should count for, and when you should
look at where you are. You might also _optimize_ for different things: maybe
you want to read a book and it doesn't matter if you miss your stop, or maybe
you _really_ can't miss your stop today and need to be vigilant.

Another interesting insight is that whichever method you choose, it's not the
_only_ place to find the answer you're looking for. You could ask the bus driver
or a fellow passenger how many stops there are left. You could use an app to
send you a push notification when your stop is approaching. You could even just
get off at the wrong stop and walk from there or take the next bus!

## Conclusion

Our brain not only handles and processes a huge number of scenarios when doing
something as simple as taking the bus, it is also able to use a number
of different approaches to solving the same problem and merge the results
of them together. All of these approaches together is what makes the "program"
successful.

But when I write code, I rarely use more than one approach to solving the problem
(although I might explore more than one solution), and rarely handle more than
a handful of error scenarios. This isn't necessarily bad, to be fair. One reason
for this is that the amount of data available to our program is much more limited
than the amount available to our brain. Another reason is that we rely on
_contracts_ from the things external to our program. For example, we may expect
that a bus will only ever stop at one of the stops in the known route. If it
stops anywhere else, we'll get off at the wrong stop, but it won't be
"our fault"--we'll just complain to the people who own and operate the bus.

Constraints or optimizations like these are easy to understand at the time of
writing a program, but it's important to understand that they may be different
every time the program is run. Choosing to write a program in a stateful or
stateless way may depend on the constraints and desired optimizations at the
time of writing, but over time, as both of these change, unexpected behavior
(i.e. bugs), can easily appear. As this bus ride example illustrates, the most
resilient and optimal way of solving a a problem is probably a complex combination
of a stateful and stateless program. Until we can achieve that, however, the
important thing to remember is that either method on its own will have its
tradeoffs, and the job of the programmer is to figure out which tradeoff to make
at any given time.
