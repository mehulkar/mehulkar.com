---
title: New Ember Projects
date: 2020-02-05
categories: programming, frontend, ember.js
---

Some default steps to follow when I start a new Ember app. Most of this is taken from
[Sergio Arbeo's post][1] on the Dockyard blog, but this is a bit more streamlined and suited to
my usage:

1. Remove unnecessary packages:

    ```bash
    npm uninstall --save-dev \
        ember-welcome-page \
        ember-data \
        ember-cli-eslint \
        ember-cli-template-lint
    ```

1. Add lower level packages:

    ```bash
    npm i --save-dev \
        ember-template-lint \
        eslint \
        prettier \
        eslint-plugin-prettier \
        eslint-config-prettier \
        husky \
        lint-staged \
        concurrently
    ```

1. Add configs to package.json:

    ```json
    {
        ...<other stuff>...
        "prettier": {
            "printWidth": 100,
            "singleQuote": true,
            "useTabs": false
        },
        "husky": {
            "hooks": {
                "pre-commit": "lint-staged"
            }
        },
        "lint-staged": {
            "*.js": ["eslint —fix"],
            "*.hbs": ["ember-template-lint"]
        }
    }
    ```

1. Remove <WelcomePage/> render from application.hbs
1. Update .eslintrc to use the prettier plugin and extend from its rules
1. Update .eslintrc to use `plugin:ember/octane` instead of `plugin:ember/recommended`.

[1]: https://dockyard.com/blog/2019/06/18/improving-the-ember-dx-part-2-changing-our-toolbelt
