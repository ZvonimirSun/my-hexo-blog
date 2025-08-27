---
title: Linux添加虚拟内存(swap)
date: 2025-08-27 21:47:16
tags:
  - Linux
---

记录一下，备查

<!-- more -->

## 创建 swap 分区

```sh
# 创建swap文件
fallocate -l 2G /swapfile

# 设置权限
chmod 600 /swapfile

# 生成交换分区
mkswap /swapfile
```

## 启用交换分区

```sh
# 启用swap
swapon /swapfile

# 查看现有交换分区
swapon -s
```

## 开机自启动

```sh
echo '/swapfile swap swap defaults 0 0' | tee -a /etc/fstab
```

## 修改 swappiness 参数

```sh
# 查看当前 swappiness 参数
cat /proc/sys/vm/swappiness
```

- `0`: 不是表示禁用 swap，而是最大限度地使用物理内存，物理内存使用完毕后才使用 swap
- `60`: 系统默认值
- `100`: 系统积极使用 swap

```sh
# 临时修改
sysctl -w vm.swappiness=10
```

```sh
# 永久修改
echo 'vm.swappiness=10' | tee -a /etc/sysctl.conf
sysctl -p
```
