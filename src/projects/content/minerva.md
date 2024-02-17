---
title: Minerva Web Framework
date: 2023-11-19

tags: ['client work']
description: "Minerva is the third iteration of the University of Alabama's web framework and is used to build the institutional Wordpress theme among other enterprise applications."

thumbnail: /images/projects/minerva/640/wireframes.jpg
cover_image: /images/projects/minerva/1280/wireframes.jpg
---

Minerva is the third iteration of the University of Alabama's web framework and is used to build the institutional Wordpress theme among other enterprise applications. I began working on a design system for the university back in 2021, as their senior designer. This design system would eventually become the bones of the Minerva framework. When I rejoined the team in 2022 as the assistant director, it was a great joy to oversee the continued development of this project, and I continued to work hands-on with the development team as they waded through other large departmental shifts.

## Scale

Designing at the scale of the university was a big challenge, but it gave us a few goals that would govern how we built the framework.

First of all, the framework and all of it's sub projects must be accessible and in compliance with WCAG 2 AA level standards. The layout system must be responsive, adapting to any viewport size, device type, or input.

![Wireframes from the Minerva design system](/images/projects/minerva/960/wireframes.jpg)

The framework also had to be platform agnostic since there are many tech stacks used across campus. Lastly, all components and compositions needed to be modular and flexible enough to adapt to any content needs campus communicators have. Unknown user input meant designing and building pieces that could fit together in a wide number of ways.

## Sustainability

A year ago, the team did not have peer code reviews, no linting or tests, no documentation. This meant that earlier versions of the institutional wordpress theme could only reliably be worked on by one of the few developers that has historical knowledge of the codebase. This, of course, let to a maintainability nightmare. To remedy this, I worked with the team to establish some industry best practices and reinforced the value of documentation and encouraged our developers to write self documenting, readable code - adding comments for anything that might be unclear.

![Screenshot of the Minerva storybook](/images/projects/minerva/960/storybook.jpg)

In addition to new CI/CD checks and a modernized devops experience, the team built a beautiful collection of documentation around the new web framework and Wordpress theme. Integrating documentation into our development workflow has ensured our docs are always up to date, and our code adheres to the division's new higher standards. The team also meets with content managers frequently to see and understand how the product is performing in the wild.

## Technical Execution

We decided to use React for the framework because it allowed us to more easily document component behavior. All of our components compile into plain HTML, CSS, and JavaScript which can be used as reference to build implementations in other languages - or even for small static built sites. The use of React, also opened us up to tools like Storybook, which we used to mock up use cases and test for regressions.

![The Wordpress Gutenberg editor](/images/projects/minerva/960/gutenberg.jpg)

For the wordpress theme, we used PHP backed gutenberg blocks so that any markup changes would be reflected instantly. Leveraging the Gutenberg block editor, also placed a few technical restrictions on how we thought about components and their use cases.

## Outcomes

While its still early days of adoption for the new design system and web framework, more than a handful of sites have launched on pre-release versions of the new theme. Minerva is even being used directly as a React component library in the new developer documentation hub, built with NextJS.

![Two websites built on theme 3](/images/projects/minerva/960/websites.jpg)

The team has received overwhelmingly positive feedback from stakeholders and users alike, saying that the new theme is beautifully simple, easy to generate content with, and friendly to navigate. Campus partners say the development experience and new documentation has changed how they approach web development, cutting out months of boilerplate and bloat. Most times, developers have found that the modifications their department or division needed before were now native to the framework.

The team hopes to roll the system out over more sites over 2024, including a new design for UA home, and a few enterprise applications.
