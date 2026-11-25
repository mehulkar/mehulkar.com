import fs from "node:fs/promises";
import path from "node:path";
import esbuild from "esbuild";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import {
  rssPlugin as pluginRss,
  dateToRfc3339,
} from "@11ty/eleventy-plugin-rss";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import activityPubPlugin from "eleventy-plugin-activity-pub";
import markdownItAnchor from "markdown-it-anchor";
import { transformTweets } from "./lib/tweets.js";

// Load a local .env file if there is one (Vercel injects env vars directly)
try {
  process.loadEnvFile();
} catch {}

const SITE_URL = "https://www.mehulkar.com";

// Letterboxd poster URLs embed their size; swap it for a smaller one.
const LETTERBOXD_POSTER_SIZE = "-0-600-0-900-crop";
const letterboxdPoster = (url, w) =>
  url.replace(LETTERBOXD_POSTER_SIZE, `-0-${w}-0-${(w * 3) / 2}-crop`);

// Browser scripts bundled with esbuild into <output>/javascript/<name>.js
const JS_ENTRY_POINTS = {
  webmentions: "source/javascript/webmentions.js",
  rollover: "source/javascript/rollover.js",
  "tweet-card": "source/javascript/tweet-card.js",
};

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

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight);

  eleventyConfig.addGlobalData("site", {
    url: SITE_URL,
    title: "Mehul Kar",
    description:
      "Mehul Kar is a software engineer at Vercel. Writing about programming, tools, and engineering teams.",
    image: "/images/icon-512.png",
  });

  // Bundle browser JS with esbuild before each build (and on each rebuild in
  // --serve mode). Each entry point is built separately into javascript/.
  eleventyConfig.addWatchTarget("source/javascript/");
  eleventyConfig.on("eleventy.before", async ({ directories }) => {
    await esbuild.build({
      entryPoints: JS_ENTRY_POINTS,
      outdir: path.join(directories.output, "javascript"),
      format: "iife",
      bundle: true,
      minify: process.env.ELEVENTY_ENV === "production",
      logLevel: "warning",
    });
  });

  // Responsive, modern-format images for local <img> tags (AVIF/WebP +
  // srcset, lazy-loaded, with width/height). Remote images are left alone so
  // the build never depends on third-party hosts.
  // Runs before the image plugin (higher priority) and marks remote images
  // with eleventy:ignore so the image plugin skips them.
  eleventyConfig.htmlTransformer.addPosthtmlPlugin(
    "html",
    () => (tree) => {
      tree.match({ tag: "img" }, (node) => {
        const src = node.attrs?.src || "";
        if (/^(https?:)?\/\//.test(src)) {
          node.attrs["eleventy:ignore"] = "";
        }
        // Letterboxd posters: request smaller sizes + reserve 2:3 space
        if (src.includes(LETTERBOXD_POSTER_SIZE)) {
          node.attrs.srcset = [230, 460, 600]
            .map((w) => `${letterboxdPoster(src, w)} ${w}w`)
            .join(", ");
          node.attrs.sizes ??= "(min-width: 44rem) 20rem, 50vw";
          node.attrs.width = "600";
          node.attrs.height = "900";
          node.attrs.decoding = "async";
        }
        return node;
      });
      return tree;
    },
    { priority: 1 },
  );
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    formats: ["avif", "webp", "auto"],
    widths: [480, 960, 1440],
    failOnError: false,
    htmlOptions: {
      imgAttributes: {
        loading: "lazy",
        decoding: "async",
        sizes: "(min-width: 44rem) 40rem, 100vw",
      },
    },
  });

  // Footer copyright year, rendered at build time
  eleventyConfig.addShortcode("year", () => String(new Date().getFullYear()));

  // Linkable headings: adds ids + a hover "#" link to h2-h4 in posts
  eleventyConfig.amendLibrary("md", (md) => {
    md.use(markdownItAnchor, {
      level: [2, 3, 4],
      permalink: markdownItAnchor.permalink.linkInsideHeader({
        symbol: "#",
        placement: "after",
        ariaHidden: true,
      }),
    });
  });

  // Turn tweet URLs / X embeds into <tweet-card> elements (see lib/tweets.js)
  eleventyConfig.addTransform("tweets", function (content) {
    if (!(this.page.outputPath || "").endsWith(".html")) return content;
    return transformTweets(content);
  });

  // e.g. "6 min read", computed from rendered HTML at build time
  eleventyConfig.addFilter("readingTime", function (html) {
    const text = String(html || "")
      .replace(/<(script|style|pre)[\s\S]*?<\/\1>/gi, " ")
      .replace(/<[^>]+>/g, " ");
    const words = text.split(/\s+/).filter(Boolean).length;
    return `${Math.max(1, Math.round(words / 230))} min read`;
  });
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addLiquidFilter("dateToRfc3339", dateToRfc3339);

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
  ]);

  eleventyConfig.addPassthroughCopy({
    "source/stylesheets/**/*.css": "stylesheets",
    "source/manifest.json": "/manifest.json",
    // Code highlighting theme, served locally instead of from a CDN
    "node_modules/prismjs/themes/prism-okaidia.css":
      "stylesheets/prism-okaidia.css",
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

  function writingPosts(collectionApi) {
    return filterPostsByTag(collectionApi.getAll(), [], {
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
  }

  // Writing posts grouped by year (archive page)
  eleventyConfig.addCollection("home", function (collectionApi) {
    return groupByYear(writingPosts(collectionApi));
  });

  // Writing posts, newest first (home page)
  eleventyConfig.addCollection("writing", function (collectionApi) {
    return sortByDate(writingPosts(collectionApi));
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
    for (const [param, value] of queryParams.entries()) {
      url.searchParams.set(param, value);
    }

    // return final
    return url.toString();
  });

  eleventyConfig.addNunjucksShortcode("blueskyShareURL", function (title) {
    // https://docs.bsky.app/docs/advanced-guides/intent-links
    const pageURL = new URL(SITE_URL);
    pageURL.pathname = this.page.url;
    const url = new URL("https://bsky.app/intent/compose");
    url.searchParams.set("text", `${title} by @mehulkar.com ${pageURL}`);
    return url.toString();
  });

  return {
    // Turn off any template preprocessing for markdown files. `.md` files are
    // usually for blog posts and don't contain any liquid/nunjucks templating.
    // Also, liquid fails to parse some of the markdown in some of the posts
    // so enabling it fails the build. See: https://github.com/11ty/eleventy/issues/2434
    markdownTemplateEngine: false,

    // Output goes to Eleventy's default "_site", which is also what
    // Vercel's Eleventy preset expects, so no output config is needed there.
    dir: {
      input: "./source",
    },
  };
}

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
