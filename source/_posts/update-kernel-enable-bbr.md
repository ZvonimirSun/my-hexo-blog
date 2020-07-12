---
title: 用标准方式升级Ubuntu内核并启用BBR
date: 2019-02-02 17:09:57
updated: 2019-02-02 17:09:57
categories:
  - 技能
  - Linux
tags:
  - Ubuntu
  - Linux
  - VPS
  - BBR
---

Google 的 TCP BBR 拥塞控制算法能够有效地提高网速，根据实地测试，在部署了最新版内核并开启了 TCP BBR 的机器上网速甚至可以提升好几个数量级。从 4.9 开始，Linux 内核已经用上了该算法，但是不少 VPS 的内核甚至还停留在 4.4，更不要说开启 BBR 了。这篇文章就来讲一下，在 Ubuntu 上如何以标准的方式优雅地升级系统内核，并开启 BBR。

<!--more-->

## BBR

### BBR 简介

> 参考来源: [TCP 拥塞控制 - 维基百科，自由的百科全书](https://zh.wikipedia.org/wiki/TCP%E6%8B%A5%E5%A1%9E%E6%8E%A7%E5%88%B6#TCP_BBR)

TCP BBR（Bottleneck Bandwidth and Round-trip propagation time）是由 Google 设计，于 2016 年发布的拥塞算法。该算法使用网络最近出站数据分组当时的最大带宽和往返时间来创建网络的显式模型。数据包传输的每个累积或选择性确认用于生成记录在数据包传输过程和确认返回期间的时间内所传送数据量的采样率。Google 在 YouTube 上应用该算法，将全球平均的 YouTube 网络吞吐量提高了 4%，在一些国家超过了 14%。BBR 之后移植入 Linux 内核 4.9 版本，并且对于 QUIC 可用。

### 监测 BBR 是否开启

在 VPS 上运行以下命令来返回可用的 TCP 拥塞控制算法。

```shell
sysctl net.ipv4.tcp_available_congestion_control
```

如果返回的内容中没有 bbr 字样，比如类似以下的内容，则不能开启。反之，则可以开启，直接跳到后文启用 BBR 部分即可。

```shell
net.ipv4.tcp_available_congestion_control = reno cubic
```

在 VPS 上运行以下命令来返回现在正在使用的 TCP 拥塞控制算法。

```shell
sysctl net.ipv4.tcp_congestion_control
```

如果返回的内容中没有 bbr 字样，比如类似以下的内容，则表示未开启 BBR。反之，则表示你的 VPS 已经开启了 BBR，你已经大功告成了。

```shell
net.ipv4.tcp_congestion_control = cubic
```

## 升级内核

### 查看当前内核版本

由于 BBR 只能在 4.9 以上的内核中开启，如果内核低于 4.9 版本，则需要升级内核，4.9 版本以上的就可以跳过这一步了。据我所知，国内云主机很多默认镜像还是 4.4 的内核。输入`uname -r`可以查看当前的内核版本。

### 通过 APT 升级内核

很多开启 BBR 的一键脚本都是手动下载新内核并编译安装的，但是手动升级内核存在着安全隐患，而且无法及时得到更新。

其实 Ubuntu 官方提供了升级最新内核的方式，那就是`linux-hwe-generic`软件包。Ubuntu 通过 apt 包管理工具提供了两个内核版本，一个是通用版本(General Availability/GA)，即最稳定的版本；一个是硬件启用版本(Hardware Enablement/HWE)，会跟随最新的内核更新。

我们可以通过输入`apt search linux-generic`看到这两个软件包。其实那些内核版本旧的装的就是`linux-generic`这个最稳定版本。

那么好了，这样就很明了了，我们就要安装`linux-generic-hwe`包即可，可以将 Ubuntu 升级为当前版本可用的最新稳定内核。Ubuntu 16.04 的包叫`linux-generic-hwe-16.04`，Ubuntu 18.04 的包叫`linux-generic-hwe-18.04`，可以以此类推。以 Ubuntu 16.04 为例，输入以下命令进行安装即可，重启后才会生效。

```shell
sudo apt install linux-generic-hwe-16.04 -y
sudo reboot
```

重启后，我们可以再次输入`uname -r`查看一下内核版本，我们可以看到，此时我的 Ubuntu 16.04 已经是 4.15 版本的内核了。

大家可能看到了还有一个叫做`linux-generic-hwe-16.04-edge`的包，那是做什么的呢？这个呢就相当于测试版吧，如果你想要使用更加新的内核，可以使用这个包。

## 启用 BBR

### 装载 BBR

此时，虽然内核已经升级好了，但还没有正式装载 BBR 模块，还无法在可用拥塞算法中查到。运行以下命令装载 BBR。

```shell
sudo modprobe tcp_bbr
echo "tcp_bbr" | sudo tee -a /etc/modules-load.d/modules.conf
```

此时，输入`sysctl net.ipv4.tcp_available_congestion_control`命令，就能看到 bbr 了。

```shell
net.ipv4.tcp_available_congestion_control = reno cubic bbr
```

### 正式启用 BBR

执行以下命令，将 BBR 配置写入 sysctl.conf 文件，正式启用 BBR。

```shell
echo "net.core.default_qdisc=fq" | sudo tee -a /etc/sysctl.conf
echo "net.ipv4.tcp_congestion_control=bbr" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

此时，BBR 已经启用完成，通过`sysctl net.ipv4.tcp_congestion_control`验证一下，可以看到现在使用的拥塞算法已经是 BBR 了，如图所示。

```shell
net.ipv4.tcp_congestion_control = bbr
```

## 后话

至此，已经完成了 Ubuntu 系统的内核升级和 TCP_BBR 的开启，享受高速网络吧。关于内核提升，虽然编译内核升级的方式也是有效的，但是还是更加推荐通过 APT 的方式升级内核。这既是官方推荐的方式，也是不容易出现问题的方式，还能跟随更新，何乐而不为呢。
