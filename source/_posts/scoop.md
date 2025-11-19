---
title: 用Scoop包管理器管理你的Windows软件
date: 2019-06-12 10:00:00
updated: 2019-06-12 10:00:00
tags:
  - Scoop
  - PowerShell
---

用过 Linux 的都知道包管理器吧，不像 Windows 上装软件需要找官网下安装包安装、在控制面板中卸载，包管理器能够提供一种非常简洁的软件管理体验，一句命令安装、升级、卸载等，完全不需要操心。Scoop 作为一个包管理器，个人使用体验相当不错，在此推荐一下。

<!--more-->

## Scoop 优势

Scoop 作为一个包管理器，安装软件是其最重要的功能。先来看看，我以前是怎么做的。

最开始吧，我喜欢通过软件管家之类的软件进行软件管理，总的来说体验还不错。不过那是以前了，现在软件公司大多作恶，越来越不喜欢把功能独立出来，我就想弄个软件管理，非得让我装上整个全家桶，于是就被我抛弃了。然后，出于对国内互联网公司的不信任，我安装软件一定会找到官方网站下载最新的版本，这样子其实也还能接受，就是找软件有时候不是那么方便，且对于软件更新也不及时。后来吧，看到腾讯有个[腾讯软件中心的网页版](https://pc.qq.com/)，感觉还挺不错的，至少有些软件可以直接在这边找了，还不需要另外装个软件，就是注意不要点高速下载，那会下一个腾讯电脑管家下来，就比较烦。

除了找软件的问题，在安装软件上，现在很多软件有的会按照规范安装在`Program Files`这样的文件夹中，有的会安装在用户`AppData\Local\Programs`中，还喜欢在系统各处留下许多痕迹。虽说这样子还是比较规范的，但是我还是觉得比较乱。

当我遇到 Scoop 之后，就深深地喜欢上了这个软件。Scoop 是通过 PowerShell 进行软件管理的命令行工具，用 Scoop 进行软件管理:

- 安装卸载升级软件都只需要短短的一句话，支持批量操作。
- 软件统一安装在用户文件夹下的 scoop 目录中，不污染系统环境，文件结构清晰明了。亦可以根据需要修改路径。
- 默认为用户权限，不像 Chocolatey 那样永远需要管理员权限。
- 符合官方标准的软件卸载后不留下一丝痕迹。
- 每个软件通过一个 json 格式的 manifest 进行描述，可以查看软件安装的全部操作，更加安全。
- 自动配置环境变量，对开发软件很友好。

## Scoop 安装

官网: [https://scoop.sh/](https://scoop.sh/)

### 运行环境

首先先说下网络的问题，Scoop 软件的关键在于 git 和 **Github**，如果不能正常、流畅地访问 **Github**，使用起来将会是一种折磨，劝你看到这里就放弃吧。

Scoop 要求安装有 `PowerShell 5` 及以上(包括 `PowerShell Core`) 以及 `.NET Framework 4.5`及以上，所以 Windows 版本必须在 Win 7 及以上。

关于 PowerShell 版本，可以打开 PowerShell，输入如下语句查看:

```powershell
Get-Host | Select-Object Version
```

会返回类似如下字样，值大于 5.0 即可。

```
Version
-------
5.1.18362.145
```

在 Win 10 和 Windows Server 2016 中已经安装了 PowerShell 5.1，如果在使用 Win 7、Windows Server 2008 R2 或 Windows Server 2012 则需要升级，官方提供了升级安装包，[点击此处查看](https://docs.microsoft.com/en-us/powershell/scripting/install/installing-windows-powershell?view=powershell-6)。

### 安装

下面输入如下语句进行安装，来自 Scoop 官网。

运行如下语句允许本地脚本运行。

```powershell
set-executionpolicy remotesigned -scope currentuser
```

运行以下语句安装

```powershell
iex (new-object net.webclient).downloadstring('https://get.scoop.sh')
```

安装完成后，可以运行下`scoop help`尝试是否成功，这条命令会显示出 Scoop 的命令说明。

![20190612111652](https://img.iszy.cc/20190612111652.png)

## Scoop 使用

Scoop 有以下常用命令，我来简单介绍一下。

### 帮助

先说下 `help` 命令，由上文可以看到`scoop help`会列出所有命令的简单说明。

如果想了解一个具体命令的说明，以`update`为例，运行`scoop help update`即可，其他命令也与此类似。

![20190612112558](https://img.iszy.cc/20190612112558.png)

### 其他常用

| 命令      | 描述           | 示例                   |
| --------- | -------------- | ---------------------- |
| search    | 搜索软件       | scoop search chrome    |
| install   | 安装软件       | scoop install git curl |
| uninstall | 卸载软件       | scoop uninstall wget   |
| update    | 更新软件       | scoop update vscode    |
| list      | 列举已安装软件 | scoop list             |
| info      | 查看软件信息   | scoop info python      |

### 添加存储桶

Scoop 的每个应用都有一个 manifest，由一个个 manifest 组成的一个文件库就成为了一个存储桶，由 git 提供版本控制。Scoop 初始安装时会下载官方默认的 main 存储库。

Scoop 是由社区支撑的，可以提供的应用很多，但毕竟还是有限的，官方倾向于使用 portable 版本以提供无污染的软件体验，不是所有的软件都能符合官方的标准，于是就需要添加除了 main 存储桶以外的存储桶。

#### 环境需求

由于 Scoop 的存储桶本质上都是一个个 git 库，所以想要添加额外的存储库，需要有 git 环境支撑，输入`scoop install git`进行安装即可。

#### 添加存储桶

添加存储库的一般方法如下，以`extras`存储桶为例，`'scoop bucket add' + '存储桶名' + 'git 地址'`。

```
scoop bucket add extras https://github.com/lukesampson/scoop-extras.git
```

输入`scoop bucket known`就能查看官方已知的存储桶列表，如图所示。

![20190612123004](https://img.iszy.cc/20190612123004.png)

这些存储桶的添加命令可以简化，如以`extras`存储库为例，输入`scoop bucket add extras`即可。

![20190612123538](https://img.iszy.cc/20190612123538.png)

如果已知存储库中没有你需要的软件，你可以自己创建存储桶，自己来书写 manifest，当然也能添加其他人已经写好的库来用。

#### 推荐存储桶

1. 已知存储桶:

   - main(默认)
   - extras
   - versions
   - java

2. 大佬的存储桶:

   - Ash258: [https://github.com/Ash258/scoop-Ash258.git](https://github.com/Ash258/scoop-Ash258.git)

3. 我自己的存储桶:

   额，这个存储桶就只有几个我自己需要用的应用，如有需要可以看看。

   - iszy: [https://github.com/ZvonimirSun/scoop-iszy.git](https://github.com/ZvonimirSun/scoop-iszy.git)
