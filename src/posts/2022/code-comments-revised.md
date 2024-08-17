---
title: Code Comments Revisited
date: 2022-05-01

tags: ['process']
description: "Back in 2019 I made a post about a code comment plugin I had found for VS Code, and how I configured it to fit my needs. Today I wanted to expand on that to show how I go about commenting my code in general."

thumbnail: null
cover_image: null
---

Before we get started, please be aware I'm going to be using Visual Studio Code with the [Comment Anchors](https://marketplace.visualstudio.com/items?itemName=ExodiusStudios.comment-anchors) extension. I really love the ability to place easy to skim, important callouts in my code.

<div class="callout--tip">
  <p>Helpful tip: You can comment out a selected line in VS Code by either selecting the code you want to comment out or placing your cursor on a specific line and pressing <kbd>command</kbd> + <kbd>/</kbd></p>
</div>

## Comment Guidelines

It's my opinion that you should write code that is easy to read. That doesn't mean to throw away abstraction or ignoring DRY principals, but you should weigh the gains of any refactor against how opaque it makes the code. Easy to read code doesn't need comments to explain how it works, any developer should be able to figure that out by reading the code.

### Provide context

As a rule of thumb, avoid using comments to describe exactly how the code works, use them to answer questions instead. Comments are most powerful when they provide context about the code or answer questions not easily answered by reading the code itself.

Ultimately, how you use comments are up to you and the project manager if you have one. Everyone has a different preference and system, but here's what works for me:

1. Keep comments short
2. Use comments to provide context
3. Use comments to answer questions
4. In some cases, it may be good to use comments as documentation
5. Comments, and white space can be used to help organize code in a larger file

The last rule to writting a good code comment is to ignore the rules. If you think adding a given comment will improve code clarity, by all means, write the comment!

## Comment with Style

In general, I have a few rules about comment formatting:

- Horizontal rules are made up of "=" characters instead of "-" this is because many programs will swap the hyphen glyph for an em-dash, which is not the same thing in plain text. Using equal signs helps prevent this accidental mutation if copy and pasting between multiple softwares.
- I try to keep comments at most 70 characters long. I've found this number to be fairly safe when cross posting code between websites and different editor sizes.
- One blank line between each logical chunk. The exact definition of a logical chunk differs between language and code content
- Three blank lines or a sectioning comment between "sets" of logical chunks that belong together. Sometimes it makes sense to break these out into their own file or module.

### Tabs vs Spaces

I've yet to hear a definitive "right" answer to this age old controversy. My take is that you should setup your code editor to use soft tabs set to 2 spaces. My reason for this are:

1. Spaces render more consistently across text editors and websites, basically anywhere monospaced text is supported
2. Two spaces is enough to see indention while still being fairly slim, allowing more nested code without weird line wraps

You can also set this setting up for individual workspaces if you work on projects with different indention rules. Ultimately, I don't think it matters too much, spaces have just never caused me problems while tabs have.

### Line comments

The type of comment people are most familiar with, I use single line comments to make a short note to describe some code, for example:

```css
/* Decrease space between sequential headings */
h1 + h2,
h2 + h3,
h3 + h4,
h4 + h5,
h5 + h6 {
  margin-top: 0;
}
```

This style of comment is meant to remind me what a specific piece of code does and why it is needed. They are short and to the point, thus only requiring one line.

### Block Comments

These are the complicated ones that have to explain how a function works or what it does. Typically, I prefer to use block level comments as documentation and rely on line by line comments to walk through what the code is doing if it's not obvious.

<div class="callout--info">
  <p>I think it's important to note here that I favor reasonably verbose code with plenty of comments over excessively opaque things that are hard to read. In my opinion, as long as the code does its job well and there are no performance concerns, the "right" way to code is the way that will allow future developers - maybe even your future self - to understand and modify the code more easily.</p>
</div>

#### Documenting a function

Let's look at how I've documented this old JS function

```js
/** ==============================
  * ANCHOR Modular Scale
  * Returns a number on a modular scale defined by the ratio
============================== **/
function modularScale (increment, base = 1, ratio = CONFIG.ratio) {
  if (increment === 0) { return base; }
  if (increment < 0 ) {
    increment = increment * -1; // remove negative from number
    return base / pow(ratio, increment);
  }
  return base * pow(ratio, increment);
}
```

I use a block comment to introduce the function and describe what it does. This is also a good place to define all arguments and parameters the function accepts, their expected types, defaults, and what they do.

#### Grouping comments

Another way I've used block comments is to group a bunch of single line comments to keep the code cleaner. Let's take a look:

```css
/** ==============================
  * [1] Remove default list margins
  * [2] Allow content to sit on same row
  * [3] Allow content to wrap if there's not enough room
  * [4] Force content to wrap if the content would be less than 300
  * [5] Set a low starting width - Would be 1/3, but we'll go much less than
  * that to give room for padding
  * [6] Add space between the items left and right
  * [7] Allow items to fill remaining space
===============================**/

ul.it-news {
  /*[1]*/ margin-left: 0;
  /*[2]*/ display: flex;
  /*[3]*/ flex-wrap: wrap;
}
.it-news > .newsflash-item {
  /*[4]*/ min-width: 300px;
  /*[5]*/ width: 20%;
  /*[6]*/ padding: 0 token.space(0.5);
  /*[7]*/ flex-grow: 1;
}
```

