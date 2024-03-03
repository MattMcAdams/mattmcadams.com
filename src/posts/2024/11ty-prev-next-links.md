---
title: 11ty - Previous and Next links
date: 2024-02-28

tags: ['tutorial', '11ty']
description: "Linking to pervious and next post in a collection is a somewhat common feature that I didn't need until recently. It took me a little bit to work out how to do it since the docs were a little ambiguous, so let's build it together using 11ty collections."

thumbnail: /images/posts/2024/11ty-prev-next.png
cover_image: /images/posts/2024/11ty-prev-next.png
---

When I was developing the template I use for each of my [logs](/log), I wanted to provide quick previous and next links since the collection items are serial in nature. To being with, I did this with metadata on each individual log. This worked well to get the concept, but it was really inconvenient for long term use. Later, I looked into 11ty pagination and found this solution.

![Mockup of previous and next links](/images/posts/2024/11ty-prev-next.png)

## Setting up the collection items

The first and really only challenge to this method is getting the collection item for the previous and next link to point to. Luckily, this is fairly simple since 11ty includes the `getPreviousCollectionItem` and `getNextCollectionItem` filters. We can filter our collection like this:

```liquid
<!-- template.njk -->
{%lbrace%}% set previousPost = collections.logs | getPreviousCollectionItem %{%rbrace%}
{%lbrace%}% set nextPost = collections.logs | getNextCollectionItem %{%rbrace%}
```

This will setup two variables called `previousPost` and `nextPost` with each holding a single collection item or being empty if there was no collection item found.

## Displaying the links

Next we want to render the previous and next links. First, we want to wrap the whole thing in an if statement to see if either previousPost or nextPost are truthy.

I'm using a `nav` element here, which [requires a label](https://www.aditus.io/patterns/multiple-navigation-landmarks/) if you're using more than one.

```liquid
<!-- template.njk -->
{%lbrace%}% if previousPost or nextPost %{%rbrace%}
  <nav aria-label="pagination">
    <!-- Links will go here -->
  </nav>
{%lbrace%}% endif %{%rbrace%}
```

Now let's add the links. Here we're using if statements to prevent rendering empty html tags if the variable is empty.

```liquid
<!-- template.njk -->
{%lbrace%}% if previousPost %{%rbrace%}
  <a href="{%lbrace%}{ previousPost.url }{%rbrace%}">&larr; Previous</a>
{%lbrace%}% endif %{%rbrace%}
<span>&nbsp;</span>
{%lbrace%}% if nextPost %{%rbrace%}
  <a href="{%lbrace%}{ nextPost.url }{%rbrace%}">Next &rarr;</a>
{%lbrace%}% endif %{%rbrace%}
```

Notice that I've included a span with a non breaking space. This is just here because I want to justify the links with space between. Adding the span makes sure that the next link is always on the right even if the previous link doesn't exist.

Here's it all together:

```liquid
<!-- template.njk -->
{%lbrace%}% set previousPost = collections.logs | getPreviousCollectionItem %{%rbrace%}
{%lbrace%}% set nextPost = collections.logs | getNextCollectionItem %{%rbrace%}
{%lbrace%}% if previousPost or nextPost %{%rbrace%}
  <nav aria-label="pagination">
    {%lbrace%}% if previousPost %{%rbrace%}
      <a href="{%lbrace%}{ previousPost.url }{%rbrace%}">← Previous</a>
    {%lbrace%}% endif %{%rbrace%}
    <span>&nbsp;</span>
    {%lbrace%}% if nextPost %{%rbrace%}
      <a href="{%lbrace%}{ nextPost.url }{%rbrace%}">Next →</a>
    {%lbrace%}% endif %{%rbrace%}
  </nav>
{%lbrace%}% endif %{%rbrace%}
```

## Styling the links

This part is completely optional and subjective, but I figured for completeness I'd show the CSS I used to get the layout I wanted.

```css
/* styles.css */
nav[aria-label="pagination"] {
  display: flex;
  justify-content: space-between;
}
```

I'm using an attribute selector here to target a nav element with the aria-label "pagination". I do this so that the styling is dependent on accessible markup.
