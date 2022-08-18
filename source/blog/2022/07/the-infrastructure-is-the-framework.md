---
title: The Infrastructure Is The Framework
date: 2022-07-05
tags: programming
---

Last week at the [San Francisco Vercel meetup][7], [Malte Ubl][6] was talking about exciting
things in the future of frontend engineering. Next.js 12.2 had just launched the same day
with [Layouts and Nested Layouts][1]. Coming from an Ember.js background that has
had routing and [nested routing forever][2] (albeit with [longstanding, thorny issues][4] and
[usability problems][5]), I had skimmed past this announcement, but a particular piece
of Malte's answer stuck out to me as one of the most innovative things I'd heard in a long time.

One of Vercel's value propositions is to easily deploy websites to "The Edge". Generically,
that means deploying to datacenters around the world so that requests from end users around
the world can be delivered with the lowest possible latency. Latency is a function of geographic
distance, so the closer the datacenter is to the website visitor's location, the faster the website
can be delivered.

But most websites need data. And data lives in databases that *don't* live on The Edge
(because replicating data is a hard problem). If a website is delivered from The Edge network, but it
needs to fetch data from some centralized location, it adds latency *back* into equation. For
example, let's say I visit a web page from India, and this web page requests some data during a
server-side render, but the data is in a US data center. The latency avoided by routing the
request to a datacenter at the Edge is hamstrung by the latency *added* by the data request.

<figure>
    <picture>
        <source srcset="/images/blog/edge-network.webp" type="image/webp">
        <source srcset="/images/blog/edge-network.jpg" type="image/jpeg">
        <img src="/images/blog/edge-network.jpg">
    </picture>
    <figcaption>
        Drawn with <a href="https://tldraw.com" target="_blank">tldraw.com</a>
    </figcaption>
</figure>

So how do we solve this? Generically speaking, there isn't a good answer. Web authors need to
carefully measure the tradeoff between keeping the user close to the web server, or keeping the web
server close to the database server.

Malte talked about how Next.js Layouts *could* enable Vercel to intelligently split a website
such that the outer layers (the "skin") could be deployed to the Edge, but the "meat" of the website
could live close to the data. In other words, a Next.js website deployed on Vercel could deliver
the *static* part of the website instantly from the Edge, improving First Paint timings, but then
deliver specific data-heavy parts of the page from datacenters close to the database servers. 🤯🤯🤯

In response, [Theo][3] pointed out that this seemed like a very complicated solution to avoid
talking about delivering data to the edge. (And when can we have that, please?) There
aren't any clear answers to that yet, sadly, but the idea of using templating layouts to draw
boundaries between datacenters felt Cutting Edge&#8482; to me.

---

I've recently accepted a job at Vercel to work on Turborepo (consider this a disclosure for this post?).
While talking to folks at the company about how Vercel can differentiate themselves from other
platforms, I heard several times that tightly integrating Next.js the framework with Vercel the
platform can create some pretty unique products for end users. At the time of these conversations,
I didn't really understand this integration. Incremental Static Regeneration was brought up as an
example, but ISR didn't particularly seem like a Next.js specific feature. I didn't understand how
this integration was unique to Next.js and Vercel. This comment (perhaps just an idle thought from
Malte) brought the philosophy home for me, and I think that's the real story here.

The idea that the infrastructure is _part_ of the web framework's design is really exciting. My
tiny, feebly brain can't think of any other integrations yet, but I *can* grasp the paradigm
shift here. We've come a long way since developer teams handed their code over to an Ops team
to deploy their code, to when "devops" became a thing, to "infrastructure expressed alongside code",
and now to this world where infrastructure is an integral part of how you think about your code.

[1]: https://nextjs.org/blog/next-12-2#layouts-rfc--advanced-routing-support
[2]: https://guides.emberjs.com/release/routing/rendering-a-template/
[3]: https://twitter.com/t3dotgg
[4]: https://github.com/emberjs/ember.js/issues?q=is%3Aopen+is%3Aissue+label%3A%22Router+Bugs%22
[5]: https://www.mehulkar.com/blog/2019/12/post-octane-ember-routing/
[6]: https://twitter.com/cramforce
[7]: https://twitter.com/nutlope/status/1542927703166181377
