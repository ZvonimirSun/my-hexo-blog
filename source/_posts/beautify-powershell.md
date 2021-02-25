---
title: Powershell 美化——oh-my-posh
date: 2018-05-06 12:00:00
updated: 2019-08-14 00:00:06
categories:
  - 其他
tags:
  - Scoop
  - PowerShell
keywords: powershell, oh-my-posh,scoop
---

为什么想到干这个事呢？这两天装了 WSL，但是 PowerShell 的配色实在让我无法忍受，有时候甚至到了看不清字的程度。经过一番谷歌，我发现 PowerShell 也是可以变得很好看的。下面我就记录一下我这次美化的过程。

<!--more-->

## 安装包管理器`scoop`

`scoop`是 Windows 中超级好用的一个包管理器，许多软件可以通过这个包管理器直接傻瓜式安装，连环境变量也会自动配置好。可以类比 Linux 中的`yum`或者`apt`，用习惯了会爱不释手的，非常推荐。

### 更改脚本执行策略

如果你没有打开运行远程签名的脚本文件则会提示你输入下面的指令：

```powershell
Set-ExecutionPolicy RemoteSigned -scope CurrentUser
```

### 安装`scoop`

```powershell
iex (new-object net.webclient).downloadstring('https://get.scoop.sh')
```

## 安装需要的软件

### 安装`concfg`

[lukesampson/concfg](https://github.com/lukesampson/concfg)  可以用来导入和导出 Windows 控制台的设置。

```powershell
scoop install concfg
```

如果需要卸载可以输入`scoop uninstall concfg`。

### 安装`git`

```powershell
scoop install git
```

此时，`git`的环境变量是设置在当前用户下的。如果需要设置在系统下，可以通过以下语句安装。需要使用`sudo`来提升权限，是的，就是`Linux`中的那个`sudo`。

```powershell
scoop install sudo
sudo scoop install -g git
```

### 安装`posh-git`

`posh-git` 是 `oh-my-posh` 的依赖，在`scoop`的`extras`包中。

先添加名为`extras`的`bucket`。

```powershell
scoop bucket add extras
```

安装`posh-git`

```powershell
scoop install posh-git
```

### 安装`oh-my-posh`

`oh-my-posh`在`scoop`的主包中，直接安装即可。这个软件能够让你的`PowerShell`有着接近`Linux`中`Oh-my-zsh`的效果。

```powershell
scoop install oh-my-posh
```

## 添加字体

### 下载并安装字体

系统中默认的字体缺失了一些`oh-my-posh`需要用到的字符，所以需要安装一个可以支持的字体。

我选择 **sarasa gothic** 系列字体，可以在 [**sarasa gothic**](https://github.com/be5invis/Sarasa-Gothic/releases) 下载，然后右键安装字体即可。

### 修改注册表

为了能够在配置里使用，还需要修改注册表。

按 `WIN+R` 打开运行，输入 `regedit` 打开注册表编辑器。

在 `HKEY_LOCAL_MACHINE >> SOFTWARE >> Microsoft >> Windows NT >> CurrentVersion >> Console >> TrueTypeFont` 路径下新增一个字符串项目，名称任意，内容为 `Sarasa Term SC`。

## 应用配置

新建一个 `1.json` 文件，键入如下内容，也可以根据自身需求自行修改。

```json
{
  "cursor_size": "small",
  "command_history_length": 500,
  "num_history_buffers": 4,
  "command_history_no_duplication": false,
  "quick_edit": true,
  "insert_mode": true,
  "load_console_IME": true,
  "font_face": "Sarasa Term SC",
  "font_true_type": true,
  "font_size": "0x18",
  "font_weight": 0,
  "screen_buffer_size": "120x30000",
  "window_size": "120x30",
  "fullscreen": false,
  "popup_colors": "cyan,white",
  "screen_colors": "white,black",
  "black": "#1E1E1E",
  "dark_blue": "#2472C8",
  "dark_green": "#0DBC79",
  "dark_cyan": "#11A8CD",
  "dark_red": "#CD3131",
  "dark_magenta": "#BC3FBC",
  "dark_yellow": "#E5E510",
  "gray": "#E5E5E5",
  "dark_gray": "#666666",
  "blue": "#3B8EEA",
  "green": "#23D18B",
  "cyan": "#29B8DB",
  "red": "#F14C4C",
  "magenta": "#D670D6",
  "yellow": "#F5F543",
  "white": "#E5E5E5"
}
```

在所在文件夹处打开 `PowerShell`，输入 `concfg import 1.json -n` 后开启新 `PowerShell` 窗口可以看到显示效果已经改变。

**注：**使用过程中发现，更新`git`后，字体会出现问题，不知道是什么原因。出现这个问题也不用担心，只需要重新执行一遍上面这个应用配置的过程即可。

## 启用`oh-my-posh`

启用`oh-my-posh`

```powershell
Import-Module oh-my-posh
```

但这还只是手动启用，所以我们需要设置`profile`文件让它自动启用。

敲`$profile`可以让 PowerShell 告诉我们这个文件的路径是什么。

编辑该文件，如果不存在则手动创建，再其中输入

```powershell
Import-Module oh-my-posh
```

以后，都将会自动启用 `oh-my-posh`。

### 设置主题

我选择了 `Agnoster` 主题。

输入如下命令

```powershell
Set-Theme Agnoster
```

显示效果如下，我认为是十分美观的。

![](https://img.iszy.xyz/20190318211904.png)

其他可选主题有 `Agnoster`、`Avit`、`Darkblood`、`Fish`、`Honukai`、`Paradox`、`Sorin`、`tehrob`，可自行选择。

不知为何，这个主题设置并没有自动保存。

可以通过把`Set-Theme Agnoster`这样的命令添加到之前的`profile`最后来永久保留。

## 后话

至此，美化完成，相比之前的蓝底 PowerShell，我自认为已经好看了很多。我在 WSL 里也安装了 oh-my-zsh 可以说是完美衔接了。
