---
title: 迁移 Docker Compose 遇到 yaml 结构错误
date: 2023-11-03 12:51:48
categories:
  - 技巧
tags:
  - Docker
  - Docker Compose
---

最近在迁移服务器，遇到了一个问题。我原来一直使用的 docker-compose.yml 文件，迁移到新服务器上后，居然报错了。

<!-- more -->

## 问题

差不多是这样的错误

```
yaml: unmarshal errors:
  line 155: mapping key "<<" already defined at line 154
  line 192: mapping key "<<" already defined at line 191
```

那么来看下我的 docker-compose.yml 文件

```yaml
version: "3.8"
x-proxy: &default-proxy
  environment:
    http_proxy: http://clash:10808
    https_proxy: http://clash:10808
  depends_on:
    - clash
  networks:
    - proxy

x-timesync: &time
  volumes:
    - /etc/localtime:/etc/localtime:ro
    - /etc/timezone:/etc/timezone:ro

nginx:
  <<: *default-proxy
  <<: *time
```

这边就是给 nginx 的配置中插入了两段配置，分别是代理和时区。一直用下来都很正常，没出现过问题。

## 解决

两边唯一的区别就是 docker compose 的版本了。老服务器上的版本是 `2.4.1` 的，新服务器装了当前的最新版本，也就是 `2.21.0`。

经过一番搜索，总的来说是这样的。

根据 yaml 的规范，一个 key 像这样出现多次是不规范的。按照官方的写法，这里应该写成：

```yaml
nginx:
  <<: [*default-proxy, *time]
```

根据 docker compose 的相关 issue，在 2.17 版本时改进了 yaml 解析器，不再允许这种不规范的写法。

所以，这边只需要规范一下写法即可。
