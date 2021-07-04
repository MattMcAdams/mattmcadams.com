# website-v6

Personal website of Matthew McAdams

## Links for my own sanity

- https://github.com/11ty/eleventy-base-blog
- https://eleventy-base-blog.netlify.app/
- https://www.recursive.design/
- https://obsolete29.com/posts/building-my-personal-site-with-eleventy/
- https://obsolete29.com/posts/rss-on-eleventy/
- https://www.11ty.dev/docs/plugins/rss/
- https://www.11ty.dev/docs/config/
- https://github.com/11ty/eleventy/issues/259
- https://www.hawksworx.com/blog/adding-search-to-a-jamstack-site/
- https://markentier.tech/posts/2021/03/responsive-toc-leader-lines-with-css/
- https://www.w3.org/Style/Examples/007/leaders.en.html

## TODO

- [x] Get directories sorted out
- [x] Get collections working
- [x] Get URLs sorted out
- [x] Get tags working

- [x] Fix static directory passthrough
- [x] Get nested layouts working / understand how includes work
- [x] Remove 11ty navigation

- [x] Organize and upload images

- [x] Page build: homepage
- [x] Page build: projects
- [x] Page build: projects tag list
- [x] Page build: projects tag
- [x] Page build: project
- [x] Page build: posts
- [x] Page build: posts tag list
- [x] Page build: posts tag
- [x] Page build: post
- [x] Page build: 404

- [x] Get font working
- [x] Get new CSS working
- [x] Get programatic metadata working (page titles, social info, etc)
- [x] Test RSS feed
- [x] Update repository files (package, gitignore, etc.)
- [x] Update site meta files (robots, humans, redirects, etc)
- [ ] Update readme
- [x] Deploy to v6.mattmcadams.com for testing
- [x] Get analytics working
- [ ] Add favicon

### Future wishlist

- [ ] Page build: about
- [ ] Page build: downloads
- [ ] Page build: knowledge or resources or links or reference (link lists from ntp)

- [ ] Implement site search
- [ ] Implement archive system / pages
- [ ] Setup mailing list workflow
- [ ] See if I can automate the "filter by tag" in the sidebar of posts and projects
- [ ] Add lightboxes for images + code
- [ ] Fancy code blocks w/ language marker, better syntax highlighting, copy button, pop-out
- [ ] Add console.log easter egg

## A brief history of my personal website

I start with a new repo each time I make major architectual changes, usually accompanied by a more drastic redesign. This is the third repository, which starts at v6, with a shift away from netlify large media and gridsome in favor of 11ty and google cloud storage.

Each major design change gets a new major version and I have kept zip archives of all previous major versions, but do not make those public.

The first two versions of my website were raw html files with a little css hosted on github pages. The next version I moved to wordpress. Versions 4 and 5 were on Gridsome and hosted on Netlify. Version 6 uses 11ty, Netlify, and Google Cloud Storage.
