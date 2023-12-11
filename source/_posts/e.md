---
title: 为 Docker 中的 Nginx 启用 Brotli 压缩算法
categories:
  - 技术
tags:
  - Nginx
  - Docker
date: 2022-02-05 01:49:02
---

为了节省服务器带宽，加快页面速度，准备为 Nginx 启用 Brotli 插件。我发现都已经 1.21.6 版本了，Brotli 作为一个非常常用的无损压缩插件，仍然没有被包含到官方的 Nginx docker 镜像中，那么我们要使用只能自己动手了。

<!--more-->

## 一、成果

我把构建好的镜像推送到了 Github 的 Docker registry 里，懒得折腾的可以直接使用。

可以通过以下语句拉取。

```bash
docker pull ghcr.io/zvonimirsun/nginx-brotli:stable-alpine
```

我这边选用了最新 stable 版本的 Nginx，因为不会一直关注 Nginx 版本，更新可能会不及时。

## 二、解决方案

总的来说就是通过对应版本的 Nginx 编译`google/ngx_brotli`，然后将编译出来的插件 so 文件塞到官方镜像中，这样我们就能够动态加载此模块了。

针对 Dockerfile 一点说明:

- `build-base`: 添加编译相关工具
- `git`: 用于克隆`google/ngx_brotli`库
- `pcre-dev`: http rewrite 模块需要用到
- `openssl-dev`: ssl 模块需要用到
- `zlib-dev`: gzip 模块需要用到
- `linux-headers`: with-file-ato 需要用到
- brotli-dev: 用于编译 brotli 模块
- configure 参数完全使用了官方镜像参数，仅添加了 add-dynamic-module 用于添加 brotl。可以执行 `docker run --rm nginx:stable-alpine nginx -V` 查看最新的编译参数，然后替换掉我的。

**Dockerfile:**

```Dockerfile
FROM nginx:stable-alpine-slim AS builder

ARG NGINX_VERSION

WORKDIR /root/

RUN apk add --update --no-cache build-base git pcre-dev openssl-dev zlib-dev linux-headers brotli-dev \
    && wget http://nginx.org/download/nginx-${NGINX_VERSION}.tar.gz \
    && tar zxf nginx-${NGINX_VERSION}.tar.gz \
    && git clone https://github.com/google/ngx_brotli.git \
    && cd ngx_brotli \
    && git submodule update --init --recursive \
    && cd ../nginx-${NGINX_VERSION} \
    && ./configure \
    --add-dynamic-module=../ngx_brotli \
    --prefix=/etc/nginx \
    --sbin-path=/usr/sbin/nginx \
    --modules-path=/usr/lib/nginx/modules \
    --conf-path=/etc/nginx/nginx.conf \
    --error-log-path=/var/log/nginx/error.log \
    --http-log-path=/var/log/nginx/access.log \
    --pid-path=/var/run/nginx.pid \
    --lock-path=/var/run/nginx.lock \
    --http-client-body-temp-path=/var/cache/nginx/client_temp \
    --http-proxy-temp-path=/var/cache/nginx/proxy_temp \
    --http-fastcgi-temp-path=/var/cache/nginx/fastcgi_temp \
    --http-uwsgi-temp-path=/var/cache/nginx/uwsgi_temp \
    --http-scgi-temp-path=/var/cache/nginx/scgi_temp \
    --with-perl_modules_path=/usr/lib/perl5/vendor_perl \
    --user=nginx \
    --group=nginx \
    --with-compat \
    --with-file-aio \
    --with-threads \
    --with-http_addition_module \
    --with-http_auth_request_module \
    --with-http_dav_module \
    --with-http_flv_module \
    --with-http_gunzip_module \
    --with-http_gzip_static_module \
    --with-http_mp4_module \
    --with-http_random_index_module \
    --with-http_realip_module \
    --with-http_secure_link_module \
    --with-http_slice_module \
    --with-http_ssl_module \
    --with-http_stub_status_module \
    --with-http_sub_module \
    --with-http_v2_module \
    --with-mail \
    --with-mail_ssl_module \
    --with-stream \
    --with-stream_realip_module \
    --with-stream_ssl_module \
    --with-stream_ssl_preread_module \
    --with-cc-opt='-Os -fomit-frame-pointer -g' \
    --with-ld-opt=-Wl,--as-needed,-O1,--sort-common \
    && make modules

FROM nginx:stable-alpine

ENV TIME_ZONE=Asia/Shanghai

RUN ln -snf /usr/share/zoneinfo/$TIME_ZONE /etc/localtime && echo $TIME_ZONE > /etc/timezone

COPY --from=builder /root/nginx-${NGINX_VERSION}/objs/ngx_http_brotli_filter_module.so /usr/lib/nginx/modules/
COPY --from=builder /root/nginx-${NGINX_VERSION}/objs/ngx_http_brotli_static_module.so /usr/lib/nginx/modules/
```

## 三、启用 Brotli

确保使用了我的镜像或上文的 Dockerfile 构建出的镜像。此时镜像中已经添加了 Brotli 的模块文件，可以动态引入。

在 nginx.conf 开头添加

```nginx
load_module /usr/lib/nginx/modules/ngx_http_brotli_filter_module.so;
load_module /usr/lib/nginx/modules/ngx_http_brotli_static_module.so;
```

在`http`部分中添加以启用，gzip 和 Brotli 可以共存。

```nginx
# brotli
brotli on;
brotli_comp_level 6;
brotli_buffers 16 8k;
brotli_min_length 20;
brotli_types
  application/atom+xml
  application/geo+json
  application/javascript
  application/x-javascript
  application/json
  application/ld+json
  application/manifest+json
  application/rdf+xml
  application/rss+xml
  application/vnd.ms-fontobject
  application/wasm
  application/x-web-app-manifest+json
  application/xhtml+xml
  application/xml
  font/eot
  font/otf
  font/ttf
  image/bmp
  image/svg+xml
  text/cache-manifest
  text/calendar
  text/css
  text/javascript
  text/markdown
  text/plain
  text/xml
  text/vcard
  text/vnd.rim.location.xloc
  text/vtt
  text/x-component
  text/x-cross-domain-policy;
```

通过`nginx -t`检查下配置无误后，通过`nginx -s reload`应用配置即可。
