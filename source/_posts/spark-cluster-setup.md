---
title: Ubuntu部署Spark集群记录
date: 2020-01-05 21:12:00
updated: 2020-01-05 21:12:00
categories:
  - 技能
  - 应用部署
  - Linux
tags:
  - Hadoop
  - Spark
  - 集群
  - Ubuntu
---

今天记录一下，在 Ubuntu 14.04 上部署 Spark 集群的过程。

<!-- more -->

## 前期准备

### 系统及软件版本说明

本章操作中所使用的相关操作系统及软件版本如下：

| 软件     | 版本           |
| -------- | -------------- |
| 操作系统 | Ubuntu 14.04.1 |
| JDK      | 1.8.0          |
| Hadoop   | 2.7.3          |
| Spark    | 2.2.0          |

### JDK 安装

集群中每台机器都需要安装 JDK，步骤如下：

1. 上传`jdk-8u191-linux-x64.tar.gz`到`/opt`目录并解压

   ```bash
   tar -zxvf jdk-8u191-linux-x64.tar.gz
   ```

2. 将 JDK 环境变量配置到/etc/profile 中

   ```bash
   echo 'export JAVA_HOME=/opt/jdk1.8.0_191' >> /etc/profile
   echo 'export JRE_HOME=/opt/jdk1.8.0_191/jre' >> /etc/profile
   echo 'export CLASSPATH=$JAVA_HOME/lib:$JRE_HOME/lib' >> /etc/profile
   echo 'export PATH=$JAVA_HOME/bin:$PATH' >> /etc/profile
   source /etc/profile
   ```

### 网络配置

如有三台机器，分别命名为 master、slave1、slave2。那么我们就分别修改各自机器上`/etc/hostname`文件中的机器名为上述名称。
修改每台机器的/etc/hosts 文件，添加上述三对网络 IP 和机器名的对应：

```
127.0.0.1       localhost
192.168.1.2     master
192.168.1.3     slave1
192.168.1.4     slave2
```

### SSH 免密登录配置

该操作是要让 master 节点可以无密码 SSH 登陆到各个 slave 节点上。

1. 首先生成 master 节点的公钥，在 master 节点的终端中执行

   ```bash
   mkdir -p ~/.ssh
   cd ~/.ssh
   ssh-keygen -t rsa
   ```

   多次回车完成 ssh 密钥对创建

2. 在各节点上将该公钥加入授权

   将公钥加入 master 本机授权，master 节点上执行命令：

   ```bash
   cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
   ```

   完成后执行 `ssh master` 验证一下（可能需要输入 `yes`，成功后执行 `exit` 返回原来的终端）

   接着在 master 节点将上公匙分发到 slave1 和 slave2 节点，如下：

   ```bash
   scp ~/.ssh/id_rsa.pub root@slave1:/root
   scp ~/.ssh/id_rsa.pub root@slave2:/root
   ```

   接着分别在 slave1 和 slave2 节点上，将 ssh 公匙加入授权：

   ```bash
   mkdir -p ~/.ssh
   cat ~/id_rsa.pub >> ~/.ssh/authorized_keys
   ```

   这样，在 master 节点上就可以无密码 ssh 登录到各个 slave 节点了，在 master 节点上执行 `ssh slave1` 和 `ssh slave2` 命令进行检验。

## Hadoop 集群部署

Spark 配置前需要部署 Hadoop 集群，这个在[上一篇文章](/2019/12/01/hadoop-cluster-setup/)里讲过，可以前往查看。

## Spark 集群部署

### 安装及配置

1. 上传 `spark-2.2.0-bin-hadoop2.7.tgz` 到 `/opt` 目录并解压。

   ```bash
   tar -zxvf spark-2.2.0-bin-hadoop2.7.tgz
   ```

2. 将 Spark 环境变量配置到`/etc/profile`中

   ```bash
   echo 'export SPARK_HOME=/opt/spark-2.2.0-bin-hadoop2.7' >> /etc/profile
   echo 'export PATH=$SPARK_HOME/bin:$PATH' >> /etc/profile
   source /etc/profile
   ```

3. 编辑`spark-env.sh`文件

   复制 `spark-env.sh.template` 并重命名为 `spark-env.sh`，编辑`spark-env.sh`文件

   ```bash
   cp /opt/spark-2.2.0-bin-hadoop2.7/conf/spark-env.sh.template /opt/spark-2.2.0-bin-hadoop2.7/conf/spark-env.sh
   vi /opt/spark-2.2.0-bin-hadoop2.7/conf/spark-env.sh
   ```

   添加如下内容：

   ```bash
   export JAVA_HOME=/opt/jdk1.8.0_191
   export SPARK_MASTER_IP=192.168.2.76
   export SPARK_WORKER_MEMORY=4g
   export HADOOP_HOME=/opt/hadoop-2.7.3
   export HADOOP_CONF_DIR=/opt/hadoop-2.7.3/etc/hadoop
   ```

   - `SPARK_MASTER_IP`为 master 节点 IP
   - `SPARK_WORKER_MEMORY`可根据实际情况调整

4. 编辑`slaves`文件

   复制 `slaves.template` 并重命名为 `slaves`，编辑`slaves`文件

   ```bash
   cp /opt/spark-2.2.0-bin-hadoop2.7/conf/slaves.template /opt/spark-2.2.0-bin-hadoop2.7/conf/slaves
   vi /opt/spark-2.2.0-bin-hadoop2.7/conf/slaves
   ```

   内容：

   ```
   master
   slave1
   slave2
   ```

5. 文件配置分发

   至此，master 上的 spark 配置已经结束，需将`/etc/profile`、`/opt/spark-2.2.0-bin-hadoop2.7`通过 scp 分发至至 slave1、slave2，重新编译 `/etc/profile` 使生效。

   ```bash
   scp /etc/profile root@slave1:/etc/profile
   scp /etc/profile root@slave2:/etc/profile
   scp -r /opt/spark-2.2.0-bin-hadoop2.7 root@slave1:/opt/spark-2.2.0-bin-hadoop2.7
   scp -r /opt/spark-2.2.0-bin-hadoop2.7 root@slave2:/opt/spark-2.2.0-bin-hadoop2.7
   ```

   分别登录 slave1 和 slave2 执行`source /etc/profile`

### 启动及验证

1. 启动 Spark

   ```bash
   /opt/spark-2.2.0-bin-hadoop2.7/start-all.sh
   ```

2. 验证

   浏览器访问 http://192.168.1.2:8080/ (master 节点 IP)，查看 Spark 集群配置及运行情况
