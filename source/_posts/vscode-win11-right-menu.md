---
title: Win11添加通过VSCode打开到右键菜单
date: 2024-09-10 10:43:48
categories:
  - 技巧
tags:
  - Windows
  - VS Code
---

自Windows 11以来，传统右键菜单被折叠到二级菜单，使用起来不太方便，没法一键用VSCode打开了。我又比较喜欢现在的新菜单样式，不想改回老菜单。遂研究了下添加`通过VSCode打开`到右键菜单的方法。

<!--more-->

## 一、探索

其实我发现安装VSCode Insider版本，Win11右键菜单是有通过Code打开的内容的，不过稳定版本迟迟没有加上这个功能。

经过一番搜索，在VSCode的Github仓库找到了一个相关issue，[Windows 11 menu recommendation](https://github.com/microsoft/vscode/issues/183297)，2023年5月就已经打开了。

总的来说，就是官方暂时没有计划将这个功能添加到稳定版，因为根据[另外一个issue](https://github.com/microsoft/vscode/issues/164689)，如果资源管理器被占用，这个功能会阻塞VSCode的卸载。

不过微软还是专门有个仓库[vscode-explorer-command](https://github.com/microsoft/vscode-explorer-command)提供了这个功能，不过需要手动通过命令安装。

我在之前的issue评论区根据大佬的评论，成功地进行了安装。

## 二、安装

1. 从 [`https://github.com/microsoft/vscode-explorer-command/releases/`](https://github.com/microsoft/vscode-explorer-command/releases/) 获取最新的VSCode context menu插件发布版本。

   请确认下载了对应系统版本的文件(`code_explorer_<arch>.zip`)，比如我就需要`code_explorer_x64.zip`

   ![](https://img.iszy.xyz/1726803912716.png)

2. 在VSCode的安装目录下创建一个shell文件夹，把刚刚下载的`code_explorer_<arch>.zip`文件解压到这个shell文件夹。

   我这边是`C:\Users\<username>\AppData\Local\Programs\Microsoft VS Code\`

3. `code_explorer_<arch>.appx`实际上是个压缩包，通过7z或者其他压缩软件解压出来。

   现在的文件结构

   ```
   <vscode安装目录>
   |-bin/
   |-...
   |-shell/
   | |-[Content_Types].xml
   | |-AppxBlockMap.xml
   | |-AppxManifest.xml
   | |-code_explorer_command.dll
   | L-code_explorer_x64.appx
   |-...
   |-Code.exe
   L-...
   ```

4. 通过文本编辑器比如说就VSCode打开`<vscode安装目录>/shell/AppxManifest.xml`文件，找到如下内容并修改。

   ```
   Publisher="CN=Microsoft Corporation, O=Microsoft Corporation, L=Redmond, S=Washington, C=US"
   ```

   把两个`Microsoft Corporation`替换成任何内容，因为Windows禁止安装任何发布自微软的未经签名的内容。

   我这边直接改成了

   ```
   Publisher="CN=Unknown, O=Unknown, L=Unknown, S=Unknown, C=Unknown"
   ```

5. 打开注册表编辑器(`regedit.exe`)，在`HKEY_CURRENT_USER\Software\Classes`下新建项`VSCodeContextMenu`。

   如果需要为其他用户也启用，可以在`HKEY_LOCAL_MACHINE\Software\Classes`下创建。

6. 在刚刚创建的 `HKEY_CURRENT_USER\Software\Classes\VSCodeContextMenu` 下新建字符串值，名称为`Title`，数据为菜单里需要展示的内容，如 `通过 VSCode 打开`。

   ![](https://img.iszy.xyz/1726806485504.png)

7. 在`设置`-`系统`-`开发者选项`中打开`开发人员模式`以便从松散文件进行安装。

   ![](https://img.iszy.xyz/1726806649124.png)

8. 打开管理员权限的Powershell，进入`<vscode安装目录>/shell/`，执行以下命令，等待安装完成。

   ```pwsh
   Add-AppxPackage -Path "<vscode安装目录>/shell/AppxManifest.xml" -Register -ExternalLocation "<vscode安装目录>/shell/"
   ```

9. 装好后就可以关闭`开发人员模式`了。

10. 通过`任务管理器`重启`资源管理器(explorer.exe)`，现在右键应该可以看到`通过 VSCode打开`了。

## 三、卸载

如果需要卸载这个插件，可以运行如下命令找到插件全名，找到`PackageFullName`一项。

```pwsh
Get-AppxPackage Microsoft.VSCode
```

然后运行如下命令移除插件。

```pwsh
Remove-AppxPackage <PackageFullName>
```

卸载需要一段时间，完成后就可以重启资源管理器，删除先前添加的注册表项，shell文件夹了。
