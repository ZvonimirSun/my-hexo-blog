---
title: 通过Subtree实现Hexo主题自定义配置的同步
date: 2020-03-09 11:08:09
updated: 2020-03-09 11:08:09
categories:
  - 技能
  - 博客
tags:
  - Hexo
  - NexT
keywords:
---

通常我们的 hexo 博客由于都是静态文本文件，比较适合用 git 来进行管理。不过主题我们一般都是用 git clone 直接拉代码的，但 git 无法直接管理子文件夹中的其他 git 项目，所以你会发现直接 add 代码是不会包含主题文件夹中的变化的。不过为了方便迁移，最好还是能够通过 git 管理整个博客文件，包括对主题文件的修改，同时为了便于更新主题也不能舍弃主题的 git。所以我们采用 `fork + subtree` 的方案来解决这个问题。

<!--more-->

## 方案

通过`fork + subtree`的方案来解决 hexo 主题配置同步的问题。

## 步骤

### Fork 主题项目并拉取到本地

首先呢就是 fork 了，fork 一下主题项目，然后你就获得了一个同名的，完全由你控制的主题项目。

比如说这个`NexT`，先访问[theme-next](https://github.com/theme-next/hexo-theme-next)页面，然后点下右上角的 Fork，这步就算完成了。然后把 Fork 出来的项目给拉取到本地，以备修改。

```shell
git clone https://github.com/example/hexo-theme-next.git
```

### 处理已有修改(选)

这一步是可选的。如果你想要重新进行配置，或是你的博客刚刚创建，还没有及进行主题配置，那这步可以跳过。

出于方便升级的目的，想必你应该不会删除主题目录的`.git`文件夹吧。首先先在已经修改过的主题目录执行下`git pull`，以把代码更新到最新，把 conflict 都处理一下，于是我们得到了保留修改的最新主题代码，就跟往常升级主题的处理方法一样。

然后，我们可以清空刚刚拉取到本地的 Fork 版主题项目(除了.git 文件夹)。把刚刚升级好的全部代码复制过来(除了.git 文件夹)。

执行一下`git status`，我们应该可以看到我们对主题做的所有更改。然后，我们就可以把修改后的主题代码 push 到远程仓库了。

```bash
git add .
git commit -m "update theme"
git push
```

### 通过 subtree 集成主题项目到站点项目里

首先，先删除`themes/next`文件夹，并将修改 push 到站点仓库。

```bash
rm -rf themes/next
git add .
git commit -m "delete theme next"
git push
```

然后绑定子项目，即修改后的主题项目。

```bash
git remote add -f next git@github.com:example/hexo-theme-next.git
git subtree add --prefix=themes/next next master --squash
```

如果不加 squash 参数，则子项目的 commit 记录都会加入到主项目中；加上 squash 参数则会把子项目的修改打包成一个 commit 加入到主项目中。

### 更新和修改子项目

从子项目进行更新，并推送给主项目

```bash
git fetch next master
git subtree pull --prefix=themes/next next master --squash
git push
```

将修改推送到子项目

```bash
git subtree push --prefix=themes/next next master
```

这样主项目就能和子项目保持同步更新，主题配置就不会丢失了。

## 迁移博客

当需要迁移博客的时候，只需要`git clone`你的主站点项目，然后执行以下语句。

```shell
git remote add -f next git@github.com:example/hexo-theme-next.git
```

接下来就可以像之前一样，用更新和修改子项目里的方法进行处理了。

## 更新主题

这样子处理后的主题该怎样进行更新呢？

先在主题子项目下拉取官方 theme-next 代码。

```bash
git pull https://github.com/example/hexo-theme-next.git
```

处理完 conflict 以后，push 到远程仓库，接着在主项目中更新下子项目即可。
