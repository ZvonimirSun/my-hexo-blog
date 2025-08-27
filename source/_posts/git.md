---
title: Git实用技巧
date: 2022-11-10 17:28:50
updated: 2022-11-10 17:28:50
tags:
  - git
---

Git 官方文档: [https://git-scm.com/docs](https://git-scm.com/docs)

<!--more-->

## 一、基本操作

### 1. 新建 git 仓库

```shell
git init
```

![](https://img.iszy.xyz/1669185106451.png)

```shell
git init -b main
```

```shell
git config --global init.defaultBranch main
```

```shell
git branch -m main
```

### 2. 克隆远程仓库

```shell
git clone http://git.example.com/someone/test.git
```

```shell
git clone http://git.example.com/someone/test.git test
```

```shell
git clone http://git.example.com/someone/test.git --depth=1 -b main
```

### 3. 提交代码

```shell
git add -a
```

```shell
git add -u
```

```shell
git add .
```

```shell
git commit
```

```shell
git commit -m "first commit"
```

```shell
git commit -am "first commit"
```

### 4. 查看仓库状态

```shell
git status
```

![](https://img.iszy.xyz/1669185760241.png)

```shell
git status -s
```

![](https://img.iszy.xyz/1669185789446.png)

### 5. 查看提交历史

[https://git-scm.com/docs/git-log](https://git-scm.com/docs/git-log)

```shell
git log
```

![](https://img.iszy.xyz/1669185798311.png)

### 6. 新建分支

```shell
git branch test
```

```shell
git checkout test
```

```shell
git checkout -b test
```

![](https://img.iszy.xyz/1669185814401.png)

### 7. 合并分支

```shell
git checkout main
git merge test
```

![](https://img.iszy.xyz/1669185829746.png)

### 8. 删除分支

```shell
git branch -d test-not-need
```

![](https://img.iszy.xyz/1669185836945.png)

### 9. 合并冲突

![](https://img.iszy.xyz/1669185846981.png)

当两个分支都对同一行进行了修改，git 便会产生冲突，并标记为未合并

![](https://img.iszy.xyz/1669185854676.png)

此时将每个文件进行修改，确认最后的内容，使用 git add 方法标记为冲突已解决

```shell
git add .\A.txt
```

在所有文件的冲突均已解决后，使用 commit 提交此次修改。

![](https://img.iszy.xyz/1669185864622.png)

```shell
git merge --abort
```

### 10. 远程仓库

```shell
git remote
```

默认应该为空

```shell
git remote add origin http://git.example.com/someone/test.git
```

```shell
git push origin main
```

```shell
git fetch --all
```

```shell
git fetch origin
```

```shell
git branch --set-upstream-to=origin/main main
git branch -u origin/main main
```

![](https://img.iszy.xyz/1669186022128.png)

```shell
git push -u origin main
```

```shell
git pull
```

```shell
git pull origin main
```

## 二、常见技巧

### 1. 临时保存成果

```shell
git stash
```

![](https://img.iszy.xyz/1669186037294.png)

```shell
git stash pop
```

![](https://img.iszy.xyz/1669186045214.png)

### 2. 合并分支灵活选择 rebase/merge

```shell
git merge test
```

```shell
git rebase test
```

![](https://img.iszy.xyz/1669186058175.png)

### 3. cherry-pick

适合 hotfix

```shell
git cherry-pick 12d654f1d701cbf7cd9abb98ce84eeef460a24a7
```

![](https://img.iszy.xyz/1669186102974.png)

![](https://img.iszy.xyz/1669186072778.png)

### 4. 修改上次提交

```shell
git commit --amend
```

会同时提交暂存的文件

### 5. 取消文件修改

```shell
git checkout .\C.txt
```

![](https://img.iszy.xyz/1669186116701.png)

### 6. 弃用提交

```shell
# 保留文件
git reset --soft 12d654f1d701cbf7cd9abb98ce84eeef460a24a7

# 丢弃修改
git reset --hard 12d654f1d701cbf7cd9abb98ce84eeef460a24a7
```

### 7. 补丁文件

```shell
git diff [file] > a.patch
git apply a.patch
```
