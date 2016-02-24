---
title: Linkedin is even less useful to me now
date: 2016-02-24
categories: design
---

Linkedin is even less useful to me now becuase they made
a silly design choice.

After you accept an incoming connection from someone,
Linkedin takes you to this page:

[![Linkedin Connections Screen](/images/linkedin-pick-up-where-you-left-off.png)](/images/linkedin-pick-up-where-you-left-off.png)

The button at the bottm "Add (xxxx Selected) connections(s)"
is placed right next to the smaller "Skip this step" link.

There are so many things wrong with this design:

1. The Add and Skip actions shouldn't be so close to each other.
Their intention is the complete opposite, so there should
never be a question as to what the user wanted
1. The Connections should not be pre-selected. Adding
connections is pretty much irreversible. Linkedin makes
it almost impossible to remove a connection (and there is
definitely no way to rescind an invitation to connect),
so "Select All" should be an opt-in, not an opt-out function.
1. The page doesn't say _where_ it found these people that
I may know. This is less of a _faux paux_, but considering
that there are 1246, I _do_ want to know if I should mass invite
them all because they came from my other networks, or if Linkedin
is slipping some suggestions of their own in.
1. The last and the biggest one is that the button text is
dynamically generated. That means that the "1246" part is being
calculated at a _different_ time then the rendering of the button
on the page. Sometimes it happens before, sometimes it happens after.
I've duplicated what happens sometimes when that number isn't loaded
and placed it below for comparison.

    [![Linkedin Buttons](/images/linkedin-button-loading.png)](/images/linkedin-button-loading.png)

    Now imagine that I wanted to
    "Skip this step" and while I was clicking, the 1246 finished loading.
    WHAT WOULD HAPPEN THEN??


    [![Linkedin New Connections](/images/linkedin-new-connections.png)](/images/linkedin-new-connections.png)


  Now I have a very large number of new connections, none of whom I intended to
  add. And more importantly, I don't _know_
