---
title: Ember Template Lint Rule from Addon
date: 2020-03-25
tags: ember.js
---

I recently wanted to ship an Ember template lint rule from an addon. This use case wasn't _exactly_
documented anywhere, so it took me a little while to figure out how to do it effectively. For anyone
else attempting to do the same, the ingredients are:

1. A file in the addon that exports a _plugin_ that contains the rule.
1. A custom test setup
1. Using the plugin from an app that installs the addon

## Creating the Rule and Plugin

The default Ember addon directory structure doesn't have an obvious place to put things that aren't
used by the Ember CLI build pipeline. Because I only needed to create one rule, I added a file to
the root of the directory as `template-lint-plugin.js`. The file looks like this:

```js
const Rule = require("ember-template-lint").Rule;

class MyRule extends Rule {
  visitor() {
    return {};
  }
}

module.exports = {
  name: "plugin-name",
  rules: {
    "the-rule-name": MyRule,
  },
};
```

[The Plugin API][1] documents a few alternative ways to do this as well. For example, the default export
could also be just the rule, and the plugin object could be created where it is used (e.g. the
test cases and the app).

## Test Setup

This one is a bit tricky. Adding a unit test file into the default `tests/` directory means
that it gets picked up by the addon's default test suite with QUnit. This is a bit messy because
Ember's default unit tests call `setupTest()`, which boot the Ember application. Although it's possible
to configure this, I thought it would be better to more closely match the test setup for rules
in `ember-template-lint` itself, which use a custom test harness, and provides a helper to set
it up with any testing library. Internally, it uses Jest to write the test cases for the provided rules,
so I opted to set up my tests the same way.

I had to do the following to make it work:

1.  `npm install --save-dev jest`, and configure it to run tests in the `node-tests` directory by
    adding configuration in `package.json`:

    ```json
    {
      "jest": {
        "coveragePathIgnorePatterns": [
          "<rootDir>/node_modules/",
          "<rootDir>/node-tests/"
        ],
        "testMatch": ["<rootDir>/node-tests/**/*-test.js"]
      }
    }
    ```

    There are several other ways to configure Jest, but this was the most lightweight. The
    decision to ignore the `node-tests` directory and then include files matching `-test.js`,
    [comes wholesale from `ember-template-lint`][3].

1.  Add a test file at `node-tests/template-lint-plugin-test.js` looks like this:

    ```js
    const generateRuleTests = require("ember-template-lint/lib/helpers/rule-test-harness");

    // The plugin object exported from the file created above.
    const myPlugin = require("../template-lint-plugin");

    function generateRuleTestsHelper(options) {
      return generateRuleTests(
        Object.assign({}, options, {
          groupMethodBefore: beforeEach, // refers to `Jest`'s global `beforeEach`
          groupingMethod: describe, // refers to `Jest`'s global `describe`
          testMethod: test, // refers to `Jest`'s global `test`
          focusMethod: test.only, // refers to `Jest`'s global `test.only`
          plugins: [myPlugin], // The plugin
        })
      );
    }

    generateRuleTestsHelper({
      name: "the-rule-name",
      config: true,
      good: [
        // examples of markup that passes the lint rule
      ],
      bad: [
        // examples of markup that fails the lint rule
      ],
    });
    ```

    The examples of how to add test cases into `good` and `bad` can be taken from any of the rule
    [tests in `ember-template-lint` now][2].

1.  Add an npm script to `package.json` to run the "Node" tests.

    ```json
    {
      "test:node": "jest"
    }
    ```

    In Ember CLI 3.17, [the default `test` script][5] was changed to `npm-run-all lint:* test:*"`, so adding
    a `test:node` script would automatically be added to the test suite and CI runs. Before 3.17,
    depending on your addon's test setup, you could simply add `&& npm run test:node` to the test script.

## Using the plugin in an app

Now that the addon contains a lint plugin and is tested, we can actually use it in an app.
After installing the addon with `npm install --save-dev your-addon-name`, and then add the plugin
and enable the lint rule in `.template-lintrc.js`:

```js
// .template-lintrc.js

module.exports = {
  plugins: ["my-addon-name/template-lint-plugin"],
  rules: {
    "the-rule-name": true,
  },
};
```

Note that the plugin's _name_ (noted in the plugin object's `name` key) isn't referenced here at all.
The only thing that is needed is a path to where the plugin is exported from and ember-template-lint
will `require` it. Because this runs in Node, and Node's `require` can resolve paths from the
`node_modules` directory, this works.

There you have it! Ember template lint plugins are fairly straightforward (and a [powerful way to
encourage a certain way of programing][4]), but the wiring wasn't immediately
obvious to me. Another thing I found confusing is that the `rules` key in the Plugin API
refers to the Rule _class_ (i.e. the implementation), but the `rules` key in `.template-lintrc.js`
refers to the _configuration_ of that rule (on or off).

Hope this helps someone else!

[1]: https://github.com/ember-template-lint/ember-template-lint/blob/v2.4.1/docs/plugins.md
[2]: https://github.com/ember-template-lint/ember-template-lint/tree/v2.4.1/test/unit/rules
[3]: https://github.com/ember-template-lint/ember-template-lint/blob/v2.4.1/package.json#L28-L36
[4]: https://twitter.com/mehulkar/status/1240020900960825345
[5]: https://github.com/ember-cli/ember-cli/pull/9009
