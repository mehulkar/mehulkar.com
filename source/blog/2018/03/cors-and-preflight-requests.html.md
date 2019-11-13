---
title: CORS and Preflight Requests
date: 2018-03-09
categories: programming, frontend
---

As a frontend developer, it's pretty common to deal with Cross Origin Resource Sharing, or CORS.
In the past, I have pretty thoughtlessly used `*` configuration on my backend servers to allow
all Javascript clients the ability to make all types of requests to my backend APIs. That means that
I've never taken more than a cursory look at how it all works.

Last week, I learned that I had been making some assumptions that were not true (and were not
immediately clear to me from reading the MDN documentation).

## What I Learned

I learned that it is possible for a server to respond to a preflight `OPTIONS` request with all the
appropriate headers that whitelist the *real* request, but then respond to the *real* request with
a different set of headers, and thoroughly confuse everyone.

The big reveal is that an `OPTIONS` request isn't coupled to the *real* CORS request at all. It is
the browser that maintains the connection between them.

This seems obvious in retrospect, because a stateless server will not have any way to connect an
`OPTIONS` request to the followup real request, so it has no obligation to respond to a CORS
request in a way that matches its response to the preflight request.

## My Understanding Before I Learned This

Previously, I thought that the entire purpose of an `OPTIONS` request was to enable a CORS request.
I assumed that if an `OPTIONS` request came back with the appropriate headers, the CORS request
would be whitelisted and all would be well.

But consider this scenario:

1. Javascript triggers a CORS GET request
1. The browser sends a preflight request to the server
1. The server responds with 200 OK and the following headers:

    ```http
    HTTP/1.1 200 0K
    Access-Control-Allow-Origin: *
    Access-Control-Allow-Methods: GET
    Access-Control-Allow-Headers: *
    Access-Control-Expose-Headers: *
    ```

1. The browser sends the GET request
1. The server responds with a 200 and the following headers:

    ```http
    HTTP/1.1 200 OK
    Access-Control-Allow-Methods: GET
    Access-Control-Allow-Headers: *
    Access-Control-Expose-Headers: *
    ```

Notice that the `Access-Control-Allow-Origin` header is missing from the GET request.

This means that although the preflight request told the browser that the CORS `GET` was okay
to send, the server "changed it's mind" about it on the real `GET` request. This is uncommon and
most likely a server bug, but it *is* possible.

Until now, I thought that the CORS related response headers on the `GET` request didn't matter!
I assumed that if the `OPTIONS` request permitted the `GET`, then all was ok.

I was wrong. If the server doesn't whitelist the origin for a request, Javascript cannot read the
response to the request.

## Understanding More

To understand this more, I read the [MDN documentation][MDN DOCS] on CORS (which is really good), and learned
that not *all* CORS requests require a preflight request. These are called "simple" requests.

A good followup question from this nugget information would have been: if the `OPTIONS` request is
responsible for notifying the browser about CORS rules maintained by the server, how do simple
requests get those rules?

This makes it easier to debunk my working understanding of CORS. The rules of CORS are PER request,
and the `OPTIONS` request is simply a way for browsers to abort requests prematurely.

## More reading

- [MDN Docs on CORS][MDN DOCS]

[MDN DOCS]: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
