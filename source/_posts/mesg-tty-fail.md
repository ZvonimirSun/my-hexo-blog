---
title: "解决ttyname failed: Inappropriate ioctl for device问题"
date: 2018-08-11 09:41:17
updated: 2018-08-11 09:41:17
tags:
  - Linux
---

在我使用`git push`、`hexo deploy`等类似操作时，时常会看到`ttyname failed: Inappropriate ioctl for device`的报错信息。这怎么能行，不是`0 errors,0 warnings`能行？这里就来记录一下这个问题的解决办法。

<!--more-->

## 问题原因

Ubuntu 知道并不是所有人都会对 root 账户执行图形登录，所以在默认`.profile`文件中设置了在这种情况下产生虚假错误。你可以看到，在`/root/.profile`文件末尾有这样一行。

```shell
mesg n || true
```

这是什么呢？这是为了防止像`talk`之类的程序写入你的控制台，这在你通过文本会话登录 root 账户时尤为重要。`|| true`是为了防止在请求 tty 失败时的错误导致 shell 脚本中止。

把这句话放在`.profile`文件中，能够让每次运行 bash 的时候，执行这句话。当你从没有 tty 设备的绘画中运行时，你就能看到报错，并且这不会影响其他程序的运行，只是显示一条消息。

## 解决方案

虽说这个消息无害，但是总是看到报错消息还是不太舒服，那就把它去掉吧。

将`/root/.profile`文件中的`mesg n || true`改为如下内容。

```shell
tty -s && mesg n || true
```

这就能让`mesg`在没有 tty 时，不发送消息，而在有 tty 时继续调用。现在你可以不用再看到`ttyname failed: Inappropriate ioctl for device`了。

![](https://img.iszy.xyz/20190318214328.png)
