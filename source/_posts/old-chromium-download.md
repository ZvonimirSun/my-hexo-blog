---
title: 下载老版本 Chromium 的正确姿势
date: 2022-07-14 11:18:03
tags:
  - Chrome
  - Chromium
---

网站开发中，有时候会遇到特定老版本 Chromium 才会产生的 bug，需要使用老版本的 Chromium 来解决。下面记录一下如何下载老版本的 Chromium 包。

<!--more-->

## 步骤

### 一、查找对应版本的分支信息

[https://chromiumdash.appspot.com/branches](https://chromiumdash.appspot.com/branches)

这里有每个分支版本的相关信息以及分支位置

![页面预览](https://img.iszy.xyz/1722480749524.png)

比如我需要 80 版本的 Chromium，这里就可以看下 80 分支的信息，主要需要这个 `Branch Pos.` 的内容，如图所示。

![](https://img.iszy.xyz/1722480814407.png)

### 二、通过 Position 号查找软件包

[Chromium 历史存储仓库](https://commondatastorage.googleapis.com/chromium-browser-snapshots/index.html)

先选择需要的平台

![](https://img.iszy.xyz/1657769779611.png)

然后根据 `Position` 号找到对应的版本

![](https://img.iszy.xyz/1657769834283.png)

可能会搜不到，可以手动拉到对应 `Position` 号附近的版本，大版本号基本是一致的。比如这里我选择了 `612439` 版本。

![](https://img.iszy.xyz/1657769953873.png)

下载对应的压缩版，解压即可使用。比如这里就是`chrome-win.zip`。

![](https://img.iszy.xyz/1657770071034.png)

### 开始使用吧

![](https://img.iszy.xyz/1657770205975.png)

## 一点注意

有一点小坑，在需要切换 Chromium 版本时，需要把已经开着的 Chromium 全都关闭，再打开新版本的 Chromium，否则版本不会切换。

另，Chrome 和 Chromium 是互不影响的，切换 Chromium 版本，不用考虑 Chrome 的状态。
