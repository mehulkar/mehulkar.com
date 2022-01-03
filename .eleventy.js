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
  "emberjs",
  "frontend",
  "ninja-tennis",
  "poetry",
  "programming",
  "quotations",
  "tech",
  "three-musics",
  "til",
];

module.exports = function (eleventyConfig) {
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
  ]);

  eleventyConfig.addPassthroughCopy({
    "source/stylesheets/**/*.css": "stylesheets",
    "source/stylesheets/vendor/*.css": "stylesheets/vendor",
    // 'assets/**/*.js': 'assets',
    // 'assets/**/*.css': 'assets',
    "source/manifest.json": "/manifest.json",
  });

  eleventyConfig.addCollection("byYear", function (collectionApi) {
    const all = collectionApi.getAll();

    // Group posts by year first. This is an unsorted object
    const byYear = {};
    for (const post of all) {
      if (post.inputPath.match(/\/blog\/category/)) {
        continue;
      }
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
      sortedGroups.push({
        name: year,
        posts: byYear[year],
      });
    }

    return sortedGroups;
  });

  eleventyConfig.addCollection("categories", function (collectionApi) {
    const all = collectionApi.getAll();

    // Group posts by year first. This is an unsorted object
    const allCategories = new Set();

    for (const post of all) {
      // Use nullish coalesce, because some posts have categories, but
      // nothing set for it, whereas some don't have the frontmatter at all.
      const categories = post.data.categories ?? "";

      const postCategories = categories
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);

      for (const category of postCategories) {
        allCategories.add(category);
      }
    }

    return Array.from(allCategories);
  });

  eleventyConfig.addFilter("formatDate", function (value) {
    if (!value) return "";

    // TODO: the `value` here is from frontmatter in each post,
    // which I wrote based on the local date for me. But 11ty assumes
    // it is UTC. For the most part this doesn't matter, because we're
    // only displaying date and month, but sometimes the 8 hour difference
    // makes it wrong. We need to initialize a PST date object using the values
    // from this value and format that.
    return shortDate.format(value);
  });

  eleventyConfig.addFilter("fullDate", function (value) {
    if (!value) return "";

    // TODO: the `value` here is from frontmatter in each post,
    // which I wrote based on the local date for me. But 11ty assumes
    // it is UTC. For the most part this doesn't matter, because we're
    // only displaying date and month, but sometimes the 8 hour difference
    // makes it wrong. We need to initialize a PST date object using the values
    // from this value and format that.
    return fullDate.format(value);
  });

  eleventyConfig.addHandlebarsHelper("concat", function () {
    const joined = [...arguments].join(" ");
    return joined;
  });

  eleventyConfig.addNunjucksFilter("split", function (value) {
    if (!value) return [];

    return value.split(", ");
  });

  eleventyConfig.addNunjucksFilter("categoryLink", function (value) {
    const classList = "pill dib mb3 br1 ph3 pv1 ttu";
    if (CATEGORY_PAGES.includes(value)) {
      return `<a href="/blog/category/${value}" class="pill--link ${classList}">${value}</a>`;
    } else {
      return `<span class="${classList}">${value}</span>`;
    }
  });

  return {
    dir: {
      input: "./source",
      output: "./build",
    },
  };
};
