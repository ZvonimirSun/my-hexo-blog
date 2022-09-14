---
title: 利用HAR文件查看和诊断网络请求
categories:
  - 其他
tags:
  - 浏览器
  - Chrome
  - Har
date: 2022-09-14 13:00:02
---


通过 HAR 文件可以方便快捷的查看和诊断网络请求，定位问题。最近才学习到这个有用的知识，在此记录下

## 一、HAR 是什么

HAR（HTTP 归档）是多种 HTTP 会话工具用来导出所记录数据的 一种文件格式。这种格式基本上是 JSON 对象，并具有一组特定的字段。请注意，并非所有 HAR 格式的字段都是必填字段， 很多时候，部分信息不会保存到文件中。

**注意：**

**HAR 文件包含敏感数据！**

- 录制过程中所下载网页中的内容。
- Cookie（任何有 HAR 文件的人都可以使用这些 Cookie 冒用帐号）。
- 录制过程中提交的所有信息： 个人详细信息、密码、信用卡号码等。

如有需要，可以在文本编辑器中编辑 HAR 文件以及对敏感信息进行 匿名处理。

以在多种浏览器中记录 HTTP 会话，包括 Google Chrome、Microsoft Edge 以及 Mozilla Firefox。

## 二、创建和查看 HAR 文件

这边我主要以 Chrome 浏览器为例，其他浏览器可以参考。IE 浏览器不支持保存为 HAR 文件，需要通过第三方软件如 [Fiddler](https://www.telerik.com/fiddler)、[HttpWatch](https://www.httpwatch.com/) 等实现。

### 创建 HAR 文件

在 Network 面板中**右键点击任意一条请求**，点击**Save As HAR With Content**，即可将所有请求保存为 HAR 文件。**注意，Network 面板中的过滤条件是被忽略的。**

![](https://img.iszy.xyz/1663130958729.png)

从 71 版本开始，导入导出 HAR 文件开始包好 Initiator 和 priority 信息。

从 **76 版本**开始，Chrome 导出的 HAR 文件中首次开始包含 WebSocket 消息。另外 ，Chrome 在 Network 面板**新增了导入和导出 HAR 文件的按钮**，使用更加便捷。

![](https://img.iszy.xyz/1663131014757.png)

### 查看 HAR 文件

从 **62 版本**开始，Chrome 增加了**将 HAR 文件拖拽到 Network 面板进行导入展示**的功能。

![](https://img.iszy.xyz/1663130703947.png)

从 76 版本开始，可以通过 Chrome 在 Network 面板**新增的导入 HAR 文件的按钮**进行导入。
