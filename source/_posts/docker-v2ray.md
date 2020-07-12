---
title: 使用Docker简单部署v2ray
date: 2019-02-18 09:03:13
updated: 2019-02-18 09:03:13
categories:
  - 技能
  - 应用部署
  - Docker
tags:
  - Docker
  - V2Ray
  - 科学上网
keywords: v2ray docker,v2ray安装,v2ray配置,v2ray教程,v2ray搭建,v2ray部署,v2ray配置文件,v2ray命令
---

V2Ray 提供了 Docker 部署方式，当你有一份可用的配置文件时，通过 Docker 来部署 V2Ray 会非常轻松高效，今天就来简单讲一下。

<!--more-->

## 安装 Docker

以 Ubuntu 为例，使用官方一键脚本安装。

```shell
wget -qO- https://get.docker.com/ | sudo sh
# 注意把username换成你自己的用户名，root用户请忽略，这步是为了让你的用户能够直接使用docker命令
sudo usermod -aG docker username
```

重新登录你的 VPS，你刚刚添加的用户就能直接使用 Docker 命令了。

## 部署 v2ray

在你喜欢的位置新建一个名叫 `v2ray` 的文件夹，当然其他名字也没事啦。将配置文件`config.json`放置到刚刚创建的文件夹里，运行下面的命令完成部署。

```shell
docker pull v2ray/official
docker run -d --name v2ray -v /your/path/to/v2ray:/etc/v2ray -p 8888:8888 --restart=always v2ray/official  v2ray -config=/etc/v2ray/config.json
```

请将`/your/path/to/v2ray`替换成刚刚的文件夹路径，将`8888`替换成你需要使用的端口，如果有多个端口，可以添加多个`-p`参数。

至此，部署完成。

## 常用命令

- 查看正在运行的容器: `docker ps`
- 查看所有容器: `docker ps -a`
- 启动 v2ray: `docker start v2ray`
- 停止 v2ray: `docker stop v2ray`
- 重启 v2ray: `docker restart v2ray`
- 删除 v2ray: `docker stop v2ray && docker rm v2ray`
- 更新 v2ray 镜像: `docker pull v2ray/official`

如果修改了配置，需要更改端口，可以删除 v2ray，重新运行部署命令即可。更新 v2ray，需要先更新 v2ray 镜像，然后删除现有的 v2ray，重新运行部署命令。

## 通过 docker-compose 提供更便捷的部署和管理(选)

### docker-compose 安装

如果你想要通过`docker-compose`统一管理你的`Docker container`，这里也可以安装一下，不是必须步骤。

```shell
sudo curl -L https://github.com/docker/compose/releases/download/1.23.2/run.sh > /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

可以运行一下`docker-compose version`来检测一下是否成功。

### 创建配置文件

创建一个名为`docker-compose.yml`的配置文件，输入如下内容。

```yaml
version: "3"
services:
  v2ray:
    image: v2ray/official
    container_name: v2ray
    restart: always
    command: v2ray -config=/etc/v2ray/config.json
    ports:
      - "8888:8888"
      #- "127.0.0.1:8889:8889"
    volumes:
      - ./v2ray:/etc/v2ray
      #- /etc/v2ray/v2ray.crt:/etc/v2ray/v2ray.crt
      #- /etc/v2ray/v2ray.key:/etc/v2ray/v2ray.key
```

请将`./v2ray`替换为你创建的文件夹，或将该文件夹放置在`docker-compose.yml`同一目录下。

### 命令

以下命令需要在`docker-compose.yml`所在目录下执行。

- 部署 v2ray: `docker-compose up -d`
- 启动 v2ray: `docker-compose start v2ray`
- 停止 v2ray: `docker-compose stop v2ray`
- 重启 v2ray: `docker-compose restart v2ray`
- 删除 v2ray: `docker stop v2ray && docker rm v2ray`
- 更新 v2ray: `docker-compose pull && docker-compose up -d`
