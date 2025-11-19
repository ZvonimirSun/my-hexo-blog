---
title: 添加或移除 WIN11 此电脑中的文件夹
date: 2022-12-16 14:00:25
tags:
  - Windows
---

在 `Windows 11 build 25136` 或者 `build 22621.160` 版本后，系统更新了资源管理器的布局，引入了多标签页的功能。与此同时，我也发现，在此电脑里的那些用户文件夹，比如文档、下载等，不见了。虽然说大多数不是很常用，但是没了还是不太习惯，整个此电脑页面也有些空旷。这里就记录下，如何将这些文件夹加回来，以及如何再次隐藏。

<!--more-->

## 添加文件夹

按 `Win + R` 快捷键，输入 `regedit` 打开注册表。

在地址栏里输入以下路径并回车。

```
计算机\HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace
```

![](https://img.iszy.cc/1671171351365.png)

这些每一条对应的就是一个文件夹。具体是什么文件夹，可以点进去看一下。

![](https://img.iszy.cc/1671171792200.png)

比如这条的值为`CLSID_ThisPCLocalDownloadsRegFolder`，对应的就是下载文件夹。

**我们可以看到除了文件夹信息，还有一条 `HideIfEnabled` 的值，就是这条注册表值把文件夹隐藏了，删除掉刷新一下就可以显示出来。**

![](https://img.iszy.cc/1671171893640.png)

## 移除文件夹

与上面操作相反，我们只要把`HideIfEnabled`条目加上，就可以将文件夹隐藏。

点击到你想要隐藏的文件夹，右键新建**DWORD (32 位)值**，名称为`HideIfEnabled`。

![](https://img.iszy.cc/1671172330084.png)

![](https://img.iszy.cc/1671172365571.png)

双击打开，输入值为`22ab9b9`

![](https://img.iszy.cc/1671172425560.png)

![](https://img.iszy.cc/1671172451119.png)

现在刷新一下资源管理器，文件夹就被隐藏了。
