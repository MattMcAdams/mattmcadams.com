---
title: New Tab Page
date: 2022-05-05

tags: ['code']
description: "A FireFox extension to override the new tab page, providing a customizable NTP using the bookmarks API"

thumbnail: /images/projects/ntp/640/thumb.jpg
cover_image: /images/projects/ntp/1280/thumb.jpg
---

This was something I made for myself and then made it open source in case anyone wanted to use it or learn from it. Basically, I'm underwhelmed by the default new tab page setup in any browser so I made my own. It uses the [bookmarks API](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Work_with_the_Bookmarks_API) and some JSON configuration to display collections of bookmarks with FontAwesome icons.

![](/images/projects/ntp/960/screenshot.jpg)

It also has a reference section, which is hard coded at the moment to display some common HTML entities I use a lot, with a link to the full list.

At the bottom of the page is a extendable library, again using the bookmarks API to pull folders of bookmarks.

If you're interested, check out the project on [GitHub](https://github.com/MattMcAdams/new-tab).
