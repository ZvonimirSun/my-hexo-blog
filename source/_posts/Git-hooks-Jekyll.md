---
title: 利用 git hooks 自动编译 Jekyll
date: 2018-03-19 18:00:00
updated: 2018-03-19 18:00:00
categories:
  - 建站
tags:
  - Jekyll
  - Git
  - Gem
keywords: Jekyll, Git, hooks
---

其实这项工作我已经完成了几天了，现在在此记录一下。主要就是整理一下在自己的服务器上配置 Jekyll 环境，并利用 git hooks 自动化编译的过程，配置好后就能实现和 Github Pages 上类似的环境。

<!--more-->

## 起因

首先来讲一下，我为什么想要折腾这个东西。

最开始，我的博客是放在 Github Pages 上的，但是由于 Github 屏蔽了百度的爬虫，所以挂在 Github Pages 上的博客并不能被百度搜索到，对于一个中文博客来说还是蛮蛋疼的。当然国内的 Coding Pages 也能提供类似的服务，但是最近开始插广告了，于是就不在我的考虑范围内了。

前段时间，我把网站挂在虚拟主机上，但是许多东西都不能自定义，不能完全按照我的心意来，我还是不太满意。后来，我找到了一家价格较为便宜的美西 VPS 服务商，用起来感觉还比较稳定，我记得好像是国人开的，有中文的界面，等我有空写篇推广。

用自己的 VPS 后，我仍然采用和虚拟主机一样的流程，利用免费的宝塔 Linux 面板来管理网站。写完文章后的一般流程就是，先用我本地的 Ubuntu 虚拟机编译网站，然后将生成的站点打包上传到我的服务器上解压出来。但是，我都已经有了自己的 VPS 了，同样是 Linux 系统，我何不直接在服务器上自动编译呢？这样就跟 Github Pages 差不多了，我认为还是相当不错的。正好还有 git hooks 这么有意思的东西，可以帮助我完成这件事情。

## 步骤

### 配置 Jekyll 环境

#### 首先我使用 RVM 来安装 ruby。

**安装 RVM**

```bash
gpg --keyserver hkp://keys.gnupg.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3 7D2BAF1CF37B13E2069D6956105BD0E739499BDB
```

```bash
\curl -sSL https://get.rvm.io | bash -s stable
```

**安装最新的 ruby 2.4.1**

启动 rvm 环境，rvm 安装完成后会有说明。

```bash
source /etc/profile.d/rvm.sh
rvm install ruby
```

**安装 Jekyll**

```bash
gem install jekyll
```

**关于其他插件**

我不想使用 bundler 来安装，反正只是我个人使用，所以我选择直接安装我的 Jekyll 模板所需的插件。你可以参考你模板中的 Gemfile 文件或 \_config.yml 文件中的 plugins。

下面是我这个博客所需的插件，可以参考。

```bash
gem install github-pages
gem install jekyll-github-metadata
gem install rouge
gem install jekyll-paginate
gem install jekyll-sitemap
gem install jekyll-feed
gem install jemoji
```

### 配置 git hooks

进入根目录并新建 Git 裸仓库。

```bash
cd ~
mkdir blog.git && cd blog.git
git init --bare
```

进入 hooks 文件夹，配置 git hooks 脚本。

```bash
cd hooks
vi post-receive
```

插入如下脚本(注意自行替换相应参数)

```bash
#!/bin/bash -l

# 仓库路径
GIT_REPO=$HOME/blog.git
# 代码暂存路径
TMP_GIT_CLONE=$HOME/tmp/git/blog
# 生成好的静态博客存放路径(以我的网站地址为例)
PUBLIC_WWW=/www/wwwroot/www.iszy.cc

git clone $GIT_REPO $TMP_GIT_CLONE
jekyll build --source $TMP_GIT_CLONE --destination $PUBLIC_WWW --incremental

rm -Rf $TMP_GIT_CLONE
exit
```

保存后为文件添加可执行权限。

```bash
chmod +x post-receive
```

### 本地配置

接下来就是为本地的仓库添加远程仓库地址(默认你已经有了本地仓库)。注意更改相应参数，如`username`、`ip`、`port`以及后面的 git 路径。

```bash
git remote add blog ssh://username@ip:port/root/blog.git
```

将`commit`推送到远程仓库。

```bash
git push blog master
```

## 后话

其实吧，我觉得现在这个情况还不够令人满意，我还需要在本地编辑完了，进行推送。我的理想情况是这样，最好能在我的 VPS 上做一个 panel，能够在线编辑我服务器上的 markdown 文件，然后通过自动化脚本对 Jekyll 进行编译。暂时还不知道怎样实现这个方案，我觉得是可行的，未来如果实现了，我再来补充。
