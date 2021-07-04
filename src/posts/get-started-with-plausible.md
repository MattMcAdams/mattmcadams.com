---
title: Getting Started with Plausible
date: 2020-12-02
published: true
series: false

tags: ['analytics', 'tutorial']
description: "Plausible is a fantastic alternative to existing JS based analytics solutions. Inexpensive, lightning fast, and build around privacy."

thumbnail: https://www.mattmcadams.com/images/posts/plausible.png
cover_image: https://www.mattmcadams.com/images/posts/plausible.png
---

Website analytics are great tools to monitor your website's traffic, see what people are interested in on your site, and inform how you develop your site going forward. They can help you understand more about your audience.

Unfortunately, analytics have a bad rep, and I pin most of this on Google. Being the largest and defacto standard analytics platform, Google makes sure to collect as much information about users as is technologically possible. This often means compromising your user's privacy and taking a little hit to website performance.

This is where [Plausible](https://plausible.io/) comes in. It takes a more modern approach to web analytics. **It's beautiful, lightning fast, super affordable, and it's built around privacy.** This is increasingly important as new internet privacy laws are passed (think GDPR). With Plausible, you don't have to worry about a privacy statement or cookie banners or any of that garbage. Your users can focus on your content, and you can still get valuable stats.

[![Screenshot of the Plausible website](/images/posts/plausible.png)](plausible.io)

Now's a good time to qualify "super affordable". They charge $6/month or $4/month billed annually at the time of writing. Compare this to Netlify's $9/month server side analytics. Personally, I think it's well worth about 50 bucks a year for a great product like this.

> I should also note that I'm not sponsored by anyone. I just think it's a great service, and to be honest, this is going to be more of a checklist than a how to guide. Sorry!
>
> The Plausible docs are really good and there's no reason to repeat all of it here. Instead, I'll highlight some cool features they don't tell you about.

## Getting Started

Head on over to plausible.io and sign up for their 30 day free trial (no credit card required). They'll give you a [script to put in your website's `<head>`](https://docs.plausible.io/plausible-script) and thats pretty much all there is to it!

Analytics will start rolling in as soon as you get 1 page view. You can test it out by visiting your site yourself. (We'll omit ourselves from the analytics later).

## Setting up 404 monitoring

Plausible also lets you [track which URLs are going to 404 pages](https://docs.plausible.io/404-error-pages-tracking). This is a little more involved, but still extremely straight forward.

If you're using one of the cool new frameworks like Vue (Gridsome in my case), you may have to put the 404 page script in a module export or something. [Check out how I did it here](https://github.com/MattMcAdams/Website/blob/78b085df4cbb85e8393daf485bd16af8b38cdeea/src/pages/404.vue#L33).

## Track outbound links

You can also track what outbound links are being clicked on and what pages those links were found on. To do this, add a new "custom event" goal, like we did for 404 page tracking and use the exact goal name `Outbound Link: Click`.

That's pretty much all there is to it. You can read more on [Plausible's blog](https://plausible.io/blog/track-outbound-link-clicks) where they talk about this feature and how it can be helpful.

## Using a custom subdomain

I really really like this feature. Not because it's overly useful or necessary, but because it helps me keep things organized. The only true benefit I can think of for doing this is to ensure the analytics script doesn't accidentally get blocked by an ad blocker. You can skip this step if you want, otherwise head over to [Plausible Custom Domains](https://docs.plausible.io/custom-domain/) to follow along.

You do unfortunately have to be patient for this part since it can take a while for the DNS records to update, though mine only took a minute or two.

## Excluding yourself from analytics

As developers, content creators, editors, we spend a fair amount of time looking at our own sites. This can be a little problematic when trying to figure out analytics, so we're going to "opt out".

Thankfully, they have an article on how to [exclude yourself](https://docs.plausible.io/excluding) too. Again, this is pretty straight forward and shouldn't take long to have up and running.

After you've excluded yourself from your own analytics, you may find that you need to test something else out. Maybe you need to create another goal of some kind, or want to double check to make sure something is working. The best way to do this is to temporarily disable the ad block extension and enable it again when you're done testing.

It's also worth noting that you don't have to make any changes to those instructions if you chose to use a custom domain. Blocking plausible.io will still work.

## Resetting your website's data

After you finish playing around with everything you may want to go ahead and reset your analytics so far to remove your own activity.

> **WARNING:** This will reset ALL collected data - not just your own, so I only recommend using this when you first finish setting things up.

[Follow this doc to reset your site's data to date](https://docs.plausible.io/reset-site-data).

## Enjoy

Congrats, you're all set up with a pretty powerful little analytics tool for less than $50/year and you don't have to worry about it impacting performance or causing privacy headaches.
