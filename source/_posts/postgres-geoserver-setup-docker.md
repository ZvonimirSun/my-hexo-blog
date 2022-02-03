---
title: 通过Docker部署Posgresql+Geoserver环境
date: 2019-02-05 17:57:56
updated: 2019-02-05 17:57:56
categories:
  - 应用
tags:
  - GIS
  - Postgresql
  - PostGIS
  - GeoServer
---

本文介绍一下如何通过 Docker 部署 `Postgresql` + `PostGIS` + `Geoserver` 环境。本文操作在 Ubuntu 18.04 中完成，理论上适用于其他可用 Docker 的系统环境。

<!--more-->

## 安装 Docker

Docker 的安装很简单，教程很多，在这里只列举一下，Ubuntu 和 CentOS 的安装脚本。

- Ubuntu: `wget -qO- https://get.docker.com/ | sudo sh`
- CentOS: `curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh`

## 安装 Postgresql + PostGIS

在这里使用 kartoza 大佬的 docker 镜像`kartoza/postgis:10.0-2.4`。

### 镜像说明

- Postgresql: `10.3.1`
- PostGIS: `2.4.4`

项目地址：`https://github.com/kartoza/docker-postgis`

### 部署命令

运行以下命令部署 Postgresql + PostGis，注意替换命令中的用户名和密码。还有更多环境变量可用，亦可选择其他镜像版本可以参考项目 [README](https://github.com/kartoza/docker-postgis/blob/develop/README.md)。

```shell
cd ~ && mkdir postgres_data
docker run --name "postgis" -p 5432:5432 -d -t -v $HOME/postgres_data:/var/lib/postgresql -e POSTGRES_USER="postgres" -e POSTGRES_PASS="postgres" -e ALLOW_IP_RANGE=0.0.0.0/0 --restart=always kartoza/postgis:10.0-2.4
```

## 安装 Geoserver

在这里使用我 build 的 docker 镜像`zvonimirsun/geoserver:2.14.2`。

### 镜像说明

- Geoserver: `2.14.2`
- oraclejdk: `8`
- tomcat: `8.0-jre8`

项目地址：`https://github.com/ZvonimirSun/docker-geoserver`

本项目 fork 自 kartoza 大佬的[项目](https://github.com/kartoza/docker-geoserver)，修复了命令中的一个不知道为何会存在的一个低级错误，替换了过期的下载链接。我只 build 了`2.14.2`的版本，使用了 oraclejdk8。想要旧版本 geoserver 的可以看 kartoza 大佬的[镜像](https://hub.docker.com/r/kartoza/geoserver/tags)，现在的最新版本为`geoserver 2.13.0`，默认使用的是 openjdk。如果仍旧不是自己想要的版本或是要添加插件，可以根据 [README](https://github.com/ZvonimirSun/docker-geoserver/blob/master/README.md) 自行 build。

### 部署命令

运行以下命令部署 Geoserver，注意替换命令中的用户名和密码。还有更多环境变量可用，可以参考项目 [README](https://github.com/ZvonimirSun/docker-geoserver/blob/master/README.md)。

```shell
cd ~ && mkdir geoserver_data
docker run -d -p 8080:8080 --name geoserver -v $HOME/geoserver_data:/opt/geoserver/data_dir zvonimirsun/geoserver:2.14.2
```
