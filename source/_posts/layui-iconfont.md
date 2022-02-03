---
title: LayUI Icon 扩展 Iconfont 图标
date: 2020-01-28 12:14:43
updated: 2020-01-28 12:14:43
categories:
  - 技术
tags:
  - JavaScript
  - JQuery
  - LayUI
keywords: layui icon, iconfont, 扩展, layui
---

layui 的所有图标全部采用字体形式，取材于阿里巴巴矢量图标库（iconfont）。不过 layui 自带的图标太少了，可以说连够用都算不上，所以今天就要用 iconfont 上的图标扩展一下。

<!--more-->

## 引入图标

正常引入 layui 和 iconfont 的 css。

```html
<link rel="stylesheet" href="/layui/css/layui.css" media="all" />
<link rel="stylesheet" href="/iconfont/iconfont.css" media="all" />
```

## 加入样式

加入样式，优先采用 layui 自带图标。

```html
<style>
  .layui-icon {
    font-family: layui-icon, iconfont !important;
    font-size: 16px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
</style>
```
