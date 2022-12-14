---
title: One Hour With Enhance.dev
date: 2022-12-13
tags: programming, frontend, web
---

I wanted to build a web form that sends data to a google spreadsheet, and had recently came across
[Enhance](https://enhance.dev). I was immediately attracted its promise of "it's just HTML" and
web components, so I spent ~an hour with learning the basics by reading the [Quick start](https://enhance.dev/docs/)
docs and watching the three video walkthroughs. Seemed simple enough! Enhance ships with:

1. File based routing, where an API route matches the "server render" based on file name.

    For example: `app/pages/index.html` is preceded by `app/api/index.mjs` and data from the latter
    is made available to the former.

2. Automatic Custom Element definition and registration

    Just export a function in `app/elements/my-element.mjs` and use `<my-element>`!
    This was really nice, because `customElements.define('my-element', ...)` has always felt
    like a turn off to me. Let me write components and _you_ make them available!

This was enough to get excited and give it a shot, but I ran into a few issues:

1. `npm create @enhance ./my-app -y` threw an error:

    ```sh
    ENOENT: no such file or directory, rename '/Users/mehulkar/dev/my-app/_.gitignore' -> '/Users/mehulkar/dev/my-app/.gitignore'
    ```

    Looking at the source, the `@enhance/create` package copies a template directory.
    [Copying the `gitignore` file][1] _should_ have worked. In fact, cloning the source
    and executing the script worked fine. My guess is that `npm create` is using a cached version,
    although the `npm` debug logs do not indicate what version is executed, so I can't say for sure.
    I stopped debugging here, since the fix was pretty simple.

    This was a pretty small issue, but as a first experience it seemed like I wasted a bit too much
    time on fixing it.

2. Phantom styles.

    I added an `<h1>` tag and deleted all the existing boilerplate, and noticed that heading styles
    had all been normalized. Browser dev tools showed that this came from `.enhance/generated.css`,
    so I deleted that and all the contents of `public/styles.css` (which I assume was the source),
    but on `npm start`, the normalization styles came back! I'm not sure why.

3. Missing `build` command.

   The docs say that [Enhance uses][2] [Architect][3], which I am not familiar with. I was hoping
   that I could look at the phantom styles issue by debugging `npm build`, but since the starter template
   doesn't include this, I couldn't.

    To be fair, it doesn't look like Enhance builds static sites by default or even "serverless"-style
    sites, so a `build` command may not make sense and this could be have been a choice.

4. All rendered elements get state.

    I didn't get far enough to actually try this out, but it felt a little weird that a `page` is part
    of the lifecycle after the api route, but intnernal _elements_ receive the json "store" returned
    by the API. It seems a big magical.

    The docs also mention that Pages can be modeled as elements, but that isn't recommended. Maybe
    that pattern would feel more natural here.

5. No layout file.

    The started template doesn't include an `index.html` with a `<html>` tag and `DOCTYPE`, et al.
    It felt a little magical that I didn't know where this is coming from.

6. Deploying.

    Ideally, I'd want to deploy Enhance to Vercel. Since the framework is owned by the [Begin][4],
    and the [deploy on Begin docs][5] mention "dynamic web applications composed entirely of pure functions",
    I think this should be possible in theory, but I'm not sure how it would work. For other
    side projects, I've used 11ty to generate a static side and just have an `api/` directory to
    take advantage of Vercel's serverless functions. I'm not sure that approach would work here.

My overall impression of Enhance in ~an hour is that I'm excited by the premise and would like to
keep building my little form with it, but I'd need more than an hour to really start writing the
features for my form.

[1]: https://github.com/enhance-dev/create/blob/4d0f4c696292c0014bc16f0871066d8872f49972/index.mjs#L36
[2]: https://enhance.dev/docs/learn/practices/architect-migration
[3]: https://arc.codes/docs/en/get-started/quickstart
[4]: https://begin.com/
[5]: https://enhance.dev/docs/learn/deployment/begin
