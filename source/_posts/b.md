---
title: 解决使用@vue/cli-plugin-babel导致动态import代码拆分失败问题
date: 2022-01-18 14:47:53
updated: 2022-01-18 14:47:53
categories:
  - 技术
tags:
  - Babel
  - Vue
---

本文记录下使用 vue-cli 的 babel 插件导致动态 import 代码拆分失败的问题。

<!--more-->

## 前情提要

先前在项目中使用了`@vue/cli-plugin-babel`插件，打包时发现项目被打包成了一个非常大的 js 文件，动态 import 代码拆分失败了。

经过测试，基本确定就是由于加上了这个 babel 插件导致的，估计是 babel 的配置导致的问题。

经过查找插件和 babel 的官方文档，可以看到，`@vue/cli-plugin-babel`默认使用`Babel 7` + `babel-loader` + `@vue/babel-preset-app`，而`@vue/babel-preset-app`使用了`@babel/preset-env`，并支持了以下几个 stage 3 特性。

- Dynamic Import Syntax
- Proposal Class Properties
- Proposal Decorators (legacy)

问题就出在这个`@babel/preset-env`，其中包含了一个插件叫`@babel/plugin-proposal-dynamic-import`，这个插件的作用就是将动态 import 转为 Promise 语法，这就导致 webpack 没法再对转换后的代码进行动态拆分。这个`@babel/preset-env`也是很多人使用的一个预设，所以估计有这个问题的人不在少数，下面的方法也是可以适用的。

原代码

```js
import("./moduleA").then(/* do stuff */);
```

转换后的代码

```js
Promise.resolve()
  .then(() => require("./moduleA"))
  .then(/* do stuff */);
```

## 解决

既然问题已经清晰了，解决方法就比较明了了，就是要禁用`@babel/plugin-proposal-dynamic-import`插件。

### 选项一（推荐）

比较直截了当的方法就是将这个插件直接排除掉。可以通过修改 babel 配置，通过 exclude 选项，将插件直接排除。

使用 `@vue/cli-plugin-babel` 的情况

```json
{
  "presets": [
    ["@vue/cli-plugin-babel/preset", { "exclude": ["proposal-dynamic-import"] }]
  ]
}
```

直接使用 `@babel/preset-env` 的情况

```json
{
  "presets": [["@babel/preset-env", { "exclude": ["proposal-dynamic-import"] }]]
}
```

### 选项二

这个其实是`@babel/preset-env`的配置项，我没有测试过使用`@vue/cli-plugin-babel`时能否正确将参数传递到后面。

将 modules 参数设置为 false，则 Babel 将会保留 ES 模组，自然也就不会转换动态 import 语句了。

```json
{
  "presets": [["@babel/preset-env", { "modules": false }]]
}
```
