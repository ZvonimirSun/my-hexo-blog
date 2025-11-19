---
title: 让一个元素高度随宽度按比例自适应
tags:
  - CSS
date: 2022-11-05 10:04:34
---

记录

<!--more-->

宽度的自适应是根据 Viewport 的 width 来调整的，高度的自适应也根据 Viewport 的 height 来调整的，理论上和 width 没有任何关系。所以需要找到一个可以关联上 Viewport 的 with 的属性还能撑起高度。

这个属性就是 padding，padding 是根据 Viewport 的 width 来调整的，padding-top 和 padding-bottom 也是如此，所以我们设置这个属性就可以和 width 保持一定比例了。

现在比如

父容器样式为

```css
.father {
  width: 200px;
  height: 300px;
  background: #dedede;
}
```

子容器样式为

```css
.child {
  width: 80%;
  background: #666;
}
```

这时候我们再设置

```css
.child {
  width: 80%;
  height: 0;
  padding-bottom: 80%;
  background: #666;
}
```

子元素就变成了一个宽度 80%，高度为 0，但有 80% 宽度 的 padding-bottom 的正方形了，效果如下图

![](https://img.iszy.cc/1667613841613.png)
