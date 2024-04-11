const esbuild = require("esbuild");

const ENTRY_POINTS = {
  analytics: "source/javascript/analytics.js",
  webmentions: "source/javascript/webmentions.js",
  rollover: "source/javascript/rollover.js",
};

/**
 * This 11ty.js template is a major hack. It uses the data()
 * function to pretend that it's a paginated template, and uses APIs
 * to "paginate", aka, iteratively "render" a list of JS entrypoints. Each of
 * these entry points are run through esbuild, so they get bundled (imports are inlined)
 * and minified. The `render()` function writes them as "pages" (because pagination...)
 * into the output directory at a path determined by the `permalink()` function
 * also in the data().
 */
module.exports = class {
  compiledAssets = {};

  /**
   * @doc https://www.11ty.dev/docs/languages/javascript/#optional-data-method
   * @returns {object}
   */
  async data() {
    return {
      permalink: (data) => `javascript/${data.file}.js`,
      eleventyExcludeFromCollections: true,

      // The pagination object says,
      pagination: {
        // "my pagination data comes from the 'targets' property"
        // (which we are also defining right below this).
        data: "targets",

        // size: 1 means we aren't trying to make chunks of pages, just one per data item
        size: 1,

        // When iterating over this data set, put the current item under the `file` property
        // so we can access it easily.
        alias: "file",
      },

      // targets is an arbitrary property name that is used by pagination.data.
      // Since we set it to ENTRY_POINTS, that's how 11ty knows how to iterate through
      // each JS entry point to "render" it into build JS.
      targets: ENTRY_POINTS,
    };
  }

  /**
   * @doc https://www.11ty.dev/docs/languages/javascript/#classes
   */
  async render(data) {
    const { env, file } = data;

    if (!this.compiledAssets[file]) {
      // Note: Compile each file individually because esbuild doesn't seem to like
      // building multiple entry points in memory: https://github.com/evanw/esbuild/issues/2378.
      const result = await esbuild.build({
        entryPoints: [ENTRY_POINTS[file]],
        format: "iife",
        bundle: true,
        minify: env.ELEVENTY_ENV === "production",
        write: false, // returns output in result, instead of printing to stdout
      });

      this.compiledAssets[file] = Buffer.from(result.outputFiles[0].contents);
    }

    return this.compiledAssets[file];
  }
};
