const { DateTime } = require("luxon");
const fs = require("fs");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");

module.exports = function (eleventyConfig) {
  /* ==================================================================
  Add Plugins
  ================================================================== */
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginSyntaxHighlight);
  /* ==================================================================
  Data Deep Merge
  https://www.11ty.dev/docs/data-deep-merge/
  ================================================================== */
  eleventyConfig.setDataDeepMerge(true);
  /* ==================================================================
  Date Filters
  ================================================================== */
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(
      "dd LLLL yyyy"
    );
  });
  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("yyyy-LL-dd");
  });
  /* ==================================================================
  General Filters
  ================================================================== */
  // Get the first `n` elements of a collection.
  eleventyConfig.addFilter("head", (array, n) => {
    if (n < 0) {
      return array.slice(n);
    }
    return array.slice(0, n);
  });
  // Return the smallest number argument
  eleventyConfig.addFilter("min", (...numbers) => {
    return Math.min.apply(null, numbers);
  });
  /* ==================================================================
  Tag filter
  Filters out unwanted / utility tags
  ================================================================== */
  function filterTagList(tags) {
    return (tags || []).filter(
      (tag) => ["posts", "projects"].indexOf(tag) === -1
    );
  }
  eleventyConfig.addFilter("filterTagList", filterTagList);
  /* ==================================================================
  Collection Functions
  ================================================================== */
  // Return a list of tags in a given collection
  function getTagList(collection) {
    let tagSet = new Set();
    collection.forEach((item) => {
      (item.data.tags || []).forEach((tag) => tagSet.add(tag));
    });
    return filterTagList([...tagSet]);
  }
  // Return a list of years in a given collection
  function getYearList(collection) {
    let years = new Set();
    collection.forEach((item) => {
      years.add(
        DateTime.fromJSDate(item.data.date, { zone: "utc" }).toFormat("yyyy")
      );
    });
    return [...years];
  }
  // Return an object with arrays of posts by tag from the provided collection
  function createCollectionsByTag(collection) {
    // set the result as an object
    let resultArrays = {};
    // loop through each item in the provided collection
    collection.forEach((item) => {
      // loop through the tags of each item
      item.data.tags.forEach((tag) => {
        // If the tag has not already been added to the object, add it as an empty array
        if (!resultArrays[tag]) {
          resultArrays[tag] = [];
        }
        // Add the item to the tag's array
        resultArrays[tag].push(item);
      });
    });
    // Return the object containing tags and their arrays of posts
    // { tag-name: [post-object, post-object], tag-name: [post-object, post-object] }
    return resultArrays;
  }
  // Return an object with arrays of posts by year from the provided collection
  function createCollectionsByYear(collection) {
    // set the result as an object
    let resultArrays = {};
    // loop through each item in the provided collection
    collection.forEach((item) => {
      year = DateTime.fromJSDate(item.data.date, { zone: "utc" }).toFormat(
        "yyyy"
      );
      if (!resultArrays[year]) {
        resultArrays[year] = [];
      }
      resultArrays[year].push(item);
    });
    // Return the object containing tags and their arrays of posts
    // { year: [post-object, post-object], year: [post-object, post-object] }
    return resultArrays;
  }
  /* ==================================================================
  Collections
  ================================================================== */
  const POSTS = (collectionAPI) => {
    return collectionAPI.getFilteredByGlob("./src/posts/*/*.md");
  };
  // collections.posts => Returns list of all posts
  eleventyConfig.addCollection("posts", function (collectionAPI) {
    return POSTS(collectionAPI);
  });
  // collections.postsByTag[tag] => Returns list of all posts that match tag-name
  eleventyConfig.addCollection("postsByTag", function (collectionAPI) {
    return createCollectionsByTag(POSTS(collectionAPI));
  });
  // collections.postTags => Returns list of all tags
  eleventyConfig.addCollection("postTags", function (collectionAPI) {
    return getTagList(POSTS(collectionAPI));
  });
  // Create a collection for post years (required for the generation of archive pages)
  eleventyConfig.addCollection("postYears", function (collectionAPI) {
    return getYearList(POSTS(collectionAPI));
  });
  // Create a collection for posts by year
  eleventyConfig.addCollection("postsByYear", function (collectionAPI) {
    return createCollectionsByYear(POSTS(collectionAPI));
  });

  const PROJECTS = (collectionAPI) => {
    return collectionAPI.getFilteredByGlob("./src/projects/*/*.md");
  };
  // collections.projects => Returns list of all projects
  eleventyConfig.addCollection("projects", function (collectionAPI) {
    return PROJECTS(collectionAPI);
  });
  // collections.projectsByTag[tag] => Returns list of all projects that match tag-name
  eleventyConfig.addCollection("projectsByTag", function (collectionAPI) {
    return createCollectionsByTag(PROJECTS(collectionAPI));
  });
  // collections.projectTags => Returns list of all tags
  eleventyConfig.addCollection("projectTags", function (collectionAPI) {
    return getTagList(PROJECTS(collectionAPI));
  });

  /* ==================================================================
  Enable static passthrough
  ================================================================== */
  eleventyConfig.addPassthroughCopy({ "src/_static/": "/" });
  /* ==================================================================
  Customize Markdown library and settings
  ================================================================== */
  let markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true,
  }).use(markdownItAnchor, {
    permalink: true,
    permalinkClass: "direct-link",
    permalinkSymbol: "#",
  });
  eleventyConfig.setLibrary("md", markdownLibrary);
  /* ==================================================================
  Override Browsersync defaults (used only with --serve)
  ================================================================== */
  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function (err, browserSync) {
        const content_404 = fs.readFileSync("dist/404.html");

        browserSync.addMiddleware("*", (req, res) => {
          // Provides the 404 content without redirect.
          res.writeHead(404, { "Content-Type": "text/html; charset=UTF-8" });
          res.write(content_404);
          res.end();
        });
      },
    },
    ui: false,
    ghostMode: false,
  });
  /* ==================================================================
  RETURN
  ================================================================== */
  return {
    // Control which files Eleventy will process
    // e.g.: *.md, *.njk, *.html, *.liquid
    templateFormats: ["md", "njk", "html", "liquid"],

    // Pre-process *.md files with:
    markdownTemplateEngine: "njk",

    // Pre-process *.html files with:
    htmlTemplateEngine: "njk",

    // Opt-out of pre-processing global data JSON files:
    dataTemplateEngine: false,

    // Set directories
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "dist",
    },
  };
};;
