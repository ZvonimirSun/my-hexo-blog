---
title: 如何在JAVA中获取格式化的当前时间
date: 2019-07-25 19:00:00
updated: 2019-07-25 19:00:00
tags:
  - Java
---

记录一下如何在 JAVA 中获取格式化的当前时间。

<!--more-->

## 所需 java 类

```java
import java.text.SimpleDateFormat;
import java.util.Date;
```

## 方法

```java
SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
let dateAfterFormat = simpleDateFormat.format(new Date());
console.log(dateAfterFormat); // 应当会输出格式化后的当前时间，如"2019-07-25 16:17:30"
```

由于 SimpleDateFormat 不是线程安全的，推荐在需要格式化的时候创建 SimpleDateFormat 的局部变量，而不要公用，否则可能会出现冲突，线程挂死等问题。
