---
title: 自建Docker Hub加速镜像
date: 2024-09-20 09:08:29
tags:
  - Docker
  - Nginx
---

众所周知，国内一般不能顺畅拉取 Docker 镜像，要么部署私有仓库，要么使用国内的镜像地址。不过国内的镜像的版本同步没有那么及时，而且最近不知为啥好像都不能用了。部署私有仓库会在本地缓存包，也不太符合我的需求。所以最终决定通过 Nginx 反向代理 DockerHub 官方 Registry 地址，如果你也有一个能够流畅访问官方 Docker 地址的服务器，可以一试。

<!--more-->

## 一、Nginx 代理

基础配置代理了以下内容

- 官方仓库地址: `registry-1.docker.io`
- jwt 授权地址: `auth.docker.io`
- api 地址: `index.docker.io`

限制:

- 受到 DockerHub 单 IP 请求次数限制

```conf
# 使用 map 来匹配和替换 upstream 头部中的 auth.docker.io
map $upstream_http_www_authenticate $m_www_authenticate_replaced {
    "~auth\.docker\.io(.*)" "$1";
    default "";
}

map $m_www_authenticate_replaced $m_final_replaced {
    "~(.*)" 'Bearer realm=\"$scheme://$host$1';
    default "";
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

        # 修改jwt授权地址
        proxy_hide_header www-authenticate;
        add_header www-authenticate "$m_final_replaced" always;

        # 关闭缓存
        proxy_buffering off;
        # 转发认证相关
        proxy_set_header Authorization $http_authorization;
        proxy_pass_header  Authorization;

        # 对 upstream 状态码检查，实现 error_page 错误重定向
        proxy_intercept_errors on;
        recursive_error_pages on;
        # 根据状态码执行对应操作，以下为301、302、307状态码都会触发
        error_page 301 302 307 = @handle_redirect;

        # v1 api
        location /v1 {
            proxy_pass https://index.docker.io;
            proxy_set_header Host index.docker.io;
        }

        # v2 api
        location /v2 {
            proxy_pass https://index.docker.io;
            proxy_set_header Host index.docker.io;
        }

        # jwt授权地址
        location /token {
            proxy_pass https://auth.docker.io;
            proxy_set_header Host auth.docker.io;
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

## 二、CloudFlare Worker 方案

CloudFlare Worker 在国内访问速度不稳定，但是胜在免费，至少比官方镜像速度要快，可以作个备份。

在面板菜单找到 Workers 和 Pages，然后点击右侧的创建，创建 Worker，取个名字，比如说 docker，点击部署。

编辑代码，粘贴以下内容，注意修改其中的 workers_url 变量为实际的 worker 地址，或者绑定的自定义域名，点击保存并部署。这样就完成了。

**worker.js**

```js
"use strict";

const hub_host = "registry-1.docker.io";
const auth_url = "https://auth.docker.io";
const workers_url = "https://docker.xxxxx.workers.dev"; // 换成实际的worker地址，或者绑定的自定义域名
/**
 * static files (404.html, sw.js, conf.js)
 */

/** @type {RequestInit} */
const PREFLIGHT_INIT = {
  status: 204,
  headers: new Headers({
    "access-control-allow-origin": "*",
    "access-control-allow-methods":
      "GET,POST,PUT,PATCH,TRACE,DELETE,HEAD,OPTIONS",
    "access-control-max-age": "1728000",
  }),
};

/**
 * @param {any} body
 * @param {number} status
 * @param {Object<string, string>} headers
 */
function makeRes(body, status = 200, headers = {}) {
  headers["access-control-allow-origin"] = "*";
  return new Response(body, { status, headers });
}

/**
 * @param {string} urlStr
 */
function newUrl(urlStr) {
  try {
    return new URL(urlStr);
  } catch (err) {
    return null;
  }
}

