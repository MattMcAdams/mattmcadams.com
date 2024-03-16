---
title: "Skip template evaluation in code blocks"
date: 2024-03-16

tags: ['11ty', 'tutorial']
description: "In my last post, I needed to show some njk syntax as a code example, but 11ty kept trying to evaluate the njk instead of displaying it. In this post, I'll show how I got around this with shortcodes"

thumbnail: null
cover_image: null
---

In my last post, I needed to show some njk syntax as a code example, but 11ty kept trying to evaluate the njk instead of displaying it. So, let's look at how I got around this with shortcodes.

This is going to be a short one because the answer is fairly straightforward. I will mention that I did try to replace the percent signs with `&percnt;` but that just printed the html entity code literally.

The solution was to add two shortcodes: `lbrace` and `rbrace`. I chose these names because they're the html entity codes for the characters I need. The objective of these shortcodes is to render the brace characters that start and end nunjucks statements.

```js
// .eleventy.js
eleventyConfig.addShortcode("lbrace", function () {
  return `{`;
});

eleventyConfig.addShortcode("rbrace", function () {
  return `}`;
});
```

Using these shortcodes, we can show an example in a markdown codeblock like this:

```md
{%lbrace%}%lbrace%{%rbrace%}{ expression }{%lbrace%}%rbrace%{%rbrace%}
or
{%lbrace%}%lbrace%{%rbrace%}% expression %{%lbrace%}%rbrace%{%rbrace%}
```

I'm surprised I couldn't find any other way to escape the characters and sure, it's a little inconvenient, but it gets the job done. Anyway, thanks for reading and I hope this helps!
