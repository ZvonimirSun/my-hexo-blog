---
title: 利用Github自建图床的几种方式
tags:
  - Github
  - 图床
keywords: "Github图床,自建图床,jsDelivr"
date: 2020-05-05 10:18:02
updated: 2020-05-05 10:18:02
---

本文我来简单讲一下利用 Github 自建图床的几种方式，希望能对大家有些帮助。

<!--more-->

## 前言

本来我是在自己服务器上搭的图床，套上 cdn，使用体验挺好。为什么想到用 Github 来自建图床呢，主要是考虑到以下几个方面。

1. 首先，Github 有着免费的存储空间，不用占据自己的硬盘。当然，虽然官方对 repo 没有磁盘限制，但是推荐在 1GB 以下，超过 1GB 会有邮件通知。上传超过 50M 的单个文件会 warning，无法上传超过 100M 的单个文件。不过，对于我这样用于博客图床的，图片容量不会很大，其实已经很够用了。
2. 其次，我使用 Github 主要是出于版本管理和迁移成本的考虑。由于图片放在 Github 上，当我想要迁移到其他地方，只需要简单的 git clone 以下即可，想要回退版本，防止误操作也很方便。
3. 此外，Github 使用人数很多，所以各种基于 Github 的工具和使用案例很多，不会给自己增添麻烦。比如 [PicGo](https://github.com/Molunerfinn/PicGo)，一个用于快速上传图片并获取图片 URL 链接的工具，其中就支持 Github，也可以自定义链接，很好用。

这么来看，Github 是一个很好的图床承载工具。

## 准备条件

### 建立 Repo

我们要用 Github 做图床，首先建个 Repo 应该不难理解吧，这个就是你用来存储图片的仓库了。[点击前往](https://github.com/new)

![](https://img.iszy.xyz/20200505113214.png)

点击 Create repository，这个仓库就建好了。

![](https://img.iszy.xyz/20200505113547.png)

比如我这里建立了一个名为 img-hosting 的仓库作为示例，链接形如

[https://github.com/ZvonimirSun/img-hosting](https://github.com/ZvonimirSun/img-hosting)

### 上传工具

既然要用 GitHub 作为图床，如果没有一个方便的上传图片的方式，用起来就很难受了。这边推荐下我主要在用的工具，也就是我前面提到的 [PicGo](https://github.com/Molunerfinn/PicGo)，文档比较完善，我这边就不再细说，大家可以直接看下官方说明，配置很简单的。

[传送门](https://picgo.github.io/PicGo-Doc/zh/guide/config.html#github%E5%9B%BE%E5%BA%8A)

![](https://img.iszy.xyz/20200505114811.png)

通过设定自定义域名，就可以每次自动获取你需要的链接格式。

## 获取图片链接方案

### 直连方案

这个方案听着就很简单了，就是直接使用 Github 存储的直链，形如

```
https://raw.githubusercontent.com/ZvonimirSun/my-img-hosting/master/20190317184116.png
```

只要把链接里的 GitHub 用户名，和你的 repo 名替换即可。master 是分支名，一般没有特别设置都是这个，不用改动。最后跟上你的图片目录即可。

PicGo 中可以把自定义域名配置为`https://raw.githubusercontent.com/ZvonimirSun/my-img-hosting/master`

有些人说要使用用 Github Pages，我是觉得没有必要的。一是因为 GitHub Pages 有 1GB 容量限制，二是因为 GitHub Pages 渲染页面比较容易失败，徒增麻烦。不过 Github Pages 可以配置自定义域名，有这个需求的可以尝试，在此我就不推荐了。

### 公用 CDN 方案

众所周知，GitHub 在国内因为某些不可描述之事使用体验不佳，用户在加载图片的时候会十分缓慢，这时候一个 CDN 就帮助很大了。

这不就巧了吗，jsDelivr 为开发者提供了免费公共 CDN 加速服务，其中就对 Github 进行了加速，只要通过 jsDelivr 的链接引用你的资源，就能获得 jsDelivr 全球 CDN 的加速效果。鉴于 jsDelivr 是在国内有节点的，使用体验就很好了。

使用方法很简单，jsDelivr 加速 GitHub 文件的链接格式如下。

```
https://cdn.jsdelivr.net/gh/user/repo@version/file
```

上面的示例就改成这样即可。

```
https://cdn.jsdelivr.net/gh/ZvonimirSun/my-img-hosting@master/20190317184116.png
```

PicGo 中可以把自定义域名配置为`https://cdn.jsdelivr.net/gh/ZvonimirSun/my-img-hosting@master`

### Nginx 反代+CDN

这个方案吧，感觉稍微有点憨。就是我想用自己的域名，正好我的 VPS 不缺流量，还有个百度云加速 CDN 可以用。于是我采用了 Nginx 反代 GitHub 直链，然后给我的域名套 CDN 的方式。

这是我的 Nginx 配置，大家可以参考下。

```conf
server
    {
        listen 80;
        #listen [::]:80;
        server_name img.iszy.xyz;
        return 301 https://$host$request_uri;

        access_log off;
    }

server
    {
        listen 443 ssl http2;
        #listen [::]:443 ssl http2;
        server_name img.iszy.xyz;

        include conf.d/iszyxyz-ssl.conf;

        location ~ ^(.*)/$ {
            add_header Access-Control-Allow-Origin *;
            add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
            add_header Access-Control-Allow-Headers 'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization';

            if ($request_method = 'OPTIONS') {
                return 204;
            }
        }

        location / {
            proxy_pass https://raw.githubusercontent.com/ZvonimirSun/my-img-hosting/master/;
        }

        access_log off;
    }
```
