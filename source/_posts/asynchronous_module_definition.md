---
title: (转载)Javascript模块化编程（二）：AMD规范
date: 2019-08-14 10:00:00
updated: 2019-08-14 10:00:00
categories:
  - 编程
tags:
  - JavaScript
  - 转载
  - 模块化
author: 阮一峰
copyright: false
---

> 原文链接: [Javascript 模块化编程（二）：AMD 规范](http://www.ruanyifeng.com/blog/2012/10/asynchronous_module_definition.html) —— 阮一峰

<!--more-->

这个系列的[第一部分](https://www.iszy.cc/2019/08/14/javascript_module/)介绍了 Javascript 模块的基本写法，今天介绍如何规范地使用模块。

![](https://img.iszy.xyz/20190814100700.png)

（接[上文](https://www.iszy.cc/2019/08/14/javascript_module/)）

## 模块的规范

先想一想，为什么模块很重要？

因为有了模块，我们就可以更方便地使用别人的代码，想要什么功能，就加载什么模块。

但是，这样做有一个前提，那就是大家必须以同样的方式编写模块，否则你有你的写法，我有我的写法，岂不是乱了套！考虑到 Javascript 模块现在还没有官方规范，这一点就更重要了。

目前，通行的 Javascript 模块规范共有两种：[CommonJS](http://wiki.commonjs.org/wiki/Modules/1.1) 和 [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD)。我主要介绍 AMD，但是要先从 CommonJS 讲起。

## CommonJS

2009 年，美国程序员 Ryan Dahl 创造了[node.js](http://nodejs.org/)项目，将 javascript 语言用于服务器端编程。

![](https://img.iszy.xyz/20190814100903.png)

这标志"Javascript 模块化编程"正式诞生。因为老实说，在浏览器环境下，没有模块也不是特别大的问题，毕竟网页程序的复杂性有限；但是在服务器端，一定要有模块，与操作系统和其他应用程序互动，否则根本没法编程。

node.js 的[模块系统](http://nodejs.org/docs/latest/api/modules.html)，就是参照 [CommonJS](http://wiki.commonjs.org/wiki/Modules/1.1) 规范实现的。在 CommonJS 中，有一个全局性方法 require()，用于加载模块。假定有一个数学模块 math.js，就可以像下面这样加载。

```js
var math = require("math");
```

然后，就可以调用模块提供的方法：

```js
var math = require("math");

math.add(2, 3); // 5
```

因为这个系列主要针对浏览器编程，不涉及 node.js，所以对 CommonJS 就不多做介绍了。我们在这里只要知道，require()用于加载模块就行了。

## 浏览器环境

有了服务器端模块以后，很自然地，大家就想要客户端模块。而且最好两者能够兼容，一个模块不用修改，在服务器和浏览器都可以运行。

但是，由于一个重大的局限，使得 CommonJS 规范不适用于浏览器环境。还是上一节的代码，如果在浏览器中运行，会有一个很大的问题，你能看出来吗？

```js
var math = require("math");

math.add(2, 3);
```

第二行 math.add(2, 3)，在第一行 require('math')之后运行，因此必须等 math.js 加载完成。也就是说，如果加载时间很长，整个应用就会停在那里等。

这对服务器端不是一个问题，因为所有的模块都存放在本地硬盘，可以同步加载完成，等待时间就是硬盘的读取时间。但是，对于浏览器，这却是一个大问题，因为模块都放在服务器端，等待时间取决于网速的快慢，可能要等很长时间，浏览器处于"假死"状态。

因此，浏览器端的模块，不能采用"同步加载"（synchronous），只能采用"异步加载"（asynchronous）。这就是 AMD 规范诞生的背景。

## AMD

[AMD](https://github.com/amdjs/amdjs-api/wiki/AMD)是"Asynchronous Module Definition"的缩写，意思就是"异步模块定义"。它采用异步方式加载模块，模块的加载不影响它后面语句的运行。所有依赖这个模块的语句，都定义在一个回调函数中，等到加载完成之后，这个回调函数才会运行。

AMD 也采用 require()语句加载模块，但是不同于 CommonJS，它要求两个参数：

```js
require([module], callback);
```

第一个参数[module]，是一个数组，里面的成员就是要加载的模块；第二个参数 callback，则是加载成功之后的回调函数。如果将前面的代码改写成 AMD 形式，就是下面这样：

```js
require(["math"], function (math) {
  math.add(2, 3);
});
```

math.add()与 math 模块加载不是同步的，浏览器不会发生假死。所以很显然，AMD 比较适合浏览器环境。

目前，主要有两个 Javascript 库实现了 AMD 规范：[require.js](http://requirejs.org/) 和 [curl.js](https://github.com/cujojs/curl)。本系列的第三部分，将通过介绍 require.js，进一步讲解 AMD 的用法，以及如何将模块化编程投入实战。

（完）
