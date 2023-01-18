---
title: Hydration
date: 2023-01-18
tags: note, response
---

Henry's article "How to make a website" had this little, innocuous fragment:

> We’ll hydrate our markup with CSS as needed

[source](https://henry.codes/writing/how-to-make-a-website/)

In the Modern Frontend landscape, "hydration" is typically referring
to attaching event listeners to server-side rendered HTML and updating
in-memory data structures that reflect the "state" of the application based on some serialzed
data from the server.

It was refreshing to hear someone refer to adding CSS as "hydrating" HTML. (And no, we aren't
talking about CSS-in-JS implementations that are fetched as JSON or JS and applied as classes
on the client!)

This casual fragment reinforced for me the idea that the HTML _document_ is the content,
CSS is a layer on top, and JavaScript is the interactivity layer.
