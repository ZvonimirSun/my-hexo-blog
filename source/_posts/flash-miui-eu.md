---
title: 小米MI6最新欧版(xiaomi.eu版)MIUI教程
date: 2019-02-26 14:29:28
updated: 2019-02-26 14:29:28
tags:
  - MIUI
  - TWRP
---

最近刚买了小米手环 3 NFC 版，在手环上开好了公交卡，感觉对国内的 MIUI 版本再无留恋。早就想把手机刷成欧版 MIUI 了，碍于想要使用 NFC 公交卡，一直没有执行，现在终于没有牵绊了。现在我就来记录一下流程。注意，刷机前请备份好你的数据。

<!--more-->

## 解锁手机

MI6 的 bootloader 是带锁的，需要先到[申请解锁小米手机](http://www.miui.com/unlock/index.html)上申请解锁，申请通过后，按照官网流程解锁即可。解锁成功后，手机开机画面最低端会显示`Unlocked`。

## 刷 TWRP

刷第三方 ROM 之前，需要先通过 Fastboot 模式刷入第三方 Recovery，这里以 TWRP 为例。

### 下载 adb

adb 全称 Android Debug Bridge，通过这个工具能够在连接的安卓设备上运行命令。

[点击这里](https://dl.google.com/android/repository/platform-tools-latest-windows.zip)，下载官方 adb 包。下载好后解压出来，会在文件夹中找到`adb.exe`、`fastboot.exe`等文件。

### 下载 TWRP

TWRP 是一个很强大的第三方 Recovery，我们需要下载对应手机型号的 TWRP 镜像。点击[这里](https://dl.twrp.me/sagit/twrp-3.2.3-2-sagit.img)下载 MI6 机型的镜像。

其他机型可以访问[Devices - TWRP](https://twrp.me/Devices/)寻找，这里不再介绍。

### 刷入 TWRP

1. 将刚刚下载的镜像移动到`adb.exe`等文件的同一目录下，并重命名为`twrp.img`。
2. 长按手机`电源键`和`下音量键`，直到屏幕上出现一个安卓小机器人，进入到 Fastboot 模式。
3. 将手机用数据线连接刀电脑。
4. 在`adb.exe`所在目录，按住`shift`并右键，点击`在此处打开Powershell窗口`/`在此处打开CMD窗口`。
5. 运行如下命令，刷入并重启到 TWRP Recovery。

```powershell
fastboot.exe flash recovery twrp.img
fastboot.exe boot twrp.img
```

## 安装

### 下载系统

在这里我直接提供一下，我下载的版本的下载链接。

点击下载: [xiaomi.eu_multi_MI6_9.2.21_v10-8.0.zip](https://jaist.dl.sourceforge.net/project/xiaomi-eu-multilang-miui-roms/xiaomi.eu/MIUI-WEEKLY-RELEASES/9.2.21/xiaomi.eu_multi_MI6_9.2.21_v10-8.0.zip)

其他机型或更新版本，请去[xiaomi.eu](https://xiaomi.eu/community/)寻找。

### 格式化手机

进入 TWRP 以后，点击`Wipe`-`Format Data`，输入`yes`并确定，这将格式化手机内部存储并清除`data`分区的加密。

### 安装系统

接下来将下载好的系统安装包(zip 格式)拷贝到手机内部目录，当然通过 U 盘插到手机上也是可以的，TWRP 支持使用 MTP 存储。

点击`Install`，然后选择之前拷贝进去的 zip 包，滑动滑块开始安装。安装完成后，重启即可开始使用新系统。

注意，可能需要登录 Google，自行解决科学上网环境。

### ROOT(选)

推荐使用 [Magisk](https://github.com/topjohnwu/Magisk/releases/)。下载最新 Release 的 zip 安装包，通过 TWRP 直接刷入即可。卸载也是很简单的，下载对应版本`Magisk-uninstaller`的 zip 包，刷入即可。需要安装 Magisk Manager 进行管理，[点击这里](https://github.com/topjohnwu/Magisk/releases/download/manager-v7.0.0/MagiskManager-v7.0.0.apk)下载。
