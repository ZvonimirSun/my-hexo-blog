---
title: 通过Telegram机器人管理ASF
date: 2019-10-05 12:18:52
updated: 2019-10-05 12:18:52
tags:
  - ASF
  - Telegram
  - Node.js
  - Docker
---

个人比较喜欢 Node.js，最近用 Node.js 弄了个简单的 Telegram 机器人用于管理 ASF，即 [ArchiSteamFarm](https://github.com/JustArchiNET/ArchiSteamFarm)。现在我把代码放 GitHub 上面，有需要的可以尝试一下。

<!--more-->

## 准备信息

### 创建 Telegram 机器人

在 Telegram 里，搜索 @BotFather 机器人并启用。

发送以下命令：

1. 创建机器人：`/newbot`
2. 设定 bot 名称：`ASF`(任取，可重复，这里只是个例子)
3. 设定 bot 用户名：`test_asf_bot`(任取，不可重复，这里只是个例子)

`@BotFather` 会发给你一串 token，形如 `987654321:XXXXXX-XXXXXXXXXX`，注意保留。

### 查询 Chat ID

在 Telegram 里，搜索 `@FalconGate_Bot` 机器人并启用。

发送命令：`/get_my_id`

`@FalconGate_Bot` 会发给你一串数字，即是你的 Chat ID。

## 下载文件

项目地址: [node-asf-bot](https://github.com/ZvonimirSun/node-asf-bot)

```bash
git clone https://github.com/ZvonimirSun/node-asf-bot.git
cd node-asf-bot
```

## 运行

### 直接运行

#### 依赖

- Node.js
- ASF IPC

#### 修改配置

配置环境变量。

```bash
# The API token of your Telegram bot
export TELEGRAM_TOKEN=987654321:XXXXXX-XXXXXXXXXXXXXXXXXXXXXXXXXXXX
# Your Telegram number ID (not the username)
export ADMIN_ID=123456789
# ASF IPC address
export IPC_ADDR=http://127.0.0.1:1242/
# ASF IPC password
export IPC_PASS=PASSWORD
```

### 启动

```bash
npm start
```

## Docker

### 依赖

- docker-ce
- docker-compose
- ASF IPC

### 修改配置

修改`docker-compose.yml`文件配置环境变量。

```yml
environment:
  - TELEGRAM_TOKEN=987654321:XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  - ADMIN_ID=123456789
  - IPC_ADDR=http://127.0.0.1:1242
  - IPC_PASS=password
```

将对应配置项替换。

### 启动

```bash
docker-compose up -d
```

## Webhooks 方式运行(选)

在上面的环境变量或`docker-compose.yml`中添加`URL`配置项，即可转为 Webhooks 方式运行，比 polling 方式响应更及时。

注意，此种方式，必须拥有自己的域名，且必须采用 https，不支持`SSL V2/V3`等过旧的协议，推荐采用`TLS V1.2`。

### 配置应用

```bash
export URL=https://asfbot.example.com
```

或者

```yml
environment:
  - URL=https://asfbot.example.com
```

### 配置 Nginx

Nginx 反代 3000 端口，部分配置示例如下。

```conf
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header X_FORWARDED_PROTO https;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $host;
}
```
