const { DateTime } = require("luxon");
const fs = require("fs");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");

module.exports = function (eleventyConfig) {
  // Add plugins
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginSyntaxHighlight);

  // https://www.11ty.dev/docs/data-deep-merge/
  eleventyConfig.setDataDeepMerge(true);

  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(
      "dd LLLL yyyy"
    );
  });

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("yyyy-LL-dd");
  });

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

  function filterTagList(tags) {
    return (tags || []).filter(
      (tag) => ["posts", "projects"].indexOf(tag) === -1
    );
  }

  eleventyConfig.addFilter("filterTagList", filterTagList);

  // COLLECTION HELPERS

  // Return a list of tags in a given collection
  function getTagList(collection) {
    let tagSet = new Set();
    collection.forEach((item) => {
      (item.data.tags || []).forEach((tag) => tagSet.add(tag));
    });
    return filterTagList([...tagSet]);
  }

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
    // { tag-name: [post-object, post-object], tag-name: [post-object, post-object] }
    return resultArrays;
  }

  // Create the posts object that contains post and tag information
  // collections.posts.all => Returns list of all posts
  // collections.posts.tags => Returns list of all tags
  // collections.posts.tag["tag-name"] => Returns list of all posts that match tag-name
  eleventyConfig.addCollection("posts", function (collectionAPI) {
    let POSTS = collectionAPI.getFilteredByGlob("./src/posts/*/*.md");
    let collection = {};
    collection.all = POSTS;
    collection.tags = getTagList(POSTS);
    collection.tag = createCollectionsByTag(POSTS);
    return collection;
  });

  // Create a collection for post tags (required for the generation of tag pages)
  eleventyConfig.addCollection("postTags", function (collectionAPI) {
    return getTagList(collectionAPI.getFilteredByGlob("./src/posts/*/*.md"));
  });

  // Create a collection for post years (required for the generation of archive pages)
  eleventyConfig.addCollection("postYears", function (collectionAPI) {
    let POSTS = collectionAPI.getFilteredByGlob("./src/posts/*/*.md");
    return getYearList(POSTS);
  });

  // Create a collection for posts by year
  eleventyConfig.addCollection("postsByYear", function (collectionAPI) {
    let POSTS = collectionAPI.getFilteredByGlob("./src/posts/*/*.md");
    return createCollectionsByYear(POSTS);
  });

  // Create the projects object that contains project and tag information
  // collections.projects.all => Returns list of all projects
  // collections.projects.tags => Returns list of all tags
  // collections.projects.tag["tag-name"] => Returns list of all projects that match tag-name
  eleventyConfig.addCollection("projects", function (collectionAPI) {
    let PROJECTS = collectionAPI.getFilteredByGlob("./src/projects/*.md");
    let collection = {};

    collection.all = PROJECTS;
    collection.tags = getTagList(PROJECTS);
    collection.tag = createCollectionsByTag(PROJECTS);
    return collection;
  });

  //Create a collection for project tags (required for the generation of tag pages)
  eleventyConfig.addCollection("projectTags", function (collectionAPI) {
    return getTagList(collectionAPI.getFilteredByGlob("./src/projects/*.md"));
  });

  // Enable static passthrough
  eleventyConfig.addPassthroughCopy({ "src/_static/": "/" });

  // Customize Markdown library and settings:
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

  // Override Browsersync defaults (used only with --serve)
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

  return {
    // Control which files Eleventy will process
    // e.g.: *.md, *.njk, *.html, *.liquid
    templateFormats: ["md", "njk", "html", "liquid"],

    // -----------------------------------------------------------------
    // If your site deploys to a subdirectory, change `pathPrefix`.
    // Don’t worry about leading and trailing slashes, we normalize these.

    // If you don’t have a subdirectory, use "" or "/" (they do the same thing)
    // This is only used for link URLs (it does not affect your file structure)
    // Best paired with the `url` filter: https://www.11ty.dev/docs/filters/url/

    // You can also pass this in on the command line using `--pathprefix`

    // Optional (default is shown)
    pathPrefix: "/",
    // -----------------------------------------------------------------

    // Pre-process *.md files with: (default: `liquid`)
    markdownTemplateEngine: "njk",

    // Pre-process *.html files with: (default: `liquid`)
    htmlTemplateEngine: "njk",

    // Opt-out of pre-processing global data JSON files: (default: `liquid`)
    dataTemplateEngine: false,

    // These are all optional (defaults are shown):
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "dist",
    },
  };
};;
