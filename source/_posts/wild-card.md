---
title: 利用 acme.sh 申请 Let's Encrypt 免费泛域名证书
date: 2018-03-18 12:00:00
updated: 2018-03-18 12:00:00
categories:
  - 技能
  - 建站
tags:
  - SSL
  - 证书
  - acme.sh
  - Let's Encrypt
keywords: 泛域名证书,wildcard,acme,letsencrypt
---

既然已经可以通过 Let's encrypt 申请免费泛域名证书了，本着生命不息，折腾不止的态度，我自然是要试试的。可以看到本站已经用上了 Let's encrypt 的泛域名证书，本文就对我这次申请过程做一个记录。

<!--more-->

## 前言

关注 Let's Encrypt 的免费泛域名证书也有一段时间了。毕竟像我这种穷学生使用不起高大上的付费 wildcard 的，之前一直是每个子域名申请一个 ssl 证书。但是由于我老是折腾，也没怎么注意备份证书，就老是在申请，可太麻烦了。这次申请 Let's Encrypt 的免费泛域名证书，我特意备份好了，以后每个子域名都能用这个证书就方便多了。

Let's Encrypt 推出 ACME V2 和泛域名证书的支持也是一波三折，一月多本来就要推出了，因为技术原因，数次推迟，终于在本月 14 号正式宣布上线。由于是刚刚发布，暂时还没有多少一键申请的支持。好在 acme.sh 已经可以支持，虽然由于 DNS API 的需要，仅支持有限的解析商，但已经足够方便了。

下面上官方公告的截取，让人十分激动。

> We’re pleased to announce that ACMEv2 and wildcard certificate support is live! With today’s new features we’re continuing to break down barriers for HTTPS adoption across the Web by making it even easier for every website to get and manage certificates.

## 准备工作

- 首先你需要有一个域名
- 你要将你的域名在支持的解析商处解析。 - 可以点击[这里](https://github.com/Neilpang/acme.sh/blob/master/dnsapi/README.md)查看支持的解析商，没有被列出来即不支持。 - 我注册域名所在的 Namecheap 就不在支持的列表内。
- 然后你需要有一台运行 Linux 系统的 VPS 来执行命令。虚拟机或许也行？没有试过。

## 步骤

本文以在 CloudXNS 解析的 iszy.me 为例，其他域名参考[这里](https://github.com/Neilpang/acme.sh/blob/master/dnsapi/README.md)。我本次系统环境为 Ubuntu 16.04，其他系统可以类比完成。

### 首先安装依赖环境

```bash
apt-get update &&  apt-get install curl -y && apt-get install cron -y && apt-get install socat -y
```

### 安装 acme.sh

#### 在线安装

```bash
curl https://get.acme.sh | sh
```

OR

```bash
wget -O -  https://get.acme.sh | sh
```

#### 通过 git 安装

```bash
git clone https://github.com/Neilpang/acme.sh.git
cd ./acme.sh
./acme.sh --install
```

### 查看 API Key 和 Secret

在用户中心查看。

![](https://img.iszy.xyz/20190318221329.png)

### 输入环境参数

```bash
export CX_Key="your api key"
export CX_Secret="your secret key"
```

### 申请证书

```bash
~/.acme.sh/acme.sh --issue --dns dns_cx -d iszy.me -d *.iszy.me
```

你的证书将会被保存在`~/.acme.sh/iszy.me/`路径下。包含文件`ca.cer`、`fullchain.cer`、`iszy.me.cer`、`iszy.me.conf`、`iszy.me.csr`、`iszy.me.csr.conf`、`iszy.me.key`，一般使用`fullchain.cer`和`iszy.me.key`就可以了。

**注意：**第一个`-d`后面不能直接写泛域名，一定要写普通域名，像我这样，后面的`-d`就支持写泛域名了。

### 续签

由于 Let's encrypt 的证书有效期为 3 个月，需要续签。我也不懂其他的，就直接用 Crontab 吧，简单直接。我暂时还没有弄，因为我其实是在我一台瞎折腾的服务器上申请的，续签的问题嘛，以后再说吧。
