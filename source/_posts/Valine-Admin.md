---
title: 配合 Valine 使用的 Valine-Admin
date: 2018-04-01 18:00:00
updated: 2020-07-24 10:00:00
categories:
  - 折腾
tags:
  - Valine
  - 评论系统
---

在[上一篇文章](/2018/04/01/Valine/)中，我讲了怎样安装 Valine 评论系统。Valine 评论系统现在自带的邮件通知功能有很大缺陷，这就要轮到我今天要讲的 Valine-Admin 了。由 [@云淡风轻](https://ioliu.cn/) 大神开发的 Valine-Admin 实现了基于 leancloud 云引擎的邮件通知、垃圾评论识别和评论管理面板，[@赵俊](http://www.zhaojun.im/hexo-valine-admin/)大佬修改优化了一波，能够提供良好的评论通知体验。

<!--more-->

## 说明

本文内容已弃用，本人的库针对我的个人需求做了一些修改，不再适用于一般用户。因为后续原始的 Valine-Admin 开始适配修改版的 Valine，所以建议使用[@赵俊](http://www.zhaojun.im/hexo-valine-admin/)大佬的版本。

赵俊大神的原始链接：[Hexo 优化 --- Valine 扩展之邮件通知](http://www.zhaojun.im/hexo-valine-admin/)

<details>
  <summary>原始文章</summary>

## 问题与改动

由于 Valine 的更新，以前的一些功能已经无法继续使用。

- 由于去除了 rid 字段，原本基于 rid 字段的“被@邮件通知”功能不再有效。我从评论内容中重新提取了 rid 字段，能够正常进行邮件通知了。
- 由于不再有 IP 字段，垃圾评论识别功能完全不起作用。emmm，我也不会搞，所以就删掉了。

## 云引擎部署

> Deserts 大神的原始链接：[Valine: 独立博客评论系统](https://panjunwen.com/diy-a-comment-system/)

由于我对项目做了一些改动，建议使用本文的库，即止到今日一直使用正常。

### 源码部署

进入博客应用的云引擎的设置，在代码库中填入以下内容并点击保存。已改用 zhaojun1998 的 Valine-Admin，与教程暂不符合，**请勿继续使用以下教程**。

```
https://github.com/ZvonimirSun/Valine-Admin.git
```

![](https://img.iszy.xyz/20190318221112.png)

接下来在云引擎的部署页，选择部署目标为`生产环境`，分支或版本号填入`master`，勾选平滑部署，点击部署。

![](https://img.iszy.xyz/20190318221123.png)

### 设置自定义环境变量

此外，还需要设置云引擎的环境变量以支持运行，如图所示。

![](https://img.iszy.xyz/20190318221132.png)

SMTP 信息需要准确填写，用于发送通知邮件，部分邮箱如 QQ 邮箱需要使用授权码（密码）。注意我们使用 SSL 发件，所以端口别填错了。

### 评论管理后台

![](https://img.iszy.xyz/20190318221144.png)

在云引擎的设置界面设置 Web 主机域名，便可以通过这个地址访问评论的管理界面。用 \_User 表中的用户登录即可，注意要手动设置密码，才能登录，不能空密码。

![](https://img.iszy.xyz/20190318221157.png)

至此已经可以顺利使用了。由于云引擎的免费实例有每天的强制休眠，可以用定时脚本唤醒，但是大多数人应该不需要用到 24 小时，所以影响不大。

</details>
