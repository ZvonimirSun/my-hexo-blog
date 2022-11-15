---
title: 通过Docker部署acme.sh
date: 2019-02-13 13:29:45
updated: 2019-02-13 13:29:45
categories:
  - 技巧
tags:
  - SSL
  - Linux
  - acme.sh
  - Docker
---

本文介绍一下如何通过 Docker 部署 acme.sh 申请证书，并添加 crontab 任务自动更新证书。

<!--more-->

## 前言

最近觉得这个 `Docker` 超好用啊，`docker-compose` 也是个神器，折腾了半天，把服务器上跑的所有应用都 docker 化了，用一个 `docker-compose.yml` 统一管理，怎一个爽字了得。

今天才把 acme.sh 替换成 docker，在此记录一下。

## 安装环境

### Docker 安装

在此以 Ubuntu 为例，其他系统请自己找下方法，教程很多，很容易的。

```shell
wget -qO- https://get.docker.com/ | sudo sh
# 注意把username换成你自己的用户名，root用户请忽略
sudo usermod -aG docker username
sudo reboot
```

### docker-compose 安装

`docker-compose`作为一个 python 应用，也是可以直接用容器来执行的，下面来安装一下。

```shell
sudo curl -L https://github.com/docker/compose/releases/download/1.23.2/run.sh > /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

下面可以运行一下`docker-compose version`来检测一下是否成功，第一次运行 docker-compose 命令会自动拉取`docker/compose:1.23.2`镜像。

安装成功会显示如下内容，可能会与我有些差异。

```
docker-compose version 1.23.2, build 1110ad01
docker-py version: 3.6.0
CPython version: 3.6.7
OpenSSL version: OpenSSL 1.1.0f  25 May 2017
```

## 部署 acme.sh

### 编写 docker-compose.yml

本文使用一个`docker-compose.yml`文件来部署 acme.sh，不使用 docker-compose 的方法呢，请看[官方给出的方法](https://github.com/Neilpang/acme.sh/wiki/Run-acme.sh-in-docker)。

在你想要的位置运行如下命令创建`docker-compose.yml`文件。

```shell
touch docker-compose.yml
```

编辑此文件，加入如下内容。需要使用 dns api 的请参考注释中的添加方法添加环境变量，如果有什么类似 CloudXNS 的 IP 白名单记得要加好。

```shell
version: "3"
services:
  acme.sh:
    image: neilpang/acme.sh
    container_name: acme.sh
    restart: always
    command: daemon
    #environment:
    #  - CX_Key="XXXXXXXXXX"
    #  - CX_Secret="XXXXXXXXXX"
    volumes:
      - ./ssl:/acme.sh
    network_mode: host
```

保存后在`docker-compose.yml`同目录下运行如下命令启动 acme.sh。如果更改了`docker-compose.yml`文件，只要在此运行如下命令，就能够更新到最新状态。

```shell
docker-compose up -d
```

### 申请证书

所有 acme.sh 的正常命令都能够正常使用，需要做一点小小的更改，比如我演示一下使用 CloudXNS API 申请本站的 ECC 泛域名证书，其他命令也类似进行。由于我的 container_name 也是 acme.sh，所以可以直接使用 docker 而非 docker-compose 命令运行。

```shell
docker exec acme.sh --issue --dns dns_cx -d iszy.cc -d '*.iszy.cc' --keylength ec-384
```

也可以添加一条 alias 来像往常一样运行 acme.sh，可以将这句添加到`.bashrc`或`.zshrc`文件中。

```shell
alias acme.sh="docker exec acme.sh"
```

### 设置 crontab 任务自动续签

运行`crontab -e`来编辑 crontab 文件，添加如下内容，保存即可。

```
0 0 * * * docker exec acme.sh --cron
```

可以运行`crontab -e`来查看已经添加的 crontab 任务。

## 后话

所以，这就部署好了，还是很方便的，尤其是在你的 VPS 上有不少 docker，并统一使用 docker-compose 进行管理的时候。有兴趣的可以这么折腾一下啦。
