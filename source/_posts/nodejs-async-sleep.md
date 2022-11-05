---
title: Node.js利用async实现sleep功能
date: 2019-03-08 14:18:04
updated: 2019-03-08 14:18:04
categories:
  - JavaScript
  - Node.js
tags:
  - Node.js
  - JavaScript
---

最近用 Node.js 的 request 调用我的一个 web api，循环访问速度太快，请求就会被丢弃。查找了一下 Node.js 中的 sleep 功能的实现方法，下面的这个方法，用起来效果很好，在此记录一下。

<!--more-->

## 方法记录

### 安装 async

```shell
npm i async --save
```

然后在你的文件开头引用此 package。

```js
const async = require("async");
```

### sleep 功能定义

```js
const sleep = () => new Promise((res, rej) => setTimeout(res, 2000));
```

可以把`2000`改为你需要的数字，单位为毫秒。

### 调用 sleep

在`async`方法中才能使用`await`。

```js
(async () => {
  function(){
    //some function
  }
  await sleep();
})();
```

## 示例

随便写个示例，可以类比着来。把 sleep 放在你需要暂停的位置上，外面要套上 async。

```js
const async = require("async");
const sleep = () => new Promise((res, rej) => setTimeout(res, 1000));

(async () => {
  for (let i = 0; i < 9; i++) {
    console.log(i);
    await sleep();
  }
})();
```
