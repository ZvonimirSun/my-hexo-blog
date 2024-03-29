---
layout: post
date: 2018-04-24 12:00:00
updated: 2018-04-24 12:00:00
title: 新的下载解决方案
categories:
  - 杂谈
tags:
  - 115
  - 离线下载
keywords: 115,网盘,离线下载,idm
---

最近开通了 115 网盘的年费 VIP ，开始采用新的下载解决方案。

<!--more-->

## 旧方案

旧方案是这样子。

- 普通的 HTTP、FTP、HTTPS 等协议下载采用 IDM 下载
- BT 以及 ed2k 下载采用迅雷(本想使用 aria2c 代替迅雷，但是不支持 ed2k，很遗憾)

## 115 网盘相关

我开通了 115 网盘的年费 VIP，500 元的价格有点小贵，在京东上买到了 300 多的，感觉还行。115 网盘已经关闭了分享功能，这让人比较难受，好在我也不用分享什么东西，就自己用用。没有分享功能，内容也就基本不会被审查，这还是非常让人放心的。作为对比的百度盘，我就不说什么了，胡乱封锁用户私人文件，无论是否真的有问题，这哪能让人放心用

一般给 115 网盘开 VIP 的人群都是看中了 115 网盘的超强云下载功能，支持所有主流的下载链接，包括 BT 和 ed2k。得益于 115 服务器的超高带宽，即使你的下载内容有几十个 G，也能被极快地离线下载下来(甚至在几秒内完成)。更关键的是，离线下载的视频是可以在线没有压缩地观看的，这让我十分满意。

## 新方案

讲了这么些，大概应该也知道新方案是怎样的了，我终于可以摆脱恶心的毒瘤迅雷了，不用再受限于什么迅雷会员、百度会员。哦，对了，用 IDM 多线程下载百度盘资源，轻轻松松，具体方法请自行谷歌。

- 普通的 HTTP、FTP、HTTPS 等协议下载采用 IDM 下载，这个没什么好说的
- BT 以及 ed2k 下载先使用 115 网盘进行离线下载，再使用 IDM 下载到本地
- 当然可能不必再下载到本地，另外直接下载速度不佳的普通资源也可以采用先离线再下载的方案

于是，本地下载器就只留下 IDM 了，电脑一篇清爽，舒服啊。

说句题外话，这个 115 年费会员送的那个社区码干啥用的呀？我似乎不需要。有需要的人可以和我联系，价格好商量啊。
