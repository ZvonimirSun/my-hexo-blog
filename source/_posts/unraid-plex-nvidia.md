---
title: Unraid 安装 Nvidia 驱动并开启 Plex 硬解
date: 2022-12-10 16:44:51
categories:
  - 折腾
tags:
  - Unraid
  - Nas
  - Plex
  - Nvidia
---

前面记录了一下我刚装好 Unraid，初始化配置，及搭建磁盘阵列的过程。一个 Nas 装好，少不了要整一个家庭影音系统用起来，今天就来记录一下，安装 Plex 并开启 Nvidia 显卡硬解的过程。

<!--more-->

## 一、前期说明

首先我来讲一下我的配置，我这边用的是从主力机上换下的 **Ryzen 5 3600** 配一张 **Nvidia Quadra T600**。3600 是没有核显的，我就准备让这张 T600 来承担转码的任务。

为啥选择 **Nvidia Quadra T600** 这个卡呢？

首先这是一张 Quadra 卡，没有一般显卡对 NVENC 的限制，我是一个懒得折腾的人，选择 Quadra 卡就省了很多事。

再一个，功耗很低，显存和性能也符合我的需求。我 T600 这张卡，40W 功耗，不用额外供电，插上就能用，还有 4GB 显存，相比上代 P 系列只提升了 10W 功耗，性能提升挺大。不过毕竟新卡，价格还是不太美丽。如果一般使用，选 P400 这张 30W 的卡，也就可以了，价格便宜太多。

## 二、教程

说是教程，其实就是我操作的一个记录，我在网上搜的好些教程，几乎都是用的 Intel 核显的，用 N 卡的不多，讲究一个性价比，像我这种用 Amd 平台的就更少了。也就是我没用 APU，不然 Amd 的核显估计也有点要折腾。

可能需要用点魔法，不然下载速度啥的都会比较慢。

### 1. 安装驱动

在应用中心，搜索`nvidia driver`，就能看到一个由 ich777 大佬维护的 Nvidia-Driver 插件，点击安装。

![](https://img.iszy.xyz/1670667734658.png)

安装完成后，进入设置，点击进入下方刚刚安装的应用。应用会拉取最新的驱动信息，所以会比较慢。

![](https://img.iszy.xyz/1670667950035.png)

选择分支或者指定的驱动版本，点击 `Update & Download` 按钮。这里我选择 Production 分支，感觉会比较稳。

![](https://img.iszy.xyz/1670668181420.png)

等待驱动下载完成，弹窗信息里会显示下载完成，重启以安装新的驱动，弹窗下方的按钮会变为完成。此时可以重启 Unraid，新的驱动会自动安装。千万不要在中途关闭弹窗，这样就搞不清楚状态了。

装好后，再次进入应用，应用里就会有驱动信息了。

![](https://img.iszy.xyz/1670668411649.png)

### 2. 安装 GPU 监控插件（选）

为了方便查看 GPU 状态，可以考虑安装一个 GPU Statistics 插件。

![](https://img.iszy.xyz/1670668613284.png)

装好后，就可以在仪表盘看到 GPU 的负载情况。

![](https://img.iszy.xyz/1670668551407.png)

### 3. 安装 Plex

接下来就是我们的主角了。

#### (1) 选择应用

这里我选择了`binhex-plexpass`这个应用，选其他的也可以，这个主要是比较方便一点，不少参数已经帮你列好了，可以直接配置。

![](https://img.iszy.xyz/1670668918772.png)

#### (2) 修改主要参数

点击安装进入参数设置，主要是修改这几点。

- 名称: Docker 页面后面显示的名字，可改可不改
- Host Path 2:(Container Path: /media): 这个是存储影片的路径，可自行修改，所有的共享都在这个`/mnt/user`下面看到
- Key 3 (NVIDIA_VISIBLE_DEVICES): 这个是 GPU 的 id，可以在 `Nvidia Driver` 应用里找到，这个指定了 docker 使用的显卡。注意，一张显卡可以在多个 docker 应用中共用，但不能在 docker 和虚拟机中共享。

![](https://img.iszy.xyz/1670669464258.png)

#### (3) 添加 GPU 设备

点击添加设备

![](https://img.iszy.xyz/1670670100384.png)

这边添加两个设备

`/dev/nvidia0`

![](https://img.iszy.xyz/1670670160151.png)

`/dev/nvidiactl`

![](https://img.iszy.xyz/1670670251438.png)

#### (4) 设置 Nvidia 运行时

点击右上角基本视图切换到高级视图

![](https://img.iszy.xyz/1670670408658.png)

在额外参数里填入`--runtime=nvidia`，指定使用 Nvidia 运行时。

![](https://img.iszy.xyz/1670670469551.png)

#### (5) 设置网络模式为 bridge 模式（选）

这个应用模板，默认用的是 host 模式的网络，如果你不喜欢想要换成 bridge 模式，就看下这边，否则跳过这一步。

首先把网络模式切换成 bridge，然后添加需要暴露的端口。

- 32400/tcp (Plex Media Server 的 TCP 端口)
- 8324/tcp (通过 Plex Companion 的 Roku 的 TCP 端口)
- 3005/tcp (用于 Plex Companion 的 TCP 端口)
- 32469/tcp (Plex DLNA 服务器的 TCP 端口)
- 1900/udp (Plex DLNA 服务器的 UDP 端口)
- 32410/udp (用于网络发现的 UDP 端口)
- 32412/udp (用于网络发现的 UDP 端口)
- 32413/udp (用于网络发现的 UDP 端口)
- 32414/udp (用于网络发现的 UDP 端口)

最后大概是这样。

![](https://img.iszy.xyz/1670670957919.png)

#### (6) 完成安装

最后点击应用，即可进入安装。

#### (7) 注意事项

要开启硬解功能，你需要有 Plex Pass 的订阅。

应用都需要从 dockerhub 上拉取，众所周知，国内从 dockerhub 上拉取应用还是比较慢的，需要换源。这边就不说具体怎么换源了，主要是在安装完 Nvidia 驱动后，会添加 nvidia 运行时到 docker 配置里，换源的时候主要不要把这个配置覆盖了，否则上面的安装会报错。

![](https://img.iszy.xyz/1670670779242.png)

### 4. 开启硬解

点击进入 WebUI。

![](https://img.iszy.xyz/1670671309161.png)

自行完成 Plex 的初始化设置，登录的账户需要有 Plex Pass 订阅。

![](https://img.iszy.xyz/1670671436939.png)

在设置 - 转码器里勾选**可用时使用硬件加速**，既可开启硬件加速。

![](https://img.iszy.xyz/1670671485170.png)

播放一个视频，不要使用原画，如果 GPU 有负载，就说明硬件加速成功了。

![](https://img.iszy.xyz/1670671596040.png)
