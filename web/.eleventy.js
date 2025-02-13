const dotenv = require("dotenv");
dotenv.config();

const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const activityPubPlugin = require("eleventy-plugin-activity-pub");

const shortDate = Intl.DateTimeFormat("en-us", {
  month: "short",
  day: "numeric",
});

const fullDate = Intl.DateTimeFormat("en-us", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const TAG_PAGES = [
  "books",
  "ember.js",
  "frontend",
  "ninja-tennis",
  "poetry",
  "programming",
  "engineering",
  "quotations",
  "tech",
  "three-musics",
  "til",
  "debugging",
  "home-screen",
  "meta",
  "product",
  "career",
  "recently-watched",
  "product-review",
];

const TAG_PATH_OVERRIDES = {
  "ember.js": "emberjs",
  "ninja-tennis": "ninjatennis",
  books: "recently-read",
};

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addLiquidFilter("dateToRfc3339", pluginRss.dateToRfc3339);

  eleventyConfig.addPlugin(activityPubPlugin, {
    domain: "mehulkar.com",
    username: "mehulkar",
    displayName: "mehulkar",
    aliases: [
      "https://indieweb.social/mehulkar",
      "https://indieweb.social/users/mehulkar",
    ],
    summary:
      "This is my personal website, but it's also discoverable on the Fediverse!",
  });

  eleventyConfig.setTemplateFormats([
    "html,hbs,md,njk",
    "md",
    "html",
    "hbs",
    "njk",
    "png",
    "webp",
    "jpg",
    "jpeg",
    "mov",
    "11ty.js",
  ]);

  eleventyConfig.addPassthroughCopy({
    "source/stylesheets/**/*.css": "stylesheets",
    "source/stylesheets/vendor/*.css": "stylesheets/vendor",
    "source/manifest.json": "/manifest.json",
  });

  eleventyConfig.addCollection("rssFeedPosts", function (collectionApi) {
    const allSorted = collectionApi.getAllSorted();
    const posts = filterPostsByTag(allSorted);

    return [...posts.reverse()].slice(0, 20);
  });

  eleventyConfig.addNunjucksFilter("byYear", function (posts) {
    return groupByYear(posts);
  });

  eleventyConfig.addNunjucksFilter("reverseChrono", function (posts) {
    return sortByDate(posts);
  });

  eleventyConfig.addCollection("home", function (collectionApi) {
    const allPosts = collectionApi.getAll();
    const homePosts = filterPostsByTag(allPosts, [], {
      exclude: [
        "recently-watched",
        "books",
        "poetry",
        "ninja-tennis",
        "personal",
        "thoughts",
        "quote",
      ],
    });
    return groupByYear(homePosts);
  });

  eleventyConfig.addFilter("formatDate", function (value) {
    if (!value) return "";
    const adjusted = adjustTimezone(value);
    return shortDate.format(adjusted);
  });

  eleventyConfig.addFilter("fullDate", function (value) {
    if (!value) return "";
    const adjusted = adjustTimezone(value);
    return fullDate.format(adjusted);
  });

  eleventyConfig.addNunjucksFilter("debug", function (value) {
    try {
      return JSON.stringify(value, null, 2);
    } catch (e) {
      return `Error: ${e}`;
    }
  });

  eleventyConfig.addNunjucksShortcode("tagLink", function (tag) {
    const classList = "dib mr1 f5";
    const tagText = `#${tag}`;
    if (TAG_PAGES.includes(tag)) {
      const path = TAG_PATH_OVERRIDES[tag] || tag;
      return `<a href="/blog/category/${path}" class="${classList}">${tagText}</a>`;
    } else {
      return `<span class="${classList}">${tagText}</span>`;
    }
  });

  eleventyConfig.addNunjucksFilter("buildForRSS", function (urlStr) {
    // remove trailing slash
    const url = new URL(urlStr.replace(/\/$/, ""));

    // add query param rss=true
    const queryParams = new URLSearchParams("utm_source=rss");
    for ([param, value] of queryParams.entries()) {
      url.searchParams.set(param, value);
    }

    // return final
    return url.toString();
  });

  eleventyConfig.addNunjucksShortcode("tweetURL", function () {
    // https://developer.twitter.com/en/docs/twitter-for-websites/tweet-button/guides/web-intent
    const url = new URL("https://twitter.com/intent/tweet");
    // set url of web mention
    const pageURL = new URL(`https://mehulkar.com`);
    pageURL.pathname = this.page.url;
    url.searchParams.set("url", encodeURI(pageURL));

    url.searchParams.set("via", "mehulkar");
    return url.toString();
  });

  return {
    // Turn off any template preprocessing for markdown files. `.md` files are
    // usually for blog posts and don't contain any liquid/nunjucks templating.
    // Also, liquid fails to parse some of the markdown in some of the posts
    // so enabling it fails the build. See: https://github.com/11ty/eleventy/issues/2434
    markdownTemplateEngine: false,

    dir: {
      input: "./source",
      output: "./build",
    },
  };
};

