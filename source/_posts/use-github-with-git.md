---
title: 配合GitHub的Git使用
date: 2017-10-27 12:00:00
updated: 2017-10-27 12:00:00
categories:
  - Git
tags:
  - Git
  - Github
keywords: git,github
---

一直以来我都觉得 GitHub 是一个对于程序员来说极为有助的一个平台。最近在学校老是在编程，我把代码都放在了 GitHub 上，Git 作为一个分布式版本控制软件，就成为了我的电脑和 GitHub 之间的桥梁。十分惭愧，我对 Git 和 GitHub 的使用还只会基本的操作，今天我就来讲一下这些基本操作。

<!--more-->

## Git 简介

引用自维基百科-[git 词条](https://zh.wikipedia.org/wiki/Git)：

> git（/ɡɪt/）是一个分布式版本控制软件，最初由林纳斯·托瓦兹（Linus Torvalds）创作，于 2005 年以 GPL 发布。最初目的是为更好地管理 Linux 内核开发而设计。应注意的是，这与 GNU Interactive Tools（一个类似 Norton Commander 界面的文件管理器）有所不同。
> git 最初的开发动力来自于 BitKeeper 和 Monotone。git 最初只是作为一个可以被其他前端（比如 Cogito 或 Stgit）包装的后端而开发的，但后来 git 内核已经成熟到可以独立地用作版本控制。很多著名的软件都使用 git 进行版本控制，其中包括 Linux 内核、X.Org 服务器和 OLPC 内核等项目的开发流程。

## Git 下载地址

[https://git-scm.com/download](https://git-scm.com/download)

## 前期准备

1. 既然我们的标题说了是要配合 GitHub 使用的，那么在 GitHub 上建一个库是有必要的。具体的建库过程在这里就不细说了，相信大家不会在这里被难住。

2. 我们要通过 Git 和 GitHub 进行交互需要使用 ssh，我们需要在自己的电脑上生成 ssh-key 公钥，然后在 GitHub 上授权使用。

   1. 在任意文件夹中，右键点击使用 Git Bash，弹出命令行窗口。
   2. 输入`ssh-keygen -t rsa -C "你的GitHub账户邮箱"`，回车。
   3. 接下来让你给密钥文件取名，可以直接回车跳过。
   4. 然后让你输入访问时的密码，直接回车跳过即可。
   5. 这样将会在当前文件夹生成文件或者`C:\Users\你的用户名\.ssh`路径下，如果在当前路径，请复制到后者。
   6. 打开生成的`id_rsa.pub`文件，里面就是你的公钥。
   7. 复制文件内容，打开 GitHub，点击`setting`。
   8. 在`Personal setting`中选择`SSH and GPG keys`菜单。
   9. 选择`New SSH keys`，添加 SSH 记录。Title 可以随便取，在 Key 框里将刚刚复制的文件内容复制进去。然后选择`Add SSH key`。
   10. 在刚刚的命令窗口中输入`ssh -T git@github.com`，中间有任何提醒，通过就好。等到窗口出现`Hi ***! You've successfully authenticated...`字样，说明已经成功。

3. 接下来我们就要把我们创建的库复制到本地。
   1. 打开到你的目标文件夹，右键点击使用 Git Bash。
   2. 输入`git clone git@github.com:ZvonimirSun/test.git`命令（`clone`后的库地址要换成你自己的）。
   3. 至此基本完成任务。

## Git 常用命令

![](https://img.iszy.xyz/20190318220908.png)

### 新建代码库

```
# 在当前目录新建一个Git代码库
$ git init

# 新建一个目录，将其初始化为Git代码库
$ git init [project-name]

# 下载一个项目和它的整个代码历史
$ git clone [url]
```

### 配置

Git 的设置文件为`.gitconfig`，它可以在用户主目录下（全局配置），也可以在项目目录下（项目配置）。

```
# 显示当前的Git配置
$ git config --list

# 编辑Git配置文件
$ git config -e [--global]

# 设置提交代码时的用户信息
$ git config [--global] user.name "[name]"
$ git config [--global] user.email "[email address]"
```

### 增加/删除文件

```
# 添加指定文件到暂存区
$ git add [file1] [file2] ...

# 添加指定目录到暂存区，包括子目录
$ git add [dir]

# 添加当前目录的所有文件到暂存区
$ git add .

# 添加每个变化前，都会要求确认
# 对于同一个文件的多处变化，可以实现分次提交
$ git add -p

# 删除工作区文件，并且将这次删除放入暂存区
$ git rm [file1] [file2] ...

# 停止追踪指定文件，但该文件会保留在工作区
$ git rm --cached [file]

# 改名文件，并且将这个改名放入暂存区
$ git mv [file-original] [file-renamed]
```

### 代码提交

```
# 提交暂存区到仓库区
$ git commit -m [message]

# 提交暂存区的指定文件到仓库区
$ git commit [file1] [file2] ... -m [message]

# 提交工作区自上次commit之后的变化，直接到仓库区
$ git commit -a

# 提交时显示所有diff信息
$ git commit -v

# 使用一次新的commit，替代上一次提交
# 如果代码没有任何新变化，则用来改写上一次commit的提交信息
$ git commit --amend -m [message]

# 重做上一次commit，并包括指定文件的新变化
$ git commit --amend [file1] [file2] ...
```

### 分支

```
# 列出所有本地分支
$ git branch

# 列出所有远程分支
$ git branch -r

# 列出所有本地分支和远程分支
$ git branch -a

# 新建一个分支，但依然停留在当前分支
$ git branch [branch-name]

# 新建一个分支，并切换到该分支
$ git checkout -b [branch]

# 新建一个分支，指向指定commit
$ git branch [branch] [commit]

# 新建一个分支，与指定的远程分支建立追踪关系
$ git branch --track [branch] [remote-branch]

# 切换到指定分支，并更新工作区
$ git checkout [branch-name]

# 切换到上一个分支
$ git checkout -

# 建立追踪关系，在现有分支与指定的远程分支之间
$ git branch --set-upstream [branch] [remote-branch]

# 合并指定分支到当前分支
$ git merge [branch]

# 选择一个commit，合并进当前分支
$ git cherry-pick [commit]

# 删除分支
$ git branch -d [branch-name]

# 删除远程分支
$ git push origin --delete [branch-name]
$ git branch -dr [remote/branch]
```

### 标签

```
# 列出所有tag
$ git tag

# 新建一个tag在当前commit
$ git tag [tag]

# 新建一个tag在指定commit
$ git tag [tag] [commit]

# 删除本地tag
$ git tag -d [tag]

# 删除远程tag
$ git push origin :refs/tags/[tagName]

# 查看tag信息
$ git show [tag]

# 提交指定tag
$ git push [remote] [tag]

# 提交所有tag
$ git push [remote] --tags

# 新建一个分支，指向某个tag
$ git checkout -b [branch] [tag]
```

### 查看信息

```
# 显示有变更的文件
$ git status

# 显示当前分支的版本历史
$ git log

# 显示commit历史，以及每次commit发生变更的文件
$ git log --stat

# 搜索提交历史，根据关键词
$ git log -S [keyword]

# 显示某个commit之后的所有变动，每个commit占据一行
$ git log [tag] HEAD --pretty=format:%s

# 显示某个commit之后的所有变动，其"提交说明"必须符合搜索条件
$ git log [tag] HEAD --grep feature

# 显示某个文件的版本历史，包括文件改名
$ git log --follow [file]
$ git whatchanged [file]

# 显示指定文件相关的每一次diff
$ git log -p [file]

# 显示过去5次提交
$ git log -5 --pretty --oneline

# 显示所有提交过的用户，按提交次数排序
$ git shortlog -sn

# 显示指定文件是什么人在什么时间修改过
$ git blame [file]

# 显示暂存区和工作区的差异
$ git diff

# 显示暂存区和上一个commit的差异
$ git diff --cached [file]

# 显示工作区与当前分支最新commit之间的差异
$ git diff HEAD

# 显示两次提交之间的差异
$ git diff [first-branch]...[second-branch]

# 显示今天你写了多少行代码
$ git diff --shortstat "@{0 day ago}"

# 显示某次提交的元数据和内容变化
$ git show [commit]

# 显示某次提交发生变化的文件
$ git show --name-only [commit]

# 显示某次提交时，某个文件的内容
$ git show [commit]:[filename]

# 显示当前分支的最近几次提交
$ git reflog
```

### 远程同步

```
# 下载远程仓库的所有变动
$ git fetch [remote]

# 显示所有远程仓库
$ git remote -v

# 显示某个远程仓库的信息
$ git remote show [remote]

# 增加一个新的远程仓库，并命名
$ git remote add [shortname] [url]

# 取回远程仓库的变化，并与本地分支合并
$ git pull [remote] [branch]

# 上传本地指定分支到远程仓库
$ git push [remote] [branch]

# 强行推送当前分支到远程仓库，即使有冲突
$ git push [remote] --force

# 推送所有分支到远程仓库
$ git push [remote] --all

```

### 撤销

```
# 恢复暂存区的指定文件到工作区
$ git checkout [file]

# 恢复某个commit的指定文件到暂存区和工作区
$ git checkout [commit] [file]

# 恢复暂存区的所有文件到工作区
$ git checkout .

# 重置暂存区的指定文件，与上一次commit保持一致，但工作区不变
$ git reset [file]

# 重置暂存区与工作区，与上一次commit保持一致
$ git reset --hard

# 重置当前分支的指针为指定commit，同时重置暂存区，但工作区不变
$ git reset [commit]

# 重置当前分支的HEAD为指定commit，同时重置暂存区和工作区，与指定commit一致
$ git reset --hard [commit]

# 重置当前HEAD为指定commit，但保持暂存区和工作区不变
$ git reset --keep [commit]

# 新建一个commit，用来撤销指定commit
# 后者的所有变化都将被前者抵消，并且应用到当前分支
$ git revert [commit]

# 暂时将未提交的变化移除，稍后再移入
$ git stash
$ git stash pop
```

### 其他

```
# 生成一个可供发布的压缩包
$ git archive
```

#### 参考链接

> [基于 github 的 git 使用方法](http://www.jianshu.com/p/3d33bcac54e7) > [常用 Git 命令清单](http://www.ruanyifeng.com/blog/2015/12/git-cheat-sheet.html)
