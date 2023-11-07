---
title: On a Modern Grid
date: 2020-01-23
published: true
series: false

tags: ['css']
description: "Back in October, Marvin Danig made a fantastic blog post on the state of responsive web design and the future of CSS frameworks. I wanted to continue some of his points and see how a responsive first grid system might look."

thumbnail: null
cover_image: null
---

Back in October, [Marvin Danig](https://dev.to/marvindanig/toucaan-rethinking-css-frameworks-394p) made a fantastic blog post on the state of responsive web design and the future of CSS frameworks. I wanted to continue some of his points and see how a responsive first grid system might look.

## The current grid

Before we get into the deep end of building a grid, I wanted to review some of the systems we have today and the pain points associated with them.

- Multiple media queries are needed to control grid columns at multiple breakpoints
- Unnecessary clutter from wrapper divs and repeated class names

The range of device sizes are growing faster than we can keep up with them. This was originally addressed by adding a breakpoint for small screens... then a breakpoint for tablet sized screens... then a breakpoint for large screens as the web finds itself on more and more devices.

It doesn't make sense to continually adjust the design to adapt to so many displays individually. Marvin outlines this problem in his article and his solution changed how I think about design for the web. His solution, in short, was to use screen orientation instead of size. Portrait or landscape.

Another problem with existing grid systems is the reliance on wrapper elements and class names. This is a little more tricky to deal with, but we'll look at a few solutions below.

## CSS Grid

Marvin hinted at this being the answer to all our grid related problems and that it should replace flexbox and floats. There is some merit to this and CSS grid is extremely powerful, but having tried building a "responsive by default" and highly flexible grid have shown that it might not be the best tool for the job. CSS experts have also said that CSS grid was never intended to replace flexbox.

That being said, CSS grid has a part to play in this system. First, let's look at some initial ideas.

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  grid-gap: 1rem;
}
```

This little line packs a ton of punch. This allows us to arrange all children in the `.grid` container as equally sized grid items, with as many columns as will fit while making sure no column is smaller than 250px.

This is extremely light weight and would work well for a gallery or similar layout of identical items. The only problem with this is that the minimum width of each column is static and must be set based on the developers knowledge of the content. What if you want a grid of blog posts *and* a grid of images. 250px might be fine for the images, but too small for the blog posts.

CSS grid works alright in situations like these, but it truly shines in bigger picture use cases, such as laying out the entire webpage, or the content in an individual component. It's fantastic for rearranging content too.

The problem with CSS grid is that it's only half as powerful as its potential. Developers must know what content will be laid out beforehand, making it hard to use it as the basis of a framework grid system.

## Flexbox

Flexbox has its own problems, mostly with its implementation in [internet explorer](https://github.com/philipwalton/flexbugs). Besides that flexbox, no pun intended, is extremely flexible. It gives us the ability to automatically fit as many items on a single row as possible, or limit the max number of items per row. Flexbox grids also give us the freedom to make an item larger or smaller than the other items in its row without overflowing.

Sounds like a dream, so what's the problem? Well, Flexbox isn't great at dealing with the gaps between items. `grid-gap` doesn't exist for flexbox, so we have to rely on the margins of the flex items themselves. This gets extremely hairy when you get into it, involving lots of math (and css variables if you want different gap sizes).

[Bulma](https://bulma.io/) offers my favorite implementation of the flexbox grid, but in my opinion, it's overly complicated for its best use case, and it relies on fixed media queries mentioned earlier. Essentially, the grid logic looks something like this:

```css
.grid {
  display: flex;
  flex-wrap: wrap;
  margin: calc(var(--grid-gap) * -1);
}

.grid-item {
  display: block;
  flex-basis: 0;
  flex-grow: 1;
  flex-shrink: 1;
  margin: var(--grid-gap);
}

.has-2-columns > .grid-item {
  width: calc( 50% - (var(--grid-gap) * 2));
}
.has-3-columns > .grid-item {
  width: calc( 33.3333% - (var(--grid-gap) * 2));
}
.has-4-columns > .grid-item {
  width: calc( 25% - (var(--grid-gap) * 2));
}

.grid-item.is-full {
  width: calc( 100% - (var(--grid-gap) * 2));
}
.grid-item.is-three-fourths {
  width: calc( 75% - (var(--grid-gap) * 2));
}
.grid-item.is-two-thirds {
  width: calc( 66.6666% - (var(--grid-gap) * 2));
}
.grid-item.is-half {
  width: calc( 50% - (var(--grid-gap) * 2));
}
.grid-item.is-one-third {
  width: calc( 33.3333% - (var(--grid-gap) * 2));
}
.grid-item.is-one-fourth {
  width: calc( 25% - (var(--grid-gap) * 2));
}
```

Now the last problem I have with this I'm on the fence about. It still bothers me that each grid item must have a class. One of the appeals of CSS grid is that child items *just work*. Sure you could use the universal selector, but it still somehow feels like bad practice because of the stigma around selector performance.

### One last idea

Before I close out this article, I wanted to show one more grid solution that uses CSS grid. Similar to above, we can use CSS custom properties to adjust values inside the grid. If we replace a few key parts of our CSS grid based system at the very beginning with a handful of variables, it becomes much more versatile.

```css
.grid {
  --col-min-width: 250px;
  display: grid;
  grid-template-columns:
    repeat( auto-fit, minmax( var(--col-min-width), 1fr ));
  grid-gap: 1rem;
}
```

```html
<!-- Larger content -->
<div class="grid" style="--col-min-width: 500px">
```

This brings a new problem though. What happens when the screen is smaller than 500px? One solution I saw was the use of `min()` inside the `minmax` function:

```css
.grid {
  grid-template-columns:
    repeat(
      auto-fit,
      minmax(min( var(--col-min-width), 100% ), 1fr)
    );
}
```

Buyer beware however, at the time of writing the `min()` function sees extremely [limited browser support](https://caniuse.com/#feat=mdn-css_types_min).

If you have components that use a different layout for portrait and landscape, you could also add another CSS variable to this system to control the min width of the items in portrait and landscape mode individually, which could prove to be quite powerful.

## Final thoughts

Both of these systems have problems if you need to support internet explorer, because these systems either rely on [CSS grid](https://caniuse.com/#feat=css-grid) or [custom properties](https://caniuse.com/#feat=css-variables), which IE never properly implemented.

The auto grid using CSS grid seems like such a beautiful and simple solution to the common layout problem, which makes the difficulty of creating deviations all the more frustrating.

At the end of the day, the fact of the matter is that there is no one-size-fits-all grid system. But I'm pretty happy with the ideas here, and look forward to seeing how the landscape of CSS evolves in the future.
