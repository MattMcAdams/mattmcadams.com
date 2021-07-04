---
title: Approaches to Web Typography
date: 2020-08-20
published: true
series: "Typography"

tags: ['typography', 'design', 'css']
description: "There are a handful of ways we can use what we learned about modular scales when creating the typographical system of our website, from simple single scale systems to fully fluid typography. This article will take a look at each style and implementation, but all of these systems aim to address the question of how to handle text on both small and large screens."

thumbnail: null
cover_image: null
---

There are a handful of ways we can use what we learned about [modular scales](/posts/typographical-scale/) when creating the typographical system of our website, from simple single scale systems to fully fluid typography. This article will take a look at each style and implementation, but all of these systems aim to address the question of how to handle text on both small and large screens.

## Single Scale

The simplest system here is what I call a "Single Scale System". These systems rely on a single typographical scale and use that scale on all screen types.

![Diagram of the single scale system](/images/posts/single-scale.png)

This is the most common style of web typography, and could be setup so that there is absolutely no difference between the text on a phone or a desktop or it could be set up so that the scale is the same but the website text is overall larger or smaller on a specific screen size.

```css
/* Major Third (1.25) */
:root { font-size: 16px; }
#h1 { font-size: 1.953rem; }
#h2 { font-size: 1.563rem; }
#h3 { font-size: 1.25rem; }
p { font-size: 1rem; }
small { font-size: 0.8rem; }

@media only screen and (min-width: 600px) {
  :root { font-size: 18px; }
}
```

## Dual Scale

The dual scale uses two (or more) typographical scales, one for each range of screen sizes. These can be useful if you want massive headdings on desktop but need them to be smaller on mobile without changing the base font size.

![Diagram of a dual scale system](/images/posts/dual-scale.png)

A dual scale system can be more difficult in that each scale creates a certain mood or feeling. It can be hard to ballance those in a single brand. This style is however extremely effective and relatively easy to setup.

```css
/* Major Third (1.25) */
#h1 { font-size: 1.953rem; }
#h2 { font-size: 1.563rem; }
#h3 { font-size: 1.25rem; }
p { font-size: 1rem; }
small { font-size: 0.8rem; }

/* Perfect Fifth (1.5) */
@media only screen and (min-width: 600px) {
  #h1 { font-size: 3.375rem; }
  #h2 { font-size: 2.25rem; }
  #h3 { font-size: 1.5rem; }
  p { font-size: 1rem; }
  small { font-size: 0.667rem; }
}
```

## Skip Scale

This is a clever technique I learned from Medium. In this system, you would use a single scale but use only odd steps for mobile and even steps for desktop.

![Diagram of a skip scale system](/images/posts/skip-scale.png)

This style of typography is great for creating a consistant mood across all platforms.

```css
/* Major Third (1.25) odd steps */
#h1 { font-size: 3.052rem; }
#h2 { font-size: 1.953rem; }
#h3 { font-size: 1.25rem; }
p { font-size: 1rem; }
small { font-size: 0.8rem; }

/* Major Third (1.25) even steps */
@media only screen and (min-width: 600px) {
  #h1 { font-size: 3.815rem; }
  #h2 { font-size: 2.441rem; }
  #h3 { font-size: 1.563rem; }
  p { font-size: 1rem; }
  small { font-size: 0.64rem; }
}
```

## Fluid

The downside to all of the above solutions is that they rely on a set breakpoint. Fluid typography changes all of that and presents typography relative to the size of the screen between a maximum and minimum threshold. This is where things get tricky - a fully fluid typographical system involves a lot of math.

![Diagram of a fluid scale system](/images/posts/fluid-scale.png)

In a fluid scale, I highly recommend using a preprocessor such as Sass (SCSS) to help put names to the numbers. These systems are highly customizable and can augment any of the methods above. For this demo, I'll show the typography I use for my own website, based on the dual scale system.

First, I'm going to create a mixin for the bare essentials. This mixin sets the max and min screen sizes. The system will reach it's minimum font size at `$fluid-min-width` and the maximum font size at `$fluid-max-width`. This code also assumes you're working with html at 100% so that 1rem = 16px.

```scss
@mixin fluid-init($fluid-max-width: $config-fluid-max-width, $fluid-min-width: $config-fluid-min-width) {
  :root {
    --fluid-screen: 100vw;
    --fluid-bp: calc((var(--fluid-screen) - #{($fluid-min-width / 16) * 1rem}) / #{($fluid-max-width / 16) - ($fluid-min-width / 16)});
  }

  @media screen and (min-width: #{$fluid-max-width * 1px}) {
    :root { --fluid-screen: #{$fluid-max-width * 1px}; }
  }
}
```

Next we'll work on the meat of the system, a fluid mixin. This mixin will be used to calculate the value of eeach step of the scale.

```scss
/* Define our mixin with variables for min size, max size, min ratio, and max ratio */
@mixin fluid(
  $step: 0,
  $min-size: $config-min-size,
  $max-size: $config-max-size,
  $min-ratio: $config-min-ratio,
  $max-ratio: $config-max-ratio)
  {

  /* Define internal values */
  $_min-size: null;
  $_max-size: null;

  /* Start logic */
  @if ($step < 0) {
    /* Remove the negative from negative steps */
    $_step: $step * -1;
    /* Devide for negative steps, a min and max size */
    $_min-size: ($min-size / pow($min-ratio, $_step)) / 16;
    $_max-size: ($max-size / pow($max-ratio, $_step)) / 16;
  } @else if ($step > 0) {
    /* Multiply for positive steps */
    $_min-size: ($min-size * pow($min-ratio, $step)) / 16;
    $_max-size: ($max-size * pow($max-ratio, $step)) / 16;
  } @else {
    /* Normal size for step 0 */
    $_min-size: ($min-size) / 16;
    $_max-size: ($max-size) / 16;
  }
  /* Find the difference of the two sizes */
  $_difference: $_max-size - $_min-size;
  /* Magic variable that calculates based on screen size */
  --fluid-#{$step}: calc(#{$_min-size * 1rem} + (#{$_difference} * var(--fluid-bp)));
}
```

Now all thats left is to include the mixins to output the actual CSS and use the css variables to style the text.

```scss
@include fluid-init;

:root {
  @include fluid(-1); /* --fluid--1 */
  @include fluid(0);  /* --fluid-0 */
  @include fluid(1);  /* --fluid-1 */
  @include fluid(2);  /* --fluid-2 */
  @include fluid(3);  /* --fluid-3 */
}

#h1 { font-size: var(--fluid-3) }
#h2 { font-size: var(--fluid-2) }
#h3 { font-size: var(--fluid-1) }
p { font-size: var(--fluid-0) }
small { font-size: var(--fluid--1) }
```
