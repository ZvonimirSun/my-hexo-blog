---
title: JQuery 中 $.ajax 和 $.getJSON 的简单应用对比
date: 2018-07-09 18:00:00
updated: 2018-07-09 18:00:00
categories:
  - 技术
tags:
  - JavaScript
  - JQuery
---

在项目中使用到了 `$.ajax` 与 `$.getJSON` 两种从后台获取 json 的方式，在此进行简单的对比，用以记录学习。

<!--more-->

## 两种方式

### `$.ajax` 方式

代码如下

```javascript
$.ajax({
  url: "/example",
  type: "GET",
  dataType: "json",
  data: { key: "test" },
  async: false,
  success: function (data) {
    somefunction();
  },
  error: function () {
    console.log("error");
  },
});
```

### `$.getJSON` 方式

代码如下

```
$.getJSON("/example",{key: "test"},function(data){
    somefunction();
});
```

## 区别

我能想到的一些区别:

- `$.ajax` 功能更加强大，能够实现更多功能
- 在获取 `json` 的这一目标下，`$.getJSON` 代码更加简洁易懂

在实际使用过程中，我觉得似乎差别不大，实在不知道还有什么区别。希望了解的大佬能够教我。
