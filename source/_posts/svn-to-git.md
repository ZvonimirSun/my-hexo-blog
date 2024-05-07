---
title: SVN迁移至GIT，并附带历史提交记录
date: 2024-05-07 11:42:45
categories:
  - 技巧
tags:
  - Git
  - SVN
---

随着信息工程的多元化发展，Git 逐渐取代 SVN 成为主流的版本管理工具。为了将项目迁移到 Git，且不丢失修改历史，特此调研实现方案。

<!--more-->

## 一、准备工作

在本地安装以下软件：

- [Git](https://git-for-windows.github.io/)
- [Subversion](https://subversion.apache.org/packages.html)
- [git-svn 实用工具](https://www.kernel.org/pub/software/scm/git/docs/git-svn.html) (Win 版 Git 已包含)

## 二、将源 SVN 存储库转换为本地 Git 存储库

### 1. 检索所有 Subversion 作者的列表

从本地 Subversion 签出根目录提取所有 SVN 用户的列表，在 PowerShell 中运行以下命令。

```shell
svn.exe log --quiet | ? { $_ -notlike '-*' } | % { "{0} = {0} <{0}>" -f ($_ -split ' \| ')[1] } | Select-Object -Unique | Sort-Object | Out-File 'authors-transform.txt' -Encoding utf8NoBOM
```

此命令将检索所有日志消息、提取用户名、消除任何重复用户名、对用户名进行排序，并将其放入 UTF-8 格式的 `authors-transform.txt` 文件中。

Subversion 仅使用每次提交的用户名，而 Git 存储真实姓名和电子邮件地址。 默认情况下，git-svn 工具将在作者和电子邮件字段中列出 SVN 用户名。 但是，可以为 SVN 用户创建映射文件及其相应的 Git 名称和电子邮件。

如有需要，可以编辑文件中的每一行，以创建 SVN 用户到格式正确的 Git 用户的映射。 例如，可将 `jamal = jamal <jamal>` 映射到 `jamal = Jamal Hartnett <jamal@fabrikam-fiber.com>`。

### 2. 使用 git-svn 克隆 Subversion 存储库

以下命令将使用在上一步中创建的 `authors-transform.txt` 文件执行标准 git-svn 转换。 它将 Git 存储库放置在本地计算机的 c:\mytempdir 文件夹中。此处可以使用相对路径。

```shell
git svn clone ["SVN repo URL"] --prefix=svn/ --no-metadata --authors-file "authors-transform.txt" --stdlayout c:\mytempdir
```

> 备注
>
> `--prefix=svn/` 是必需的，否则工具无法从导入的修订中判断 SVN 修订。 建议设置一个前缀（带有尾部斜杠），原因是因为 SVN 跟踪引用将位于 refs/remotes/$prefix/，这与 Git 自己的远程跟踪分支布局 (refs/remotes/$remote/) 兼容。
>
> 如果要跟踪共享通用存储库的多个项目，设置前缀也很有用。 默认情况下，前缀设置为 origin/。

如果使用标准 trunk、分支、标记布局，只需使用 `--stdlayout`。

![标准布局](https://img.iszy.xyz/1715063051410.png)

但是，如果使用的是其他布局，则可能需要传递 `--trunk`、`--branches` 和 `--tags` 来找到具体是什么。 例如，如果存储库结构为 `trunk/companydir`，并且对存储库使用的是分支而不是 trunk，则可能需要使用 `--trunk=trunk/companydir --branches=branches`。

```shell
git svn clone ["SVN repo URL"] --prefix=svn/ --no-metadata --trunk=/trunk --branches=/branches --tags=/tags  --authors-file "authors-transform.txt" c:\mytempdir
```

如果 svn 仓库需要密码验证，可以传递 `--username` 来指定用户名。

更多参数可以访问[git-svn 文档](https://git-scm.com/docs/git-svn)。

#### 举例

这里举一个例子，我这边的项目，项目结构就不太规范，甚至没有 branches 和 tags，根目录就是 trunk，需要用户名密码验证。命令如下：

```shell
git svn clone ["SVN repo URL"] --prefix=svn/ --no-metadata --trunk=/ --authors-file "authors-transform.txt" --username=jamal mytempdir
```

完成以后在本地查看生成的仓库分支信息，就类似于这样，原来的分支都会挂在 svn 这个远程下，本地 main 分支即为原来的 trunk 内容。

![](https://img.iszy.xyz/1715064038320.png)

## 三、将存储库推送到空 Git 存储库

现在创建一个空的 Git 存储库，这步就不多说了。

将新的远程仓库信息添加到本地 Git 仓库，将分支推送到远程。

```shell
git remote add origin ["Git repo URL"]
git push --set-upstream origin --all
git push --set-upstream origin --tags
```
