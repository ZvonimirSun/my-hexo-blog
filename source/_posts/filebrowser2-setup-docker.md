---
title: 通过Docker快速部署FileBrowser 2.0
date: 2019-02-02 22:04:48
updated: 2019-02-02 22:04:48
tags:
  - 文件管理
  - Docker
---

File Browser 作为一款远端文件浏览器，可以把你的服务器轻松地变为私人网盘。今天我就来简单介绍一下，如何通过 Docker 轻松部署 File Browser 2.0。

<!--more-->

## File Browser 简介

File Browser 可以在指定目录中提供文件管理界面，可以上传、删除、预览、重命名和编辑文件。 它允许创建多个用户，每个用户都可以拥有自己的目录。 它可以用作独立应用程序或中间件。

功能概览：

- 简单好用的登录系统
- 通过流畅的界面管理文件
- 管理用户，添加权限，设置文件范围
- 编辑文件
- 执行自定义命令
- 个性化界面

## 安装及配置

### 安装 Docker

Docker 的安装很简单，教程很多，在这里只列举一下，Ubuntu 和 CentOS 的安装脚本。

- Ubuntu: `wget -qO- https://get.docker.com/ | sudo sh`
- CentOS: `curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh`

### 创建配置文件

如果要自定义设置的话，那就要创建一个配置文件，注意配置文件中的路径都是 Docker 容器中的虚拟路径。

```shell
vi filebrowser.json
```

我的配置文件内容如下

```json
{
  "address": "0.0.0.0",
  "port": 80,
  "locale": "zh-cn",
  "baseURL": "/",
  "log": "stdout",
  "database": "/database.db",
  "root": "/srv", // 文件管理根目录
  "cert": "/ssl.cer", // 如果不需要 https 请去掉
  "key": "/ssl.key" //   cert 和 key 两行配置
}
```

如果需要更多配置内容，请参考[官方文档](https://docs.filebrowser.xyz/cli/filebrowser-config-set)。

### 创建一个 db 文件

如果需要长久化存储账号配置等信息，需要提前创建一个空的 db 文件用于存储。

```shell
touch database.db
```

### 启动 File Browser

使用如下命令启动 File Browser。注意替换所有`:`前的路径为你自己的路径，`:`后的路径为 docker 容器中的虚拟路径，不要修改。可以把 8888 改成任意你想要的端口。如果上面配置文件里面没有写 https 配置的话，可以不用加上证书和密钥的映射。

```shell
docker run \
-v /your/path:/srv \
-v /your/path/to/example.cer:/ssl.cer \
-v /your/path/to/example.key:/ssl.key \
-v /your/path/to/database.db:/database.db \
-v /your/path/to/filebrowser.json:/.filebrowser.json \
-p 8888:80 \
--name filebrowser \
--restart=always \
filebrowser/filebrowser
```

访问你的浏览器，现在应该可以开始使用了。如果通过外网访问，别忘了在防火墙打开端口。

![File Browser](https://img.iszy.xyz/20190318213056.png)

## 其他

### 管理

这里的管理指的是在服务器上对 File Browser 进行管理，File Browser 内的操作我就不再赘述了。

- 关闭 File Browser: `docker stop filebrowser`
- 开启 File Browser: `docker start filebrowser`
- 卸载 File Browser: `docker rm filebrowser`

### 防火墙配置

如果需要外网访问，需要在服务器上打开端口，以上面的`8888`端口为例。

这里仅举例 iptables 和 ufw 的操作。

#### iptables

```shell
sudo iptables -A INPUT -p tcp --dport 8888 -j ACCEPT
sudo iptables -A OUTPUT -p tcp --sport 8888 -j ACCEPT
```

#### ufw

```shell
sudo ufw allow 8888
```

## 后话

好了，以上就是通过 Docker 在 Linux 系统上安装以及使用 File Browser 的方法。既然是 Docker，那么在其他支持 Docker 的平台也是可以用的，Docker 部分的操作是一致的。

有更多问题，欢迎在评论区留言。
