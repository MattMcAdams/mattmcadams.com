---
title: Typographical Scales
date: 2020-06-30
published: true
series: "Typography"

tags: ['typography', 'design', 'css']
description: "In any form of design, one uses a series of measures to plan and layout the product. Measurements create precision, consistency, and promote trustworthiness. In print, common measurements are inches, centimeters, points, and picas. In the world of digital and web design we use pixels and more relative measurements such as percentages."

thumbnail: null
cover_image: null
---

In any form of design, one uses a series of measures to plan and layout the product. Measurements create precision, consistency, and promote trustworthiness. In print, common measurements are inches, centimeters, points, and picas. In the world of digital and web design we use pixels and more relative measurements such as percentages.

I bring this up in a series about typography because typography and its measurements sit at the very core of any design - even if unintentionally. I love typography and like to think of it as the starting point of any project. Today we'll be talking about the relationships that relate most to typography, though we'll see how these measurements have much further reaching implications in a future article.

## Terminology

<dl>
	<dt>Body</dt>
	<dd>The related paragraphs of text is a typographic composition. "Body" typically refers to the primary copy and supported by headlines, captions, quotations, etc.</dd>
	<dt>Composition</dt>
	<dd>The arrangement of elements within a visual field or page.</dd>
	<dt>Font size</dt>
	<dd>The maximum height of all characters in a font including all ascenders and descenders.</dd>
	<dt>Hierarchy</dt>
	<dd>An organization of elements in a composition that assigns greater importance to some elements than others.</dd>
	<dt>Rhythm</dt>
	<dd>An ordered recurrent alteration of elements in a visual sequence.</dd>
</dl>

## The classical scale

Typographic measuring systems began with the letterpress, which required all characters and spaces to sit tightly packed line after line on a physical press. What resulted from this was the classical type scale: 18pt, 24pt, 36pt, 48pt, 64pt, 72pt, and 96pt. These numbers were chosen because of their mathematical relationship. 18 = two lines of 9; 24 = two lines of 12; 48 = two lines of 24; 72 = two lines of 36 or six lines of 12.

![Diagram of the mathematical relationships of font sizes in the classical type scale](https://mattmcadams.com/images/posts/classical-scale.png)

This typographical scale served for hundreds of years and is now considered the default in many word processing software. Now in the age of computer graphics and websites, we more often need to specify a *relative* size for each step in the scale to ensure the composition responds to responsive and reactive environments.

## The base unit

The base unit of a typographical composition is the default size of the body. In most browsers, this default is 16px.

A trick I've seen many times to simplify typographical math on the web is to reset the base font size. Because typical browsers set the base font size at 16px, a web designer can reset that to 62.5% thus resetting the base font size to 10px. From here, the relative unit `em` may be used to set responsive font sizes that easily equate to solid pixels. For example 1.8em would equal 18px.

## A modular scale

The classical typographical scale uses multiples of 3 and a designer has selected a few values from that set to create a range of font sizes that work harmoniously together. Now that there are no physical constraints to selecting font sizes, what keeps designers from selecting completely arbitrary values? Well, sometimes they do, but creating a set scale is a more reliable way to create font sizes that share a rhythm.

One way to create a typographical scale is to use a ratio. Sometimes called "modular scales" these scales can have an infinite number of steps and can react to changes in the base unit.

![Preview of the first three font sizes in a modular scale with a ratio of 1.5](https://mattmcadams.com/images/posts/modular-scale.png)

The first step is to choose a ratio, for this example I'll be using 1.5 and a base unit of 10px. Multiply each step by the ratio to get the value of the next.

```css
small { font-size: 6.667px; }.  /* 10 / 1.5 */
body  { font-size: 10px; }      /* base */
h3    { font-size: 15px; }      /* 10 * 1.5 */
h2    { font-size: 22.5px; }    /* 15 * 1.5 */
h1    { font-size: 33.75px; }   /* 22.5 * 1.5 */
```

A more concise way to write the formula would be `x = y * z^x` where x is the step in the scale, y is the base unit, and z is the chosen ratio.

Instead of using absolute values, try using `rem` units. These units in CSS use the document's base font size as its unit of measure. For example, if the document's default size is 16px, then 1rem = 16px.

The above scale can instead be written as `x = x^y` where x is the step on the scale and y is the chosen ratio.

```css
small { font-size: 0.667rem }    /* 1 / 1.5 */
body  { font-size: 1rem; }      /* base */
h3    { font-size: 1.5rem; }    /* 1 * 1.5 */
h2    { font-size: 2.25rem; }   /* 1.5 * 1.5 */
h1    { font-size: 3.375px; }   /* 2.25 * 1.5 */
```

You can explore other scales and see the results live [Type Scale](https://type-scale.com/), an awesome tool by Jeremy Church.

## Using variables

Using a scale built on a ratio does have the limitation that each step usually yields a more complex number that is harder to remember. At work, we've used sticky notes to remember common measurements without having to look it up or redo the math.

In the example below, I'll be using the preprocessing syntax SCSS, but this could also be achieved using [CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*) better known as CSS variables.

```scss
$ms_-1: 0.667rem;
$ms_0:  1rem;
$ms_1:  1.5rem;
$ms_2:  2.25rem;
$ms_3:  3.375rem;
}

small { $ms_-1; }
body  { $ms_0; }
h3    { $ms_1; }
h2    { $ms_2; }
h1    { $ms_3; }
```
