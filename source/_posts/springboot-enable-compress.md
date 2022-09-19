---
title: Spring Boot 开启压缩
categories:
  - Wiki
  - Java
tags:
  - Spring Boot
date: 2022-09-14 09:38:50
updated: 2022-09-14 09:38:50
---

公司的部分老项目还没有用上 webpack，前后端不分离，有不少静态资源不压缩的话还是比较大的。这边记录下 Spring Boot 开启压缩的方法。

<!--more-->

## 开启方法

1. 首先需要在 `application.yml` 里启用压缩
2. 因为默认只压缩 `text/html` 类型，需要添加上其他需要的类型，比如 `application/json`
3. 如有需要可以配置启用压缩的最小响应大小，默认为 `2048 byte`

```yml
server:
  compression:
    enabled: true
    mime-types: application/json,application/xml,text/html,text/xml,text/plain
    min-response-size: 2048
```

## 效果对比

压缩前

![](https://img.iszy.xyz/1663551069657.png)

压缩后

![](https://img.iszy.xyz/1663551287356.png)

可以看到已经开启了 gzip 压缩

![](https://img.iszy.xyz/1663551338263.png)

## 常见其他方法

一般如果应用比较多，在每个应用里添加配置还是比较麻烦的。可以考虑使用 Nginx 进行代理，统一添加 gzip 甚至 brotli 压缩，会更加方便。brotli 和 gzip 可以同时开始，压缩效果更好。
