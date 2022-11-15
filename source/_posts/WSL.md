---
title: 体验 Windows 10 内置 Linux 子系统
date: 2018-05-05 12:00:00
updated: 2018-05-05 12:00:00
categories:
  - 技巧
tags:
  - WSL
  - Ubuntu
  - Windows
  - Linux
---

有的工作在 Linux 环境中会比在 Windows 环境中更加方便，但我的主要使用环境还是 Windows，所以不能直接装 Linux 系统。我过去的解决方案是装了一个 Ubuntu 的虚拟机，但是这样还是不太方便，尤其是在文件访问上。现在 Win10 中有了 Linux 子系统，简称 WSL，很好地解决了我的问题。

<!--more-->

## WSL 简介

**适用于 Linux 的 Windows 子系统**（英语：Windows Subsystem for Linux，简称**WSL**）是一个为在 Windows 10 上能够原生运行 Linux 二进制可执行文件（ELF 格式）的兼容层。它是由微软与 Canonical 公司合作开发，目标是使纯正的 Ubuntu 14.04 "Trusty Tahr" 映像能下载和解压到用户的本地计算机，并且映像内的工具和实用工具能在此子系统上原生运行。

## 安装步骤

本文以 Ubuntu 子系统为例。

### 开启开发人员模式

![](https://img.iszy.xyz/20190318221442.png)

### 启用 WSL 功能

![](https://img.iszy.xyz/20190318221451.png)

### 在应用商店进行搜索

![](https://img.iszy.xyz/20190318221502.png)

可以搜到如下 5 个 Linux 子系统。

![](https://img.iszy.xyz/20190318221511.png)

### 安装 Ubuntu

在此，我选择安装我比较熟悉的 Ubuntu，如果对其他感兴趣的也可以安装。

![](https://img.iszy.xyz/20190318221521.png)

系统显示安装完成后，打开 Ubuntu，将会进行进一步的安装，将需要等待一段时间。

![](https://img.iszy.xyz/20190318221535.png)

接下来设定你在 Ubuntu 子系统中的用户名，可以任意指定。

![](https://img.iszy.xyz/20190318221547.png)

接下来设定密码，这将会是你的 root 密码。用过 Linux 的应该知道，密码输入是不会显示的，这是正常现象，输入完密码回车即可。

![](https://img.iszy.xyz/20190318221557.png)

当看到如下内容时，子系统已经安装完毕，可以使用了。

![](https://img.iszy.xyz/20190318221608.png)

除了通过点击 Ubuntu 图标进入子系统，你同样可以通过在 cmd 或 PowerShell 中输入 ubuntu 进入，无需管理员权限。

![](https://img.iszy.xyz/20190318221620.png)

## 内核版本和发行版本号

![](https://img.iszy.xyz/20190318221636.png)

在这里我们可以看到内核版本为 4.4.0，发行版本为 Ubuntu 16.04.3 LTS。

## 后话

WSL 最初在 Win 10 Insider Preview build 14316 开始可用，现在正式版已经升级到 1803 版，内部版本号为 17134，功能已经完善了太多。除了受限于 Windows 文件系统，文件操作较慢，其他已经和原版 Ubuntu，不相上下，完全可以替代虚拟机，完成我的工作了，我感觉非常满意。
