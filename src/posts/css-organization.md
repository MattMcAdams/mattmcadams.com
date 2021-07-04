---
title: CSS Organization
date: 2019-12-06
published: true
series: false

tags: ['css', 'process']
description: "While researching best practices of CSS organization this past year for a huge UI project at work, I ran across several ideas and strategies to solve this problem. My goal here is to digest these ideas and formulate a more comprehensive approach to organizing CSS."

thumbnail: null
cover_image: null
---

While researching best practices of CSS organization this past year for a huge UI project at work, I ran across several ideas and strategies to solve this problem. My goal here is to digest these ideas and formulate a more comprehensive approach to organizing CSS.

For the purposes of this article, I'll be talking more specifically about Sass and similar workflows.

## Putting the C in CSS

Many developers I've seen attacking this problem think of the cascade as the enemy - a tangled mess of specificity issues and unpredictable styles. I'd argue that they're not great at writing CSS. The cascade is one of the fantastic features of CSS and it can make your life much easier if you lean into it.

For example, why define the typography for every component when you can rely on inheritence? If you decide to later change the typographical scale the project is built on, its much easier to change at the root level than have to hunt down every component you've used. Of course, you can leverage CSS variables, but we'll get into that later.

### The inverted triangle (ITCSS)
This is a concept I read a few months back and really enjoied it's concept. It doesn't seem to be widely talked about, but it essentially shows how to arrange CSS based on specificity, leaning into the cascade to carry styles throughout the design.

I think this is the most common-sense method of organizing a massive stylesheet or project. Consider this example index.scss

```scss
// Layer 1: Preprocessor
@include 'requirements';
@include 'settings';
@include 'tools';
// Layer 2: Basic Styles
@include 'reset';
@include 'elements';
// Layer 3: UI
@include 'layout';
@include 'components';
@include 'objects';
// Layer 4: Utilities
@include 'helpers'
```
In the first layer, we include libraries our project relies on, our Sass functions and mixins, and any configuration variables / setup needed for them to run.

In the second layer, we include any CSS resets and lay down the base styles for all of the html elements. This layer should have the least specificity, relying almost exclusively on html element selectors.

The third layer is where all the fun is, and where you have the most freedom to move things around. In layout, I have things like the overall site layout, grid systems, etc. These should all essentially just be containers used to position other elements.

I also include UI components in this layer. Components are usually reusable class-based UI elements like cards, buttons, chips, etc. The third layer is the only layer where things are allowed to have "children". And I say children here in quotes because I'm not using literal descendent selectors, but BEM style naming to create child elements in a design sense. More on this below.

Objects in the third layer are one-per-page, major UI components referenced with an ID. This might be the header, footer, sidebar, etc. There should only be one of them. Using an ID selector here is debatable. It should be fine, but you can use classes for selecting those items if you want. The important thing is that there is a mental understanding that these are major UI elements.

The last layer includes style rules with `!important`. These are utility and helper rules that take precidence over the other styles no matter what, like `.hide` to make sure the element is set to display: none.

## Naming

> There are only two hard things in Computer Science: cache invalidation and naming things.
>
> -- Phil Karlton

Naming things are always hard. Too verbose and its a chore to type out, too short and its difficult to understand. For years, I tried to walk this fine line, to create abbriviations or short abstractions to make the code "cleaner" and easier to write. But as I've gotten more experience I've been leaning toward readability over writability because maintenance is a bigger chore than development.

This is how I approach class names:
```
component:        .noun
child:            .noun__noun
theme:            .noun--adjective
state:            .is-state | .has-state
object:           #noun
layout:           .l-layout
utility:          .u-utility
accessibility:    .aria-
```

At first, it looks like BEM. Thats because it is. But then it looks kind of like SMACSS. Thats because it is. BEM and SMACSS solve similar but different problems, this is just a way of bringing them together.

### Responsive suffixes
I'm conflicted about this because it feels hacky, but I've seen several other developers use this method so I thought I'd mention it here as well.

You can attach a suffix representing a media query to the end of a class like this: `.l-grid@landscape`. This would show the contents of that container as a grid if the screen orientation is landscape. The problem with this is that the `@` symbol isn't technically valid - you'll have to escape the character in the CSS.

```scss
@media (orientation: landscape) {
  .l-grid\@landscape {
    ...
  }
}
```

## Other things to consider

If using a framework like Vue or React that allow you to store your HTML, CSS, and JavaScript all in one file, I think you can move the component styles to those one-file components. The UI layer is so flexible that it shouldn't matter where exactly you put these styles, as long as you don't start overriding them or combining them.

Remember that each component and their children should be mutually exclusive from any other component. That is to say, a `.card` can not also be a `.button`. If you have a use case for this, consider creating a card theme: `.card--button`.

## On CSS variables
I think variables are fantastic and you should absolutely use them wherever possible. If you can afford to drop support for older browsers, CSS custom properties are the way to go. Otherwise, you can use Sass or other preprocessor variables throughout the code. Variables of any kind should be included in the first layer of the CSS, before resets or base styles are added.
