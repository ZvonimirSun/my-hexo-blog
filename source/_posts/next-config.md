---
title: NexT 主题配置记录
date: 2018-07-22 12:16:13
updated: 2018-11-28 22:04:00
categories:
  - 技能
  - 博客
tags:
  - NexT
  - Hexo
keywords: Next 主题
---

前段时间将博客模板更改为 NexT 主题了，在此记录一下配置的内容，按照配置文件顺序进行。留做备份，方便升级。很多以前的自定义添加的内容都整合进了主题，只需要在配置文件中简单启用即可。

<!--more-->

这里只是记录了我主要的配置内容，并不是全部，后期也可能会修改。有什么配置上的问题，可以在评论里留言，我会尽量回答。

## 启用 NexT 主题

默认已经新建了 hexo 站点，不再赘述。

### 下载 NexT 主题

在这里选取 ``v6.5.0`` 版本。

```shell
cd your-hexo-site
git clone --branch v6.5.0 https://github.com/theme-next/hexo-theme-next.git themes/next
```

### 启用主题

在站点配置文件中将主题设置为 next。

```yaml
theme: next
```

## 使用 Hexo data files 配置主题

为了使主题与配置分离，方便升级主题，采用 Hexo data files 进行配置。

### 创建文件

在站点文件夹创建 ``source/_data/next.yml`` 文件。

### 复制配置

将所有配置内容，包括站点和主题配置文件移入 ``source/_data/next.yml`` 文件。

### ``next.yml`` 文件中启用 override

修改以下内容。

```yaml
override: true
```

至此，配置文件与主题分离，不用再区分站点配置文件或是主题配置文件，后面的所有配置更改都将在此文件内进行。

## 站点配置内容

在此只列出改动的内容

### 基本信息

```yaml
title: 随遇而安
subtitle: 在自由的空气中漂浮
description: 孙梓洋的个人博客，主要用于生活吐槽和学习记录
keywords: your keywords
author: Sun Ziyang
language: zh-CN
timezone: Asia/Shanghai

url: https://www.iszy.cc
```

### 远程部署

```yaml
deploy:
- type: git
  repo: your git repo
  branch: master
```

### 本地搜索

```yaml
# Local Search
search:
  path: search.xml
  field: post
  format: html
  limit: 10000
```

### 启用AMP(选)

需要安装插件``hexo-generator-amp``，请确保你了解**AMP**，否则不要贸然进行这一步。

#### 安装插件

```
npm install hexo-generator-amp --save
```

#### 添加配置文件内容

```
generator_amp:
  templateDir:  amp-template
  assetDistDir: amp-dist
  logo:
    path:   sample/sample-logo.png
    width:  384
    height: 384
  substituteTitleImage: 
    path:   sample/sample-substituteTitleImage.png
    width:  640
    height: 640
  warningLog: false   # To display warning, please set true.
  validateAMP: true   # To AMP HTML validate automatically, please set true.
```

#### 修改模板

打开``post``的模板

```
vi themes/next/layout/_macro/post.swig
```

添加以下内容。

```html
{% if is_post() and config.generator_amp %}
    <link rel="amphtml" href="{{ post.permalink }}amp/">
{% endif %}
```

## 主题配置内容

### 图标配置

