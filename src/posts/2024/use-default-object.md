---
title: "Use a Javascript object as default for another"
date: 2024-09-30

tags: ['javascript']
description: "Here we'll explore an interesting bug I encountered while building colorscale.app, and ways to fix it."

thumbnail: null
cover_image: null
---

Sometimes you want to use one object as a default state, and override it with new props. This is the case in my app, [ColorScale](https://colorscale.app). I have an object with all of the default values for each attribute defined in the object's type.

This concept may be easier shown, so let's define a type and an object that defines the default values.

```ts
export type config = {
  keyColor: string,
  dark: {
    count: number,
    brightness: number,
    angle: number,
    saturation: number,
  },
  light: {
    count: number,
    brightness: number,
    angle: number,
    saturation: number,
  },
}

export const defaultConfig: config = {
  keyColor: "0EA5E9",
  dark: {
    count: 4,
    brightness: 50,
    angle: -10,
    saturation: 15,
  },
  light: {
    count: 5,
    brightness: 80,
    angle: 25,
    saturation: 0,
  },
};
```

## Creating a new object with default values

For my purposes, I wanted to start with my default object and change the values of each property as they were defined in the loaded configuration. My first attempt was to create a new const and use the spread operator to populate it with the values from my defaultConfig object.

I'm going to scaffold out a function to update the configuration using react.

```ts
function updateConfig(configObj: config) {
  const newConfig = {...defaultConfig};
  if (configObj.keyColor) {
    newConfig.keyColor = configObj.keyColor;
  }
}
```

<div class="callout--warning">
  <p>This doesn't work however, because it will actually override the original <code>defaultConfig</code> object!</p>
</div>

The solution for me was to use `JSON.stringify()` to detach the object's reference to the original object. Here's the new code:

```ts
function updateConfig(configObj: config) {
  const newConfig = JSON.parse(JSON.stringify(defaultConfig));
  if (configObj.keyColor) {
    newConfig.keyColor = configObj.keyColor;
  }
  return newConfig;
}
```

This will let you use an object as a default safely.

## Simplifying the code

You could also do this a bit differently, still using the spread operator. With this method, we won't define any properties in the newConfig, just an empty shell.

```js
function updateConfig(configObj) {
  const newConfig = {};
  if (configObj.dark.count) {
    newConfig.dark.count = configObj.dark.count;
  }
  return {...defaultConfig, ...newConfig}
}
```

Here the spread syntax allows you to destructure / restructure an object or array. If there are multiple instances of a key/value pair, then the second value seen for that key is used, allowing you to override the defaults. I couldn't get this to work in Typescript though, since newConfig doesn't have the required properties of our config type.

## Bonus: optimizing the config override

You could argue the if statements are not necessary in the second example, but I like that we get a little organization and cleanup by creating a new object with the values that were passed in. To make it easier though, we can loop through each property of the config object and apply the new value as properties match. This way we don't need an if statement for every property.

```ts
if (typeof configObj.light === 'object') {
  Object.getOwnPropertyNames(defaultConfig.light).forEach((key) => {
    if (Object.hasOwn(configObj.light, key)) {
      newConfig.light[key] = configObj.light[key];
    }
  });
}
```
