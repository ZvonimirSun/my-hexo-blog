---
title: ASP.NET MVC 简介
date: 2017-10-31 12:00:00
updated: 2017-10-31 12:00:00
categories:
  - 技能
  - 编程
tags:
  - ASP.NET
  - MVC
keywords: ASP.NET, MVC
---

## MVC 编程模型

MVC 是三个 ASP.NET 开发模型之一。

<!--more-->

MVC 是用于构建 web 应用程序的一种框架，使用 MVC (Model View Controller) 设计：

- Model（模型）表示应用程序核心（比如数据库记录列表）
- View（视图）对数据（数据库记录）进行显示
- Controller（控制器）处理输入（写入数据库记录）

MVC 模型同时提供对 HTML、CSS 以及 JavaScript 的完整控制。

---

### Model (模型)

模型（Model）是应用程序中用于处理应用程序数据逻辑的部分。

通常模型对象在数据库中存取数据。

### View (视图)

View（视图）是应用程序中处理数据显示的部分。

通常从模型数据中创建视图。

### Controller (控制器)

控制器是应用程序中处理用户交互的部分。

通常控制器从视图读取数据、控制用户输入，并向模型发送数据。
