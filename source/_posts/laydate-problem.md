---
title: 尝试Layui日期控件(layDate)遇到的坑
date: 2019-04-07 21:01:47
updated: 2019-04-07 21:01:47
tags:
  - JavaScript
  - JQuery
  - LayUI
---

最近在写个小网页的时候用到了 Layui 的日期控件——layDate，期间遇到了一些小问题，在此记录一下。

<!--more-->

## 问题简述

情形大致如下。

```js
layui.use("laydate", function () {
  var laydate = layui.laydate;
  laydate.render({
    elem: "#date",
    change: function () {},
    done: function () {},
  });
});
```

### 关于`layDate`的`change`与`done`属性

如果是单独的时间选择，效果类似下图，则选中日期后的回调触发的是`change`。

![](https://img.iszy.xyz/20190407214909.png)

如果是时间范围的选择，效果类似下图，则选中日期后的回调触发的是`done`。

![](https://img.iszy.xyz/20190407215225.png)

需要根据情况在对应的属性后编写回调函数。

### 关于`$('#date').change()`不触发

我本想用`$('#date').change(function(){})`来在日期变化时做些处理，但我发现 laydate 的日期变化并没有触发 change 事件，十分奇怪。

解决办法：

在`layDate`的`change`或`done`的回调函数中手动触发`change`事件，即加入以下内容。

```js
$("#date").change();
```