addEventListener("fetch", (e) => {
  const ret = fetchHandler(e).catch((err) =>
    makeRes("cfworker error:\n" + err.stack, 502)
  );
  e.respondWith(ret);
});

/**
 * @param {FetchEvent} e
 */
async function fetchHandler(e) {
  const getReqHeader = (key) => e.request.headers.get(key);

  let url = new URL(e.request.url);

  if (url.pathname === "/token") {
    let token_parameter = {
      headers: {
        Host: "auth.docker.io",
        "User-Agent": getReqHeader("User-Agent"),
        Accept: getReqHeader("Accept"),
        "Accept-Language": getReqHeader("Accept-Language"),
        "Accept-Encoding": getReqHeader("Accept-Encoding"),
        Connection: "keep-alive",
        "Cache-Control": "max-age=0",
      },
    };
    let token_url = auth_url + url.pathname + url.search;
    return fetch(new Request(token_url, e.request), token_parameter);
  }

  url.hostname = hub_host;

  let parameter = {
    headers: {
      Host: hub_host,
      "User-Agent": getReqHeader("User-Agent"),
      Accept: getReqHeader("Accept"),
      "Accept-Language": getReqHeader("Accept-Language"),
      "Accept-Encoding": getReqHeader("Accept-Encoding"),
      Connection: "keep-alive",
      "Cache-Control": "max-age=0",
    },
    cacheTtl: 3600,
  };

  if (e.request.headers.has("Authorization")) {
    parameter.headers.Authorization = getReqHeader("Authorization");
  }

  let original_response = await fetch(new Request(url, e.request), parameter);
  let original_response_clone = original_response.clone();
  let original_text = original_response_clone.body;
  let response_headers = original_response.headers;
  let new_response_headers = new Headers(response_headers);
  let status = original_response.status;

  if (new_response_headers.get("WWW-Authenticate")) {
    let re = new RegExp(auth_url, "g");
    new_response_headers.set(
      "WWW-Authenticate",
      response_headers.get("WWW-Authenticate").replace(re, workers_url)
    );
  }

  if (new_response_headers.get("Location")) {
    return httpHandler(e.request, new_response_headers.get("Location"));
  }

  let response = new Response(original_text, {
    status,
    headers: new_response_headers,
  });
  return response;
}

/**
 * @param {Request} req
 * @param {string} pathname
 */
function httpHandler(req, pathname) {
  const reqHdrRaw = req.headers;

  // preflight
  if (
    req.method === "OPTIONS" &&
    reqHdrRaw.has("access-control-request-headers")
  ) {
    return new Response(null, PREFLIGHT_INIT);
  }

  let rawLen = "";

  const reqHdrNew = new Headers(reqHdrRaw);

  const refer = reqHdrNew.get("referer");

  let urlStr = pathname;

  const urlObj = newUrl(urlStr);

  /** @type {RequestInit} */
  const reqInit = {
    method: req.method,
    headers: reqHdrNew,
    redirect: "follow",
    body: req.body,
  };
  return proxy(urlObj, reqInit, rawLen, 0);
}

/**
 *
 * @param {URL} urlObj
 * @param {RequestInit} reqInit
 */
async function proxy(urlObj, reqInit, rawLen) {
  const res = await fetch(urlObj.href, reqInit);
  const resHdrOld = res.headers;
  const resHdrNew = new Headers(resHdrOld);

  // verify
  if (rawLen) {
    const newLen = resHdrOld.get("content-length") || "";
    const badLen = rawLen !== newLen;

    if (badLen) {
      return makeRes(res.body, 400, {
        "--error": `bad len: ${newLen}, except: ${rawLen}`,
        "access-control-expose-headers": "--error",
      });
    }
  }
  const status = res.status;
  resHdrNew.set("access-control-expose-headers", "*");
  resHdrNew.set("access-control-allow-origin", "*");
  resHdrNew.set("Cache-Control", "max-age=1500");

  resHdrNew.delete("content-security-policy");
  resHdrNew.delete("content-security-policy-report-only");
  resHdrNew.delete("clear-site-data");

  return new Response(res.body, {
    status,
    headers: resHdrNew,
  });
}
```

## 三、整合方案

还是采用 Nginx 代理方式，当超出请求数量限制，返回 429 错误时，将后端转发给 CloudFlare Worker。

需要对 Nginx 配置加上一小段对 429 错误的转发。

```conf
server
    {
        # ....
        error_page 429 = @handle_too_many_requests;

        # 处理429错误
        location @handle_too_many_requests {
            proxy_set_header Host docker.xxxxx.workers.dev;  # 替换为另一个服务器的地址
            proxy_pass https://docker.xxxxx.workers.dev;
        }
        # ....
    }
