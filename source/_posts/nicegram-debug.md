---
title: 最新开启Nicegram Debug方法
date: 2019-10-15 14:07:23
updated: 2019-10-15 14:07:23
categories:
  - 其他
tags:
  - iOS
  - Telegram
keywords: nicegram,nicegram debug,telegram,ios
---

记录一下最新的开启`Nicegram Debug`的方式，帮助有需要的人。

<!--more-->

## 说明

Nicegram 曾在`5.11(57)`版本中移除了 `NG Debug`，大家都开始采用回退版本的方法来开启`NG Debug`，在之后的版本中此方法失效。我看了下测试版的更新说明，可以在`5.11(59)`版本的更新说明中看到，`Nicegram Debug`已经回归，采用了全新的开启方式，不能再从 Nicegram App 中开启，而是采用 Web 或 Telegram bot 的方式开启。

![更新说明](https://img.iszy.xyz/20191015145457.png)

## 方法

访问[my.nicegram.app](https://my.nicegram.app)，通过 Telegram 登录你需要开启`Nicegram Debug`的账户。注意是 Telegram，不是 Nicegram。

![my.nicegram.app](https://img.iszy.xyz/20191015141146.png)

然后将看到开启开关。

![开关](https://img.iszy.xyz/20191015141021.png)

将两个开关均打开，重新启动 Nicegram，该账号已经能够正常访问苹果封锁的群组了。
