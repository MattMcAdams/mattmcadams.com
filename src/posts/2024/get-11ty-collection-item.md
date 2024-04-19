---
title: "Get a single item from an 11ty collection"
date: 2024-04-19

tags: ['tutorial', '11ty']
description: "Sometimes, you might need to get a single item from an 11ty collection to display information about that page inside of another. Here's a little filter you can add that will help you do this."

thumbnail: null
cover_image: null
---

When creating my [sitemap](/sitemap), I wanted to find a way to add the Page's description under each heading but I didn't want to retype it or have to manually keep it updated. My solution was to pull the description from the page's metadata, but to do that, I would need to have a way of querying the 11ty collections for a single page.

Huge credit to [Peter deHaan](https://github.com/11ty/eleventy/discussions/2533) on GitHub who solved this problem, and who's work I'm basing my on.

## Filtering an array

To explain how this filter works, it helps to know how to find an object within an array in Javascript. This is because an 11ty collection is essentially an array of javascript objects. Lets look at this silly dataset I just made up.

```js
const animals = [
  {
    animal: "cat",
    call: "meow",
    color: "black",
  },
  {
    animal: "dog",
    call: "woof",
    color: "brown",
  }
]
```

If you wanted to get the object where the value of `animal` is `dog`, you could do that using the Javascript [find method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find).

```js
function findAnimal(array, animal) {
  return array.find(item => item.animal === animal);
}

findAnimal(animals, 'dog');
```

## Get 11ty item by slug

Let's adapt this concept to 11ty. We'll create a function called `find` and it will accept two arguments, the collection we're searching, and the page slug to search for.

```js
function find(collection = [], slug = "") {
  return collection.find(item => item.url === slug);
};
```

Now let's add this as a filter by wrapping the function in `eleventyConfig.addFilter`.

```js
eleventyConfig.addFilter("find", function find(collection = [], slug = "") {
  return collection.find(item => item.url === slug);
});
```

To use this, we only need to supply the collection and the item's relative url.

```liquid
{% openBracket %}%- set pageQuery = collections.projects | find("/path/to/page") -%{% closeBracket %}
```

Now we have a variable called `pageQuery` that we can use to access that page's metadata.

```liquid
<h2>{% openBracket %}{ pageQuery.data.title }{% closeBracket %}</h2>
```
