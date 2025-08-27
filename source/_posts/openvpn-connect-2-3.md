---
title: OpenVPN连接2.3及更老版本服务端问题
tags:
  - OpenVPN
date: 2024-03-27 11:38:34
---

最近由于需要连接几个公司不同的 OpenVPN 服务，各家都提供了自己的定制 OpenVPN 客户端，不胜其烦。而且个人不太喜欢使用旧版本的客户端，理论上使用最新的 OpenVPN 客户端没有道理不能连接，遂研究开始。

<!-- more -->

## 问题

一般情况下，需要连接的 OpenVPN 服务端版本越老，由于各种安全限制逐渐收紧，老版本使用的安全协议逐渐不受支持，问题也就越多。

这里我需要连接的最老的 OpenVPN 版本是 2.1.1 的，使用的客户端是文章编写时[最新的 OpenVPN 开源客户端](https://openvpn.net/community-downloads/) 2.6.10 版本。

直接使用公司提供的 ovpn 配置文件进行连接，不出意料的报错失败了。

点这里[直接看结论](#总结一下)

## 解决问题

### 问题一：TLS handshake failed

先看一下连接出现的报错。

```log
2024-03-27 10:29:54 Received fatal SSL alert: handshake failure
2024-03-27 10:29:54 OpenSSL: error:0A000410:SSL routines::ssl/tls alert handshake failure:SSL alert number 40
2024-03-27 10:29:54 TLS_ERROR: BIO read tls_read_plaintext error
2024-03-27 10:29:54 TLS Error: TLS object -> incoming plaintext read error
2024-03-27 10:29:54 TLS Error: TLS handshake failed
2024-03-27 10:29:54 Fatal TLS error (check_tls_errors_co), restarting
2024-03-27 10:29:54 SIGUSR1[soft,tls-error] received, process restarting
2024-03-27 10:29:54 MANAGEMENT: >STATE:1711506594,RECONNECTING,tls-error,,,,,
```

从这边的报错可以看到，是 TLS 协商握手直接就失败了。

经过相关搜索，在 OpenVPN Community 的 Wiki 中的 [tls-cipher](https://community.openvpn.net/openvpn/wiki/Hardening#Useof--tls-cipher) 配置部分提到了可能的原因。**在 OpenVPN 2.3.2 版本之前，只有 TLSv1.0 RSA cipher 可用。在 OpenVPN 2.4 版本后，对默认的 cipher 列表添加了新的限制。**

![](https://img.iszy.xyz/1711506949529.png)

经过尝试，在 **ovpn 配置中增加如下内容**，使用 **OpenVPN 2.4 版本**能够正常进行连接。

```
tls-cipher DEFAULT:!EXP:!LOW
```

或

```
tls-cipher DEFAULT
```

### 问题二: data-cipher

虽然加上上面的配置在 OpenVPN 2.4 可以正常连接了，但是在 OpenVPN 2.6.10 上仍然有问题没有解决。

看看新的日志

```log
2024-03-27 10:47:26 MANAGEMENT: >STATE:1711507646,RESOLVE,,,,,,
2024-03-27 10:47:26 TCP/UDP: Preserving recently used remote address: [AF_INET]xxx.xxx.xxx.xxx:xxxx
2024-03-27 10:47:26 Socket Buffers: R=[65536->65536] S=[65536->65536]
2024-03-27 10:47:26 Attempting to establish TCP connection with [AF_INET]xxx.xxx.xxx.xxx:xxxx
2024-03-27 10:47:26 MANAGEMENT: >STATE:1711507646,TCP_CONNECT,,,,,,
2024-03-27 10:47:26 TCP connection established with [AF_INET]xxx.xxx.xxx.xxx:xxxx
2024-03-27 10:47:26 TCPv4_CLIENT link local: (not bound)
2024-03-27 10:47:26 TCPv4_CLIENT link remote: [AF_INET]xxx.xxx.xxx.xxx:xxxx
2024-03-27 10:47:26 MANAGEMENT: >STATE:1711507646,WAIT,,,,,,
2024-03-27 10:47:26 MANAGEMENT: >STATE:1711507646,AUTH,,,,,,
2024-03-27 10:47:26 TLS: Initial packet from [AF_INET]xxx.xxx.xxx.xxx:xxxx, sid=7a8a0685 8d7eb18c
2024-03-27 10:47:26 VERIFY OK: depth=1, C=CN, ST=XX, L=XX, O=XX, OU=ovpn, CN=XX, name=ovpn, emailAddress=XX@XX.XX
2024-03-27 10:47:26 VERIFY KU OK
2024-03-27 10:47:26 Validating certificate extended key usage
2024-03-27 10:47:26 ++ Certificate has EKU (str) TLS Web Server Authentication, expects TLS Web Server Authentication
2024-03-27 10:47:26 VERIFY EKU OK
2024-03-27 10:47:26 VERIFY OK: depth=0, C=CN, ST=XX, L=XX, O=XX, OU=ovpn, CN=XX, name=ovpn, emailAddress=XX@XX.XX
2024-03-27 10:47:26 Connection reset, restarting [0]
2024-03-27 10:47:26 SIGUSR1[soft,connection-reset] received, process restarting
2024-03-27 10:47:26 MANAGEMENT: >STATE:1711507646,RECONNECTING,connection-reset,,,,,
2024-03-27 10:47:26 Restart pause, 1 second(s)
```

这里很奇怪，证书验证正确，但是连接断开了。

从这里看不出来，那就从老版本的连接日志里看看。

```log
Wed Mar 27 11:02:31 2024 Data Channel Encrypt: Cipher 'BF-CBC' initialized with 128 bit key
Wed Mar 27 11:02:31 2024 Data Channel Encrypt: Using 160 bit message hash 'SHA1' for HMAC authentication
Wed Mar 27 11:02:31 2024 Data Channel Decrypt: Cipher 'BF-CBC' initialized with 128 bit key
Wed Mar 27 11:02:31 2024 Data Channel Decrypt: Using 160 bit message hash 'SHA1' for HMAC authentication
Wed Mar 27 11:02:31 2024 Control Channel: TLSv1, cipher TLSv1/SSLv3 AES256-SHA, 2048 bit RSA
```

从这里我们可以看到除了简历 TCP 连接的握手，还有一个数据加密的 Cipher，这里的这个 BF-CBC 就是一个比较老旧的不安全的协议，应当早就已经被默认禁用了。

根据[官方关于密码协商的 Wiki 部分](https://community.openvpn.net/openvpn/wiki/CipherNegotiation)，在 2.2 及更早的版本，似乎没有配置可以指定数据加密使用的 Cipher；从 2.3 版本开始新增了 `cipher` 配置项用于指定数据加密使用的 Cipher；从 **2.5 版本**开始，需要使用新配置 `data-ciphers`来指定一组可用的数据加密 Cipher。

这里我就尝试将`cipher`配置为`BF-CBC`并没有作用，按照文档，只有服务端和客户端都配置了`cipher`才行，我这边服务端才 2.1.1 版本显然是无法实现的。

转而添加以下配置进行测试。

```
data-ciphers BF-CBC
```

这个同样报错了，属于配置错误，都不进行连接了。

```log
2024-03-27 11:24:06 Note: --cipher is not set. OpenVPN versions before 2.5 defaulted to BF-CBC as fallback when cipher negotiation failed in this case. If you need this fallback please add '--data-ciphers-fallback BF-CBC' to your configuration and/or add BF-CBC to --data-ciphers.
2024-03-27 11:24:06 Unsupported cipher in --data-ciphers: BF-CBC
Options error: --data-ciphers list contains unsupported ciphers or is too long.
Use --help for more information.
```

可以看到 `BF-CBC` 不支持，想来应该是被禁用了。

经过了一些搜索，在 OpenVPN 2.6 版本需要添加以下配置，就可以正常连接了。

```
providers legacy default
```

在 OpenVPN 2.6 的[使用手册](https://openvpn.net/community-resources/reference-manual-for-openvpn-2-6/)中，找到了对这个配置项的说明，但没有详细内容。

![](https://img.iszy.xyz/1711510301173.png)

## 总结一下

这边测试了两个版本的 OpenVPN 客户端。

在 OpenVPN 2.4 版本客户端的 ovpn 配置中需要添加

```
tls-cipher DEFAULT:!EXP:!LOW
```

在 OpenVPN 2.6 版本客户端的 ovpn 配置中需要添加

```
tls-cipher DEFAULT:!EXP:!LOW
data-ciphers BF-CBC
providers legacy default
```

即可正常连接 2.3 及更老版本的 OpenVPN，可能需要根据服务端配置进行更多的调整，以实际情况为准。

如有问题，请不吝指正。
