---
title: Writing Smarter CSS
date: 2021-01-14
published: true
series: false

tags: ['css']
description: "Authoring more robust CSS with smart selectors"

thumbnail: null
cover_image: null
---

CSS authoring has become my favorite part of being a designer and developer but like anyone who has built more than three websites, I got tried of starting fresh every time. Frameworks, boilerplates, and other systems became part of my toolkit but I hated using the metric ton of extra CSS that I never used and didn't write and overriding a lot of styles because they were too opinionated.

I decided to make my own boilerplate built on modern authoring techniques and design systems. In this article I'm going to talk about a few tricks I used and why this set of base styles works so well.

## Addressing visibility woes

One challenge that is easy to overcome but difficult to do well is controlling the visibility of elements. Sure, we can always reach for `display: none;` but let's look at these two first and I'll explain why they're better.

When you need to hide something from users but it needs to be available for screen readers using `display: none;` is fairly unreliable. Screen readers have gotten pretty smart and sometimes ignore elements that don't display. This feature will render the element invisible, and the technique is pretty common, but pay close attention to the `:not` selectors.

Let's consider a "skip to content" button. We want this to be hidden but available for assistive technology. You HAVE to display this content on focus for it to be WCAG compliant. This selector will cover that use case.

```css
.visually-hidden:not(:focus):not(:active) {
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;
}
```

Fun fact: the default HTML `hidden` attribute has an incredibly low specificity. This means that you can show a hidden element with CSS. To fix this, I always include the following CSS to my project:

```css
[hidden] {
  display: none !important;
}
```

It's probably best practice to use the `hidden` attribute truly hide content instead of having a `.hidden` CSS class. This will help you do that without any unexpected problems.

## Stop fighting with base styles

How many times have you gone to do some sort of layout using the correct html elements and had to override a bunch of default styles? Think about a traditional horizontal navigation bar. These are typically built with an unordered list and formatted to look like a nav bar. Take a look at the following HTML:

```html
<nav>
  <ul class="nav-bar">
    <li><a href="/home">Home</a></li>
    <li><a href="/services">Services</a></li>
    <li><a href="/about">About</a></li>
  </ul>
</nav>
```

The first thing you'll need to do is work on removing all the `<ul>` and `<li>` styles before you start any layout work. We can actually skip this step with some smart CSS in our base styles. Let's look at an example:

```css
ul:not([class]) { list-style-type: disc; }
```

The CSS now knows that you're going to be altering the style of the list so it goes ahead and removes those basic styles for you. We can leverage this trick for links too.

## More context for links

One really nice thing I see from time to time are links that feature an icon to indicate that the link will open in a new tab or that the link will go to a PDF. We can implement this with some clever CSS.

```css
a:not([class])[target="_blank"]::after,
a:not([class])[data-link-type="external"] {
  content: ' \e91f';
  font-size: 90%;
}
```

This CSS will apply to any link that doesn't have a class and opens in a new tab. The reason I wanted to restrict this to links without classes is because there may be a time where I need a link to be styled like a button and the button doesn't need the icon.

```css
a:not([class])[href$='.pdf']::after,
a:not([class])[data-link-type='document']::after {
  content: '\e91d';
  font-size: 90%;
  padding-left: 0.1em;
}
```

This CSS uses the same principal but adds a PDF icon to the end of the link. We can achieve this with `[href$='.pdf']` this looks for a link who's `href` ends with ".pdf".

> It's important to note that this exact implementation was designed with an icon font in mind. You can get around this by changing the `content` property to whatever suits your need.

## Accessibility first

Another cool trick we can do with CSS is help enforce accessible markup. For example, we can require certain aria labels to be present. Let's look at a common "alert" component.

```html
<div role="alert">Test Alert</div>
```

It is more semantically correct to use `role="alert"` than a generic `class="alert"` because it gives more information to assistive technologies. We can enforce this markup by authoring our CSS with that in mind:

```css
div[role='alert'] {
  color: white;
  background-color: tomato;
  padding: 1em;
}
```

## Small design system

I firmly believe that EVERY project can benefit from having a design system. I don't mean that you need a huge and involved framework or documentation. I'm talking about a handful of standard colors and numbers to act as design tokens. Let's look at a super simple design toolbox.

```css
:root {
  --font-body: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --font-head: var(--font-body);
  --font-mono: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;

  --color-gray-100: #F3F4F6;
  --color-gray-500: #6B7280;
  --color-gray-900: #111827;
  --color-red-100: #FEE2E2;
  --color-red-500: #EF4444;
  --color-red-900: #7F1D1D;
  --color-yellow-100: #FEF3C7;
  --color-yellow-500: #F59E0B;
  --color-yellow-900: #78350F;
  --color-green-100: #D1FAE5;
  --color-green-500: #10B981;
  --color-green-900: #064E3B;
  --color-primary-100: #E0F2FE;
  --color-primary-500: #0EA5E9;
  --color-primary-900: #0C4A6E;

  --page-bg-color: white;
  --element-bg-color: var(--color-gray-100);
  --text-color: var(--color-gray-900);
  --light-text-color: var(--color-gray-500);
  --heading-color: var(--text-color);
  --link-color: var(--color-primary-500);

  --space-unit: 1.5rem; /* Should equal base line-height */
  --content-width: 900px;
  --sidebar-width: 300px;
  --side-pad: var(--space-unit);
}
```

This small section of design tokens can evolve to create a ton of visually robust UIs. Another huge part of having a great design system is great typography. I've [talked a lot about typography](https://www.mattmcadams.com/thoughts/tag/typography/) before, so I won't get on that soap box here, but do check out those articles.

## Easy media queries

With today's wide variety of screen sizes and resolutions its more and more difficult to keep up using traditional media queries. The solution? Consider testing for screen orientation instead of screen width. Let's look at a simple grid implementation:

```css
.grid {
  --grid-gap: var(--space-unit);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  grid-gap: var(--grid-gap);
}

@media ( orientation: portrait ) {
  .grid-portrait {
    --grid-gap: var(--space-unit);
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    grid-gap: var(--grid-gap);
  }
}

@media ( orientation: landscape ) {
  .grid-landscape {
    --grid-gap: var(--space-unit);
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    grid-gap: var(--grid-gap);
  }
}
```

With this system, you leverage responsive-by-default grid layouts and can constrict grid functionality to landscape only, portrait only, or both. You can expand this principal to work with sidebars or other content layouts.

## Conclusion

These are just a few new techniques I've implemented in several of my personal projects and I hope that you found something here that was fresh and insightful. If you liked this article and these ideas, please [check out my CSS boilerplate](https://github.com/MattMcAdams/CSS-Boilerplate) on GitHub.
