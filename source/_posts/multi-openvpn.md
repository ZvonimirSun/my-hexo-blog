---
title: OpenVPN同时连接多个VPN服务
date: 2024-03-27 14:13:47
tags:
  - OpenVPN
---

在日常开发工作中，要连接不同的环境需要连接不同的 VPN 服务，OpenVPN 默认只会添加一个 Tap 网卡，只能来回切换 VPN，很不方便。所以我们只需要能够增加更多的 Tap 网卡即可。

<!-- more -->

接下来的操作都是以安装完 OpenVPN 为前提的，如果没有安装，可以前往[官网](https://openvpn.net/community-downloads/)进行安装。

默认的 OpenVPN 安装目录为 `C:\Program Files\OpenVPN`，这边就以默认目录为例。

## 最简单的方法

![](https://img.iszy.cc/1711520900617.png)

其实最新的 OpenVPN 版本为了用户方便考虑，在开始菜单里面提供了添加新 Tap 网卡的快捷命令，**只要点击就会自动添加一个新的 Tap 网卡**，网卡会自动命名。需要同时连接几个 OpenVPN 服务，就增加几个网卡，OpenVPN 会自动使用空闲的 Tap 网卡进行连接。

打开这个快捷方式的属性就可以看到，其实这个就是包装了一个创建 Tap 网卡的命令。

```
C:\Program Files\OpenVPN\bin\tapctl.exe create --hwid root\tap0901
```

## 手动操作

在**管理员权限**的 PowerShell 中执行

进入 OpenVPN 安装目录

```
cd "C:\Program Files\OpenVPN"
```

### 查看 Tap adapter

```
.\bin\tapctl.exe list
```

输出

![](https://img.iszy.cc/1711521772122.png)

或者使用

```
.\bin\openvpn.exe --show-adapters
```

输出

![](https://img.iszy.cc/1711521749124.png)

### 新增 Tap adapter

```
.\bin\tapctl.exe create --name "test" --hwid root\tap0901
```

可以通过 `name` 参数指定网卡名称，网卡名称不能重复。创建成功后，将会返回创建的网卡 id。

查看一下列表，可以看到网卡已经正常添加。

![](https://img.iszy.cc/1711522259063.png)

### 删除 Tap adapter

如果 Tap 网卡多了，或者不想要那些之前默认的网卡，可以删除掉。删除成功不会返回内容。

```
.\bin\tapctl.exe delete "test"
```

### OpenVPN 配置文件指定网卡

可以添加以下配置到 ovpn 文件中，可以按照名称指定使用的网卡。注意，如果该名称的网卡不存在将会报错。

```
dev-node test
```