这些图标可以在 [网页图标生成器](https://www.websiteplanet.com/zh-hans/webtools/favicon-generator/) 生成（感谢一位热心读者提供了这个更加好用的工具）。如果前面那个用不来，也可以尝试一下[Favicon Generator](https://realfavicongenerator.net/)。图片存放路径与站点source文件夹中路径一致。

```yaml
favicon:
  small: /images/favicon-16x16.png
  medium: /images/favicon-32x32.png
  apple_touch_icon: /images/apple-touch-icon.png
  safari_pinned_tab: /images/safari-pinned-tab.svg
  android_manifest: /images/manifest.json
  ms_browserconfig: /images/browserconfig.xml
```

### RSS订阅

安装插件。

```
npm install hexo-generator-feed --save
```

保持此项配置不动。

```yaml
rss:
```

### 关闭站点底部各种说明

```yaml
powered:
  # Hexo link (Powered by Hexo).
  enable: false
  # Version info of Hexo after Hexo link (vX.X.X).
  version: false

theme:
  # Theme & scheme info link (Theme - NexT.scheme).
  enable: false
  # Version info of NexT after scheme info (vX.X.X).
  version: false
```
### 备案信息

国内网站需要添加备案信息。

```yaml
beian:
  enable: true
  icp:苏ICP备18000000号-1 #请换成你自己的备案号

### 打开SEO优化

```yaml
seo: true
```

### 菜单配置

```yaml
menu:
  home: / || home
  tags: /tags/ || tags
  #categories: /categories/ || th
  archives: /archives/ || archive
  about: /about/ || user
  #schedule: /schedule/ || calendar
  #sitemap: /sitemap.xml || sitemap
  #commonweal: /404/ || heartbeat
```

### 选取主题样式

```yaml
#scheme: Muse
#scheme: Mist
#scheme: Pisces
scheme: Gemini
```

### 配置社交

可以自行添加，选择图标

```yaml
social:
  Telegram: https://t.me/sunziyang97 || telegram
  E-Mail: mailto:hi@iszy.xyz || envelope
  #Google: https://plus.google.com/yourname || google
  #Twitter: https://twitter.com/yourname || twitter
  #FB Page: https://www.facebook.com/yourname || facebook
  #VK Group: https://vk.com/yourname || vk
  #StackOverflow: https://stackoverflow.com/yourname || stack-overflow
  #YouTube: https://youtube.com/yourname || youtube
  #Instagram: https://instagram.com/yourname || instagram
  #Skype: skype:yourname?call|chat || skype
```

### 配置友链

```yaml
# Blog rolls
links_icon: link
links_title: Links
#links_layout: block
links_layout: inline
links:
  随遇而安: https://www.iszy.cc
  name2: https://example.com
```

### 侧边栏头像

```yaml
avatar:
  url: /images/avatar.png #头像地址
  rounded: true #是否圆形
  opacity: 1 #透明度
  rotated: true #鼠标指向是否转圈
```

### 文章浏览进度

```yaml
b2t: true
scrollpercent: true
scroll_to_more: true
save_scroll: true
```

### 字数统计

```yaml
symbols_count_time:
  separated_meta: true
  item_text_post: true
  item_text_total: false
  awl: 2
  wpm: 275
```

### 赞助

```yaml
# Reward
reward_comment: 您的支持将是对我最好的鼓励！
wechatpay: /images/wechatpay.png
alipay: /images/alipay.jpg
#bitcoin: /images/bitcoin.png
```

### 相关文章

```yaml
# Related popular posts
# Dependencies: https://github.com/tea3/hexo-related-popular-posts
related_posts:
  enable: true
  title: # custom header, leave empty to use the default one
  display_in_home: false
  params:
    maxCount: 5
    #PPMixingRate: 0.0
    #isDate: false
    #isImage: false
    #isExcerpt: false
```

### 版权声明

```yaml
# Declare license on posts
post_copyright:
  enable: true
  license: <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" rel="external nofollow" target="_blank">CC BY-NC-SA 4.0</a>
```

### Valine评论

```yaml
valine:
  enable: true
  appid: your appid # your leancloud application appid
  appkey: your appkey # your leancloud application appkey
  notify: false # mail notifier , https://github.com/xCss/Valine/wiki
  verify: false # Verification code
  placeholder: ヾﾉ≧∀≦)o快来评论一下吧! # comment box placeholder
  avatar:  # gravatar style
  guest_info: nick,mail,link # custom comment header
  pageSize: 10 # pagination size
  visitor: true # leancloud-counter-security is not supported for now. When visitor is set to be true, appid and appkey are recommended to be the same as leancloud_visitors' for counter compatibility. Article reading statistic https://valine.js.org/visitor.html
```

### 站长工具

```yaml
google_site_verification: ABCD...
google_analytics: UA-123456789-1
bing_site_verification: 10AA...
```

### 本地搜索

```yaml
local_search:
  enable: true
  trigger: auto
  top_n_per_article: 1
  unescape: true
```

### 关闭动画

为了加速我的网站，我关闭了站点的动画。

```yaml
motion:
  enable: false
