---
title: Resizing a MacOS window with the Shortcuts app
date: 2022-04-05

tags: ['tutorial', 'process']
description: "If you ever record or share your screen you may have wanted to get the window you were sharing to be a specific size or aspect ratio. Let's look at how to achieve this with Shortcuts."

thumbnail: null
cover_image: null
---

After getting my home office fully set up I found that I had a very niche and first world problem: When I share my screen or even a window from my ultrawide monitor during a zoom meeting, the image is too small for people on normal sized screens to see. I decided to make a button that would resize my last used window to the fullscreen size of my macbook pro. This way I could easily setup a window for screen sharing without needing to disconnect the macbook just for a meeting.

## Setup

First we need to get information about the open windows. Luckily there is a way to filter this operation to almost exactly what we need.

```txt
Find "All Windows" {
  Sort by: "Window Index"
  Order: "Smallest First"
  Limit: True
  Get "1" Window
}

// This will return an array stored in the variable *Windows*
```

This will return the window with the highest scoring window index. This is helpful because that *should* be the exact window we need.

Theoretically, you could get more than 1 window for testing or debugging, so to make sure the script handles that gracefully, I like to return the first item as a seperate variable. We'll use this variable as the target for resizing later.

```txt
Get "First Item" from *Windows*

Set variable "Window" to *Item from List*
```

## Resizing the window

Once we have the single `Window` to use as a target, we can resize it using the "Resize Window" action.

```txt
Resize *Window* to "Dimensions" "1792 x 1120"
```

There is one bug with this however. If the active window is too lose to either the bottom or right edges of the screen, it will not be resized properly. To fix this, we'll also move the window into the top left corner of the screen.

```txt
Move *Window* to "TopLeft"

Resize *Window* to "Dimensions" "1792" x "1120"
```

## The part that causes problems

The only major problem with this shortcut is with how the window index system works. In some cases certain indicators, tooltips, widgets, and other UI extensions will have a higher index value by mistake. These are not often the desired targets and if they can't be resized it may cause an error.

To get around this, I've created an if statement to detect likely problem windows by testing their width. Most small ui widgets or overlays are less than 100 wide. Inside this if statement, I set up some warning text and display an alert.

```txt
Set variable "Window" to *Item from List*

...

If "*Window.width*" "is less than" "100" {
  Text {
    WARNING
    The selected window has a width smaller than 100. This likely means it is not the intended target of this function.
    ---
    "Index" : *Window.Window Index*
    "Title" : *Window.Title*
    "App Name" : *Window.App Name*
    "Width" : *Window.Width*
    ---
  }
  Set variable "Warning Message" to *Text*
  Show Alert *Warning Message*
End If }

...

Move *Window* to "Top Left"
Resize *Window* to "Dimensions" "1792" x "1120"
```

This way we can get some timely debugging info and a more useful error message than a vague "An error has accured" message when the shortcut fails.

To fix this, you need to add a "Filter" to the Find Windows action. The filter should look something like this:

```txt
Find "All Windows" where
  "All" of the following are true
  "App Name" "is not" "STRING"
```

The `STRING` used after the `is not` in the filter must match the exact spelling, capitalization, and punctuation of the "App Name" responsible for window you want to exclude from the search.

## Improving debugging

One of the helpful things about adding some debugging options is that it gives you a much easier and complete view of the window data you're working with. When working with multiple windows from the find action, it can be helpful to display an array of each object in the list. Let's work on building this output first.

```txt
Repeat with each item in *Windows*
  Text {
    ---
    "Index" : "Repeat Item > Window Index"
    "Title" : "Repeat Item > Repeat Item"
    "App Name" : "Repeat Item > App Name"
    "Width" : "Repeat Item > Width"
  }
  Add *Text* to *Window Array*
End Repeat

Text {
  ---
}
Add *Text* to *Window Array*
```

This will provide an easy to read list of every window found.

Next I make a debug info variable that we can use in the output action, which acts like a console.

```txt
Text {
  DEBUG INFO

  TARGET
  ---
  "Index" : *Window.Window Index*
  "Title" : *Window.Title*
  "App Name" : *Window.App Name*
  "Width": *Window.Width*
  ---

  ALL WINDOWS
  *Window Array*
}
Set variable "Debug Info" to *Text*
```

Then we can display the debug info at any step in the Shortcut.

```txt
Stop and output *Debug Info*
  If there's nowhere to output: "Do Nothing"
```

## Wrapping it up

This is a pretty cool exploration of a practical use of Shortcuts, and to test their ability. Its a great way to learn more about how MacOS works too. There is also a really cool "set up" option to ask for user inputs the first time the shortcut in ran on the machine, which would be really useful for configuration. For example, you might want to customize the resize dimensions on installation.

I'm interested to see if there's a lot of examples of people using Shortcuts for genuinely useful or complex tasks. Most of the options I've looked through seemed like very shallow app specific actions.

You can [download this shortcut](https://www.icloud.com/shortcuts/631bbc20b45b4741a5d930b837d43707) and use as-is, or expand on to fit your needs.
