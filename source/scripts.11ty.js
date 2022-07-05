const esbuild = require("esbuild");

const ENTRY_POINTS = {
  analytics: "source/javascript/analytics.js",
};

module.exports = class {
  /**
   * @doc https://www.11ty.dev/docs/languages/javascript/#optional-data-method
   * @returns {object}
   */
  async data() {
    return {
      // TODO: what does the targets data do?
      //        It seems to be responsible for the set of files
      //        passed to render() function, but I can't find docs for it.
      targets: ENTRY_POINTS,
      permalink: (data) => `/javascript/${data.file}.js`,
      eleventyExcludeFromCollections: true,

      // TODO: what does this data do?
      pagination: {
        data: "targets",
        size: 1,
        alias: "file",
      },
    };
  }

  /**
   * @doc https://www.11ty.dev/docs/languages/javascript/#classes
   */
  async render({ file }) {
    if (!this.compiledAssets) {
      const result = await esbuild.build({
        entryPoints: Object.values(ENTRY_POINTS),
        format: "iife",
        bundle: true,
        minify: true, // TODO: base this on production env
        write: false, // returns output in result, instead of printing to stdout
      });

      this.compiledAssets = {
        // TODO: this key should be derived from ENTRY_POINTS constant.
        // TODO: outputFiles[0] should not be hardcoded here.
        analytics: Buffer.from(result.outputFiles[0].contents),
      };
    }

    try {
      return this.compiledAssets[file];
    } catch (err) {
      console.error(err);
      return null;
    }
  }
};
