---
title: Docker一键部署LNMP
date: 2019-03-09 15:41:00
updated: 2019-04-02 23:41:00
categories:
  - 应用
tags:
  - LNMP
  - 建站
  - Docker
keywords: docker,lnmp,dnmp,部署,建站
---

之前一段时间，我已经把服务器上的应用全部 Docker 化了。我把我服务器上的 LNMP 配置，提取出来，来写一下如何用 Docker 部署一个最简单的 LNMP。

<!--more-->

## 项目地址

写了 docker-compose，放在了 Github 上，还有些简单的配置文件。

Github 项目地址: [https://github.com/ZvonimirSun/dnmp](https://github.com/ZvonimirSun/dnmp)

### 简介

通过 Docker 一键部署 LNMP。包含以下内容：

- `nginx:alpine`:
  - 说明
    - 已支持`TLS 1.3`
  - 网站目录: `./nginx/html`(docker 内`/usr/share/nginx/html`)
  - 虚拟主机配置目录: `./nginx/conf.d`(docker 内`/etc/nginx/conf.d`)
- `mysql:5`
  - 数据库目录: `./mysql`
- `php:7-fpm-alpine`:
  - 说明
    - 基于初始镜像额外安装了`pdo_mysql`、`mysqli`、`gd`插件。
    - 若想安装其他插件，请自行修改`Dockerfile`。
  - `php.ini`目录: `./php-fpm`
- acme.sh:
  - 说明:
    - 用于申请 ssl 证书。
    - 使用方法: 参考[官方文档](https://github.com/Neilpang/acme.sh)
  - 证书存储目录: `./ssl`

### 安装

- 请确保已经安装`docker`和`docker-compose`。
- 将项目 clone 到本地
- 在`docker-compose.yml`文件中更改你需要的端口和数据库密码。
- 执行`docker-compose up -d`，并等待启动完成。

### 常见问题

Nginx:

- 检查 Nginx 配置:
  - `docker exec nginx nginx -t`
- Nginx 重载配置:
  - `docker exec nginx nginx -s reload`
- 配置:
  - 启用`php`: `include enable-php.conf`
  - 启用带`pathinfo`的`php`: `include enable-php-pathinfo.conf`
  - 启用`HSTS`: `add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;`(此句可根据需要适当调整)

php:

- 安装插件(以 pdo_mysql 为例):
  - `docker exec php docker-php-ext-install pdo_mysql`
  - 最好修改`Dockerfile`实现，否则无法保留
- 访问地址:
  - `docker`中访问`php`: `http://php:9000`

mysql:

- 访问地址
  - `docker`中访问`mysql`地址: `http://mysql:3306`
  - 宿主机访问`mysql`地址: `http://localhost:3306`
- 如需外部访问 mysql，请自行修改 mysql 的端口映射为`3306:3306`，并放开防火墙。
- 连接数据库: `docker-compose exec mysql mysql -u root -p`
