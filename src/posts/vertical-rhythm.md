---
title: Vertical Rhythm
date: 2020-07-13
published: true
series: "Typography"

tags: ['typography', 'design', 'css']
description: "Vertical rhythm is a concept in typography that aims to keep vertical spaces between elements consistent with each other. This creates repeatable patterns that readers subconsciously understand and use to read faster and more accurately."

thumbnail: null
cover_image: null
---

![left: example of good vertical rhythm, right: example of poor vertical rhythm](/images/posts/vertical-rhythm.png)

Vertical rhythm is a concept in typography that aims to keep vertical spaces between elements consistent with each other. This creates repeatable patterns that readers subconsciously understand and use to read faster and more accurately.

As a disclaimer, this is going to be an opinionated and complicated article.

## Terminology

<dl>
<dt>Baseline</dt>
	<dd>The invisible shared line on which capital letters sit. Curved or pointed letters, such as o and v, often fall slightly below the baseline to adjust to optically for their diminished points of contact with the line.</dd>
	<dt>Font size</dt>
	<dd>The maximum height of all characters in a font including all ascenders and descenders.</dd>
	<dt>Hierarchy</dt>
	<dd>An organization of elements in a composition that assigns greater importance to some elements than others.</dd>
	<dt>Leading</dt>
	<dd>The distance from baseline to baseline in a paragraph of text.</dd>
	<!--<dt>Letter spacing</dt>
	<td>The uniform alteration of the space between letters of a word. Similar to Tracking, the overall adjustment to the spaces between letters in all words in a block of text.</td>-->
	<dt>Line height</dt>
	<dd>The height of the invisible bounding box containing a line of text.<dd>
	<!--<dt>Line length</dt>
	<dd>The length of a line of body copy, containing an average number of characters and spaces in the selected typeface and font size.</dd>-->
</dl>

## The baseline grid

The baseline grid is perhaps the pinnacle of vertical rhythm and many have tried to use it on the web. This is an admirable goal, but one that will lead to many headaches.

What is a baseline grid? The baseline is the invisible line that all typographical characters sit on. A baseline grid is a system that use's the leading of a page's body copy to align all elements to the baselines of the text. This ensures that in two columns, the lines of text look like they sit on the same invisible line.

So what's the problem? The web doesn't care about baselines. It takes a much looser approach to typography, using `line-height` an invisible bounding box the text sits in.

![Example of baseline alignment vs line hight alignment. Notice that text using line height is positioned in the middle of the bounding box.](/images/posts/baseline-line-height.png)

This article is not going to go into replicating the baseline grid. If you're really interested in this approach, I'd recommend taking a look at the [8pt grid system](https://builttoadapt.io/intro-to-the-8-point-grid-system-d2573cde8632). It's probably the closest thing to the baseline grid on the web.

The only thing about the 8pt grid system and other systems like it, is that they require you to work from the outside in. I firmly believe the base of any design should be it's text. Determining your unit of measurement first requires you to select font sizes that work with that measurement.

## What is the magic number?

When you think about it, what is the smallest unit of vertical measurement we already have established by default? For the designers who created the idea of a baseline grid, it was the leading from one line of body copy to the next.

Leading doesn't exist in web typography - there is no space between lines of text, so what do we use? The line height itself.

Now, to create perfect vertical rhythm, like would exist if using a baseline grid, every element's height and margin should equal a multiple of the base line height.

Except, I'm going to bend the rules a little. You may have already realized this but the average line height is just too large for practical use. My suggestion is to divide it in half and use *that* number as your base unit.

This number needs to become your new best friend. Where I currently work, this value is 0.8rem (our base line height is 1.6)

## Calculating the line height

In the previous article, we looked at modular scales, so let's calculate the line height for each step of a scale. This would use a formula like this:

```
X = Font Size
Y = Base Line Height
Z = Line Height

A * Y = Z

Where A is an increment of 0.5 and is as high as possible so that Z >= X
```

For example, let's say our base font size is 10px, we have a 1.5 ratio, and the base line height is 1.6 (16px). The next step in the scale would be 15px and its line height would be 16px since 16 is greater than or equal to 15.

At this point, the designer might say "well that's just too tight and it needs to be wider" and they could increase the line height up to 24px since 16 * 1.5 = 24

## Margins, Paddings, and Borders

Keep in mind that the total height of any element including margins, borders, paddings, and content should be a multiple of the base line-height / 2. I'll refer to this as the "space unit" from here on.

- If you add a padding, use a multiple of the base line height divided by 2. For small top and bottom paddings, consider using the base line height divided by 4.
- Do not use a bottom margin less than the base line height on any block level element, and if you add to that margin, use a multiple of the base line height
- If you add a border you need to subtract 2 times the border’s width from the bottom margin.
- Any elements that have a height property, that value should be a multiple of the base line height.

Obviously, this is highly nit picky and would be next to impractical to use in production. This is simply the goal of a perfect vertical rhythm.

## Images

As proof that an absolutely perfect vertical rhythm is likely impractical in production, consider responsive images where the height changes fluidly as the window is scaled to maintain the image’s aspect ratio.

This could be achieved with JavaScript by cropping the image to a height multiple of the line height but less than the auto height of the image, but I’m not sure this level of perfection is necessary or desirable. In the future, advancements in CSS math may provide an answer to this.

## A loose system

Maintaining vertical rhythm can be done quite easily as long as we understand where we can break the rules. In my experience, I feel that we can allow images, borders, and small paddings to fudge the rules.

The most important take away is that we have a consistent margin that is preferably based on the line height of our body copy. Large paddings like those on cards could also be considered when using this system of spacial measurement, as well as the height of arbitrary containers or content where it is convenient to do so.
