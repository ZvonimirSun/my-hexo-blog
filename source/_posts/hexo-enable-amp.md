---
title: 本站已全面启用AMP
date: 2018-08-26 23:17:48
updated: 2018-08-26 23:17:48
categories:
  - 技能
  - 博客
tags:
  - 建站
  - Hexo
  - AMP
keywords: hexo-generator-amp,amp,hexo,启用amp
---

早有听闻 Google 的 AMP，能够显著加快网站的移动访问。现在本站终于全面启用了 AMP，现在已经有部分 AMP 页面加入了索引，效果很不错。

<!--more-->

## AMP 简介

Accelerated Mobile Pages（简称 AMP，意为“加速移动页面”）是 Google 带领开发的开源项目，目的是为提升移动设备对网站的访问速度。AMP 也可指其派生的标准和库等项目成果。AMP 在 HTML 等广泛使用的网络技术基础上进行改良，它的核心称作 AMP HTML，是 HTML 的一种。服务于技术预览期结束后的 2016 年 2 月正式发布。

![](https://img.iszy.xyz/20190318213401.png)

## Hexo 博客启用方式

本站采用 NexT 主题，就以此作为演示。

### 安装`hexo-generator-amp`插件

```shell
npm install hexo-generator-amp --save
```

如果不成功，加个`sudo`再试一下。

### 修改主题

本文使用的是 NexT 主题 v6.4.0，这个版本已有提供用户自定义增加内容的设置。

打开`themes/next/layout/_custom`文件夹中的`head.swig`文件。

```shell
vi themes/next/layout/_custom/head.swig
```

在文件中添加如下内容。

```html
{% if is_post() and config.generator_amp %}
<link rel="amphtml" href="./amp/" />
{% endif %}
```

### 修改站点配置

打开**站点配置文件**`_config.yml`，加入以下内容。

```yml
generator_amp:
  templateDir: amp-template
  assetDistDir: amp-dist
  logo:
    path: sample/sample-logo.png
    width: 600
    height: 60
  substituteTitleImage:
    path: sample/sample-substituteTitleImage.png
    width: 1024
    height: 800
  warningLog: false # To display warning, please set true.
  validateAMP: true # To AMP HTML validate automatically, please set true.
```

### 部署

```
hexo clean
hexo g -d
```

## 查看效果

在我的每篇文章地址后加上`./amp/`即可看到效果，以本文为例。

![](https://img.iszy.xyz/20190318213417.png)

## Google 的 AMP 测试

可以使用 Google 的[AMP 测试](https://search.google.com/test/amp)来测试你的 AMP 网页的有效性。然后你就能放心地将网页提交给 Google 和百度了。

![](https://img.iszy.xyz/20190318213428.png)
