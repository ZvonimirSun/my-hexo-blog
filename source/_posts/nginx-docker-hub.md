---
title: 自建Docker Hub加速镜像
date: 2024-09-20 09:08:29
tags:
  - Docker
  - Nginx
---

众所周知，国内一般不能顺畅拉取 Docker 镜像，要么部署私有仓库，要么使用国内的镜像地址。不过国内的镜像的版本同步没有那么及时，而且最近不知为啥好像都不能用了。部署私有仓库会在本地缓存包，也不太符合我的需求。所以最终决定通过 Nginx 反向代理 DockerHub 官方 Registry 地址，如果你也有一个能够流畅访问官方 Docker 地址的服务器，可以一试。

<!--more-->

配置代理了以下内容

- 官方仓库地址: `registry-1.docker.io`
- jwt 授权地址: `auth.docker.io`
- api 地址: `index.docker.io`

限制:

- 受到 DockerHub 单 IP 请求次数限制

```conf
map $upstream_http_www_authenticate $docker_service {
    ~service="([^"]+)" ',service="$1"';
    default "";
}

map $upstream_http_www_authenticate $docker_scope {
    ~scope="([^"]+)" ',scope="$1"';
    default "";
}

map $arg_q $docker_search_q {
    default $arg_q;
    "~^library/(.+)" $1;
    "library/" "library";
}

server
    {
        listen 443 ssl http2;
        # 改成自己的域名
        server_name xxxx.example.com;

        # 证书部分
        ssl_certificate 证书地址;
        ssl_certificate_key 密钥地址;

        ssl_session_timeout 24h;

        # TLS 版本控制
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_prefer_server_ciphers on;
        ssl_ciphers TLS13-CHACHA20-POLY1305-SHA256:TLS13-AES-256-GCM-SHA384:TLS13-AES-128-GCM-SHA256:EECDH+CHACHA20:EECDH+AESGCM:EECDH+AES;

        proxy_ssl_server_name on;

        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # 关闭缓存
        proxy_buffering off;

        # v1 api
        # v2规范不包含搜索端点
        location /v1/search {
            set $n_param "";
            set $page_param "";

            # 保留 n 参数
            if ($arg_n != "") {
                set $n_param "&n=$arg_n";
            }

            # 保留 page 参数
            if ($arg_page != "") {
                set $page_param "&page=$arg_page";
            }

            proxy_pass https://index.docker.io/v1/search?q=$docker_search_q$n_param$page_param;
            proxy_set_header Host index.docker.io;
        }

        location /v2/_catalog {
            return 404;
        }

        # v2 api
        location /v2 {
            proxy_pass https://registry-1.docker.io;
            proxy_set_header Host registry-1.docker.io;

            # 转发认证相关的头部
            proxy_set_header Authorization $http_authorization;
            proxy_pass_header Authorization;

            # 重写 www-authenticate 头为你的反代地址
            proxy_hide_header www-authenticate;
            add_header www-authenticate 'Bearer realm="https://$host/token"$docker_service$docker_scope' always;
            # always 参数确保该头部在返回 401 错误时无论什么情况下都会被添加。

            # 对 upstream 状态码检查，实现 error_page 错误重定向
            proxy_intercept_errors on;
            # error_page 指令默认只检查了第一次后端返回的状态码，开启后可以跟随多次重定向。
            recursive_error_pages on;
            # 根据状态码执行对应操作，以下为301、302、307状态码都会触发
            error_page 301 302 307 = @handle_redirect;
        }

        # jwt授权地址
        location /token {
            proxy_pass https://auth.docker.io; # Docker 认证服务器
            proxy_set_header Host auth.docker.io;

            # 转发认证相关的头部
            proxy_set_header Authorization $http_authorization;
            proxy_pass_header Authorization;
        }

        location / {
            # Docker hub 的官方镜像仓库
            proxy_pass https://registry-1.docker.io;
            proxy_set_header Host registry-1.docker.io;
        }

        #处理重定向
        location @handle_redirect {
            resolver 1.1.1.1;
            set $saved_redirect_location '$upstream_http_location';
            proxy_pass $saved_redirect_location;
        }
    }
```
