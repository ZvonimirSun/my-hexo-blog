---
title: (转载)整合 Gmail 与 Mailgun 实现免费域名邮箱 — 香菇肥牛的博客
date: 2018-07-06 12:00:00
updated: 2018-07-06 12:00:00
categories:
  - 技巧
tags:
  - Mailgun
  - Google
  - 域名邮箱
keywords: GMail,Mailgun,企业邮箱,域名邮箱,邮件服务器教程
---

> 原文链接：[奇技淫巧——整合 Gmail 与 Mailgun 实现免费域名邮箱](https://qing.su/article/131.html) —— 香菇肥牛

曾今免费的 G Suite 现在已经不再免费了，老版本的 G Suite 已不能更换域名。至于其他的免费域名邮箱，Yandex 的发信经常被 Block, Zoho 收信延迟严重且服务器不稳定，国内各企业邮局更是垃圾得不能用。因此，免费且靠谱的域名邮箱显得格外稀缺。最近在处理邮件发送的时候发现了 Mailgun 这款神器；它和 Gmail 配合可以完美地实现免费域名邮箱。因此，在这里分享给大家。

<!--more-->

## Mailgun

首先要说明一下，Mailgun 每个月发送 10000 封邮件以内是免费的。对于个人和小型团体来说，10000 封的月发送量绰绰有余了。

整个域名邮箱的实现如下面的示意图所示。可见，我们整合了 Mailgun 和 Gmail 实现了和 G Suite 一样的功能，曲线救国。下面我就来介绍一下具体怎样部署 GMail 和 Mailgun。

![](https://img.iszy.cc/20190318213136.png)

### 添加域名

首先，我们要去 mailgun.com 注册一个账号。注册账号并验证邮箱后，可以登录到后台，然后在 Domains 选项卡中点击 Add New Domain。

![](https://img.iszy.cc/20190318213148.png)

输入域名 (比如 example.com) 之后点击下一步，会提示修改 DNS 记录。请移步你的域名 DNS 解析商，添加好对应的 DNS 记录。相关的记录一共有 5 条，其中 2 条 TXT 记录，2 条 MX 记录，1 条 CNAME 记录。添加好后点击页面底部的 Continue to Domain Overview，进入管理控制台。

![](https://img.iszy.cc/20190318213158.png)

在控制台中，顶部有提示，DNS 需要 24~48 小时生效。如果确认自己更改的 DNS 已经生效了，就可以点击控制台中的 Check DNS Records Now，如上图。如果 DNS 设置无误，那么这个域名就可以开始使用了，我们可以看到此时域名的状态已经变成了绿色的 Active。

### 配置域名转发

现在，我们首先要给这个域名设置转发，使得我们的 Gmail 邮箱能够收取域名邮箱的所有信件。

点击顶部 Routes 选项卡，然后点击 Create Route，如下图所示。

![](https://img.iszy.cc/20190318213212.png)

在 Create New Route 界面中，Expression Type 选择 Catch All，Actions 勾选 Forward 并输入你的 GMail 邮箱地址，其他所有选项保持默认即可，最后点击下面的 Create Route。

![](https://img.iszy.cc/20190318213224.png)

这时，我们回到 Domains 列表中点击我们自己的域名，应该能看到如下图的页面，其中包含了 SMTP 服务器和密码，以及 API 等内容。我们只需要知道服务器密码即可。

![](https://img.iszy.cc/20190318213235.png)

至此，Mailgun 的设置完毕，我们需要登录 GMail，设置收发信。

## GMail

### 在 GMail 中配置收发信

登录你的个人 Gmail 后台，在 Settings 里面找到 Accounts and Import，点击 Add another email address，如下图。

![](https://img.iszy.cc/20190318213248.png)

在弹出的小窗口中，输入姓名和你要使用的域名邮箱，这里以 admin@example.com 为例。勾选 Treat as an alias, 然后点击 Next step。在服务器配置的页面输入我们刚才的服务器信息、SMTP 用户名和密码。端口为 587，加密方式选择 TLS，如下图所示。填好后点击 Add account。

![](https://img.iszy.cc/20190318213257.png)

如果用户名和密码输入无误，GMail 会向你的 admin@example.com 邮箱发送一封验证邮件，而此时，这封邮件已经被转发至你的 GMail 邮箱了，所以只要点击收到的邮件中的验证链接就大功告成了。

![](https://img.iszy.cc/20190318213309.png)

至此，我们完成了 GMail 和 Mailgun 的整合，以及免费域名邮箱的设置。所有发往 admin@example.com 的邮件均会被 Mailgun 转递至你的 GMail 邮箱，而你的 GMail 邮箱可以直接以 admin@example.com 的名义发信，和普通的域名邮箱没有任何差别。收件人是无法知道你是用 GMail 发信还是用其他独立的域名邮箱发信的。如果需要添加多个域名邮箱或者别名，只需要重复执行上述 GMail 的配置即可。

如果大家在使用过程中遇到任何问题，欢迎在这里留言，我将及时回复。本文作者为香菇肥牛，原文地址为[https://qing.su/article/131.html](https://qing.su/article/131.html)。转载需经过作者同意且需注明原文链接。谢谢！
