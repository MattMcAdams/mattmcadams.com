---
title: "Guide to the WordPress Customizer"
date: 2024-09-15

tags: ['wordpress']
description: "When creating a WordPress theme for work, I had my first experience with the WordPress Customizer, and I had trouble finding a comprehensive guide, and so this post was born. So let's learn about the Customizer and how to extend it."

thumbnail: null
cover_image: null
---

A bit late to the party aren’t I? You may be wondering why make a post like this in 2024, when WordPress is moving steadily away from the Customizer and PHP templates in favor of the Full Site Editor and Block Themes.

When my team and I were exploring the new block based WordPress experience and evaluating if it would be a good move to make the next version of the University’s theme a block theme, we found that while the block based themes offer tremendous flexibility, it is equally difficult to control at the theme level.

In addition to most of our content editors being confused by the Full Site Editor, it allows users to create and manipulate page templates as well as modify global styles, with no way to moderate layout or style. This means that creating consistency for brand and UX across hundreds of sites under the same institution would be a nightmare. I imagine this is still a very valid use case for many organizations that use WordPress, and is why I think classic themes still have a place in the ecosystem.

When creating the next version of The University of Alabama’s WordPress theme, I had my first experience with the WordPress Customizer, and I had trouble finding a comprehensive guide, and so this post was born. This will be one of my longer posts, so strap in and let’s learn about the WordPress Customizer.

<div class="callout--info">
  <p>Note that from here on out, I'll be working inside a function. Below is the function definition and where we're using it:</p>
</div>

```php
function customizer_customizations( $wp_customize ){}
add_action( 'customize_register', 'customizer_customizations', 30 );
```

## The existing sections

Out of the box, the Customizer comes with a few sections with controls.

### Themes

This panel lets you change the site’s theme. It’s pretty much what it says on the tin. For our use case, we’ll remove this since all sites at our institution have to use the same theme. This is a great opportunity for me to show you how to remove a default section.

```php
$wp_customize->remove_panel( 'themes' );
```

### Site Identity

This includes some things available in the Settings menu from the Dashboard under “General”. This section is referred to as `title_tagline` in the code.

- Site Title is the title of your site. (wow) under the hood, this is called `blogname`
- Tagline is your site description or tagline. Different themes treat this differently, we use it in metadata for social embeds. Under the hood, this is called `blogdescription`
- Site Icon, which is used for the favicon. This is called `site_icon`

You can remove or rename these controls pretty easily. First, let’s remove Site Icon, since my use case is for an institution with the favicon defined at the theme level. Note that this won’t remove the control from the Settings menu.

```php
$wp_customize->remove_control('site_icon');
```

With that done, we can look at how to rename a default control. For example, our theme uses the tagline as a description, so we want to change the control to “Site Description”

```php
$wp_customize->get_control('blogdescription')->label = __( 'Site Description', 'TextDomain' );
```

### Menus

This just adds a way to get to the Menu system from the Customizer. It’s more or less the same editor you get when you go to “Appearance > Menus”

### Widgets

Like Menus, this is the same editor you get when you go to “Appearance > Widgets”. Honestly, if you’re using block widgets, the editor here is pretty awful because it’s so narrow. I recommend removing the section entirely.

```php
$wp_customize->remove_panel( 'widgets' );
```

### Homepage Settings

This lets you chose a page to use as your homepage, and what page should be used as the Posts page. It’s the same settings available in the Dashboard under Settings > Reading.

### Additional CSS

This section allows you to type in custom CSS for your site. This is added to each page as a stylesheet.

## Adding a setting to an existing section

Modifying existing controls is cool and all, but what if you want to add a control to an existing section? For us, we wanted to add a “Site Subtitle” control to the “Identity” section. This is also a great first look at how to extend the customizer.

### Add setting

First, we need to add the setting. This is what will store the value of the control.

```php
$wp_customize->add_setting( 'namespace_site_subtitle',
  array(
    'default'           => '',
    'sanitize_callback' => 'sanitize_text_field',
  )
);
```