```

worker.js 也需要修改一下，把 worker_url 改为 nginx 代理的地址。

```js
const workers_url = "https://xxxx.example.com"; // 改为nginx代理的地址
```

**完整配置**

### Nginx 配置

```conf
# 使用 map 来匹配和替换 upstream 头部中的 auth.docker.io
map $upstream_http_www_authenticate $m_www_authenticate_replaced {
    "~auth\.docker\.io(.*)" "$1";
    default "";
}

map $m_www_authenticate_replaced $m_final_replaced {
    "~(.*)" 'Bearer realm=\"$scheme://$host$1';
    default "";
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

        # 修改jwt授权地址
        proxy_hide_header www-authenticate;
        add_header www-authenticate "$m_final_replaced" always;

        # 关闭缓存
        proxy_buffering off;
        # 转发认证相关
        proxy_set_header Authorization $http_authorization;
        proxy_pass_header  Authorization;

        # 对 upstream 状态码检查，实现 error_page 错误重定向
        proxy_intercept_errors on;
        recursive_error_pages on;
        # 根据状态码执行对应操作，以下为301、302、307状态码都会触发
        error_page 301 302 307 = @handle_redirect;

        error_page 429 = @handle_too_many_requests;

        # v1 api
        location /v1 {
            proxy_pass https://index.docker.io;
            proxy_set_header Host index.docker.io;
        }

        # v2 api
        location /v2 {
            proxy_pass https://index.docker.io;
            proxy_set_header Host index.docker.io;
        }

        # jwt授权地址
        location /token {
            proxy_pass https://auth.docker.io;
            proxy_set_header Host auth.docker.io;
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

        # 处理429错误
        location @handle_too_many_requests {
            proxy_set_header Host docker.xxxxx.workers.dev;  # 替换为另一个服务器的地址
            proxy_pass https://docker.xxxxx.workers.dev;
        }
    }
```

### Worker.js

```js
"use strict";

const hub_host = "registry-1.docker.io";
const auth_url = "https://auth.docker.io";
const workers_url = "https://xxxx.example.com"; // 改为nginx代理的地址
/**
 * static files (404.html, sw.js, conf.js)
 */

/** @type {RequestInit} */
const PREFLIGHT_INIT = {
  status: 204,
  headers: new Headers({
    "access-control-allow-origin": "*",
    "access-control-allow-methods":
      "GET,POST,PUT,PATCH,TRACE,DELETE,HEAD,OPTIONS",
    "access-control-max-age": "1728000",
  }),
};

/**
 * @param {any} body
 * @param {number} status
 * @param {Object<string, string>} headers
 */
function makeRes(body, status = 200, headers = {}) {
  headers["access-control-allow-origin"] = "*";
  return new Response(body, { status, headers });
}

/**
 * @param {string} urlStr
 */
function newUrl(urlStr) {
  try {
    return new URL(urlStr);
  } catch (err) {
    return null;
  }
}

addEventListener("fetch", (e) => {
  const ret = fetchHandler(e).catch((err) =>
    makeRes("cfworker error:\n" + err.stack, 502)
  );
  e.respondWith(ret);
});

/**
 * @param {FetchEvent} e
 */
async function fetchHandler(e) {
  const getReqHeader = (key) => e.request.headers.get(key);

  let url = new URL(e.request.url);

  if (url.pathname === "/token") {
    let token_parameter = {
      headers: {
        Host: "auth.docker.io",
        "User-Agent": getReqHeader("User-Agent"),
        Accept: getReqHeader("Accept"),
        "Accept-Language": getReqHeader("Accept-Language"),
        "Accept-Encoding": getReqHeader("Accept-Encoding"),
        Connection: "keep-alive",
        "Cache-Control": "max-age=0",
      },
    };
    let token_url = auth_url + url.pathname + url.search;
    return fetch(new Request(token_url, e.request), token_parameter);
  }

  url.hostname = hub_host;

  let parameter = {
    headers: {
      Host: hub_host,
      "User-Agent": getReqHeader("User-Agent"),
      Accept: getReqHeader("Accept"),
      "Accept-Language": getReqHeader("Accept-Language"),
      "Accept-Encoding": getReqHeader("Accept-Encoding"),
      Connection: "keep-alive",
      "Cache-Control": "max-age=0",
    },
    cacheTtl: 3600,
  };

  if (e.request.headers.has("Authorization")) {
    parameter.headers.Authorization = getReqHeader("Authorization");
  }

  let original_response = await fetch(new Request(url, e.request), parameter);
  let original_response_clone = original_response.clone();
  let original_text = original_response_clone.body;
  let response_headers = original_response.headers;
  let new_response_headers = new Headers(response_headers);
  let status = original_response.status;

  if (new_response_headers.get("WWW-Authenticate")) {
    let re = new RegExp(auth_url, "g");
    new_response_headers.set(
      "WWW-Authenticate",
      response_headers.get("WWW-Authenticate").replace(re, workers_url)
    );
  }

  if (new_response_headers.get("Location")) {
    return httpHandler(e.request, new_response_headers.get("Location"));
  }

  let response = new Response(original_text, {
    status,
    headers: new_response_headers,
  });
  return response;
}

/**
 * @param {Request} req
 * @param {string} pathname
 */
function httpHandler(req, pathname) {
  const reqHdrRaw = req.headers;

  // preflight
  if (
    req.method === "OPTIONS" &&
    reqHdrRaw.has("access-control-request-headers")
  ) {
    return new Response(null, PREFLIGHT_INIT);
  }

  let rawLen = "";

  const reqHdrNew = new Headers(reqHdrRaw);

  const refer = reqHdrNew.get("referer");

  let urlStr = pathname;

  const urlObj = newUrl(urlStr);

  /** @type {RequestInit} */
  const reqInit = {
    method: req.method,
    headers: reqHdrNew,
    redirect: "follow",
    body: req.body,
  };
  return proxy(urlObj, reqInit, rawLen, 0);
}

/**
 *
 * @param {URL} urlObj
 * @param {RequestInit} reqInit
 */
async function proxy(urlObj, reqInit, rawLen) {
  const res = await fetch(urlObj.href, reqInit);
  const resHdrOld = res.headers;
  const resHdrNew = new Headers(resHdrOld);

  // verify
  if (rawLen) {
    const newLen = resHdrOld.get("content-length") || "";
    const badLen = rawLen !== newLen;

    if (badLen) {
      return makeRes(res.body, 400, {
        "--error": `bad len: ${newLen}, except: ${rawLen}`,
        "access-control-expose-headers": "--error",
      });
    }
  }
  const status = res.status;
  resHdrNew.set("access-control-expose-headers", "*");
  resHdrNew.set("access-control-allow-origin", "*");
  resHdrNew.set("Cache-Control", "max-age=1500");

  resHdrNew.delete("content-security-policy");
  resHdrNew.delete("content-security-policy-report-only");
  resHdrNew.delete("clear-site-data");

  return new Response(res.body, {
    status,
    headers: resHdrNew,
  });
}
```
