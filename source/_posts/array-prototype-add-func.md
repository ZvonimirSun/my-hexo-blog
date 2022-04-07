---
title: 给数组原型对象添加方法
date: 2021-06-15 10:24:35
updated: 2021-06-15 10:24:35
categories:
  - Wiki
  - JavaScript
  - Browser
tags:
  - JavaScript
  - 数组
permalink: /posts/6/
---

今天使用`for...in`方法的时候发现枚举到了意料之外的`prototype`内的方法，发现是没有正确为数组原型对象添加方法，在此记录。

<!--more-->

## 问题

一般我们如何给一个数组原型对象添加方法呢，比如我们添加一个去重方法。

```js
Array.prototype.unique = function () {
  var n = {},
    r = [];
  for (var i = 0; i < this.length; i++) {
    if (!n[this[i]]) {
      n[this[i]] = true;
      r.push(this[i]);
    }
  }
  return r;
};
```

我看不少文章里这样就好了，这就会出现我刚刚说到的问题。在你使用`for...in`方法遍历数组时就会拿到`unique`这个 key 值，这个是不符合我们预期的。

其实出现这样的情况是因为`Array.prototype`对象的`unique`属性的描述值`enumerable`为`true`，也就是可枚举，在枚举对象属性时会被枚举到（`for...in`或`Object.keys`方法）。

根据[MDN Web Docs](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Enumerability_and_ownership_of_properties)说明，可枚举属性是指那些内部 `可枚举` 标志设置为 `true` 的属性，对于通过直接的赋值和属性初始化的属性，该标识值默认为即为 `true`，对于通过 `Object.defineProperty` 等定义的属性，该标识值默认为 `false`。可枚举的属性可以通过 `for...in` 循环进行遍历（除非该属性名是一个 `Symbol`）。

## 解决

正确的方法如下，忽略方法内容。

### 方法一

先添加方法，再通过 `Object.defineProperty` 设置为不可枚举。

```js
Array.prototype.unique = function () {};
Object.defineProperty(Array.prototype, "unique", {
  enumerable: false,
});
```

### 方法二

或者直接通过 `Object.defineProperty` 方法添加。此时`enumerable`默认为`false`，不用特别指定。

```js
Object.defineProperty(Array.prototype, "unique", {
  value: function () {},
});
```
