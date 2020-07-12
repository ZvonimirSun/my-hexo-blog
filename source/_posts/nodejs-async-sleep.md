---
title: Node.js利用async实现sleep功能
date: 2019-03-08 14:18:04
updated: 2019-03-08 14:18:04
categories:
  - 技能
  - 编程
tags:
  - Nodejs
  - JavaScript
keywords: async, sleep, nodejs, javascript
---

最近用Node.js的request调用我的一个web api，循环访问速度太快，请求就会被丢弃。查找了一下Node.js中的sleep功能的实现方法，下面的这个方法，用起来效果很好，在此记录一下。

<!--more-->

## 方法记录

### 安装async

```shell
npm i async --save
```

然后在你的文件开头引用此package。

```js
const async = require("async");
```

### sleep功能定义

```js
const sleep = () => new Promise((res, rej) => setTimeout(res, 2000));
```

可以把`2000`改为你需要的数字，单位为毫秒。

### 调用sleep

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

随便写个示例，可以类比着来。把sleep放在你需要暂停的位置上，外面要套上async。

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