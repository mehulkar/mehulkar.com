---
title: Issues with Github Issues Comments
date: 2023-09-20
tags: product, ux, github
---

Now that I work on an open source repository, I'm spending more time in Github
Issues for publicly reported bugs and feature requests. I genuinely enjoy issue
triage, but Github Issues have several shortcomings that make it difficult for
even me to look forward to this part of my job. Here's a list of woes:


- Quote replies are a useless feature. They don't link back to what was being
  quoted, and scrolls down when you use the UI, so you have to re-scroll back up
  to copy-paste the username of the person again if you want any kind of
  relationship to the original (and find that comment again). It would be pretty
  trivial for the Quote Reply UI button to include a markdown link to the issue
  it was clicked form along with the username.
- No threading, so you can't have specialized conversations when people
  inevitably add their unique circumstance into an issue, when you don't really
  know if it's the same thing.
- No way to move a comment into its own issue, so you have to rely on people to
  do that work
- Scrolling tens (or sometimes hundreds) of comments makes it very hard to
  follow conversations
- Collapsing comments arbitrarily in the middle makes it impossible to follow
  conversations. Much worse when you add in quoted replies, because you cannot
  use browser search to find where the quoted text came from.
- Usernames are not memorable, so you can't easily tell while scrolling that the
  _same_ or _different_ people are continuing the conversation. If they share
  letters or their avatar (Which is tiny) is similar, you can just give up now.

All public issue trackers will have some amount of noise, but I would have thought that after a decade+, the most heavily used source code host would have made improvements to this workflow for open source maintainers!
