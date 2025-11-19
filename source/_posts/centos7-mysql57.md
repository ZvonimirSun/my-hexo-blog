---
title: CentOS 7 手动部署 MySQL 5.7
date: 2019-08-05 09:00:00
updated: 2019-08-05 09:00:00
tags:
  - MySQL
  - Linux
  - CentOS
keywords: mysql,centos,部署
---

今天来简单记录一下在 CentOS 7 上手动部署 MySQL 5.7 的过程。

<!--more-->

## 流程

### 下载安装包

第一步自然是下载安装包，我们在这里下载 5.7 版本，下载下来的文件名为`mysql-5.7.27-linux-glibc2.12-x86_64.tar.gz`。

- 官网地址: [https://dev.mysql.com/downloads/mysql/](https://dev.mysql.com/downloads/mysql/)
- 下载地址: [https://cdn.mysql.com//Downloads/MySQL-5.7/mysql-5.7.27-linux-glibc2.12-x86_64.tar.gz](https://cdn.mysql.com//Downloads/MySQL-5.7/mysql-5.7.27-linux-glibc2.12-x86_64.tar.gz)

![20190804175143](https://img.iszy.cc/20190804175143.png)

```bash
yum install wget -y
wget https://cdn.mysql.com//Downloads/MySQL-5.7/mysql-5.7.27-linux-glibc2.12-x86_64.tar.gz
```

### 解压安装包

```bash
tar zxvf mysql-5.7.27-linux-glibc2.12-x86_64.tar.gz
mv mysql-5.7.27-linux-glibc2.12-x86_64 /usr/local/mysql
cd /usr/local/mysql
mkdir data
```

### 添加 mysql 用户和组并授权

```bash
groupadd mysql
useradd -g mysql mysql
chown -R mysql:mysql /usr/local/mysql
```

### 初始化数据库

```bash
yum install libaio-devel.x86_64 -y
./bin/mysqld --initialize --user=mysql --basedir=/usr/local/mysql --datadir=/usr/local/mysql/data
```

注意保留此时打印出的临时 root 密码。

![20190805095840](https://img.iszy.cc/20190805095840.png)

为了安全起见，我们仅将 data 目录权限保留给 mysql 用户。

```bash
chown -R root /usr/local/mysql
chown -R mysql /usr/local/mysql/data
```

因为 CentOS 系统自带了 mariadb，我们需要把它卸载并删除相关文件。

```bash
yum -y remove mari*
rm -rf /var/lib/mysql/*
```

### 配置启动及配置文件并启动 MySQL

将启动文件复制到系统启动目录。

```bash
cp ./support-files/mysql.server /etc/init.d/mysqld
```

创建并编辑配置文件。

```bash
touch /etc/my.cnf
vi /etc/my.cnf
```

添加如下内容并保存。

```conf
[client]
port = 3306

[mysqld]
user = mysql
port = 3306
basedir = /usr/local/mysql
datadir = /usr/local/mysql/data
max_allowed_packet = 100M
lower_case_table_names = 1
default-time-zone = '+8:00'
net_buffer_length = 100K
character-set-server = utf8
collation-server = utf8_general_ci
```

启动 MySQL

```bash
service mysql start
```

### 添加环境变量

编辑`/etc/profile`文件，添加环境变量以在任何地方使用 mysql 命令。

```bash
vi /etc/profile
```

在末尾加入如下语句并保存。

```bash
export PATH=$PATH:/usr/local/mysql/bin
```

应用环境变量

```bash
source /etc/profile
```

重启 MySQL

```bash
service mysql restart
```

### 通过命令行登录 MySQL 修改 root 密码

```bash
mysql -uroot -p
```

输入之前保留的 root 密码即可登录，接着输入以下命令修改 root 密码并授予远程登录权限，注意替换命令中的示例密码为自己的。

```bash
SET PASSWORD = PASSWORD('root');
use mysql;
update user set authentication_string=password("ExamplePassword") where user='root';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY 'ExamplePassword' WITH GRANT OPTION;
flush privileges;
exit;
```

接着你就可以通过工具如 Navicat 连接到 MySQL 操作数据库了。

## 修改配置文件

如果要修改配置，修改`/etc/my.cnf`文件后，输入如下命令即可。

```bash
service mysql reload
```
