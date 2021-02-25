---
title: v2ray配置文件简单说明和常见配置实例
date: 2019-02-18 09:55:13
updated: 2019-03-03 11:02:03
categories:
  - 其他
tags:
  - 科学上网
  - V2Ray
keywords: v2ray安装,v2ray配置,v2ray教程,v2ray搭建,v2ray部署,v2ray
---

很多人刚上手 v2ray 的时候，对于 v2ray 复杂的配置文件可能有些无所适从，不过嘛，好在网上有在线生成配置文件的网站来帮助我们简单跨越这个难关。今天我想来简单说明一下 v2ray 的这个配置文件，和一些常见配置的设置方法(服务器端)。当然我这边讲的都是些基础的东西，让新手容易上手的。

<!--more-->

## 部署 v2ray

这个在这里不是重点，有了配置文件以后，部署 v2ray 那就是相当简单的一件事了，请大家看我的另一篇文件——[使用 Docker 简单部署 v2ray](https://www.iszy.cc/2019/02/18/docker-v2ray/)，简单快速进行部署。下面我就来说一下这个配置文件。如果不想了解的也可以直接跳到最后的完整配置实例。

## 配置文件格式

### 官方介绍

首先我们来看一下官方给出的配置文件格式。

<details>
  <summary>官方配置格式</summary>

```json
{
  "log": {},
  "api": {},
  "dns": {},
  "stats": {},
  "routing": {},
  "policy": {},
  "reverse": {},
  "inbounds": [],
  "outbounds": [],
  "transport": {}
}
```

</details>

- log: 日志配置，表示 V2Ray 如何输出日志。
- api: 内置的远程控置 API。
- dns: 内置的 DNS 服务器，若此项不存在，则默认使用本机的 DNS 设置。
- stats: 当此项存在时，开启统计信息。
- routing: 路由配置。
- policy: 本地策略可进行一些权限相关的配置。
- reverse: 反向代理配置。
- inbounds: 一个数组，每个元素是一个入站连接配置。
- outbounds: 一个数组，每个元素是一个出站连接配置。列表中的第一个元素作为主出站协议。当路由匹配不存在或没有匹配成功时，流量由主出站协议发出。
- transport: 用于配置 V2Ray 如何与其它服务器建立和使用网络连接。

### 简化配置文件

对于我们最一般的使用来说呢，大部分的配置都不需要的，只需要留下以下内容即可，即入站配置、出站配置以及路由配置。

```json
{
  "inbounds": [],
  "outbounds": [],
  "routing": {}
}
```

这样就比较清晰了。首先，入站配置包含了我们客户端如何连接到服务器的配置列表，比如常见的 ss、vmess 什么的，这样我们就能通过其中一种连接到服务器。然后，出战配置包含了服务器如何连接到目标站点的配置列表，比如直连、通过什么协议连等，一般都是直连，这样服务器就能连接到目标站点了。最后通过，路由配置把入站和出站的配置一连，通道就打通了，我们就能连接到目标站点了。

## 配置说明

### 入站配置 inbounds

入站配置`inbounds`是一个数组，每个数组项是一个 json，存放一个配置。

#### VMess

使用 v2ray 一定对 VMess 不陌生，这个是 v2ray 最常使用的协议。下面是一个最简单的 TCP 连接的配置。

<details>
  <summary>VMess示例</summary>

```json
"inbounds": [
  {
    "port": 6666, // 服务器监听端口
    "protocol": "vmess", // 主传入协议
    "settings": {
      "clients": [
        {
          "id": "937a376b-1723-40de-9815-3bcee70cc8b8", // 用户ID，客户端连接使用，必须保持一致。
          "alterId": 64 // 推荐16，一般使用64足够，也需要保持一致。
        }
      ]
    },
    "streamSettings": {} //更多配置，没有就空着
  }
]
```

</details>

#### Shadowrocks

这个也是一个大家常用的协议，配置起来就简单很多了。

<details>
  <summary>Shadowrocks示例</summary>

```json
"inbounds": [
  {
    "port": 6666, // 服务器监听端口
    "protocol": "shadowsocks", // 主传入协议
    "settings": {
      "method": "加密方式", //建议使用AHEAD加密(method为aes-256-gcm、aes-128-gcm、chacha20-poly1305即可开启AEAD)
      "password": "密码",
      "ota": false, //建议使用AHEAD加密，并关闭ota。
      "network": "tcp,udp" //可接收的网络连接类型，默认值为"tcp"。
    }
  }
]
```

</details>

#### MTProto

使用 Telegram 的人应该熟悉这个协议，这个就是 tg 专用代理，也可以使用 v2ray 来部署，目前只支持转发到 Telegram 的 IPv4 地址。需要搭配对应的出站配置和路由配置。

<details>
  <summary>MTProto示例</summary>

```json
"inbounds": [
  {
    "tag": "telegram-in", // 设定一个标签供路由使用，不需要在路由中指定的就不需要加tag
    "port": 6666, // 服务器监听端口
    "protocol": "mtproto", // 主传入协议
    "settings": {
      "users": [
        {
          "email": "love@v2ray.com", //用户邮箱，用于统计流量等辅助功能，个人使用无所谓
          "level": 0,
          "secret": "b0cbcef5a486d9636472ac27f8e11a9d" //用户密钥。必须为32个字符，仅可包含0到9和a到f之间的字符。
        }
      ]
    }
  }
]
```

</details>

可使用如下命令生成随机用户密钥，或直接在线生成强密码。

```shell
openssl rand -hex 16
```

### 出站配置 outbounds

大多数出站配置都是很简单的，除了 MTProto 需要一点额外的配置。

#### Freedom

这是最简单的配置，即由服务器直接连接，一般的代理都是使用这个。我们一般把它放置在出战配置 outbounds 的第一个，作为默认配置，所有没有在路由配置 routing 中指定流向的流量都走这个出站。

<details>
  <summary>Freedom示例</summary>

```json
"outbounds": [
  {
    "protocol": "freedom",
    "settings": {}
  }
}
```

</details>

#### MTProto

如果配置了 MTProto 的入站配置，则需要添加一个出战配置来搭配使用。让服务器也通过 mtproto 协议连接到 Telegram 服务器。

<details>
  <summary>MTProto示例</summary>

```json
"outbounds": [
  {
    "tag": "telegram-out", // 供路由使用
    "protocol": "mtproto",
    "settings": {}
  }
]
```

</details>

### 路由配置 routing

路由配置决定了流量的走向，不进行设置的流量，则默认走 outbounds 的第一条出站。没有特别需要的配置，可以不加这一条。

下面是配置了 MTProto 时需要使用的配置。

<details>
  <summary>带MTProto的路由示例</summary>

```json
"routing": {
  "domainStrategy": "AsIs",
  "rules": [
    {
      "type": "field",
      "inboundTag": ["telegram-in"],
      "outboundTag": "telegram-out"
    }
  ],
  "balancers": []
}
```

</details>

## 完整配置实例

### VMess

#### TCP

<details>
  <summary>TCP配置示例</summary>

```json
{
  "inbounds": [
    {
      "port": 6666,
      "protocol": "vmess",
      "settings": {
        "clients": [
          {
            "id": "937a376b-1723-40de-9815-3bcee70cc8b8",
            "alterId": 64
          }
        ]
      }
    }
  ],
  "outbounds": [
    {
      "protocol": "freedom",
      "settings": {}
    }
  ]
}
```

</details>

#### TLS

需要自行申请 ssl 证书。

<details>
  <summary>TLS配置示例</summary>

```json
{
  "inbounds": [
    {
      "port": 443, // 建议使用 443 端口
      "protocol": "vmess",
      "settings": {
        "clients": [
          {
            "id": "937a376b-1723-40de-9815-3bcee70cc8b8",
            "alterId": 64
          }
        ]
      }，
      "streamSettings": {
        "network": "tcp",
        "security": "tls", // 启用tls
        "tlsSettings": {
          "certificates": [
            {
              "certificateFile": "/etc/v2ray/v2ray.crt", // 证书文件
              "keyFile": "/etc/v2ray/v2ray.key" // 密钥文件
            }
          ]
        }
      }
    }
  ],
  "outbounds": [
    {
      "protocol": "freedom",
      "settings": {}
    }
  ]
}
```

</details>

#### WebSocket

下面是普通的 WebSocket 配置。

<details>
  <summary>WebSocket配置示例</summary>

```json
{
  "inbounds": [
    {
      "port": 6666,
      "protocol": "vmess",
      "settings": {
        "clients": [
          {
            "id": "937a376b-1723-40de-9815-3bcee70cc8b8",
            "alterId": 64
          }
        ]
      },
      "streamSettings": {
        "network": "ws",
        "wsSettings": {
          "path": "/ray"
        }
      }
    }
  ],
  "outbounds": [
    {
      "protocol": "freedom",
      "settings": {}
    }
  ]
}
```

</details>

WebSocket+TLS+Web 实际上就是反代 v2ray 的 WebSocket 端口并套上 https，反代的路径要与`wsSettings`中的`path`保持一致。比如，使用 Nginx 进行反代，v2ray 的配置文件保持上文内容，配置文件大致如下所示。

<details>
  <summary>Nginx 配置示例</summary>

```
server
    {
        listen 80;
        listen [::]:80;
        server_name www.example.com; //任意你想要的域名
        return 301 https://$host$request_uri;

        access_log off;
    }

server
    {
        listen 443 ssl http2;
        listen [::]:443 ssl http2;
        server_name www.example.com;

        ssl_certificate /etc/nginx/ssl/www.example.com/fullchain.cer;
        ssl_certificate_key /etc/nginx/ssl/www.example.com/www.example.com.key;
        ssl_session_timeout 5m;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_prefer_server_ciphers on;
        ssl_ciphers TLS13-CHACHA20-POLY1305-SHA256:TLS13-AES-256-GCM-SHA384:TLS13-AES-128-GCM-SHA256:EECDH+CHACHA20:EECDH+AESGCM:EECDH+AES;
        ssl_session_cache builtin:1000 shared:SSL:10m;
        ssl_stapling on;
        ssl_stapling_verify on;
        resolver 1.1.1.1 1.0.0.1 223.5.5.5 valid=300s;
        resolver_timeout 5s;

        add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;

        location /ray {
            proxy_redirect off;
            proxy_pass http://127.0.0.1:6666;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $http_host;
        }

        access_log off;
    }
```

</details>

#### mKCP

<details>
  <summary>mKCP配置示例</summary>

```json
{
  "inbounds": [
    {
      "port": 6666,
      "protocol": "vmess",
      "settings": {
        "clients": [
          {
            "id": "937a376b-1723-40de-9815-3bcee70cc8b8",
            "alterId": 64
          }
        ]
      },
      "streamSettings": {
        "network": "mkcp",
        "kcpSettings": {
          "uplinkCapacity": 5,
          "downlinkCapacity": 100,
          "congestion": true,
          "header": {
            "type": "none"
          }
        }
      }
    }
  ],
  "outbounds": [
    {
      "protocol": "freedom",
      "settings": {}
    }
  ]
}
```

</details>

### Shadowsocks

<details>
  <summary>Shadowsocks配置示例</summary>

```json
{
  "inbounds": [
    {
      "port": 6666,
      "protocol": "shadowsocks",
      "settings": {
        "method": "aes-128-gcm",
        "password": "12345678",
        "ota": false,
        "network": "tcp,udp"
      }
    }
  ],
  "outbounds": [
    {
      "protocol": "freedom",
      "settings": {}
    }
  ]
}
```

</details>

### MTProto

<details>
  <summary>MTProto配置示例</summary>

```json
{
  "inbounds": [
    {
      "tag": "telegram-in",
      "port": 9714,
      "protocol": "mtproto",
      "settings": {
        "users": [
          {
            "email": "love@v2ray.com",
            "level": 0,
            "secret": "b0cbcef5a486d9636472ac27f8e11a9d"
          }
        ]
      }
    }
  ],
  "outbounds": [
    {
      "protocol": "freedom",
      "settings": {}
    },
    {
      "tag": "telegram-out",
      "protocol": "mtproto",
      "settings": {}
    }
  ],
  "routing": {
    "domainStrategy": "AsIs",
    "rules": [
      {
        "type": "field",
        "inboundTag": ["telegram-in"],
        "outboundTag": "telegram-out"
      }
    ],
    "balancers": []
  }
}
```

</details>

### 多配置共存

<details>
  <summary>多配置配置示例</summary>

```json
{
  "inbounds": [
    {
      "port": 6666,
      "protocol": "vmess",
      "settings": {
        "clients": [
          {
            "id": "937a376b-1723-40de-9815-3bcee70cc8b8",
            "alterId": 64
          }
        ]
      },
      "streamSettings": {
        "network": "ws",
        "wsSettings": {
          "path": "/ray"
        }
      }
    },
    {
      "port": 6667,
      "protocol": "shadowsocks",
      "settings": {
        "method": "aes-128-gcm",
        "password": "12345678",
        "ota": false,
        "network": "tcp,udp"
      }
    },
    {
      "tag": "telegram-in",
      "port": 6668,
      "protocol": "mtproto",
      "settings": {
        "users": [
          {
            "email": "love@v2ray.com",
            "level": 0,
            "secret": "b0cbcef5a486d9636472ac27f8e11a9d"
          }
        ]
      }
    }
  ],
  "outbounds": [
    {
      "protocol": "freedom",
      "settings": {}
    },
    {
      "tag": "telegram-out",
      "protocol": "mtproto",
      "settings": {}
    }
  ],
  "routing": {
    "domainStrategy": "AsIs",
    "rules": [
      {
        "type": "field",
        "inboundTag": ["telegram-in"],
        "outboundTag": "telegram-out"
      }
    ],
    "balancers": []
  }
}
```

</details>

## 后话

至此，大家可能已经能够写出一套属于自己的配置文件了，希望对大家有所帮助。保存好这个配置文件，随便到哪个服务器上都能轻松地部署出一样的配置。再此推荐一下我的另一篇文件——[使用 Docker 简单部署 v2ray](https://www.iszy.cc/2019/02/18/docker-v2ray/)，使用在本文中写好的配置文件简单快速进行部署。
