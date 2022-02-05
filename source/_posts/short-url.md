---
title: 自建短域名服务——Polr
date: 2018-08-15 09:39:44
updated: 2019-02-14 09:39:44
categories:
  - 应用
tags:
  - Ubuntu
  - Linux
  - 短域名
---

也曾想过自己写一个短域名服务，毕竟原理还是相当简单的。但是前端是真的难搞，我是真的玩不来。既然已经有造好的轮子，干嘛还自己造，是吧。这个 Polr 就是一个非常好用的短域名服务，功能也比较完善。在这里记录一下部署的过程。最近折腾 docker，这玩意在 docker 中表现挺诡异的，我准备切换成现有的 yourls 的 docker 了。

<!--more-->

## 程序依赖

- Apache, nginx, IIS, or lighttpd (Apache preferred)
- PHP >= 5.5.9
- MariaDB or MySQL >= 5.5, SQLite alternatively
- composer
- PHP requirements:
  - OpenSSL PHP Extension
  - PDO PHP Extension
  - PDO MySQL Driver (php5-mysql on Debian & Ubuntu, php5x-pdo_mysql on FreeBSD)
  - Mbstring PHP Extension
  - Tokenizer PHP Extension
  - JSON PHP Extension
  - PHP curl extension

## 本人使用环境

- Ubuntu 18.04 LTS
- Nginx 1.14.0
- PHP 5.6.36
- Mysql 8.0.11
- Composer 1.7.1

## 环境安装

### LNMP

我使用的是军哥的 LNMP 一键脚本，点击[这里](https://lnmp.org/)前往官网。

### Composer

Composer 的安装，我在之前的文章已经叙述过了。请参考：[Ubuntu 安装使用 Composer](https://www.iszy.cc/2018/08/09/use-composer/)。

## 下载源代码

```shell
sudo su #使用 root 权限
cd /home/wwwroot
git clone https://github.com/cydrobolt/polr.git --depth=1
chmod -R 755 polr
chown -R www:www polr
```

## 通过 composer 安装依赖

```shell
cd polr
composer install --no-dev -o
```

## 配置虚拟主机

以 nginx 为例，以下是官方配置。

```shell
# Upstream to abstract backend connection(s) for php
upstream php {
    server unix:/var/run/php-fpm.sock;
    server 127.0.0.1:9000;
}

# HTTP

server {
    listen       *:80;
    root         /home/wwwroot/polr/public;
    index        index.php index.html index.htm;
    server_name  example.com; # Or whatever you want to use

#   return 301 https://$server_name$request_uri; # Forces HTTPS, which enables privacy for login credentials.
                                                 # Recommended for public, internet-facing, websites.

    location / {
            try_files $uri $uri/ /index.php$is_args$args;
            # rewrite ^/([a-zA-Z0-9]+)/?$ /index.php?$1;
    }

    location ~ \.php$ {
            try_files $uri =404;
            include /etc/nginx/fastcgi_params;

            fastcgi_pass    php;
            fastcgi_index   index.php;
            fastcgi_param   SCRIPT_FILENAME $document_root$fastcgi_script_name;
            fastcgi_param   HTTP_HOST       $server_name;
    }
}


# HTTPS

#server {
#   listen              *:443 ssl;
#   ssl_certificate     /etc/ssl/my.crt;
#   ssl_certificate_key /etc/ssl/private/my.key;
#   root                /home/wwwroot/polr/public;
#   index index.php index.html index.htm;
#   server_name         example.com;
#
#   location / {
#           try_files $uri $uri/ /index.php$is_args$args;
#           # rewrite ^/([a-zA-Z0-9]+)/?$ /index.php?$1;
#   }
#
#   location ~ \.php$ {
#           try_files $uri =404;
#           include /etc/nginx/fastcgi_params;
#
#           fastcgi_pass    php;
#           fastcgi_index   index.php;
#           fastcgi_param   SCRIPT_FILENAME $document_root$fastcgi_script_name;
#           fastcgi_param   HTTP_HOST       $server_name;
#   }
#}
```

## 创建数据库

登入 mysql

```shell
mysql -u root -p
```

创建数据库，名字任取，安装时会用到。

```sql
CREATE DATABASE polrdb;
```

退出 mysql

```shell
exit
```

## 进行安装

复制初始`.env`

```shell
cp .env.setup .env
```

访问`http://你设定的地址/setup/`即可进行安装，网页上都有详细解释，就不在这里多说了。

需要注意的是，当安装完成后，只能在`polr`文件夹中的`.env`文件修改设置。你将无法再次访问安装页面。

## 例子

~~我个人部署的短域名服务：[ISZY Short URL](https://url.iszy.cc)。有需要的可以使用。~~

![](https://img.iszy.xyz/20190318220031.png)
