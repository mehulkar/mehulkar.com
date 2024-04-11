---
title: "EMFILE: too many open files"
date: 2021-08-13
tags:
- programming
- javascript
- watchman
---

Sometimes when I run a `ember serve` I get this error:

```bash
EMFILE: too many open files, watch
```

I don't really understand why this happens, but it's usually after a restart
when some esoteric settings I used previously get reset. Or after a `brew update`
that upgrades `watchman`.

The docs are very spotty, but my coworker told me a workaround that's not totally
random and also makes enough sense in my mental model that I will probably use it
forever.

The mental model is something like: "newer versions of watchman break ember server,
so use an older version". This makes sense to me. Some implicit update is causing
issues, rollback.

1. `brew rm watchman`

    This removes `watchman` from your system.

1. `curl https://raw.githubusercontent.com/Homebrew/homebrew-core/ec72d21865f5b18191594565fda4157b7576dea8/Formula/watchman.rb | pbcopy`

    This updates the "Formula" for installing watchman with the 4.9.0 version, which
    is the working version<sup>1</sup>

1. `brew edit watchman`

    This opens up the file where Homebrew keeps the formula for installing watchman
    on your system.

1. paste and save

    Save the 4.9.0 installer for watchman into the file, so that it will
    install 4.9.0 next time you install.

1. `HOMEBREW_UPDATE_PREINSTALL=0 brew install watchman`

    Installs `watchman`, but opts out of running updating all Homebrew
    formulas before doing the install (which would overwrite the formula)
    we just edited before. You can also add this to your shell profile
    to always have this behavior.

1. `brew pin watchman`

    Prevents upgrading the formula in the future.

Another coworker pointed me to more commands from `watchman`, which look like reset
steps.

```
watchman watch-del .
watchman watch .
```

One of these days I'll dig deeper to understand how these tools are actually working
together and if there's some root cause issue that can be solved, but there's only
so many rabbit holes you can go down (and then write about)!
