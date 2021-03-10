---
title: JAVA信任自签名证书
date: 2021-03-07 17:45:55
updated: 2021-03-07 17:45:55
categories:
tags:
  - OpenSSL
  - Java
  - 自签名证书
  - SSL
---

这篇文章是为了解决 Java 使用 SSL 过程中出现`PKIX path building failed: sun.security.provider.certpath.SunCertPathBuilderException: unable to find valid certification path to requested target`的问题。

<!--more-->

## 问题

今天在给微服务添加自签名证书后，微服务间使用 SSL 验证权限时出现了如下错误。

```log
javax.net.ssl.SSLHandshakeException: sun.security.validator.ValidatorException: PKIX path building failed: sun.security.provider.certpath.SunCertPathBuilderException: unable to find valid certification path to requested target
    at sun.security.ssl.Alerts.getSSLException(Alerts.java:192)
    at sun.security.ssl.SSLSocketImpl.fatal(SSLSocketImpl.java:1949)
    at sun.security.ssl.Handshaker.fatalSE(Handshaker.java:302)
    at sun.security.ssl.Handshaker.fatalSE(Handshaker.java:296)
...
Caused by: sun.security.validator.ValidatorException: PKIX path building failed: sun.security.provider.certpath.SunCertPathBuilderException: unable to find valid certification path to requested target
    at sun.security.validator.PKIXValidator.doBuild(PKIXValidator.java:387)
    at sun.security.validator.PKIXValidator.engineValidate(PKIXValidator.java:292)
    at sun.security.validator.Validator.validate(Validator.java:260)
    at sun.security.ssl.X509TrustManagerImpl.validate(X509TrustManagerImpl.java:324)
    at sun.security.ssl.X509TrustManagerImpl.checkTrusted(X509TrustManagerImpl.java:229)
```

这是因为自签名证书不被 Java 信任导致 SSL 握手失败。我看网上有不少是通过代码忽略证书验证来解决的，但是我觉得不能一刀切忽略验证，而是应该将特定证书添加到服务器的 Java 证书信任库中。

## Java 信任自签名证书

```bash
keytool -import -trustcacerts -alias nginx -file /opt/ssl/server.crt -keystore $JAVA_HOME/jre/lib/security/cacerts -storepass changeit -keyalg RSAs -noprompt
```

> 1. `-alias`，证书别名，可以任意填写，但不能重复
> 2. `-file`，需要导入的证书路径
> 3. `-keystore`，Java 证书库地址，默认地址为`$JAVA_HOME/jre/lib/security/cacerts`
> 4. `-storepass`，Java 证书库密码，默认密码为`changeit`

![](https://img.iszy.xyz/20210309181047.png)

这样就将证书导入到了该服务器的 Java 证书信任库中了，**涉及到这个证书的 Java 应用需要重启才能生效**。
