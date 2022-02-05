---
title: Ubuntu 安装使用 Composer
date: 2018-08-09 10:47:36
updated: 2018-08-09 10:47:36
categories:
  - 应用
tags:
  - Linux
  - Composer
  - php
keys: composer,国内源,速度慢,ubuntu
---

今天我想要安装 polr 短域名项目的时候，需要用到 Composer。期间遇到了一些问题，在这里记录一下安装使用 Composer 的问题和解决方案。

<!--more-->

## 安装 Composer

我选择使用`Composer 中国全量镜像`，这个是由 Laravel China 社区联合又拍云与优帆远扬共同合作推出的公益项目，旨在为广大 PHP 用户提供稳定和高速的 Composer 国内镜像服务。

虽然我是腾讯云的香港主机啦，但不知道为什么使用 Composer 官网极慢，所以也选择了使用国内镜像。

### 安装

使用如下命令安装，如遇权限不足，可添加 sudo。

```shell
wget https://dl.laravel-china.org/composer.phar -O /usr/local/bin/composer
chmod a+x /usr/local/bin/composer
```

### 查看当前版本

```shell
composer -V
```

### 升级版本

此处升级命令连接的是官方服务器回合慢，不推荐。建议直接从国内镜像站下载更新。

```shell
composer selfupdate
```

## 切换 Composer 镜像

### 全局(推荐)

```shell
composer config -g repo.packagist composer https://packagist.laravel-china.org
```

### 单独使用

如果仅限当前工程使用镜像，去掉 -g 即可。

```shell
composer config repo.packagist composer https://packagist.laravel-china.org
```

## 问题

1. 已存在 composer.lock 文件，先删除，再运行 composer install 重新生成。

   composer.lock 缓存了之前的配置信息，从而导致新的镜像配置无效。

2. Your requirements could not be resolved to an installable set of packages.

   ```
   Loading composer repositories with package information
   Installing dependencies from lock file
   Your requirements could not be resolved to an installable set of packages.

     Problem 1
       - Installation request for phpoffice/phpexcel 1.8.1 -> satisfiable by phpoffice/phpexcel[1.8.1].
       - phpoffice/phpexcel 1.8.1 requires ext-xml * -> the requested PHP extension xml is missing from your system.
     Problem 2
       - phpoffice/phpexcel 1.8.1 requires ext-xml * -> the requested PHP extension xml is missing from your system.
       - maatwebsite/excel 2.1.6 requires phpoffice/phpexcel 1.8.* -> satisfiable by phpoffice/phpexcel[1.8.1].
       - Installation request for maatwebsite/excel 2.1.6 -> satisfiable by maatwebsite/excel[2.1.6].
   ```

   解决方案：

   以我使用的 php 版本 php7.2 为例，请根据自己使用的 php 版本进行修改。

   ```shell
   apt install php7.2-xml
   ```

3. 安装时出现`Unzip with unzip command failed, falling back to ZipArchive class`

   解决方案：

   同样以 php7.2 为例。

   ```shell
   apt install php7.2-zip
   ```