### Sectioning

This is one of the most important parts of code commenting you can do. To clearly divide code into logical sections within a single file creates landmarks that are easy to find when skimming. I use the plugin Comment Anchors to augment this practice, since it will add a list of all anchors to a sidebar for easy navigation. Section anchors allow you to define a region and group other anchors or even other sections together.

For a section comment, I create a wide divider and include the section anchor, name, and any information about the section before closing it with another wide divider.

```css
/** =================================================================
  * SECTION Tokens
================================================================= **/
```

It's important that when using the `section` anchor, you also "close" it at the end of the section. I usually do this by adding a one line comment right above the next section's heading.

```css
/* END !SECTION Tokens */
/** =================================================================
  * SECTION Universal Defaults
================================================================= **/
```

#### Sub sections

I mentioned earlier that you can nest section anchors. I still prefer to leave these ultra-wide comments for top level sections, so for sub sections, I use my usual block comment style.

```css
/** ==============================
  * SECTION Typography
============================== **/
```

## Anchors

I've touched on anchors a bit with sections, but there are other great keywords you can use to add landmarks to a file. The [Comment Anchors](https://marketplace.visualstudio.com/items?itemName=ExodiusStudios.comment-anchors) documentation outlines the ones it comes with by default, you can also add and customize your own.

Here's my anchors and what I use them for:

<dl>
  <dt>ANCHOR</dt>
  <dd>A generic anchor to bookmark a spot in the code</dd>
  <dt>SECTION and !SECTION</dt>
  <dd>Defines a region of code</dd>
  <dt>TODO</dt>
  <dd>Indicates unfinished code, or an item that is awaiting completion</dd>
  <dt>FIXME</dt>
  <dd>Indicates problematic / non working code or an item that requires a bugfix</dd>
  <dt>REVIEW</dt>
  <dd>Indicates code that needs further consideration or testing</dd>
  <dt>NOTE</dt>
  <dd>Indicates critical information about a piece of code or provides important context for future developers</dd>
  <dt>TEMP</dt>
  <dd>Indicates code that is only temporary. This comment and the code it refers to should likely be removed before making a commit or merging into production</dd>
  <dt>DEPRECATED</dt>
  <dd>Marks code that is no longer supported and needs to be removed in the future</dd>
</dl>

Many of these should never make it into production, but can be useful flags for your own reference working on a branch or during a code review / team coding.

I'd probably suggest resolving a `FIXME` before pushing code to origin, or removing the comment and converting it to a proper ticket in your issue tracker.

I'd use `TODO` for something quick, like a reminder for when I come back from lunch. Proper task management should probably be kept in a different program.

It is common for developers to comment out a chunk of code while exploring a different approach. `TEMP` is a great way to mark these commented out bits making cleanup easier before submitting a pull request.

`REVIEW` can be used as a reminder to yourself that you need to follow up on some research before considering something "done", maybe the code works, but you need to do some A11Y research to make sure the implementation is accessible. It's also a useful tool to flag code if you're working in a pair programming environment.

The other anchors may have a much longer lifespan depending on the nature of the comment.

### Fancy features

Being able to create meaningful bookmarks in code can be incredibly helpful, and thanks to Comment Anchors, we can take it a step further.

Create links to code and other files with the special `LINK` anchor. You can even link to a specific anchor within a file. Linking to another file is simple enough, use the link anchor followed by an absolute or relative file path.

```js
// LINK src/file.js -->
```

To link to a specific line, add ":#" where "#" is the line number.

```js
// LINK src/file.js:175 -->
```

Linking to another anchor is a bit trickier, you'll need to set up the destination anchor with an ID, then link to it similar to how you would link to an ID of an element on a web page.

```js
// Inside a different file: ANCHOR[id=My-ID]

// LINK src/file.js#My-ID -->
```

<div class="callout--caution">
<p>Note that as far as I can tell, there is no way to link to a spot in the same file. It's also important to note that links must point to a valid file in the project. One broken link will break all others in the document.</p>
</div>

## Closing thoughts

I know a lot of developers like to keep the code free of comment clutter, but when used responsibly, these types of tags and comments can be really helpful. Plus, code comments can work fantastically alongside issue tracking systems like GitHub. For example, you could reference an edge case bug or conversation by adding the issue number or a link to the issue in a comment, providing richer context for future developers.

[Comment Anchors](https://marketplace.visualstudio.com/items?itemName=ExodiusStudios.comment-anchors) will highlight the entire comment line as well as provide a list of anchors established. The plugin is also extremely customizable, so you can add or remove anchors to fit your style.

[Download my personal configuration](https://gist.github.com/MattMcAdams/7cfbf8b560bba93e6c1f52341a7540ce).
