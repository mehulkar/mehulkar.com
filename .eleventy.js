const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginRss = require("@11ty/eleventy-plugin-rss");

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
  "quotations",
  "tech",
  "three-musics",
  "til",
  "debugging",
];

const TAG_PATH_OVERRIDES = {
  "ember.js": "emberjs",
  "ninja-tennis": "ninjatennis",
};

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addLiquidFilter("dateToRfc3339", pluginRss.dateToRfc3339);

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
    "11ty.js",
  ]);

  eleventyConfig.addPassthroughCopy({
    "source/stylesheets/**/*.css": "stylesheets",
    "source/stylesheets/vendor/*.css": "stylesheets/vendor",
    "source/manifest.json": "/manifest.json",
  });

  eleventyConfig.addCollection("rssFeedPosts", function (collectionApi) {
    const allSorted = collectionApi.getAllSorted();
    const posts = filterPostsByTag(allSorted, "programming");

    return [...posts.reverse()].slice(0, 20);
  });

  eleventyConfig.addCollection("byYear", function (collectionApi) {
    const allPosts = collectionApi.getAll();

    // Group posts by year first. This is an unsorted object
    const byYear = {};
    for (const post of allPosts) {
      const year = post.date.getFullYear();
      byYear[year] = byYear[year] || [];
      byYear[year].push(post);
    }

    // Get all the years, sort them numerically
    const sortedYears = Object.keys(byYear).sort((x, y) => +y - +x);

    // Create an array that with objects each corresponding
    // to the set of posts from each year in the order we determed
    // above.
    const sortedGroups = [];
    for (const year of sortedYears) {
      const posts = byYear[year].sort(
        (post1, post2) => post2.date - post1.date
      );
      sortedGroups.push({
        name: year,
        posts,
      });
    }

    return sortedGroups;
  });

  eleventyConfig.addNunjucksFilter("category", function (byYear, tag) {
    const filtered = [];

    for (const postCollection of byYear) {
      const { name: year, posts } = postCollection;

      const forTag = filterPostsByTag(posts, tag);

      if (forTag.length) {
        filtered.push({
          name: year,
          posts: forTag,
        });
      }
    }

    return filtered;
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

  eleventyConfig.addNunjucksFilter("splitTags", function (value) {
    if (!value) {
      return [];
    }

    // https://github.com/11ty/eleventy/blob/v1.0.1/src/TemplateData.js#L608-L617
    // 11ty specially parses tags and always returns an array. It expects that
    // we are setting tags as a multiline array, if there are more than one. And
    // if a single string is provided, it will still give that to us as an array of one string.
    // But in _our_ posts, we specify comma separated tags.
    // So we need to take the first value out of the single-item array, and
    // then parse that.
    const [tags = ""] = value;
    return splitTagsArr(tags);
  });

  eleventyConfig.addNunjucksFilter("tagLink", function (tag) {
    const classList = "pill dib mb3 br1 ph3 pv1 ttu f6";

    if (TAG_PAGES.includes(tag)) {
      const path = TAG_PATH_OVERRIDES[tag] || tag;
      return `<a href="/blog/category/${path}" class="pill--link ${classList}">${tag}</a>`;
    } else {
      return `<span class="${classList}">${tag}</span>`;
    }
  });

  eleventyConfig.addNunjucksFilter("addQueryParam", function (urlStr, queryParamsStr) {
    const url = new URL(urlStr)
    const queryParams = new URLSearchParams(queryParamsStr);
    for ([param, value] of queryParams.entries()) {
      url.searchParams.set(param, value)
    }
    return url.toString()
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

/**
 * TODO: allow accepting more than one tag?
 * @param {*} posts
 * @param {string} tag
 * @returns
 */
function filterPostsByTag(posts, tag) {
  return posts.filter((post) => {
    const postTags = getTags(post);
    return postTags.includes(tag);
  });
}

function splitTagsArr(tags) {
  const cleaned = tags
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);

  const unique = new Set(cleaned);
  return [...unique];
}

function getTags(post) {
  // TODO: how to use frontmatter correctly so that tags are already an array?
  const tagsString = post.data.tags[0] || "";
  return splitTagsArr(tagsString);
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
