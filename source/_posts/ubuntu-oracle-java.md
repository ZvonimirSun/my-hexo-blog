---
title: 在Ubuntu 16.04中安装Oracle Java 8
date: 2018-08-05 09:43:19
updated: 2018-08-05 09:43:19
categories:
  - 技巧
tags:
  - Linux
  - Java
keywords: ubuntu,java,oracle,16.04
---

在此记录一下在 Ubuntu 16.04 中安装 Oracle Java 8 的过程。

<!--more-->

## 添加 Oracle 的 PPA

```shell
sudo add-apt-repository ppa:webupd8team/java
sudo apt update
```

![](https://img.iszy.xyz/20190318220829.png)

## 安装 Java 8

```shell
sudo apt install oracle-java8-installer -y
```

如下图所示，将会跳出一个界面让你同意 Oracle 的 license，切换到 Yes 回车即可。

![](https://img.iszy.xyz/20190318220840.png)

## 指定 Java 版本

一台服务器上可能会安装有多个 Java 版本，通过以下语句指定版本，选择想要的版本即可。

```shell
sudo update-alternatives --config java
```

## 设定`JAVA_HOME`环境变量

打开存环境变量的文件

```shell
sudo vi /etc/environment
```

在底部添加一行

```shell
JAVA_HOME="/usr/lib/jvm/java-8-oracle"
```

应用环境变量

```shell
source /etc/environment
```

可以通过如下语句确认环境变量是否配置成功

```shell
echo $JAVA_HOME
```

## 后话

现在已经成功安装了 Oracle Java 8，尽情使用吧。
