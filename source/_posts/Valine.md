---
title: 超好用极简评论系统 Valine 安装
date: 2018-04-01 12:00:00
updated: 2018-04-01 12:00:00
categories:
  - 技能
  - 博客
tags:
  - Valine
  - 评论系统
keywords: Valine, 评论系统, 无后端
---

今天我来介绍一下，我现在正在使用的评论系统——[Valine](https://valine.js.org/)，一个可以完全自主掌控数据的超好用无后端极简评论系统。我之前使用的评论系统是 Remarkbox，感兴趣的可以看一下我之前的文章，我会在文章末尾放上链接。

<!--more-->

## Valine 评论系统简介

![](https://img.iszy.cc/20190318221214.png)

如题目所说，Valine 是一个无后端的极简评论系统。由 [@云淡风轻](https://ioliu.cn/) 大神开发，利用免费的 leancloud 作云数据库，实现了真正的无后端。Valine 有以下几点吸引我的地方：

- 能够完全掌控评论数据
- 外观简约美观
- 评论支持 markdown 语法
- 能够邮件通知（不推荐使用）

**备注：**不推荐使用 Valine 自带的邮件推送，功能并不完善，我会再后文另外说明实现的方法。

## 安装步骤

Valine 官方文档：[文档](https://valine.js.org/quickstart/)

### 创建应用

1. [点击这里登录或注册](https://leancloud.cn/dashboard/login.html#/signup)`Leancloud`
2. [点击这里创建应用](https://leancloud.cn/dashboard/applist.html#/newapp)，应用名称随意。

![](https://img.iszy.cc/20190318221231.png)

### 获取 `APP ID` 和 `APP KEY`

进入应用后，在此处获取该应用的 `APP ID` 和 `APP KEY`。

![](https://img.iszy.cc/20190318221242.png)

### 设置安全域名

为了数据安全，请务必在此处添加安全域名为你的博客地址。如在本地测试，可以先不添加安全域名。

![](https://img.iszy.cc/20190318221253.png)

### 插入页面

以本人博客为例，请将以下语句添加到博客的评论位置。

```js
<!--评论显示区，请插入合适的位置-->
<div id="comment"></div>
<!--Leancloud 操作库:-->
<script src="//cdn1.lncld.net/static/js/3.6.1/av-min.js"></script>
<!--Valine 的核心代码库-->
<script src="//cdn.jsdelivr.net/npm/valine@1.1.9-beta9/dist/Valine.min.js"></script>
<script>
    new Valine({
        el:'#comment',
        appId: 'Your App ID',
        appKey: 'Your App Key',
        placeholder: 'ヾﾉ≧∀≦)o快来评论一下吧!',
        avatar:''
    });
</script>
```

**注意：**在 Valine 核心代码库的部分可以自行选择版本，现在最新的稳定版为 1.1.8，将链接中的 `1.1.9-beta9` 换成 `1.1.8` 即可。beta 版可能存在 bug，但能更快使用新功能，风险自负。

## 其他参数

可自定义配置项较多，不在此一一列举，请参考官方文档。

## Valine-Admin

我之前说过，不推荐使用 Valine 提供的邮件通知功能。由于 leancloud 自身邮件系统的限制，无法传递足够的参数，所以通知邮件中的链接无法直接跳转到文章页，不能够满足使用。

大神 [@Deserts](https://panjunwen.com) 基于 leancloud 云引擎做了一个邮件通知功能，顺便还实现了评论管理面板，Github：[Valine-Admin](https://github.com/panjunwen/Valine-Admin)。

由于 Valine 的版本更新，原本的功能除了管理面板已经基本不能使用了，包括邮件通知、垃圾评论识别。我对此进行了一点简单的改动，恢复了邮件通知的内容，垃圾评论识别不会搞，我就给删掉了，Github：[Valine-Admin](https://github.com/ZvonimirSun/Valine-Admin)。

[下一篇文章](https://www.iszy.cc/2018/04/01/Valine-Admin/)，我将写一下这个 Valine-Admin 的配置。同样是十分简单的。
