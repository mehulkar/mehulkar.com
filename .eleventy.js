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

const CATEGORY_PAGES = [
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

  eleventyConfig.addCollection("posts", function (collectionApi) {
    const allPosts = getPosts(collectionApi);

    // TODO: add more categories in here?
    return filterPostsByCategory(allPosts, "programming");
  });

  eleventyConfig.addCollection("byYear", function (collectionApi) {
    const posts = getPosts(collectionApi);

    // Group posts by year first. This is an unsorted object
    const byYear = {};
    for (const post of posts) {
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

  eleventyConfig.addCollection("categories", function (collectionApi) {
    const posts = getPosts(collectionApi);

    // Group posts by year first. This is an unsorted object
    const allCategories = new Set();

    for (const post of posts) {
      const postCategories = getCategories(post);

      for (const category of postCategories) {
        allCategories.add(category);
      }
    }

    return Array.from(allCategories);
  });

  eleventyConfig.addNunjucksFilter("category", function (byYear, category) {
    const filtered = [];

    for (const postCollection of byYear) {
      const { name: year, posts } = postCollection;

      const forCategory = filterPostsByCategory(posts, category);

      if (forCategory.length) {
        filtered.push({
          name: year,
          posts: forCategory,
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

  eleventyConfig.addNunjucksFilter("split", function (value) {
    if (!value) return [];

    return value.split(", ");
  });

  eleventyConfig.addNunjucksFilter("categoryLink", function (value) {
    const classList = "pill dib mb3 br1 ph3 pv1 ttu";
    if (CATEGORY_PAGES.includes(value)) {
      const path =
        {
          "ember.js": "emberjs",
          "ninja-tennis": "ninjatennis",
        }[value] || value;
      return `<a href="/blog/category/${path}" class="pill--link ${classList}">${value}</a>`;
    } else {
      return `<span class="${classList}">${value}</span>`;
    }
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
 * TODO: allow accepting more than one category?
 * @param {*} posts
 * @param {string} category
 * @returns
 */
function filterPostsByCategory(posts, category) {
  return posts.filter((post) => {
    const postCategories = getCategories(post);
    return postCategories.includes(category);
  });
}

function getPosts(collectionApi) {
  const all = collectionApi.getAll();
  return all.filter((post) => !post.inputPath.match(/\/blog\/category/));
}

function getCategories(post) {
  // Use nullish coalesce, because some posts have categories, but
  // nothing set for it, whereas some don't have the frontmatter at all.
  const categories = post.data.categories ?? "";

  return categories
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
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
