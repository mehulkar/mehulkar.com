## Personal website

Built on [Middleman](http://middlemanapp.com/).

## Deploy

Uses custom shell script to deploy to the master branch on github pages.
The `master` branch on Github will always be overwritten.

```
rake publish
```

The `master` branch is the deploy branch. It gets pushed up to the Github
with a `CNAME` and is served by Github Pages. The `source` branch is the,
well, source of the project.
