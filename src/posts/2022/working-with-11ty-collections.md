---
title: Working with 11ty Collections
date: 2022-03-06

tags: ['11ty', 'tutorial']
description: "Create complex and nested collections to handle multiple taxonomies in a site built with 11ty"

thumbnail: null
cover_image: null
---

When building my website, I didn’t expect the biggest challenge to be having a separate collection for posts and projects, each collection with their own independent list of tags.

At its face value, it doesn't seem that big of a problem, but the way 11ty handles content by default creates a lot of opportunities for cross-collection pollution. For example, 11ty doesn't have a clear way to create a list of all "posts" with the "typography" tag, it really wants to provide one or the other.

## Making custom collections

Let’s start at the simplest point, by making a custom collection that only contains my posts. One way to do this is to get items by a functional "post" tag present on all of my posts, but this pollutes the tag list with junk I'd need to filter out. I want to avoid this wherever possible.

Instead, we can create a collection based on the content of a directory:

```js
eleventyConfig.addCollection("posts", function (collectionAPI) {
  return collectionAPI.getFilteredByGlob("./src/posts/*.md");
});
```

Now I can get a list of posts with `collections.posts`, which is a good starting point. Now, let’s say we want to list all of the tags in a specific content type. This is useful for making a tag directory among other things.

Because I have to create two collections using the same logic, just pulling from a different source, I chose to make this a function that takes a collection as an argument.

First, we create a new tag set and loop through each item in the collection, adding the tags as we go.

```js
// Return a list of tags in a given collection
function getTagList(collection) {
  let tagSet = new Set();
  collection.forEach((item) => {
    (item.data.tags || []).forEach((tag) => tagSet.add(tag));
  });
  return filterTagList([...tagSet]);
}
```

You may notice I also run the result through a `filterTagList` function I declaired earlier. This is not doing anything in my code anymore, since I no longer use utility tags that need to be filtered out. I decided to leave it in though, just in case I need it later. You can create the tag filter like so:

```js
function filterTagList(tags) {
  return (tags || []).filter(
    (tag) => ["utility-tag", "unwanted-tag"].indexOf(tag) === -1
  );
}

eleventyConfig.addFilter("filterTagList", filterTagList);
```

Next, we'll use the `getTagList` function to create the actual collection.

```js
eleventyConfig.addCollection("postTags", function (collectionAPI) {
  let collection = collectionAPI.getFilteredByGlob("./src/posts/*.md");
  return getTagList(collection);
});
```

Now let’s say we want to list all of the projects with the design tag. This gets much more difficult. 11ty does not have a convenient way to list items in a collection filtered by what is, essentially, another collection.

We could do `collections[tag]` OR `collections.type` but if we use the “design” tag in both projects and in posts (as I do), you’ll get pollution and have to filter out the other content type, which would ultimately require you have extra info in the frontmatter to filter by.

## Complex collections

This took a lot of sleuthing to figure out. Huge credit to [Laurence Hughes](https://fuzzylogic.me/posts/flexible-tag-like-functionality-for-custom-keys-in-eleventy/), who solved a really similar problem that led me to the solution to mine.

The ideal functionality is to be able to use the collectionAPI to get a list of posts with a specific tag with `collections.posts[tag]` and luckily we can do just that.

Again, I created this as a function, because I'll need to do the exact same thing with projects later. This gets a little complicated so I tried to walk through what the code is doing in the code comments.

```js
// Return an object with arrays of posts by tag from the provided collection
function createCollectionsByTag(collection) {
  // set the result as an object
  let resultArrays = {};
  // loop through each item in the provided collection
  collection.forEach((item) => {
    // loop through the tags of each item
    item.data.tags.forEach((tag) => {
      // If the tag has not already been added to the object, add it as an empty array
      if (!resultArrays[tag]) { resultArrays[tag] = []; }
      // Add the item to the tag's array
      resultArrays[tag].push(item);
    });
  });
  // Return the object containing tags and their arrays of posts
  // { tag-name: [post-object, post-object], tag-name: [post-object, post-object] }
  return resultArrays;
}
```

<div class="callout--caution">
<p>By this point, I no longer needed <code>filterTagList</code> and so the above snippet does not filter the tags it creates collections for. If you DO use a tag filter, you may want to add some logic to deal with that here.</p>
</div>

Now we can create the actual collection with this:

```js
eleventyConfig.addCollection("postsTagged", function (collectionAPI) {
  let collection = collectionAPI.getFilteredByGlob("./src/posts/*.md");
  return createCollectionsByTag(collection);
});
```

With all the above added, I can now:

- Get a list of all posts with `collections.posts`
- Get a list of all tags used by posts with `collections.postTags`
- Get a list of all posts with a specific tag with `collections.postsTagged["tag"]`

And I can do the same thing with projects.

But what if we wanted to kick it up a notch?

## Nested Collections

<div class="callout--warning">
<p>I've got to warn you that this may or may not be a good idea. As far as I know, there isn't a really good reason to do this, and 11ty doesn't always handle nested collections in the way you'd expect. For example, the 11ty pagination feature won't understand nested collections from my experiments. Hopefully these are classified as bugs and get worked out in the future. I opened an <a href="https://github.com/11ty/eleventy/issues/2266">issue on the eleventy repo</a> to ask about this behavior.</p>
</div>

I was inspired to do this after realizing the collection created by `addcollection` is essentially a javascript object that you can manipulate to your needs.

I combined the above collections into two: posts and projects. Using these two collections, I can get all the information I need in a nested way.

```js
// Create the posts object that contains post and tag information
eleventyConfig.addCollection("posts", function (collectionAPI) {
  let POSTS = collectionAPI.getFilteredByGlob("./src/posts/*.md");
  let collection = {};
  collection.all = POSTS;
  collection.tags = getTagList(POSTS);
  collection.tag = createCollectionsByTag(POSTS);
  return collection;
});
```

With nested collections:

- `collections.posts.all` Returns list of all posts
- `collections.posts.tags` Returns list of all tags
- `collections.posts.tag["tag-name"]` Returns list of all posts that match tag-name

Regardless of the bugs, it’s an interesting idea, and it's really cool to see how flexible the collection system can get if you push it.
