---
title: Ubuntu 16.04 更改软件源
date: 2018-05-05 12:00:00
updated: 2018-05-05 12:00:00
categories:
  - Linux
tags:
  - Ubuntu
  - 软件源
keywords: 更改,软件源,Ubuntu,WSL,Linux
---

由于国内的特殊环境，Linux 系统如果不更换软件源，软件的下载安装将会速度奇慢。总不能下载软件也全走代理吧，更换软件源才是正道。本文是在 Win10 子系统 Ubuntu 中完成的，在原版 Ubuntu 中同样适用。

<!--more-->

## 更换软件源

本文选择将软件源更换为阿里云的镜像以实现高速访问。

### 备份官方软件源列表

```bash
sudo cp /etc/apt/sources.list /etc/apt/sources.list.bak
```

### 修改软件源列表

#### 用熟悉的编辑器打开

我在这里使用 vim 打开

```bash
sudo vim /etc/apt/sources.list
```

#### 进行替换

替换默认的

```
http://archive.ubuntu.com/
```

和

```
http://security.ubuntu.com/
```

为

```
https://mirrors.aliyun.com/
```

**注：**vim 中的全局替换命令为 `:%s/源字符串/目的字符串/g`

#### 保存并退出

输入`:wq`。

### 更新源和软件

- 使用 `sudo apt-get update -y` 获取软件列表更新
- 使用 `sudo apt-get upgrade -y` 获取软件更新
