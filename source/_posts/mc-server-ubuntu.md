---
title: 在Ubuntu 16.04搭建Minecraft服务器1.13
date: 2018-08-05 12:47:10
updated: 2018-08-05 12:47:10
categories:
  - 技能
  - 应用部署
  - Linux
tags:
  - Linux
  - Minecraft
  - Ubuntu
keywords: minecraft,server,ubuntu
---

在此记录在 Ubuntu 16.04 搭建 Minecraft 服务器 1.13 的全过程。

<!--more-->

## 安装 Java 运行库

在前一篇文章——[在 Ubuntu 16.04 中安装 Oracle Java 8](https://www.iszy.cc/2018/08/05/ubuntu-oracle-java/)中已经有了详细讲述。

## 创建新用户和组

### 创建用户和组

创建用户和组 minecraft，用以运行 minecraft 服务端

```shell
sudo adduser minecraft
sudo groupadd minecraft
sudo usermod -a -G minecraft minecraft
```

### 登录到用户 minecraft

```shell
su minecraft
cd
```

## 下载并启动 Minecraft

### 下载 Minecraft 服务器

官方地址：[下载 MINECRAFT ：JAVA 版的服务器](https://minecraft.net/zh-hans/download/server)

```shell
wget https://launcher.mojang.com/mc/game/1.13/server/d0caafb8438ebd206f99930cfaecfa6c9a13dca0/server.jar
chmod a+x server.jar
```

### 启动 Minecraft

```shell
java -Xmx1024M -Xms1024M -jar server.jar nogui
```

如图所示，首次运行需要同意 EULA 协议。

![](https://img.iszy.xyz/20190318214212.png)

下面编辑生成的`eula.txt`。

```shell
vi eula.txt
```

如图所示，将`eula=false`改为`eula=true`。

![](https://img.iszy.xyz/20190318214227.png)

再次启动，`-Xmx`和`-Xms`可以调整内存大小，请自行根据情况调整，内存太少将会卡顿严重。

```shell
java -Xmx1024M -Xms1024M -jar server.jar nogui
```

如图所示，你的服务器已经启动成功，注意打开服务器端口。

![](https://img.iszy.xyz/20190318214241.png)

按`Ctrl+C`可以中止服务器

### 打开服务器端口

使用如下语句打开服务器端口。

```shell
iptables -A INPUT -p tcp -m tcp --dport 25565 -j ACCEPT
```

## 注册为 service

### 先退出 minecraft 用户

```shell
exit
```

### 创建 systemd 配置文件

```shell
sudo vi /etc/systemd/system/minecraft.service
```

写入如下内容

```shell
[Unit]
Description=start and stop the minecraft-server

[Service]
WorkingDirectory=/home/minecraft
User=minecraft
Group=minecraft
Restart=on-failure
RestartSec=20 5
ExecStart=/usr/bin/java -Xms1024M -Xmx1024M -jar server.jar nogui

[Install]
WantedBy=multi-user.target
Alias=minecraft.service
```

### 启动 Minecraft

```shell
service minecraft start
```

还可以使用如下语句

```shell
service minecraft stop #停止 Minecraft 服务
service minecraft status # 查看 Minecraft 服务运行状态
```

![](https://img.iszy.xyz/20190318214300.png)

## 后话

至此，已经成功在 Ubuntu 16.04 搭建了 Minecraft 服务器 1.13，可以尽情玩耍了。当然，需要获得更好的体验，还有更多调整需要进行。
