---
title: Linux 安装 docker compose v2
categories:
  - Wiki
  - Docker
tags:
  - Docker
  - Linux
date: 2022-04-13 10:42:38
---


最近换个新服务器，准备装下 docker，才发现 docker compose 已经出 v2 版本一段时间了。安装和使用上和 v1 有一些差别，在此记录。

<!--more-->

## 介绍

目前 Docker 官方用 GO 语言 重写 了 Docker Compose，并将其作为了 docker cli 的子命令，称为 Compose V2。

## 安装

首先要先安装 docker，再进行接下来的安装。

### 仅为当前用户安装

```bash
$ mkdir -p $HOME/.docker/cli-plugins
$ curl -L https://github.com/docker/compose/releases/latest/download/docker-compose-`uname -s`-`uname -m` > $HOME/.docker/cli-plugins/docker-compose
$ chmod +x $HOME/.docker/cli-plugins/docker-compose
```

### 安装到全局

```bash
$ curl -L https://github.com/docker/compose/releases/latest/download/docker-compose-`uname -s`-`uname -m` > docker-compose
$ sudo mv docker-compose /usr/libexec/docker/cli-plugins
$ sudo chmod +x /usr/libexec/docker/cli-plugins/docker-compose
$ sudo chown root:root /usr/libexec/docker/cli-plugins/docker-compose
```

## 验证和使用

```bash
$ docker compose version

Docker Compose version v2.4.1
```

如果能正常返回，说明已经可以正常使用。只要将熟悉的 docker-compose 命令替换为 docker compose，即可使用 Docker Compose。
