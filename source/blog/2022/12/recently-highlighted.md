---
title: Recently Highlighted
date: 2022-12-11
tags:
- indieweb
- 11ty
- rss
- meta
---

I've started reading more on the internet via RSS using the Feedly RSS client. Feedly has a feature
that lets me highlight parts of articles I like, and I thought it was a good note-taking tool.

This site has a section on the homepage where I display ["recent" things](/#recent) (e.g. Watched movies
from [LetterBoxd](//letterboxd.com/mehulkar) or [Liked tweets](https://twitter.com/mehulkar/likes)),
and I wanted to add in recent highlights from Feedly. (Feedly calls them annotations, becuase
you can take notes on entire articles also, rather than just highlight portions and it's modeled
the same.)

Turns out this was pretty straightforward using Feedly's developer API. In the same pattern
as the other parts of the "Recently" section, I wrote a [Vercel serverless function](https://vercel.com/docs/concepts/functions/serverless-functions) to fetch from the API:

1. Request for recent annotations. By default I get 20, which is enough
2. Shuffle up the array and use the first one
3. Fetch the related entry using the `entryId` key in the response
4. Synthesize the data into:

    ```json
    {
        "text": "the highlighted text",
        "originUrl": "https://...",
        "originTitle": "title of post that I highlighted"
    }
    ```
1. Return the data

On the client, I have some empty elements on the 11ty-generated page already. I added a `window.fetch`
request in a `<script>` tag and when the response comes back, and some good old-fashioned
`document.getElementById().innerHTML = ""`. There are no fancy components or loading states.
There's a little bit of layout shift when data loads, but I put this markup in a `<aside>` so I don't
expect it to affect UX too much. The whole snippet is:

```javascript
fetch("/api/feedly-annotation").then(res => res.json()).then(data => {
    const { text, originTitle, originURL } = data;
    const element = document.getElementById('feedly-annotation');

    element.querySelector('blockquote').innerHTML = `<p>${text}</p>`;

    if (originTitle &&  originURL) {
        element.querySelector('blockquote').setAttribute('cite', originURL);
        element.querySelector('cite').innerHTML = `<a target="_blank" rel="noopener noreferrer" href="${originURL}">— ${originTitle}</a>`;
    }
})
```

Some things about the Feedly API:

- The `/annotations/journal` endpoint returns entries with both an `_annotation` and `annotation` key.
I'm not sure why, as the data seems identical.
- The Developer Access Token expires in 30 days, and I'm not sure how to use the Refresh Token to get
a new one. I'll have to figure it out some time later.

The whole project took maybe 3-4 hours, but the fetch + render pattern was already set, so I didn't
have to re-invent anything. You can see it in action on the [homepage](/#recent) of this website.

You can see the implementation [on Github here](https://github.com/mehulkar/mehulkar.com/pull/52).
