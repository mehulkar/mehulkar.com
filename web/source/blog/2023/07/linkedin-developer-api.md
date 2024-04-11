---
title: LinkedIn Developer API
date: 2023-07-18
tags:
  - programming
  - api
---

I had the inspiration to build an app today and after a couple hours, I'm giving up.

I wanted to fetch a random LinkedIn connection, and take a couple actions on it:
if I remembered who it was, write a little note and save it, if I didn't, delete
the connection. I thought this would be a fun little game I could play in idle
moments and also use it as a way to reconnect with people I had lost touch with.

To make this app, I'd need to:

1. sign in with LinkedIn
2. fetch my connections
3. store "notes" some data somewhere
4. send a delete request for a particular connection

When I started, I had no idea how I would do any of these things, but I assumed LinkedIn would have
a sufficient API to sign in and fetch/delete connections.

I started by creating a new repository with an `index.html`. I used `vercel dev` to serve this
HTML, because I knew from past experience that auth flows from third party services
don't work on `file://` URLs, and that I'd need a server for an OAuth flow, so serverless
functions would be nice. I added a Sign in button:

```html
<a href="linkedin.com/somethingsomething">Sign in</a>
```

I read [the Authentication guide][1] on LinkedIn's Developer portal (which was
surprisingly easy to follow), and updated my Sign in link to point to the correct
URL with a `redirect_url` param pointing to `/api/auth-callback`.

Turns out, you need to create a Linkedin _Company_ page to setup an Developer App
to get the OAuth client ID and secret. This was a bit annoying, but I created
[one with the minimal amount of details][2] needed.

I set up the client ID and redirect URL on my sign in link:

```html
<a
  href="https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id={redacted}&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth-callback&state=foobar&scope=r_liteprofile%20r_emailaddress"
>
  Sign in
</a>
```

but shortly after, I realized that while a serverless function would be a collect the information I
needed from the auth process, I wouldn't be able to do anything after that. I needed to be able to
redirect somewhere.

Enter [middleware][3].

Some grappling later, I ended up with some working code that redirected to `/` with a query
param `?token=${token}`. (This was not meant to be right, I just wanted to get access to
the token so I could make real requests).

The grappling involved originally reading a page of docs that only included Next.js example
code, so I couldn't figure out how to do a redirect. But it was user error, I had landed on
a random docs page instead of starting from the Overview page that linked to the Middleware API.

<details>
<summary>See middleware code</summary>

```js
export const config = {
  matcher: "/auth-callback",
};

export default async function (req) {
  const reqURL = new URL(req.url);
  const { searchParams: params } = reqURL;
  if (params.has("error")) {
    return Response.redirect(new URL("/?failed=true", req.url));
  }

  const code = params.get("code");

  let token;
  try {
    // hand wave over next step
    token = await getToken(code);
  } catch (e) {
    // nothing
  }

  if (!token) {
    return Response.redirect(new URL("/?failed=true", req.url));
  }

  return Response.redirect(new URL(`/?token=${token}`, req.url));
}

// get token using authCode
async function getToken(code) {
  const queryParams = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    client_id: "{redacted}",
    client_secret: "{redacted}",
    redirect_uri: "http://localhost:3000/auth-callback",
  });

  const res = await await fetch(
    `https://www.linkedin.com/oauth/v2/accessToken?${queryParams}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  const json = await res.json();
  if (res.ok) {
    return json.access_token;
  }

  throw new Error("Failed", json.error);
}
```

</details>

This took at least an hour or so, but then I found out that the basic
provisioning I had set up for my Developer App only had access to a `/me`
endpoint that did not include my connections. Grappling through Linkedin
"Products", which enable access to "scopes", which grant permissions to
endpoints, I saw that there was no way to get the `/connections` endpoint. The
two Products that gave me access to that endpoint were the "Advertising API" and
the "Community Management API". I could request access to the former by filling
out a form (No thanks), but the latter wasn't even request-able.

So I finally hit a dead end and gave up. Maybe I'll try it again some day with
web scraping instead.

[1]: https://learn.microsoft.com/en-us/linkedin/shared/authentication/authentication
[2]: https://www.linkedin.com/company/my-little-company-123
[3]: https://vercel.com/docs/concepts/functions/edge-middleware/middleware-api
