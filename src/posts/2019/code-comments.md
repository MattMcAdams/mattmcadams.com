---
title: Code Comment Anchors
date: 2019-11-02

tags: ['process']
description: "One of the really cool plugins I found for VS Code is this tool called Comment Anchors. It’s a way of adding more visible, meaningful comments to your code. I’m a really big fan of writing documentation in the code itself, so its nice to have a way to highlight the most important notes."

thumbnail: null
cover_image: null
---

One of the really cool plugins I found for VS Code is this tool called Comment Anchors. It’s a way of adding more visible, meaningful comments to your code. I’m a really big fan of writing documentation in the code itself, so its nice to have a way to highlight the most important notes.

## Notes to self

Several of my special comments fall under the category of “Notes to Self” and aren’t really meant to be seen by anyone else. I try to clean these up before a commit.

### Todo

I think its better practice to store todo items in a separate task management system. Though sometimes items on a todo list may be much more technical and intimate to the task at hand to put it somewhere else.

I only ever use these on my local branch, and I try to remove or complete them before pushing to remote. It’s a good reminder of your current thoughts before going on lunch.

If any todo item overstays its welcome in a code comment, it’s easy enough to move it to an issue or task.

### Idea

Sometimes it’s nice to jot down ideas about a specific code block in the code itself. These ideas may be a note-to-self, or brought up to be discussed with other developers. If the latter, you may consider using an Issue or communication channel to talk about the idea in real time.

These are great for any generic comment to your future self, and I like to use them before switching branches or if I notice something about a different part of the code than the one I’m actively working on.

### Debug

Much like optimize, if you know what code block is causing a bug it could be helpful to tag it with a debug comment that you can reference in an issue. If you know how to fix the bug however, you may want to just go ahead and correct it.

This could also be useful to use as a note-to-self tag if you’re working on another part of code and need to come back to fix the bug later

## Cleanup

### Temp

Sometimes considered bad practice, leaving experimental code in while developing is occasionally useful. I like to use this tag as a self reminder to delete code I’ve commented out before opening a PR. I like to do this in its own commit, so that those experimental blocks are logged in case they are needed in the future.

```js
// TEMP: Use JavaScript to X
// commented out code
```

### Review

Useful for calling out sections of code and ideas that need another set of eyes. If you feel unsure about a segment of code, it may be useful to include a `review` comment that can then be seen easily during a pull request. Just remember to delete it after it’s been reviewed.

## Notes to the future

### Warning

Warnings are used to communicate to another developer something they must know before modifying related code. Useful especially when the code does something odd or its purpose is not obvious.

### Note

Much like `warning` this comment can help communicate information to another developer. This information would be important but not critical.

For general comments, just use normal comment syntax for your language.

### Fix

If you need to use unorthodox methods to fix a bug or implement a feature, it can be nice to comment with one of these tags to communicate that to your future self or other developers. You can also revisit this from time to time to see if this method is still the best solution.

## Closing thoughts

I know a lot of developers like to keep the code free of comment clutter, but when used responsibly, these types of tags can be really helpful.

[Comment Anchors](https://marketplace.visualstudio.com/items?itemName=ExodiusStudios.comment-anchors) will highlight the entire comment line as well as provide a list of anchors established. The plugin is also extremely customizable, so you can add or remove anchors to fit your style.

[Download my personal configuration](https://gist.github.com/MattMcAdams/7cfbf8b560bba93e6c1f52341a7540ce).
