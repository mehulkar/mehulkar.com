---
title: Site Performance Improvements
date: 2020-01-02
tags: programming, frontend, meta
---

I have been saying for years that I'm going to dive deeper into web performance, but each time I
tried, I found it too complicated and gave up / lost interest. I think the problem was that I would
read some articles and then not know how to apply it or measure any changes. This time,
I decided to start with my own website, even though it's a very simple static website.

## Tech Stack

-   HTML: This site is built using [Middleman](http://middlemanapp.com/), a Ruby-based static site
    generator, and it works great.
-   CSS: The site loads normalize.css and tachyons.css, both of which I just
    copy-pasted into my source code, rather than loading from CDN or NPM module/RubyGem or something.
    It also loads a syntax highlighting stylesheet using the `middleman-syntax` gem and a embedded ruby
    stylesheet.
-   JS: There is a tiny bit of JS that sets the Copyright year in the footer, and a Google Analytics
    script.
-   Fonts: The site downloads two fonts from Google Fonts and also the Font Awesome font.
-   Images: Images in subpages / blog posts are deployed as part of the site's bundle and loaded from
    the same domain, but there is one image from my Gravatar profile also.

## Improvements

Here are a set of things I played around with:

1. Replace Font Awesome with custom SVG

    I used to default to installing Font Awesome for icons, so it's on this site too, but I noticed
    that I was only using two icons here: the Twitter logo and an "envelope" icon for an email link.
    I downloaded the SVG icon from [Twitter Brand Resources][2] and used Sketch to create a simple envelope icon.
    Both of these icons looks a little worse, but I don't really care and it would be easy to improve them
    in a future iteration. The SVG from twitter brand resources also adds a background to the icon, which I could
    probably edit out from the SVG, but I didn't care too much about that either.

1. Resource Hints to Google Fonts and Gravatar

    Added `preconnect` Resource hints for Google Fonts and Gravatar. I'm not yet sure if this actually
    had an impact, but it's supposed to tell the browser to establish a connection with 3rd party
    hosts earlier so that so when requests are actually requested, DNS resolution and SSL handshakes
    are already done. I think in my case, both these requests are made pretty early, so it didn't make
    a big difference.

    ```html
    <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin />
    <link rel="preconnect" href="https://gravatar.com" crossorigin />
    ```

    I learned about what these mean from this post: <https://www.keycdn.com/blog/resource-hints>.

1. Precompile vendor styles (normalize, tachyons, and syntax highlighting into one stylesheet

    A confusing thing about `@import` in SCSS is that `@import 'foo.css';` acts like a CSS
    import statement, and is requested at runtime, whereas `@import foo;` acts like a SASS
    import, meaning that the style is imported and inlined at build time.

    I previously had this setup.

    ```erb
    <!-- HTML layout file -->
    <%= stylesheet_link_tag "all", "syntax" %>
    ```

    ```scss
    // all.css.scss
    @import "vars";
    @import "vendor/normalize.css";
    @import "vendor/tachyons.css";
    @import "flex";
    @import "post";
    ```

    ```erb
    // syntax.css.erb
    <%= Rouge::Themes::Github.render(:scope => '.highlight') %>
    ```

    This setup resulted in four CSS requests. One for the compiled `all.css`, which would
    then load `normalize.css` and `tachyons.css`, and then another one for the compiled `syntax.css`.

    Thinking about it a little bit, I reduced these two requests:

    ```erb
    <%= stylesheet_link_tag "vendor", "app" %>
    ```

    ```scss
    // vendor.css.scss
    @import 'vendor/normalize';
    @import 'vendor/tachyons';
    <%= Rouge::Themes::Github.render(:scope => '.highlight') %>
    ```

    ```scss
    // app.css.scss
    @import "vars";
    @import "flex";
    @import "post";
    ```

    I could have reduced farther to a single stylesheet, but I read somewhere that because
    vendor dependencies don't change that much, and because static assets in production are
    hashed filenames for caching / cache busting, it's good to keep vendor assets hashed independently
    so users can take advantage of thier local caches.

1. Google Fonts stylesheets

    Another mistake I was making was to use `@import` to load Google Fonts:

    ```css
    @import url("https://fonts.googleapis.com/css?family=Indie+Flower");
    @import url("https://fonts.googleapis.com/css?family=Libre+Baskerville");
    ```

    I changed this to load both fonts in a single request and using `link`, rather than `@import`
    [which blocks parallel downloads][3].

    ```html
    <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Indie+Flower|Libre+Baskerville"
    />
    ```

1. Download smaller profile image

    Another trivial optimization was to replace the 300px Gravatar image to a more appropriate 80px size.
    I considered using `srcset` to optimize this for different screen reoslutions, but simply
    decided the extra 2kb saving wasn't worth it.

1. Inlined scripts

    I previously had an `all.js` file that was using the `middleman-sprockets` gem to bundle all JS files
    in `source/javascripts` together. This is fine when you have a lot of JS, but I only had a Google
    Analytics snippet and a two-liner that sets the copyright year in the footer. I removed the `all.js`
    and put both these scripts in the `<head>` section of my HTML layout file.

    In doing this, I also updated the Google Analytics snippet, which seems to have added another request
    to some Google Site Manager. I am not sure what that is, but it seems like a generally good idea
    to use the latest snippet recommended by the service that provides the snippet. I'll have to look
    into what the difference is at some point

## Waterfalls

Here's are the WebPageTest waterfalls from before and after on Mobile - Slow 3G using the "Simple Testing"
option on <https://www.webpagetest.org/easy.php>.

**BEFORE**

[![WebPageTest Before](/images/mehulkar-webperf-before.png)](/images/mehulkar-webperf-before.png)

**AFTER**

[![WebPageTest After](/images/mehulkar-webperf-after.png)](/images/mehulkar-webperf-after.png)

I am not great at reading these charts yet, but I skimmed through [this post by Matt Hobbs][4] to
get my bearings, and saw a couple things that confirmed that the steps I took above actually did
something:

-   The thin yellow line marking DOM Interactive went from ~5.1 seconds to ~4.4 seconds.
-   The blue line marking "Document Complete" went from ~9.5 seconds to ~8.5 seconds
-   Number of requests went down from 15 to 11.

One other more nuanced things that I noticed is that CSS downloading from Google Fonts now starts
at the same time as all the other CSS.

## Forward

Looking at that chart, it looks like the next main thing holding up DOM Interactive is the Google Fonts
CSS and a large part of that is DNS, Connection, and SSL. I wonder if the `preconnect` resource hint
might be making this more complicated than it should be? Or maybe I should inline the `@font-face`
directives that are in this stylesheet. Any breaking changes from Google would break the site, but
that would probably not be the end of the world, since fallback fonts are a thing.

[2]: https://about.twitter.com/en_us/company/brand-resources.html
[3]: https://www.keycdn.com/blog/css-performance
[4]: https://nooshu.github.io/blog/2019/10/02/how-to-read-a-wpt-waterfall-chart/