```

### 配置静态文件CDN

配置CDN能够节省服务器流量。

```yaml
# Script Vendors.
# Set a CDN address for the vendor you want to customize.
# For example
#    jquery: https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js
# Be aware that you should use the same version as internal ones to avoid potential problems.
# Please use the https protocol of CDN files when you enable https on your site.
vendors:
  # Internal path prefix. Please do not edit it.
  _internal: lib

  # Internal version: 2.1.3
  jquery: //cdn.bootcss.com/jquery/2.1.3/jquery.min.js

  # Internal version: 2.1.5
  # See: http://fancyapps.com/fancybox/
  fancybox: //cdn.bootcss.com/fancybox/2.1.5/jquery.fancybox.pack.js
  fancybox_css: //cdn.bootcss.com/fancybox/2.1.5/jquery.fancybox.min.css

  # Internal version: 1.0.6
  # See: https://github.com/ftlabs/fastclick
  fastclick: //cdn.bootcss.com/fastclick/1.0.6/fastclick.min.js

  # Internal version: 1.9.7
  # See: https://github.com/tuupola/jquery_lazyload
  lazyload: //cdn.bootcss.com/jquery_lazyload/1.9.7/jquery.lazyload.min.js

  # Internal version: 1.2.1
  # See: http://VelocityJS.org
  velocity: //cdn.bootcss.com/velocity/1.2.1/velocity.min.js

  # Internal version: 1.2.1
  # See: http://VelocityJS.org
  velocity_ui: //cdn.bootcss.com/velocity/1.2.1/velocity.ui.min.js

  # Internal version: 0.7.9
  # See: https://faisalman.github.io/ua-parser-js/
  ua_parser: //cdn.bootcss.com/UAParser.js/0.7.9/ua-parser.min.js

  # Internal version: 4.6.2
  # See: http://fontawesome.io/
  fontawesome: //cdn.bootcss.com/font-awesome/4.6.2/css/font-awesome.min.css

  # Internal version: 1
  # https://www.algolia.com
  algolia_instant_js:
  algolia_instant_css:

  # Internal version: 1.0.2
  # See: https://github.com/HubSpot/pace
  # Or use direct links below:
  # pace: //cdn.bootcss.com/pace/1.0.2/pace.min.js
  # pace_css: //cdn.bootcss.com/pace/1.0.2/themes/blue/pace-theme-flash.min.css
  pace: //cdn.bootcss.com/pace/1.0.2/pace.min.js
  pace_css: //cdn.bootcss.com/pace/1.0.2/themes/blue/pace-theme-flash.min.css

  # Internal version: 1.0.0
  # See: https://github.com/theme-next/theme-next-canvas-nest
  canvas_nest: //cdn.jsdelivr.net/gh/theme-next/theme-next-canvas-nest@1.0.0/canvas-nest.min.js
  canvas_nest_nomobile: //cdn.jsdelivr.net/gh/theme-next/theme-next-canvas-nest@1.0.0/canvas-nest-nomobile.min.js

  # Internal version: 1.0.0
  # See: https://github.com/theme-next/theme-next-three
  # three: //cdn.jsdelivr.net/gh/theme-next/theme-next-three@1.0.0/three.min.js
  # three_waves: //cdn.jsdelivr.net/gh/theme-next/theme-next-three@1.0.0/three-waves.min.js
  # canvas_lines: //cdn.jsdelivr.net/gh/theme-next/theme-next-three@1.0.0/canvas_lines.min.js
  # canvas_sphere: //cdn.jsdelivr.net/gh/theme-next/theme-next-three@1.0.0/canvas_sphere.min.js
  three: //cdn.jsdelivr.net/gh/theme-next/theme-next-three@1.0.0/three.min.js
  three_waves: //cdn.jsdelivr.net/gh/theme-next/theme-next-three@1.0.0/three-waves.min.js
  canvas_lines: //cdn.jsdelivr.net/gh/theme-next/theme-next-three@1.0.0/canvas_lines.min.js
  canvas_sphere: //cdn.jsdelivr.net/gh/theme-next/theme-next-three@1.0.0/canvas_sphere.min.js

  # Internal version: 1.0.0
  # https://github.com/zproo/canvas-ribbon
  canvas_ribbon:

  # Internal version: 3.3.0
  # https://github.com/ethantw/Han
  Han:

  # Internal version: 3.3.0
  # https://github.com/vinta/pangu.js
  # Example: 
  # pangu: //cdn.jsdelivr.net/npm/pangu@3.3.0/dist/browser/pangu.min.js
  # pangu: //cdnjs.cloudflare.com/ajax/libs/pangu/3.3.0/pangu.min.js
  pangu: //cdn.bootcss.com/pangu/3.3.0/pangu.min.js

  # needMoreShare2
  # https://github.com/revir/need-more-share2
  # Example: 
  # needmoreshare2_js: //cdn.jsdelivr.net/gh/theme-next/theme-next-needmoreshare2@1.0.0/needsharebutton.min.js
  # needmoreshare2_css: //cdn.jsdelivr.net/gh/theme-next/theme-next-needmoreshare2@1.0.0/needsharebutton.min.css
  needmoreshare2_js: //cdn.jsdelivr.net/gh/theme-next/theme-next-needmoreshare2@1.0.0/needsharebutton.min.js
  needmoreshare2_css: //cdn.jsdelivr.net/gh/theme-next/theme-next-needmoreshare2@1.0.0/needsharebutton.min.css

  # bookmark
  # Internal version: 1.0.0
  # https://github.com/theme-next/theme-next-bookmark
  # Example: 
  # bookmark: //cdn.jsdelivr.net/gh/theme-next/theme-next-bookmark@1.0.0/bookmark.min.js
  bookmark: //cdn.jsdelivr.net/gh/theme-next/theme-next-bookmark@1.0.0/bookmark.min.js

  # reading_progress
  # Internal version: 1.0
  # https://github.com/theme-next/theme-next-reading-progress
  # Example: https://cdn.jsdelivr.net/gh/theme-next/theme-next-reading-progress@1.1/reading_progress.min.js
  reading_progress: //cdn.jsdelivr.net/gh/theme-next/theme-next-reading-progress@1.1/reading_progress.min.js

  # valine comment
  # Example: https://cdn.jsdelivr.net/npm/valine@1.1.8/dist/Valine.min.js
  valine: //cdn.jsdelivr.net/npm/valine@latest/dist/Valine.min.js
```