This will create a setting called `namespace_site_subtitle` and define what sanitization callback to use. Input sanitation is outside the scope of this post, so you’ll have to do some separate research on that if you want to learn more, but here’s a pretty [good article about sanitization](https://divpusher.com/blog/wordpress-customizer-sanitization-examples/) for you to refer to.

### Add control

Now that we’ve got our setting defined, we can add a control for it.

```php
$wp_customize->add_control( new WP_Customize_Control(
  $wp_customize,
  'namespace_site_subtitle',
  array(
      'label'      => __( 'Subtitle', 'TextDomain' ),
      'priority'   => 10,
      'section'    => 'title_tagline',
      'settings'   => 'namespace_site_subtitle',
      'type'       => 'text',
  )
));
```

The `label` field tells the Customizer what text to display on the front end for the control, `priority` is used to order the controls, `section` is used to let the Customizer know what section to put the control in, `settings` is used to tell the control what setting it is controlling, and lastly `type` lets the Customizer what kind of input to use on the front end for the control.

## The default control types

The default input types are:

- text (default)
- checkbox
- radio (requires choices array in $args)
- select (requires choices array in $args)
- dropdown-pages
- textarea (since WordPress 4.0)

Since WordPress 4.0, input types such as ’email’, ‘url’, ‘number’, ‘hidden’ and ‘date’ are supported implicitly as variations of the ‘text’ input type. [Reference](https://developer.wordpress.org/reference/classes/wp_customize_control/)

You can create custom controls for the customizer as well, though that’s outside the scope of this article.

## Types of settings

<div class="callout--warning">
  <p>I don't know a lot about databases, so this is going to be a very rudamentary explanation based on my understanding. Please research this topic further to gain a better understanding of the differences between theme mods and options.</p>
</div>

You can store data from the customizer two ways, as a theme mod or as an option. Theme mods are stored differently in the database to be specific to a given theme, this makes sure settings don’t bleed into other themes when they’re switched. It’s generally considered better practice to use theme mods. Options are used more to store site settings that should apply to every theme.

The customizer uses theme mods by default, but if you want to store something as an option, you’ll define that when creating your setting. Below is an example where we’re surfacing the Posts Per Page setting in the customizer. Since WordPress stores this as an option, we need to respect that here.

```php
$wp_customize->add_setting( 'posts_per_page', array(
  'default'           => get_option('posts_per_page'),
  'type'              => 'option'
));
```

Here’s another example where we’re storing a Google Property ID as an option which is then used for analytics.

```php
$wp_customize->add_setting( 'google_property_id',
  array(
    'type'              => 'option',
    'default'           => '',
    'sanitize_callback' => 'sanitize_text_field',
  )
);
```

## How to add your own sections

Extending the default sections is great and all, but what if you need your own section? That’s pretty simple to add as well. You’ll need to give your section a slug, title, and priority. You’ll use the slug when setting up controls.

```php
$wp_customize->add_section( 'namespace_site_settings_section',
  array(
    'title'         => __( 'Site Settings', 'ua-theme' ),
    'priority'      => 1,
  )
);
```

## Nesting sections into panels

You can nest multiple sections using panels. First, create a panel by giving it a slug, title, and description.

```php
$wp_customize->add_panel( 'namespace_templates_panel',
  array(
    'title'            => __( 'Page Templates', 'TextDomain' ),
    'description'      => __( 'Theme modifications to page templates', 'TextDomain' ),
  )
);
```

Next, you’ll need to add sections to the panel, since (as far as I know) controls can not be added directly to panels.

```php
$wp_customize->add_section( 'namespace_single_settings',
  array(
    'title'         => __( 'Single Post', 'TextDomain' ),
    'priority'      => 2,
    'panel'         => 'namespace_templates_panel'
  )
);
```

## How to use the settings

Now that we’ve gone over how to manipulate the customizer, let’s look at how to actually use the data set by the user through the customizer UI.

First, we’re going to look at a use case where we’ve given the user the ability to toggle tags on a page template. In the template’s PHP file, we’ll want to set a variable to hold the setting we get from the customizer.

<div class="callout--info">
  <p>Note that the customizer does not store default values, the default prop in the setting is only used to set the default state or value of the customizer control. If the setting had never been changed or set in the customizer, the value of that theme mod would be undefined.</p>
</div>

By setting a variable like this, we can look up the theme mod and supply the default if the mod doesn’t exist or hasn’t been set.

```php
$namespace_index_tags = get_theme_mod('namespace_index_tags', true);
```

Then, we’ll use this mod in an if statement before we render the tags.

```php
<?php if ($namespace_index_tags && get_tags()) : ?>
  <div>
    <p>Tags</p>
    <ul class="tag-list">
      <?php
        $tags = get_tags();
        foreach ( $tags as $tag ) :
          $tag_link = get_tag_link( $tag->term_id );
      ?>
        <li>
          <a href='<?php echo $tag_link; ?>' title='<?php echo $tag->name; ?>' rel="tag">
          <?php echo $tag->name ?></a>
        </li>
      <?php endforeach; ?>
    </ul>
  </div>
<?php endif; ?>
```

Alright, but what about settings saved as options? The usage is the same, but we’ll define the variable a bit differently since `get_option` doesn’t handle defaults the same way.

```php
$googlePropertyID = get_option('google_property_id') ? get_option('google_property_id') : '';
```

For this, we use a tertiary operator to test the option and provide a fallback if it’s a falsy value.

## Handling defaults

You could probably write a function to store all of the default values, and use that function in both the customizer and in the templates, or even write a wrapper for the `get_theme_mod` function that applies your defaults automatically. We haven’t done anything like this in our theme, but I thought it was an interesting idea worth mentioning since managing default values is a little less than straightforward with the customizer.

## Conclusion

Despite WordPress seemingly moving away from this site customization experience, I do think it’s still critical for developing themes for institutions where branding and governance are strategic priorities. Hopefully this post has helped you get started with the customizer and has given you a good foundation to continue learning and building. Thanks for reading along!
