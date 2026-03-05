---
title: PostgreSQL Docker镜像大版本升级
date: 2026-03-06 01:01:31
tags:
  - PostgreSQL
  - Docker
  - 数据库
---

最近，我发现 `PostgreSQL 14` 的官方支持在 `2026年11月12日` 就要结束了， 我正在使用的 `postgis/postgis:14-3.2` 镜像也即将失去官方支持。为了保持系统的安全性和稳定性，我决定将数据库升级到 `PostgreSQL 17`。有人说 Docker 镜像没有办法用 `pg_upgrade` 来升级数据库，但实际上是可以的。今天，我就来记录一下我的升级过程。

<!--more-->

## 一、升级前的准备

### 1. 初始目录结构参考

我当前的目录结构如下：

```
├── docker-compose.yml
├── data
│   └── postgres-old-data
```

### 2. 备份数据

首先在备份前一定要先停止容器，防止备份时还在写入，造成数据不一致。

```bash
docker stop postgres-old
```

我选择直接备份volume目录，直接打一个tar包。

```bash
cd data
tar cvf postgres-old.tar postgres-old-data
cd ..
```

当前目录结构如下：

```
├── docker-compose.yml
├── data
│   ├── postgres-old-data
│   └── postgres-old.tar
```

### 3. 拷贝二进制目录

接下来，我需要拷贝 `PostgreSQL 14` 的二进制目录，以便在升级过程中使用。我使用的镜像是 `postgis/postgis:14-3.2`，注意`alpine`镜像的路径不一样，此处仅做参考。

```bash
cd data
mkdir postgres-old-bin
chown 999 postgres-old-bin
docker cp postgres-old:/usr/lib/postgresql/14 ./postgres-old-bin/lib
docker cp postgres-old:/usr/share/postgresql/14 ./postgres-old-bin/share
cd ..
```

当前目录结构如下：

```
├── docker-compose.yml
├── data
│   ├── postgres-old-data
│   ├── postgres-old.tar
│   ├── postgres-old-bin
|   |   ├── lib
|   |   └── share
```

### 4. 初始化新目录

接下来，我需要初始化一个新的目录来存放升级后的数据。

```bash
cd data
mkdir postgres-new-data
chown 999 postgres-new-data
cd ..
docker run -it --rm --name postgres-new \
  -v ./data/postgres-new-data:/var/lib/postgresql/data \
  -e POSTGRES_PASSWORD=mysecretpassword \
  postgres:17
```

数据库创建完成按 `Ctrl + C` 停止，现在 `postgres-new-data` 目录已经初始化好了。

```
├── docker-compose.yml
├── data
│   └── postgres-old-data
│   └── postgres-old.tar
│   └── postgres-old-bin
│   └── postgres-new-data
```

## 二、执行升级

这里要使用需要升级的目标镜像，保证对应的插件在新版本中都包含。

```bash
docker run -it --rm --name postgres-upgrade \
  -v ./data/postgres-old-data:/data \
  -v ./data/postgres-new-data:/var/lib/postgresql/data \
  -v ./data/postgres-old-bin/lib:/usr/lib/postgresql/14 \
  -v ./data/postgres-old-bin/share:/usr/share/postgresql/14 \
  --workdir /var/lib/postgresql/data \
  --user postgres \
  -e POSTGRES_PASSWORD=mysecretpassword \
  -e PGUSER=postgres \
  -e PGPASSWORD=mysecretpassword \
  postgis/postgis:17-3.5 \
  pg_upgrade \
    --old-datadir=/data \
    --new-datadir=/var/lib/postgresql/data \
    --old-bindir=/usr/lib/postgresql/14/bin \
    --new-bindir=/usr/lib/postgresql/17/bin
```

参数说明：

- `-v ./data/postgres-old-data:/data`：将旧数据目录挂载到容器内的 `/data`。
- `-v ./data/postgres-new-data:/var/lib/postgresql/data`：将新数据目录挂载到容器内的 PostgreSQL 数据目录。
- `-v ./data/postgres-old-bin/lib:/usr/lib/postgresql/14`：将旧版本的二进制文件挂载到容器内的 `/usr/lib/postgresql/14`。
- `-v ./data/postgres-old-bin/share:/usr/share/postgresql/14`：将旧版本的共享文件挂载到容器内的 `/usr/share/postgresql/14`。
- `--workdir /var/lib/postgresql/data`：设置工作目录为新数据目录。
- `--user postgres`：以 postgres 用户身份运行容器。
- `-e POSTGRES_PASSWORD=mysecretpassword`：设置 PostgreSQL 密码环境变量。
- `-e PGUSER=postgres`：设置 PostgreSQL 用户环境变量。
- `-e PGPASSWORD=mysecretpassword`：设置 PostgreSQL 密码环境变量。

运行完成后，可以根据日志提示进行一些补充工作。

1. 会生成一个升级插件的sql脚本，可以执行一下，或者后续自行在数据库里执行升级对应的插件版本。
2. 会生成一个移除旧目录的脚本，鉴于我们后面直接不挂载旧目录了，可以不管。
3. 还提示推荐执行一下优化查询统计的命令：`vacuumdb --all --analyze-in-stages`。

## 三、升级后的清理工作

运行新镜像

```bash
mv data/postgres-new-data data/postgres
docker run --name postgres -v ./data/postgres:/var/lib/postgresql/data -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d postgis/postgis:17-3.5
```

执行优化

```bash
docker exec -it -u postgres postgres vacuumdb --all --analyze-in-stages
```

确认无误后可以删除旧数据了。

```bash
docker rm postgres-old
rm -rf data/postgres-old-data
rm -rf data/postgres-old-bin
rm -rf data/postgres-old.tar
```
