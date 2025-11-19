---
title: VPS 使用 Caddy 快速搭建 Nextcloud 全过程
date: 2018-07-15 21:00:00
updated: 2018-07-15 21:00:00
tags:
  - Caddy
  - Linux
  - Ubuntu
  - NextCloud
  - 文件管理
  - php
---

今天准备做一个完整的采用 Caddy Web Server 部署 NextCloud 的教程。本教程除 Web 服务器配置，部分参考橙叶博客文章——[VPS 快速完美部署 ownCloud/Nextcloud 全过程](https://www.orgleaf.com/2203.html)。有什么问题，欢迎在评论区留言或者联系我，我一定会及时回复的。

<!--more-->

## VPS 及系统环境

- VPS：国内腾讯云的香港云主机
- 系统：Ubuntu 16.04

我采用的 VPS 是国内腾讯云的香港云主机，全世界范围内 ping 值都很低，按流量计费最大能开到 200M 带宽。毕竟是腾讯的，国内访问速度出奇的快。

系统采用的是 Ubuntu 16.04，Debian 系的应该都能够一样实现吧。

## DNS 解析

Caddy Web Server 会自动申请 ssl 证书，全站 https，但是需要提前将域名解析到所在 VPS，否则 Caddy 会启动失败。不需要 ssl 的或想要 IP 访问的请自行调整 Caddy 配置。

![](https://img.iszy.cc/20190318212135.png)

## 环境配置

ssh 登录 VPS 后，在 root 用户下继续执行下面的操作。

### 更新软件源

```shell
apt update
```

### 安装 Caddy

为节省时间，此处采用了 Toyo 大佬的一键脚本。详细页面参见：[『原创』Go 语言 跨平台支持的极简 HTTP Server —— Caddy 一键安装脚本](https://doub.io/shell-jc1/)。

```shell
wget -N --no-check-certificate https://softs.loan/Bash/caddy_install.sh && chmod +x caddy_install.sh && bash caddy_install.sh install http.cgi,http.expires,http.filemanager,http.git,http.filter

# 如果上面这个脚本无法下载，尝试使用备用下载：
wget -N --no-check-certificate https://raw.githubusercontent.com/ToyoDAdoubi/doubi/master/caddy_install.sh && chmod +x caddy_install.sh && bash caddy_install.sh install http.cgi,http.expires,http.filemanager,http.git,http.filter
```

> ### 使用说明
>
> **启动：**/etc/init.d/caddy start
>
> **停止：**/etc/init.d/caddy stop
>
> **重启：**/etc/init.d/caddy restart
>
> **查看状态：**/etc/init.d/caddy status
>
> **查看 Caddy 启动日志：** tail -f /tmp/caddy.log
>
> **安装目录：**/usr/local/caddy
>
> **Caddy 配置文件位置：**/usr/local/caddy/Caddyfile
>
> **Caddy 自动申请 SSL 证书位置：**/.caddy/acme/acme-v02.api.letsencrypt.org/sites/xxx.xxx(域名)/

## 安装并配置 MySQL

### 安装

```shell
apt install mysql-server
```

将会有图形界面用以设定 root 密码，根据提示进行操作即可。

### 配置

这里采用 SQL 命令配置数据库

1. 登录数据库

   ```shell
   mysql -u root -p
   ```

2. 创建名为 nextcloud 的数据库

   ```sql
   CREATE DATABASE nextcloud;
   ```

3. 切换数据库

   ```sql
   USE nextcloud;
   ```

4. 创建名为 nextcloud 的用户，密码为 password (注意替换为自己的)，并赋予权限。

   ```sql
   GRANT All  ON nextcloud.* TO nextcloud@localhost IDENTIFIED BY 'password';
   ```

5. 登出数据库

   ```shell
   exit
   ```

## 安装 php7.0

```shell
apt install php7.0 php7.0-mbstring php7.0-zip php7.0-dom php7.0-xml php7.0-gd php7.0-curl php7.0-mysql -y
```

打开 `/etc/php/7.0/fpm/pool.d/www.conf` 查看 `php7.0-fpm` 监听的地址，**留作后用**。不同系统可能位置不同，也可能配置在 `/etc/php7.0/fpm/php-fpm.conf` 中。

监听地址可能为以下两种：

- 语句为 `listen = /run/php/php7.0-fpm.sock`，此时监听地址为 `/run/php/php7.0-fpm.sock`
- 语句为 `listen = 127.0.0.1:9000`，此时 `php7.0-fpm` 绑定了 9000 端口，监听地址为 `127.0.0.1:9000`

监听地址可以自行修改。修改后运行以下内容应用。

```shell
service php7.0-fpm reload
```

## 创建文件及网站目录

```shell
cd /
mkdir /home && cd /home
mkdir wwwroot wwwdata && cd wwwroot
mkdir example.com && cd example.com #文件夹名字及位置自定
chown www-data:www-data /home/wwwdata -Rf
chmod 770 /home/wwwdata -Rf
chown www-data:www-data /home/wwwroot/example.com -Rf
```

## 安装 NextCloud

### 下载

```shell
cd /home/wwwroot/example.com
wget https://download.nextcloud.com/server/releases/nextcloud-13.0.4.zip
unzip nextcloud-13.0.4.zip
rm nextcloud-13.0.4.zip
mv nextcloud/* .
mv nextcloud/.* .
rm nextcloud -r
```

### 设置文件夹权限

新建 `set.sh` 文件，添加如下内容：

```shell
#!/bin/bash
# 将ocpath替换为自己的网站文件夹位置
ocpath='/home/wwwroot/example.com' #1
htuser='www-data'
htgroup='www-data'
rootuser='root'

printf "Creating possible missing Directories\n"
mkdir -p $ocpath/data
mkdir -p $ocpath/assets
mkdir -p $ocpath/updater

printf "chmod Files and Directories\n"
find ${ocpath}/ -type f -print0 | xargs -0 chmod 0640
find ${ocpath}/ -type d -print0 | xargs -0 chmod 0750

printf "chown Directories\n"
chown -R ${rootuser}:${htgroup} ${ocpath}/
chown -R ${htuser}:${htgroup} ${ocpath}/apps/
chown -R ${htuser}:${htgroup} ${ocpath}/assets/
chown -R ${htuser}:${htgroup} ${ocpath}/config/
chown -R ${htuser}:${htgroup} ${ocpath}/data/
chown -R ${htuser}:${htgroup} ${ocpath}/themes/
chown -R ${htuser}:${htgroup} ${ocpath}/updater/

chmod +x ${ocpath}/occ

printf "chmod/chown .htaccess\n"
if [ -f ${ocpath}/.htaccess ]
  then
    chmod 0644 ${ocpath}/.htaccess
    chown ${rootuser}:${htgroup} ${ocpath}/.htaccess
fi
if [ -f ${ocpath}/data/.htaccess ]
  then
    chmod 0644 ${ocpath}/data/.htaccess
    chown ${rootuser}:${htgroup} ${ocpath}/data/.htaccess
fi
```

打开文件，将 “#1” 所在行的地址更改为你自己的网站文件地址，然后保存。

赋予权限并运行。

```shell
chmod +x set.sh
./set.sh
```

## 挂载腾讯 COS 作为存储盘(选)

这一步为选做，小硬盘 VPS 福音。

由于我用的是腾讯云主机，同地域 COS 内网流量免费，将文件存储到 COS 能极大地节省 VPS 的硬盘空间。在此处我默认你已经创建了腾讯云对象存储的 Bucket，不会的请谷歌解决。

### 安装 COSFS 工具

#### 环境安装

```shell
apt install automake autotools-dev g++ git libcurl4-gnutls-dev libfuse-dev libssl-dev libxml2-dev make pkg-config fuse -y
```

#### 下载源码

使用 Github 原始地址：

```shell
git clone https://github.com/tencentyun/cosfs /usr/cosfs
```

如果国内主机速度过慢，可以使用我在 gitee 备份的库：

```shell
git clone https://gitee.com/sunziyang97/cosfs.git /usr/cosfs
```

#### 编译安装

```shell
cd /usr/cosfs
./autogen.sh
./configure
make
sudo make install
```

#### 配置文件

在  `/etc/passwd-cosfs` 文件中，配置您的存储桶的名称，以及该存储桶对应的 SecretId 和 SecretKey，相关概念参见  [对象存储基本概念](https://cloud.tencent.com/document/product/436/6225)。使用冒号隔开，注意冒号为半角符号。 并为  `/etc/passwd-cosfs`  设置可读权限。命令格式如下：

```shell
echo <bucketname>:<SecretId>:<SecretKey> > /etc/passwd-cosfs
chmod 640 /etc/passwd-cosfs
```

其中：
`bucketname`/ `SecretId`/`SecretKey` 需要替换为用户的真实信息。

`bucketname` 形如 `bucketprefix-123456789`, 更多关于 `bucketname` 的命名规范，参见[存储桶命名规范](https://cloud.tencent.com/document/product/436/13312#.E5.AD.98.E5.82.A8.E6.A1.B6.E5.91.BD.E5.90.8D.E8.A7.84.E8.8C.83)。

### 挂载

#### 运行工具

将配置好的存储桶挂载到指定目录，命令行如下：

```shell
cosfs nextcloud-123456789 /home/wwwdata -ourl=http://cos.ap-hongkong.myqcloud.com -ouid=33 -ogid=33 -o allow_other -o umask=007
```

注意替换为自己的信息

#### 配置开机自动挂载

```shell
echo cosfs#nextcloud-1253146816 /home/wwwdata fuse _netdev,url=http://cos.ap-hongkong.myqcloud.com,uid=33,gid=33,allow_other,umask=007 0 0 >> /etc/fstab
mount -a
```

注意替换为自己的信息

## 编辑 Caddy 配置文件

打开配置文件

```shell
vi /usr/local/caddy/Caddyfile
```

添加如下内容

```shell
pan.iszy.me {

    root   /home/wwwroot/pan.iszy.me
    log    /home/wwwlog/pan.iszy.me.log
    errors /home/wwwlog/pan.iszy.me.errors.log
    tls hi@iszy.me

    # 1
    fastcgi / /run/php/php7.0-fpm.sock php

    # checks for images
    rewrite {
        ext .svg .gif .png .html .ttf .woff .ico .jpg .jpeg
        r ^/index.php/(.+)$
        to /{1} /index.php?{1}
    }

    rewrite {
        r ^/index.php/.*$
        to /index.php?{query}
    }

    # client support (e.g. os x calendar / contacts)
    redir /.well-known/carddav /remote.php/carddav 301
    redir /.well-known/caldav /remote.php/caldav 301

    # remove trailing / as it causes errors with php-fpm
    rewrite {
        r ^/remote.php/(webdav|caldav|carddav|dav)(\/?)(\/?)$
        to /remote.php/{1}
    }

    rewrite {
        r ^/remote.php/(webdav|caldav|carddav|dav)/(.+?)(\/?)(\/?)$
        to /remote.php/{1}/{2}
    }

    rewrite {
        r ^/public.php/(dav|webdav|caldav|carddav)(\/?)(\/?)$
        to /public.php/{1}
    }

    rewrite {
        r ^/public.php/(dav|webdav|caldav|carddav)/(.+)(\/?)(\/?)$
        to /public.php/{1}/{2}
    }

    # .htaccess / data / config / ... shouldn't be accessible from outside
    status 403 {
        /.htaccess
        /data
        /config
        /db_structure
        /.xml
        /README
    }

    header / Strict-Transport-Security "max-age=31536000;"

}
```

在 `#1` 处将地址替换为之前查看的 `php7.0-fpm` 监听的地址。

重启 Caddy。

```shell
service caddy restart
```

## 安装

访问 example.com (你自己的网站)，输入信息并安装。

**注意点：**

- 数据目录填写绝对地址，本例中应使用 `/home/wwwdata`。
- 数据库用户名为之前创建的 `nextcloud`，密码为你设定的密码
- 数据库地址要加端口，如 `localhost:3306`

配图为我前一次[使用宝塔面板进行安装](/2017/12/18/NextCloud/)时的截图。

![](https://img.iszy.cc/20190318212151.png)

## 更多问题

安装完成后登录，进入`设置`—`管理`—`基本设置`，还有一些问题需要解决。我们下篇文章继续说明。

**有什么问题，欢迎在评论区留言或者联系我，我一定会及时回复的。**
