---
title: Linux常用命令
date: 2018-07-24 08:59:23
updated: 2018-07-24 08:59:23
categories:
  - 技能
  - Linux
tags:
  - RHEL
keywords: linux, 常用命令, rhel, 学习
---

总结几个 Linux 常用的命令。

<!--more-->

## 查看帮助命令`man`

用法: `man [OPTION...] [SECTION] PAGE...`

可以用`man --help`或`man -h`查看更多用法。

例子：

用`man man`查看 man 的说明。

![](https://img.iszy.cc/20190318213752.png)

## 常见工作命令

### echo 命令

用法: `echo [SHORT-OPTION]... [STRING]...`或`echo LONG-OPTION`

例子：

![](https://img.iszy.cc/20190318213805.png)

### date 命令

用法: `date [OPTION]... [+FORMAT]`或者`date [-u|--utc|--universal] [MMDDhhmm[[CC]YY][.ss]]`

常见参数

| 参数 | 解释                             |
| ---- | -------------------------------- |
| %d   | day of month (e.g., 01)          |
| %H   | hour (00..23)                    |
| %I   | hour (01..12)                    |
| %j   | day of year (001..366)           |
| %m   | month (01..12)                   |
| %M   | minute (00..59)                  |
| %n   | a newline                        |
| %S   | second (00..60)                  |
| %t   | a tab                            |
| %u   | day of week (1..7); 1 is Monday  |
| %w   | day of week (0..6); 0 is Sunday  |
| %y   | last two digits of year (00..99) |
| %Y   | year                             |

例子：

![](https://img.iszy.cc/20190318213820.png)

### poweroff 命令

关机

### reboot 命令

重启

### wget 命令

下载命令

| 参数 | 解释                               |
| ---- | ---------------------------------- |
| -a   | 显示所有进程（包括其他用户的进程） |
| -u   | 用户以及其他详细信息               |
| -x   | 显示没有控制终端的进程             |

### top 命令

相当于任务管理器的监控

![](https://img.iszy.cc/20190318213832.png)

### pidof 命令

查看进程 pid

![](https://img.iszy.cc/20190318213847.png)

### kill 命令

关闭某个进程

用法: `kill pid...`

**待更新~~**
