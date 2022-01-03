// const SlugFilter = require('@11ty/eleventy/src/Filters/Slug');

const shortDate = Intl.DateTimeFormat("en-us", {
  month: "short",
  day: "numeric",
});

const fullDate = Intl.DateTimeFormat("en-us", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

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

  //   // Add handlebars helper so we can match how 11ty generates the pages in
  //   // people-pages.njk when we generate our links in the app in index.hbs.
  //   // https://www.11ty.dev/docs/filters/slug/
  //   // https://github.com/11ty/eleventy/blob/v0.11.0/src/Filters/Slug.js
  //   eleventyConfig.addHandlebarsHelper("slugify", function(value) {
  //     return SlugFilter(value);
  //   });

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

  return {
    dir: {
      input: "./",
      output: "./build",
    },
  };
};
