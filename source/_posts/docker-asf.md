---
title: 通过Docker快速部署ASF(ArchiSteamFarm)挂卡
date: 2018-11-17 00:16:00
updated: 2018-11-17 00:16:00
tags:
  - Docker
  - Steam
  - 挂卡
  - ASF
---

今天来介绍一下超简单的使用 Docker 部署 ASF 的方法。在部署上，相对一般的部署，使用 Docker 会简单许多，今天我就来介绍一下如何使用 Docker 部署 ASF。

<!--more-->

## ArchiSteamFarm

这个软件就是用来 Steam 挂卡的，相信查到这篇文章的人应该都知道 Steam 挂卡是什么吧。在之前的一篇文章——[在 Ubuntu 16.04 环境下使用 ASF(v3) 实现云挂卡](/2018/08/08/asf-steam/)里，我已经介绍了部署 ArchiSteamFarm 的一般流程，以及 ASF 的两步验证、IPC、在 Telegram 中管理 ASF 等内容，感兴趣的可以了解一下。

## 为什么使用 Docker

我也不想多介绍 Docker，大家可以自己去搜索一下。为什么要用 Docker 呢，那就是简单。

由于 Docker 确保了执行环境的一致性，不用在意系统环境，你只需要运行做好的 Docker 镜像，部署就完成了，又快又好。

## 步骤

### 安装 Docker

我是用一键脚本进行安装的，非常简便。

Ubuntu 系统使用以下脚本：

```shell
wget -qO- https://get.docker.com/ | sh
sudo service docker start
```

CentOS 系统使用以下脚本：

```shell
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo systemctl start docker
```

### 创建配置文件

#### 创建文件夹

创建一个文件夹用于存储配置文件

```shell
mkdir /home/asf && cd /home/asf
```

#### 创建配置文件

一样，我们需要创建 ASF 需要使用的配置文件。建议使用[ASF 配置文件生成器](https://justarchinet.github.io/ASF-WebConfigGenerator/#/)进行生成`ASF.json`和`botname.json`文件，其中`botname`为机器人名称。

将生成的全局配置存储为`ASF.json`，生成的机器人配置存储为`botname.json`，可以将`botname`改成你喜欢的名称。

#### IPC 端口配置

在使用 docker 镜像的时候，需要让 IPC 在镜像内绑定到`0.0.0.0:1242`，否则外部无法访问。只需要添加配置文件`IPC.config`，填入以下内容。

```json
{
  "Kestrel": {
    "Endpoints": {
      "HTTP": {
        "Url": "http://*:1242"
      }
    }
  }
}
```

#### 其他配置

如果还有其他需要配置的文件，也要将配置文件放置在此处，如 2FA 配置文件`botname.maFile`。

### 启动 Docker 镜像

```
docker pull justarchi/archisteamfarm
docker run -it -p 127.0.0.1:1242:1242 -p [::1]:1242:1242 -v /home/asf:/app/config --name asf justarchi/archisteamfarm
```

注意将`/home/asf`改成你之前存储配置文件的文件夹。

这个命令运行后，将会进入镜像和程序进行交互，可能会有需要输入的内容，比如 Steam 的二次验证等。等程序正常运行后，按`ctrl+P+Q`撤出镜像并让镜像继续在后台执行。

这样运行下来，只有本地能够访问 1242 端口，建议保持这样，比较安全，可以使用 Nginx 进行反代 IPC 进行使用。

如果想要直接绑定到`0.0.0.0:1242`，可以将命令改成如下内容。

```
docker run -it -p 1242:1242 -v /home/asf:/app/config --name asf justarchi/archisteamfarm
```

### ASF 的启动和停止

- 启动: `docker start asf`
- 停止: `docker stop asf`

## Nginx 反代 IPC 配置

可以参考一下，由 ASF 作者提供。

```
server {
    listen *:443 ssl;
    server_name asf.mydomain.com;
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/certificate.key;

    location /Api/NLog {
        proxy_pass http://127.0.0.1:1242;
#        proxy_set_header Host 127.0.0.1; # Only if you need to override default host
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Host $host:$server_port;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Server $host;
        proxy_set_header X-Real-IP $remote_addr;

        # We add those 3 extra options for websockets proxying, see https://nginx.org/en/docs/http/websocket.html
        proxy_http_version 1.1;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Upgrade $http_upgrade;
    }

    location / {
        proxy_pass http://127.0.0.1:1242;
#        proxy_set_header Host 127.0.0.1; # Only if you need to override default host
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Host $host:$server_port;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Server $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```
