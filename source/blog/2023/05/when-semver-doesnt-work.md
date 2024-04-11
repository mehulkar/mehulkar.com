---
title: When SemVer doesn't work
date: 2023-05-21
tags:
  - programming
---

It's Friday evening and you're working on a piece of code that you're pretty
happy with. You've had a couple of Ollipops. You had no meetings today so you've
got some heads down time, and you're ready to hit `npm publish` on your library.
You run your tests, commit your code, and push it up to Github which will
automatically publish to the registry. It's a breaking change, so you make sure
you mark it as a major version upgrade (because you are a SemVer diehard and screw
the fact that you're already at v17, numbers are cheap!)

But a second after that publish log comes in, you realize that instead of
starting your branch from `main` (like your friend Mehul who's obsessive about
this stuff), you started from another feature branch and now, in your happy daze,
you've accidentally published a feature that wasn't supposed to be published.
It's not supposed to be announced until next week with the big Twitter ad spend
you had lined up for it! Heck, it doesn't even work quite right yet! This is a
disaster.

No worries, you're smart, you can figure this out. You'll just revert your
commit and publish another version. No big deal. Just need to figure out what
that new version will be. There was a breaking change, but also a new feature in
v17, so even if you just do a partial revert and remove the new feature, you'll
technically have another breaking change on your hands. Just publish a v18 then?
That's going to cause all sorts of questions. For example, you have a new
automated dependency update system that triggers a new ticket when new major
versions are created. It's not a big deal, but a bunch of people will have that
ticket notification sitting in their inbox Monday morning. Do you really want
them to know you published two major versions in a night? Does that look
incompetent?

What if you quietly publish a v17.0.1 and, in the changelog, simply claim that
"fixed bad merge that included other code" and hope nobody looks at the diff?
It's plausible, you guess. And technically, it _is_ "a bug" that you included
code from another branch in your code, right? But is a bug in _you_, the same as
a bug in _the software_?? You pore over the SemVer spec trying to answer these
existential questions for a bit, before realizing this is silly.

You can just _deprecate_ v17 instead and publish a v17.1.0? A deprecation is
like saying "erronous publish", right? So you don't really have to explain
anything in the changelog. Just say it never happend and you'll be ok. Nobody
will look twice at it, people are busy after all.

But then you remember that lab your software runs in that has an auto update
script pulling down `@latest` version of your software, and running it every 15
minutes. You check your watch. Has it been 15 minutes already? So what if it
has. Is the addition of the new feature and then the removal going to break the
lab? Does v17 do anything to those machines that a v18 would now then have to
check for? It's the weekend, pretty much. Paging an automation lab engineer
because the 48-hour script they expected to complete over the weekend is
breaking their lab and they need to come in to restart all their machines and
individually reinstall `yourpackage@v16` and run some manual commands, is
like... well it's exactly what it sounds like. It's bad. Or they'll come in
Monday and probably start an only-slightly-veiled Slack thread about how this
was slightly inconvenient and there should really be a retro to figure out how
to avoid this from happening again. Maybe you don't want to take that chance and
just wait till Monday to figure out what to do. Nobody will see what happened on
Friday until Monday anyway right?

Except your Israeli coworker will be working Sunday, which is&mdash;you quickly ask
~~google~~ ChatGPT&mdash;Saturday evening in your timezone, and they'll surely pull
down the latest installation and, best case scenario wonder what happened, or
worst case scenario, lose half a day asking yarn why (why yarn, just why??)

Can you message the support team for the registry and just cross your fingers
that they can unpublish v17? They typically have a pretty strong policy
against unpublishing, "immutable this and that". But you could explain your
situation with the no-meeting Friday and the Ollipops and what not, and maybe a
kind human will look at you, another kind human, and help you out. That could
take 24 hours, but maybe, just maybe you'll beat the Israeli work week in the
nick of time.

If _only_ you didn't have that `postpublish: "git push --follow-tags"` script
that hadn't pushed the git tag back to Github from CI yet already. Is there any
automation that would have been triggered by that, you wonder? Maybe just the
smoke tests your CI runs on a new publish. That's fine right? It'll run once and
nobody really looks at CI unless it's broken, right? Right?? Does it trigger any
emails where people will idly click through looking for a v17 tag that won't
exist anyore if you delete it?

You get more and more frantic as you pan through these options. You know in the
back of your head, that there's something amusing about all this, but it's also
starting to really be a drag on that high you just felt moments ago. Versioning
software shouldn't be so hard. Why doesn't the SemVer spec talk about situations
like this? You realize that versioning isn't simple because it's not meant for
computers. It's meant to communicate something to humans. But those same humans
also program a whole bunch of computers with their interpretations of what those
versions means, and sometimes that can cause problems. Sometimes, SemVer doesn't
work that way the spec says. Sometimes, it doesn't work at all.

---

I wrote most of this at 1am while writing about how software evolution isn't
measured in time, it's measured in versions. I had a paragraph about how
versions are socio-technological constructs, and that paragraph got longer and
longer so I ranted it out in story form. Let's just say it's not entirely fictional.
