---
title: 11ty - Previous and Next links
date: 2024-02-28

tags: ['tutorial', '11ty']
description: "Let's add previous and next links to a page template using 11ty collections."

thumbnail: /images/posts/2024/11ty-prev-next.png
cover_image: /images/posts/2024/11ty-prev-next.png
---

When I was developing the template I use for each of my [logs](/log), I wanted to provide quick previous and next links since the collection items are serial in nature. To being with, I did this with metadata on each individual log. This worked well to get the concept, but it was really inconvenient for long term use. Later, I looked into 11ty pagination and found this solution.

![Mockup of previous and next links](/images/posts/2024/11ty-prev-next.png)

## Setting up the collection items

The first and really only challenge to this method is getting the collection item for the previous and next link to point to. Luckily, this is fairly simple since 11ty includes the `getPreviousCollectionItem` and `getNextCollectionItem` filters. We can filter our collection like this:

```liquid
<!-- template.njk -->
{% openBracket %}% set previousPost = collections.logs | getPreviousCollectionItem %{% closeBracket %}
{% openBracket %}% set nextPost = collections.logs | getNextCollectionItem %{% closeBracket %}
```

This will setup two variables called `previousPost` and `nextPost` with each holding a single collection item or being empty if there was no collection item found.

## Displaying the links

Next we want to render the previous and next links. First, we want to wrap the whole thing in an if statement to see if either previousPost or nextPost are truthy.

I'm using a `nav` element here, which [requires a label](https://www.aditus.io/patterns/multiple-navigation-landmarks/) if you're using more than one.

```liquid
<!-- template.njk -->
{% openBracket %}% if previousPost or nextPost %{% closeBracket %}
  <nav aria-label="pagination">
    <!-- Links will go here -->
  </nav>
{% openBracket %}% endif %{% closeBracket %}
```

Now let's add the links. Here we're using if statements to prevent rendering empty html tags if the variable is empty.

```liquid
<!-- template.njk -->
{% openBracket %}% if previousPost %{% closeBracket %}
  <a href="{% openBracket %}{ previousPost.url }{% closeBracket %}">&larr; Previous</a>
{% openBracket %}% endif %{% closeBracket %}
<span>&nbsp;</span>
{% openBracket %}% if nextPost %{% closeBracket %}
  <a href="{% openBracket %}{ nextPost.url }{% closeBracket %}">Next &rarr;</a>
{% openBracket %}% endif %{% closeBracket %}
```

Notice that I've included a span with a non breaking space. This is just here because I want to justify the links with space between. Adding the span makes sure that the next link is always on the right even if the previous link doesn't exist.

Here's it all together:

```liquid
<!-- template.njk -->
{% openBracket %}% set previousPost = collections.logs | getPreviousCollectionItem %{% closeBracket %}
{% openBracket %}% set nextPost = collections.logs | getNextCollectionItem %{% closeBracket %}
{% openBracket %}% if previousPost or nextPost %{% closeBracket %}
  <nav aria-label="pagination">
    {% openBracket %}% if previousPost %{% closeBracket %}
      <a href="{% openBracket %}{ previousPost.url }{% closeBracket %}">← Previous</a>
    {% openBracket %}% endif %{% closeBracket %}
    <span>&nbsp;</span>
    {% openBracket %}% if nextPost %{% closeBracket %}
      <a href="{% openBracket %}{ nextPost.url }{% closeBracket %}">Next →</a>
    {% openBracket %}% endif %{% closeBracket %}
  </nav>
{% openBracket %}% endif %{% closeBracket %}
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
