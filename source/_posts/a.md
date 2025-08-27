---
title: 低微漏洞处理办法记录
date: 2021-01-12 09:39:41
updated: 2021-01-12 09:39:41
tags:
  - Linux
  - CVE
author: 诸子流
mathjax: true
copyright: false
---

> 原文链接: [低微漏洞处理办法记录](https://www.cnblogs.com/lsdb/p/8204578.html) —— 诸子流

<!--more-->

1. 允许 Traceroute 探测

   描述：本插件使用 Traceroute 探测来获取扫描器与远程主机之间的路由信息。攻击者也可以利用这些信息来了解目标网络的网络拓扑。

   处理：

   ```bash
   iptables -I INPUT -p icmp --icmp-type 11 -m comment --comment "deny traceroute" -j DROP
   ```

2. ICMP timestamp 请求响应漏洞

   描述：远程主机会回复 ICMP_TIMESTAMP 查询并返回它们系统的当前时间。 这可能允许攻击者攻击一些基于时间认证的协议。

   处理：

   ```bash
   iptables -I INPUT -p ICMP --icmp-type timestamp-request -m comment --comment "deny ICMP timestamp" -j DROP
   iptables -I INPUT -p ICMP --icmp-type timestamp-reply -m comment --comment "deny ICMP timestamp" -j DROP
   ```

3. 探测到 SSH 服务器支持的算法
   描述：本插件用来获取 SSH 服务器支持的算法列表

   处理：无法处理。ssh 协议协商过程就是服务端要返回其支持的算法列表。

4. SSH 版本信息可被获取

   描述：SSH 服务允许远程攻击者获得 ssh 的具体信息，如版本号等等。这可能为攻击者发动进一步攻击提供帮助。

   处理：无法处理。sshd_config 中的 Banner 项只是 ssh 主机前输出的信息，源码处理机制就是 telnet 其端口就会返回版本信息。

5. OpenSSH CBC 模式信息泄露漏洞(CVE-2008-5161)【原理扫描】

   描述：OpenSSH 是一种开放源码的 SSH 协议的实现，初始版本用于 OpenBSD 平台，现在已经被移植到多种 Unix/Linux 类操作系统下。
   如果配置为 CBC 模式的话，OpenSSH 没有正确地处理分组密码算法加密的 SSH 会话中所出现的错误，导致可能泄露密文中任意块最多 32 位纯文本。在以标准配置使用 OpenSSH 时，攻击者恢复 32 位纯文本的成功概率为 $2^{-18}$，此外另一种攻击变种恢复 14 位纯文本的成功概率为 $2^{-14}$。

   处理：使用 man sshd_config 查看 Ciphers 项可以看到 sshd 支持的算法（如下图所示）

   ![](https://img.iszy.xyz/1641952164668.png)

   处理办法是在 sshd_config 中配置 Ciphers 项，并去除所有包含 cbc 字眼的算法然后重启 sshd 即可。

   ```config
   Ciphers aes128-ctr,aes192-ctr,aes256-ctr,arcfour256,arcfour128,arcfour
   ```
