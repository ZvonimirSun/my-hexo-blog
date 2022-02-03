---
title: 在Ubuntu 16.04中安装php7.2
date: 2018-08-09 11:19:25
updated: 2018-08-09 11:19:25
categories:
  - 应用
tags:
  - Linux
  - Ubuntu
  - php
keywords: php7.2,ubuntu,16.04
---

本文记录如何在 Ubuntu 16.04 中安装 php-7.2。

<!--more-->

## 添加 PPA 源

```shell
sudo apt install software-properties-common python-software-properties
sudo add-apt-repository ppa:ondrej/php && sudo apt update
```

## 安装 php7.2

```shell
sudo apt -y install php7.2
```

## 安装 php 扩展

常用扩展

```shell
sudo apt install php7.2-fpm php7.2-mysql php7.2-curl php7.2-json php7.2-mbstring php7.2-xml php7.2-intl -y
```

更多需要的扩展，请自行搜索。
