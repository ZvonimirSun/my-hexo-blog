---
title: Ubuntu部署Hadoop集群记录
date: 2019-12-01 20:12:00
updated: 2019-12-01 20:12:00
categories:
  - 应用部署
tags:
  - Hadoop
  - 集群
  - Ubuntu
---

今天记录一下，部署 Hadoop 集群的过程。

<!-- more -->

## 前期准备

### 系统及软件版本说明

本章操作中所使用的相关操作系统及软件版本如下：

| 软件     | 版本           |
| -------- | -------------- |
| 操作系统 | Ubuntu 14.04.1 |
| JDK      | 1.8.0          |
| Hadoop   | 2.7.3          |

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

### 安装及配置

1. 上传`hadoop-2.7.3.tar.gz`到`/opt`目录并解压

   ```bash
   tar -zxvf hadoop-2.7.3.tar.gz
   ```

2. 在 hadoop 目录上创建 tmp、dfs、dfs/name、 dfs/data 文件夹

   ```bash
   cd /opt/hadoop-2.7.3
   mkdir -p tmp dfs dfs/name dfs/data
   ```

3. 配置环境变量

   ```bash
   echo 'export HADOOP_HOME=/opt/hadoop-2.7.3' >> /etc/profile
   echo 'export HADOOP_COMMON_LIB_NATIVE_DIR=$HADOOP_HOME/lib/native' >> /etc/profile
   echo 'export HADOOP_OPTS="-Djava.library.path=$HADOOP_HOME/lib"' >> /etc/profile
   echo 'export PATH=$HADOOP_HOME/bin:$PATH' >> /etc/profile
   source /etc/profile
   ```

4. 修改配置文件

   切换到`/opt/hadoop-2.7.3/etc/hadoop`目录下修改配置文件。

   1. 编辑 `hadoop-env.sh` 文件，将 `JAVA_HOME`(25 行)配置项为 `JDK` 安装目录

      ```bash
      export JAVA_HOME=/opt/jdk1.8.0_191
      ```

   2. 编辑 `core-site.xml` 文件，添加以下内容，其中 `master` 为计算机名，`/opt/hadoop-2.7.3/tmp` 为手动创建的目录。

      ```bash
      vi /opt/hadoop-2.7.3/etc/hadoop/core-site.xml
      ```

      内容：

      ```xml
      <configuration>
      <property>
        <name>fs.default.name</name>
        <value>hdfs://master:9000</value>
      </property>
      <property>
        <name>hadoop.tmp.dir</name>
        <value>file:/opt/hadoop-2.7.3/tmp</value>
        <description>Abasefor other temporary directories.</description>
      </property>
      </configuration>
      ```

   3. 编辑 `hdfs-site.xml` 文件，添加以下内容，其中`/opt/hadoop-2.7.3/dfs/name` 和 `/opt/hadoop-2.7.3/dfs/data` 为手动创建目录

      ```bash
      vi /opt/hadoop-2.7.3/etc/hadoop/hdfs-site.xml
      ```

      内容：

      ```xml
      <configuration>
        <property>
          <name>dfs.name.dir</name>
          <value>/opt/hadoop-2.7.3/dfs/name</value>
          <description>Path on the local filesystem where theNameNode stores the namespace and transactions logs persistently.</description>
        </property>
        <property>
          <name>dfs.data.dir</name>
          <value>/opt/hadoop-2.7.3/dfs/data</value>
          <description>Comma separated list of paths on the localfilesystem of a DataNode where it should store its blocks.</description>
        </property>
        <property>
          <name>dfs.replication</name>
          <value>2</value>
        </property>
        <property>
          <name>dfs.namenode.secondary.http-address</name>
          <value>slave1:50090</value>
        </property>
        <property>
          <name>dfs.permissions</name>
          <value>false</value>
          <description>need not permissions</description>
        </property>
      </configuration>
      ```

   4. 修改 `mapred-site.xml`

      ```bash
      vi /opt/hadoop-2.7.3/etc/hadoop/mapred-site.xml
      ```

      内容：

      ```xml
      <configuration>
        <property>
          <name>mapred.job.tracker</name>
          <value>master:9001</value>
        </property>
        <property>
          <name>mapred.local.dir</name>
          <value>/opt/hadoop-2.7.3/var</value>
        </property>
        <property>
          <name>mapreduce.framework.name</name>
          <value>yarn</value>
        </property>
      </configuration>
      ```

   5. 修改 `yarn-env.sh`

      ```bash
      vi /opt/hadoop-2.7.3/etc/hadoop/yarn-env.sh
      ```

      内容：

      ```bash
      export JAVA_HOME=/opt/jdk1.8.0_191
      ```

   6. 修改 `yarn-site.xml`

      ```bash
      vi /opt/hadoop-2.7.3/etc/hadoop/yarn-env.xml
      ```

      内容：

      ```xml
      <configuration>
        <!-- reducer获取数据的方式 -->
        <property>
          <name>yarn.nodemanager.aux-services</name>
          <value>mapreduce_shuffle</value>
        </property>
        <!-- 指定YARN的ResourceManager的地址 -->
        <property>
          <name>yarn.resourcemanager.hostname</name>
          <value>slave1</value>
        </property>
      </configuration>
      ```

   7. 修改 `slaves`

      ```bash
      vi /opt/hadoop-2.7.3/etc/hadoop/slaves
      ```

      内容：

      ```
      master
      slave1
      slave2
      ```

5. 文件配置分发

   至此，master 上的 hadoop 配置已经结束，需将`/etc/profile`、`/opt/hadoop-2.7.3`通过 scp 分发至至 slave1、slave2，重新编译 `/etc/profile` 使生效。

   ```bash
   scp /etc/profile root@slave1:/etc/profile
   scp /etc/profile root@slave2:/etc/profile
   scp -r /opt/hadoop-2.7.3 root@slave1:/opt/hadoop-2.7.3
   scp -r /opt/hadoop-2.7.3 root@slave2:/opt/hadoop-2.7.3
   ```

   分别登录 slave1 和 slave2 执行`source /etc/profile`

### 启动及验证

1. 第一次启动初始化

   ```bash
   /opt/hadoop-2.7.3/bin/hadoop namenode -format
   ```

   初始化成功后，可以在 `/opt/hadoop-2.7.3/dfs/name` 目录下看到新增了一个 current 目录以及一些文件。

2. Hadoop 启动

   1. 启动 hdfs

      在 master 节点执行

      ```bash
      /opt/hadoop-2.7.3/sbin/start-dfs.sh
      ```

   2. 启动 yarn

      在 slave1 节点执行

      ```bash
      /opt/hadoop-2.7.3/sbin/start-yarn.sh
      ```

   浏览器输入访问 http://master:50070 (替换 master 节点 IP)验证部署成功。
