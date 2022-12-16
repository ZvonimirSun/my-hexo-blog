---
title: 删除win11右键一级菜单的AMD驱动栏
date: 2022-12-15 08:35:29
categories:
  - 技巧
tags:
  - Windows
  - Windows 11
---

如题，在此记录一下。

<!--more-->

## 问题

![](https://img.iszy.xyz/1671064733303.png)

如图所示，就是想把这个东西去掉，用处不大，还把右键菜单撑老大，想去掉。

## 打开注册表编辑器

按 `Win + R` 快捷键，输入 `regedit` 打开注册表。

## 查找 AMD 应用 ID

```
计算机\HKEY_LOCAL_MACHINE\SOFTWARE\Classes\PackagedCom\Package\AdvancedMicroDevicesInc-2.AMDRadeonSoftware_10.22.20034.0_x64__0a9344xs7nr4m\Server
```

按照这个路径一直往下找，Package 名称在不同电脑和软件版本的情况下可能会有不通，以自己找到的为准。

![](https://img.iszy.xyz/1671065063988.png)

在这个 Server 里面，有的人是键值 `0`，有的是键值 `1`，点到这个键值下，我这边键值是 `0`。

![](https://img.iszy.xyz/1671065176268.png)

在这个下面的 SurrogateAppId 里的数据，也就是右侧大括号的数据就是我们需要的 ID，可以双击打开来复制。

## 屏蔽菜单

在地址栏里输入以下路径并回车。

```
计算机\HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Shell Extensions\Blocked
```

右键新建字符串值，值为刚刚的 AppID，我这里为 `{6767B3BC-8FF7-11EC-B909-0242AC120002}`

![](https://img.iszy.xyz/1671065384645.png)

![](https://img.iszy.xyz/1671065443124.png)

这样菜单就不显示了，如果想要恢复展示，删掉这条字符串值即可。

![](https://img.iszy.xyz/1671065556009.png)
