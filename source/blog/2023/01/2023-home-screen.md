---
title: "2023: Home Screen"
date: 2023-01-11
tags: home-screen
---

I haven't written one of these [since 2020](/blog/category/home-screen), so I'm excited to see
what's changed since then. My main observation is that my home screen is a total mess. And right now, I'm ok with that.

![2023 home screen](/images/2023-home-screen.PNG)

## Home Row

- Notes, Messages, and Calendar still taking prime real estate.
- [TickTick][8] replaced by Chrome, although TickTick is still on the home screen.

## First Party

Maps, Photos, Phone, Music, Podcasts all make an appearance.

It's a bit weird, because I almost never launch Music and Podcasts from here
anymore. Now that I'm working from home permanently, music is pretty much always
"Hey Siri, play some music". I'm not a fan of this UX in the long term, but
that's how it is.

News.app is also still there, but hidden inside a Reading folder that I almost never
open.

## Folders

It looks like I used Folders quote a bit in 2020 also, but I know I tried to stop doing this
in the last couple of years. Interesting to see that they've come back.

- Reading

    I almost never open this, to be honest. The one thing I _do_ read on these
    days is Feedly, and that's on the homescreen directly. Feedbin is there too,
    because the Feedly app is frankly terrible, but Feedbin doesn't have the
    ability highlight and save portions of articles, so I can't fully switch.

- Mastodon

    I've been trying out and enjoying Mastodon like everyone else, and it's been fun
    to try out different clients. Follow me on [`@mehulkar@indieweb.social`][4].

- Baby

    Contains Reddit (for [/r/newborns][5]); TinyBeans for photo sharing with family;
    1SE to try to capture the first year; and MyChart for doctor's visits, test results etc (IFYKYK, I guess).

- Home

    I recently got some [Kasa Smart Plugs][3] and have been plugging lamps into it.
    That way we can say things like "Hey siri, turn on the diaper lamp" when it's 3am
    and the "shit is hitting the fan".

## PWAs

I like seeing installable home screen apps in the wild, so there's an assortment here:
[National Weather Service](//mobile.weather.gov), [Google Finance](//google.com/finance), [SuperCuts](//supercuts.com), and [Etsy](//etsy.com).

- I learned that the NWS PWA exists because [lobbyists won't let the government make a native app][6]. Yay for the web?
- Google Finance just because I discovered that it's installable as a standalone app;
I never open it. I need to delete it.
- SuperCuts because that's where I get my hair cut and you need to check in when you go there to get in line. It's pretty solid, actually.
- Etsy because I _want_ to make it a browsing destination, but it's not an installable app ([yet?][7]), so it launches Safari. I need to delete it and try again later.

And a not-so-random PWA: Sofia. It's a web "app" I made to track the baby's feeding and diapers. I say "app" in quotes, because it's an `index.html` that uses [`htmx`][2] with a `<script>` tag to make requests to serverless endpoints that read/write from Google Spreadsheets. Not the most innovative, but it worked well for us
in the last few weeks.

## Other Stuff

- Safari is replaced by Chrome

    I don't love it yet, but [migrating][1] was pretty easy.

- 1Password and Authenticator on the home screen.

- Standard Notes

    I haven't used this yet, and I'm not sure I want to make a deep dive into
    note taking, the way everyone seems to be doing right now, but I got the app
    recently and it's there, waiting for me.

- MyAudi

    There's really no reason for this to be on the home screen other than to remind
    myself that our new car has an app.


[1]: /blog/2022/12/how-to-transfer-safari-tabs-to-chrome-on-ios
[2]: /blog/2022/12/first-developer-experience-with-htmx
[3]: https://a.co/d/ah5DL9p
[4]: https://indieweb.social/@mehulkar
[5]: https://reddit.com/r/newborns
[6]: https://www.forbes.com/sites/marshallshepherd/2019/08/12/why-doesnt-the-national-weather-service-have-a-weather-app/?sh=47dea34658a8
[7]: https://indieweb.social/@ksylor@mastodon.social/109659279043544292
[8]: /blog/2023/01/ticktick
