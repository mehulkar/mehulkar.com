## Personal website

Built on [Middleman](http://middlemanapp.com/).

## Deploy

Uses custom shell script to deploy to the master branch on github pages.
The `master` branch on Github will always be overwritten. It should
probably try to retain the git history, but I don't care enough at this
point. History for source will be maintained.

```
rake publish
```

