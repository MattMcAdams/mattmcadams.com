---
title: Filter items by tag with plain Javascript
date: 2024-05-18

tags: ['tutorial', 'javascript']
description: "I wanted a way to filter items by tag on the front-end and decided to build a quick demo. Here I'll talk through some decisions I ended up making and show you how to implement something like this in your own project."

thumbnail: null
cover_image: null
---

A while back, I was working on a personal project (that I ended up scrapping) and wanted to filter items by tag. I'm not going to go over how to dynamically render this HTML, you can do that with a number of options. The project I was working on wasn't using React, so this will be plain vanilla javascript. Alright let's get into it.

## The markup

I always start with the HTML and think its a good strategy for building things in a semantic and accessible way. I know I will have an unordered list but thats about it for now.

```html
<section class="list-section">
  <h2>Filterable Item List</h2>
  <ul class="item-list">
    <li class="card" data-tags="['Example Tag', 'Test']">
      <h3>Card Title</h3>
      <p>Description</p>
      <p class="sr-only">Tags:</p>
      <ul class="tags">
        <li>Example Tag</li>
        <li>Test</li>
      </ul>
    </li>
    <!-- Repeat list item markup as needed -->
  </ul>
</section>
```

For my case, I'm using a `<section>` element with a class. The class name doesn't matter, but we will be using it in the javascript later. I added the `data-tags` attribute to the `li` element so we'll have a way to get the tag names into javascript.

We're not done with the markup yet though, because we need to add in the tag filter. We'll do this with a form placed just below the `h2`

```html
<section class="list-section">
  <h2>Filterable Item List</h2>
  <form>
    <label for="filter">Sort by tag</label>
    <select name="filter">
      <option>All</option>
      <option>Example Tag</option>
      <option>Test</option>
    </select>
  </form>
  <ul class="item-list">
    <!-- List items -->
  </ul>
</section>
```

## The logic

Alright let's get into the meat of the problem. First of all, we're going to be working inside a function called `sortList`. The first thing we need to do is find every filterable section on the page.

```js
function sortList() {
  // Get all sections with filterable lists
  const sections = document.querySelectorAll(".list-section");
}
```

Next we want to loop through each of those sections and defined some variables to make our lives easier in the future. `items` will hold each item that can be filtered, and `select` will hold the select element used to define the filter criteria. Lastly, we need to add an event listener to the select element to trigger a sort function we'll build next.

```js
sections.forEach(section => {
  // Get list of all list items
  const items = section.querySelectorAll(".item-list > li");
  // Get the filter select input and add listener for the change event
  const select = section.querySelector("select");
  select.addEventListener("change", sort);
});
```

Alright let's start on our sort function. **Note that we're still inside the `sortList` function, inside the `sections.forEach` loop.

We need to loop through the list of items and toggle the `hidden` attribute depending on if that item has the tag selected by the select element.

Before we end the loop containing our sort function, we also need to call the sort function. This covers initialization so that the filter is correct on page refresh.

```js
function sort() {
  // Look at each item in the array
  items.forEach(element => {
    // Remove the "hidden" attribute if the item has the tag selected or if the selection is "All"
    // Otherwise, add the hidden attribute to the element
    if (element.dataset.tags.includes(select.value) | select.value == "All") {
      element.removeAttribute("hidden");
    } else { element.setAttribute("hidden", true); }
  });
};
sort();
```

Now that we have the logic written, we need to initialize it once the page is laoded. We'll do this with a new event listener outside of our `sortList` function.

```js
document.addEventListener("DOMContentLoaded", function() {
  sortList();
});
```

## The finished product

<iframe height="300" style="width: 100%;" scrolling="no" title="JS Tag Sort" src="https://codepen.io/mattmcadams/embed/VwrNMwP?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/mattmcadams/pen/VwrNMwP">
  JS Tag Sort</a> by Matthew McAdams (<a href="https://codepen.io/mattmcadams">@mattmcadams</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>
