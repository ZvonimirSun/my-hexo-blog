---
title: 在VMware中安装"开源版Windows"——ReactOS
date: 2018-07-28 14:43:13
updated: 2018-07-28 14:43:13
categories:
  - 技巧
tags:
  - ReactOS
  - 开源
  - VMWare
keywords: reactos,vmware,install,安装,虚拟机
---

ReactOS 是一个适用于 x86/x64 平台的免费、开源的操作系统暨项目，旨在提供 Windows 平台下的程序与驱动的二进制兼容性，简直可以说是开源版的 Windows。借由逆向工程等手段，其以净室设计的方法进行开发。为确保操作系统没有任何一部分是看过泄漏出来的微软 Windows 源码的人所写，或者逆向工程的过程达不到净室设计标准，一个全盘的源码审查由 ReactOS 主要开发者下令展开。此审查目前已经结束。这篇文章将演示如何在 VMWare 虚拟机上体验 ReactOS。

<!--more-->

## 下载系统镜像

前往 ReactOS 官网[下载系统镜像](https://www.reactos.org/download)。

![](https://img.iszy.xyz/20190318215607.png)

将会得到一个 zip 压缩包，解压后是 ReactOS 的安装镜像。

## 安装

首先你要安装有 VMware Workstation Pro(或 Player 版)，这部分安装不再赘述。

### 创建虚拟机

#### 新建虚拟机

![](https://img.iszy.xyz/20190318215634.png)

#### 选择镜像

![](https://img.iszy.xyz/20190318215652.png)

#### 系统类型设置

全部选择其他

![](https://img.iszy.xyz/20190318215707.png)

#### 选择虚拟机存储位置

![](https://img.iszy.xyz/20190318215717.png)

#### 硬盘设置

容量设置为 8G，不用太多

![](https://img.iszy.xyz/20190318215728.png)

#### 其他参数设置

内存建议至少 512M，如果想的话，可以开启加速 3D 图形

![](https://img.iszy.xyz/20190318215740.png)

点击完成即可。

### 安装 ReactOS

首先启动虚拟机，进入安装进程。

#### 选择语言

有许多语言可供选择，在这里我选择`Chinese (RPC)`，点击回车。

![](https://img.iszy.xyz/20190318215752.png)

#### 调整屏幕分辨率

一路回车到如下界面，可以调整屏幕分辨率，若不需要，回车即可。

![](https://img.iszy.xyz/20190318215803.png)

在此，我调整了分辨率为`1280x1024x32`。

![](https://img.iszy.xyz/20190318215814.png)

#### 安装

一路回车进行安装，到如下界面。在虚拟机右下角断开 CD 连接后回车重启。

![](https://img.iszy.xyz/20190318215825.png)

## 设置

启动后直接回车进入第一个系统，后面都是类 Windows 的操作，比较简单，不用设置的地方下一步即可。

![](https://img.iszy.xyz/20190318215850.png)

在此页面可以设置时区、输入语言和键盘，可惜似乎没有中文的输入法支持。

![](https://img.iszy.xyz/20190318215901.png)

在此页面可以设置系统密码，我在此留空，不设密码。

![](https://img.iszy.xyz/20190318215909.png)

时区选择北京，关闭夏令时。

![](https://img.iszy.xyz/20190318215922.png)

一路下一步完成安装，重启后即可进入系统。自动安装驱动可以取消，反正也没有可以支持的内容。

![](https://img.iszy.xyz/20190318215937.png)

## 后话

ReactOS 完成度已经很高了，经网友测试已经可以兼容许多 Windows 下的程序，完全没有使用 Windows 的代码，可以说是非常了不起了。现在 ReactOS 仍在积极开发，提供了许多新的功能，看官大可以体验一下，说不定未来这个系统真的能够代理 Windows 呢。

在此我就体验了一下 ReactOS 自带的扫雷游戏，更多功能留给看官自行探索。

![](https://img.iszy.xyz/20190318215950.png)
