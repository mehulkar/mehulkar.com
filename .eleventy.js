// const SlugFilter = require('@11ty/eleventy/src/Filters/Slug');

module.exports = function (eleventyConfig) {
  eleventyConfig.setTemplateFormats('html,hbs,md,njk');

  eleventyConfig.addPassthroughCopy({
    'source/stylesheets/**/*.css': 'stylesheets',
    'source/stylesheets/vendor/*.css': 'stylesheets/vendor',
    'source/images/**/*.png': 'images',
    'source/images/**/*.jpeg': 'images',
    // 'assets/**/*.js': 'assets',
    // 'assets/**/*.css': 'assets',
    // 'manifest.json': '/manifest.json',
  });

//   // Add handlebars helper so we can match how 11ty generates the pages in
//   // people-pages.njk when we generate our links in the app in index.hbs.
//   // https://www.11ty.dev/docs/filters/slug/
//   // https://github.com/11ty/eleventy/blob/v0.11.0/src/Filters/Slug.js
//   eleventyConfig.addHandlebarsHelper("slugify", function(value) {
//     return SlugFilter(value);
//   });
};
