---
title: Webmentions Test
date: 2023-01-02
tags:
---

This post tests _sending_ webmentions. I've set it up by using IFTTT to send an ping to [webmention.app][1]
when a new post is published. IFTT will wait for new items in my RSS feed.

webmention.app is made by [@rem][7]. He first described using it in [this post][2],
so in the theme of meta posts like my recent ["test suite"][3], maybe I can test sending his website
a mention too!

## Test Links

These links below are for the official/unofficial test suite on [webmention.rocks][4]. By
including them here, the setup above should send a mention to that site (eventually), and
_this_ post should show up on those pages.

<a href="https://webmention.rocks/test/1">Test 1</a>
<a href="https://webmention.rocks/test/2">Test 2</a>
<a href="https://webmention.rocks/test/3">Test 3</a>
<a href="https://webmention.rocks/test/4">Test 4</a>
<a href="https://webmention.rocks/test/5">Test 5</a>
<a href="https://webmention.rocks/test/6">Test 6</a>
<a href="https://webmention.rocks/test/7">Test 7</a>
<a href="https://webmention.rocks/test/8">Test 8</a>
<a href="https://webmention.rocks/test/9">Test 9</a>
<a href="https://webmention.rocks/test/10">Test 10</a>
<a href="https://webmention.rocks/test/11">Test 11</a>
<a href="https://webmention.rocks/test/12">Test 12</a>
<a href="https://webmention.rocks/test/13">Test 13</a>
<a href="https://webmention.rocks/test/14">Test 14</a>
<a href="https://webmention.rocks/test/15">Test 15</a>
<a href="https://webmention.rocks/test/16">Test 16</a>
<a href="https://webmention.rocks/test/17">Test 17</a>
<a href="https://webmention.rocks/test/18">Test 18</a>
<a href="https://webmention.rocks/test/19">Test 19</a>
<a href="https://webmention.rocks/test/20">Test 20</a>
<a href="https://webmention.rocks/test/21">Test 21</a>
<a href="https://webmention.rocks/test/22">Test 22</a>
<a href="https://webmention.rocks/test/23/page">Test 23</a>


## Receving Webmentions

I've also setup receiving webmentions by:

1. Signing up on [webmentions.io][5] to create an endpoint that can receive and store mentions for me
2. Adding a `link[rel=webmention]` element with this endpoint, so anyone _sending_
    webmentions can discover it.
3. Signing up on [Bridgy][6] so any mentions on twitter and Mastodon will first discover the endpoint
    from each post and then send the webmention.

[1]: https://webmention.app/
[2]: https://remysharp.com/2019/06/18/send-outgoing-webmentions
[3]: /blog/2022/12/a-test-suite-and-design-system-for-my-blog/
[4]: https://webmention.rocks
[5]: https://webmention.io
[6]: https://brid.gy/
[7]: https://remysharp.com