function groupByYear(items) {
  // Group items by year first. This is an unsorted object
  const byYear = {};
  for (const item of items) {
    const year = adjustTimezone(item.date).getFullYear();
    byYear[year] = byYear[year] || [];
    byYear[year].push(item);
  }

  // Get all the years, sort them numerically
  const sortedYears = Object.keys(byYear).sort((x, y) => +y - +x);

  const sortedGroups = [];
  for (const year of sortedYears) {
    const items = sortByDate(byYear[year]);
    sortedGroups.push({
      name: year,
      items,
    });
  }
  return sortedGroups;
}

function sortByDate(posts) {
  return posts.sort((item1, item2) => item2.date - item1.date);
}

/**
 * @param {*} posts
 * @param {string[]} tags
 * @returns
 */
function filterPostsByTag(posts, tags = [], { exclude = [] } = {}) {
  if (tags.length === 0 && exclude.length === 0) {
    return posts;
  }

  if (tags.length > 0 && exclude.length > 0) {
    throw new Error('Cannot have both "tags" and "exclude" options');
  }

  // INCLUDE POSTS THAT HAVE THE TAGS
  if (tags.length > 0) {
    // Check all the tags for each post
    return posts.filter((post) => {
      // If any of the tags on a post includes the ones we want
      let include = false;
      tags.forEach((requestedTag) => {
        if (post.data.tags.includes(requestedTag)) {
          include = true;
          return;
        }
      });

      return include;
    });
  }

  // REMOVE POSTS THAT INCLUDE A TAG
  if (exclude.length > 0) {
    // Check all the tags for each post
    return posts.filter((post) => {
      // If any of the tags on a post includes the ones we want
      let include = true;
      exclude.forEach((requestedTag) => {
        if (post.data.tags.includes(requestedTag)) {
          include = false;
          return;
        }
      });

      return include;
    });
  }

  return posts;
}

/**
 * Eleventy hardcodes parsing of dates from frontmatter as UTC.
 * https://www.11ty.dev/docs/dates/#dates-off-by-one-day
 * https://github.com/11ty/eleventy/blob/a5101895787ba7a264c37a411fa5178cce1b93d9/src/Template.js#L1018-L1031
 *
 * But all these posts are written with PST timezone (probably).
 * So we need to take the JS Date that Eleventy gives us, serialize
 * it to a ISO String, change the timezone, and initialize a new Date object.
 *
 * @param {Date} date
 * @returns {Date}
 */
function adjustTimezone(date) {
  const isoString = new Date(date).toISOString();
  // adjusted date. Replacing the `Z` at the end and adding an -8 hour offset
  // makes the ISO string a PST timezone string. Then, initializing a new
  // date object with this string, means that we get a date object with the
  // correct timezone.
  return new Date(isoString.replace("Z", "-08:00"));
}
