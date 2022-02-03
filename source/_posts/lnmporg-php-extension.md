---
title: 军哥LNMP一键安装包的php扩展安装
date: 2018-08-15 13:43:41
updated: 2018-08-15 13:43:41
categories:
  - 应用
tags:
  - LNMP
  - php
  - 建站
keywords: lnmp,lnmp.org,php,扩展,extension,一键包
---

我站上的 LNMP 用的是军哥的 LNMP 一键安装包，其中的软件都是通过编译安装的，我发现直接通过`apt install`的方法安装 php 扩展并不会生效，其实有更好的安装方法。

<!--more-->

## 前提

这里讲的方法适用于使用军哥 LNMP 一键安装包的情况。LNMP 一键安装包官网，请点击[这里](https://lnmp.org/)。

## 环境

我使用的 LNMP 一键安装包 1.5 版本，默认 php 安装了 php7.0。

## 步骤

在这里以安装 zip 扩展为例。

### 解压 php 安装包

先进入 lnmp 安装包目录，我放在了 root 文件夹中。

```shell
cd ~/lnmp/
```

进入安装包存放位置。

```shell
cd src
```

解压安装包

```shell
tar -jxvf php-7.0.30.tar.bz2
```

### 进入扩展包存放目录

```shell
cd php-7.0.30/ext
```

### 进入需要的扩展文件夹

以 zip 为例

```shell
cd zip
```

### 编译配置

#### 执行 phpize

```shell
/usr/local/php/bin/phpize
```

![](https://img.iszy.xyz/20190318204059.png?x-oss-process=style/big)

#### 执行 configure

```shell
./configure --with-php-config="/usr/local/php/bin/php-config"
```

### 编译

#### 开始编译

```shell
make
```

#### 编译完成

编译完成后，将在 modules 目录下生成`zip.so`文件，将其复制到 php 扩展文件夹中。

```shell
cd modules
cp zip.so /usr/local/php/lib/php/extensions/no-debug-non-zts-20151012
```

可以到`/usr/local/php/lib/php/extensions`文件夹中看一下，这个文件夹名字可能和我这里有所不同。

#### 配置 php.ini

经测试，不需要修改 php.ini，可能已经默认包含了所有扩展文件夹中的内容。

~~打开`php.ini`文件~~

```shell
vi /usr/local/php/etc/php.ini
```

~~找到`;extension=`字样，可以通过输入`/;extension=`快速找到。~~

~~添加以下内容。~~

```
extension=zip.so
```

### 重载 php-fpm

```shell
lnmp php-fpm reload
```

## 结论

现在你已经成功安装了 zip 扩展，其他扩展也可以类比着来，有什么问题，可以在评论区问我。
