---
title: 在Ubuntu 16.04环境下使用ASF(v3)实现云挂卡
date: 2018-08-08 00:59:52
updated: 2018-08-08 00:59:52
tags:
  - Steam
  - ASF
  - Ubuntu
  - Linux
---

挂卡是什么，我再次就不赘述了。Steam 玩家估计都有所了解，还不清楚的可以谷歌一下。今天在此分享一下如何在在 Ubuntu 16.04 环境下使用 ArchiSteamFarm(v3)实现云挂卡，24 小时无人值守。

<!--more-->

## 环境

- 主机：腾讯云香港云主机 1 核 1G
- 系统：Ubuntu 16.04
- 软件版本：ArchiSteamFarm V3.2.0.5

## 教程

### 使用 root 权限

```shell
sudo su
```

### 安装.NET Core

#### 注册微软 key 和订阅源

```shell
wget -q https://packages.microsoft.com/config/ubuntu/16.04/packages-microsoft-prod.deb --no-check-certificate
sudo dpkg -i packages-microsoft-prod.deb
```

#### 安装.NET SDK

```shell
sudo apt install apt-transport-https
sudo apt update
sudo apt install dotnet-sdk-2.1
```

### 安装 ASF

#### 下载最新稳定版 ASF

建议选用`Pre-release`版本，`Pre-release`版本可能存在稳定性问题。

```shell
wget https://github.com/JustArchi/ArchiSteamFarm/releases/download/3.3.0.0/ASF-linux-x64.zip --no-check-certificate
```

在`/home`中创建`asf`文件夹

```bash
mkdir /home/asf && cd /home/asf
```

解压软件到该目录

```bash
unzip /root/ASF-linux-x64.zip
```

### 创建 bot 配置文件

这里只写最简单的配置，更多高级设置可以到[ASF web config](https://justarchi.github.io/ArchiSteamFarm/#/)上生成配置文件。

文件名字自取，这里我取名 test.json，所以这个 bot 的名称就叫 test。

```shell
vi /home/asf/config/test.json
```

输入以下内容并保存，注意替换为自己的 steam 用户名和密码。

```json
{
  "SteamLogin": "yourusername",
  "SteamPassword": "yourpassword",
  "Enabled": true
}
```

由于 asf 就是模拟一个 steam 平台进行游戏，你的好友将会看到你正在游戏的状态。想要让 steam 显示离线状态，可以将配置文件换成以下内容。

```json
{
  "SteamLogin": "yourusername",
  "SteamPassword": "yourpassword",
  "Enabled": true,
  "OnlineStatus": 0
}
```

### 运行

#### 赋予执行权限

```shell
chmod +x ArchiSteamFarm
```

#### 开始运行

```shell
./ArchiSteamFarm
```

如果正常运行，现在已经开始自动挂卡了。

### 保持后台运行

#### 方法一：Screen

安装 screen

```shell
apt install screen
```

创建一个名为 asf 的窗口，并在其中执行程序。

```shell
screen -S asf
cd /home/asf
./ArchiSteamFarm
```

按`Ctrl+A+D`搁置窗口，程序已经在后台运行了，可以放心退出终端了。

其他命令：

- 恢复 screen 窗口命令：`screen -r asf`
- 退出 screen 窗口：在窗口中，先按`Ctrl+A`，再按`K`，最后输入`y`确认。

#### 方法二：Systemd（推荐）

安装 systemd

```shell
apt install systemd
```

创建 service 文件

```shell
vi /etc/systemd/system/asf.service
```

输入以下内容并保存

```shell
[Unit]
Description=Archi Steam Farm
After=network.target

[Service]
Type=simple
User=root
EnvironmentFile=/etc/environment
Environment=""
ExecStart=/home/asf/ArchiSteamFarm
Restart=always
RestartSec=15s

[Install]
WantedBy=multi-user.target
```

现在可以运行了。

```shell
service asf start  # 开始运行挂卡
service asf stop   # 停止运行
service asf status # 查看服务状态
```

## 更多功能

### steam 两部验证

要知道，如果绑定了 steam 手机令牌的话，登录需要输入密钥，显然不可能在挂卡平台每次都手动输入密钥，这也太蠢了。那么我们就需要将令牌导入到 ASF 中，以实现自动登录。

各个平台操作不同，详情请见[官方 WIKI](https://github.com/JustArchi/ArchiSteamFarm/wiki/Two-factor-authentication)。我没有其他设备，这里就只说明以下安卓设备的方法。

#### 手机 root

首先，你需要有系统的 root 权限，这个不多说，每个设备都有所不同。

#### 提取令牌文件

安装一个能够访问系统根目录的文件管理器，如[ES 文件浏览器](https://play.google.com/store/apps/details?id=com.estrongs.android.pop)。

将文件`/data/data/com.valvesoftware.android.steam.community/files/Steamguard-XXX`复制出来，`XXX`是你的 SteamID。重命名为`BotName.maFile`并放置到`/home/asf/config`目录下，程序会自动检测并读取。如我的 bot 名字为 test，则重命名为`test.maFile`。

#### 提取设备 ID

将文件`/data/data/com.valvesoftware.android.steam.community/shared_prefs/steam.uuid.xml`打开，找到如`android:XXXXXXXXXXXXXXXX`字样，这就是你的设备 ID，注意保存。

#### 输入设备 ID

导入好令牌文件以后，首次启动，将会看到如下字样。

```log
[*] INFO: ImportAuthenticator() <1> Converting .maFile into ASF format...
<1> Please enter your Device ID (including "android:"):
```

这时输入你的设备 ID，连`android:`字样一起输入，回车。看到如下字样，表示你已经完成，以后启动就不再需要输入了，会自动登录。

```log
[*] INFO: ImportAuthenticator() <1> Successfully finished importing mobile authenticator!
```

#### 注意事项

**注意：为了你的 steam 账号安全，切勿暴露你的令牌文件和设备 ID。拥有这些内容，将能任意变更你的账户。**

### 启用 IPC

启用 IPC 将会提供 API 和图形化 GUI，可以远程进行控制。

编辑 ASF 配置文件

```shell
vi /home/asf/config/ASF.json
```

查找并修改相关内容如下

```shell
"IPC": true,
"IPCPassword": null,
"IPCPrefixes": [
    "http://127.0.0.1:1242/"
],
"SteamOwnerID": "你的64位id",
```

`IPCPassword`后改为你想要设置的密码，注意加双引号。`IPCPrefixes`设置为`127.0.0.1`，则只能本地访问；设置为`*`则可以从任意地址访问；可以设置多个监听地址，用逗号隔开。

### 用 Telegram 远程控制 ASF 挂卡

提供给有需求的人，要求主机上 python 版本至少为 3.6。

#### 向 Telegram 申请 bot token

在 Telegram 里，搜索`@BotFather`机器人并启用。

发送以下命令：

1. 创建机器人：`/newbot`
2. 设定 bot 名称：`ASF`(任取，可重复，这里只是个例子)
3. 设定 bot 用户名：`test_asf_bot`(任取，不可重复，这里只是个例子)

`@BotFather`会发给你一串 token，形如`123456789:XXXXXX-XXXXXXXXXX`，注意保留。

#### 申请 Chat ID

在 Telegram 里，搜索`@FalconGate_Bot`机器人并启用。

发送命令：`/get_my_id`

`@FalconGate_Bot`会发给你一串数字，即是你的 Chat ID。

#### 安装`telegram_bot_asf`

请确保 python 版本正确

```shell
git clone https://github.com/deluxghost/telegram-asf.git
cd telegram-asf
sudo pip3 install -r requirements.txt
```

编辑`bot.py`，修改如下内容。

```python
token = '123456789:XXXXXX-XXXXXXXXXX' # 之前获取的bot token
admin = '123456789' # 之前获取的Chat ID
ipc_address = 'http://127.0.0.1:1242/' #填写ASF的IPC监听地址
ipc_password = '' # 填写ASF的IPCPassword，留空表示没有密码
```

#### 后台启动 bot

```shell
screen -S bot
python3 bot.py
```

#### 在 Telegram 中使用这个 bot

搜索刚刚你设定的 bot 用户名，并启用，你已经可以发送命令远程控制 ASF 了。这个机器人只有你能使用。

**常见命令**：

帮助命令：`help`

![](https://img.iszy.xyz/20190318211533.png)

开始命令：`start`

![](https://img.iszy.xyz/20190318211546.png)

暂停命令：`pause`

![](https://img.iszy.xyz/20190318211557.png)

继续命令：`resume`

![](https://img.iszy.xyz/20190318211609.png)

查看状态命令：`status`

![](https://img.iszy.xyz/20190318211620.png)

![](https://img.iszy.xyz/20190318211633.png)

查看版本命令：`version`

![](https://img.iszy.xyz/20190318211805.png)

激活 steam 密钥命令：`redeem <key>`

![](https://img.iszy.xyz/20190318211831.png)

更多命令，请参[官方 WIKI](https://github.com/JustArchi/ArchiSteamFarm/wiki/Commands)。

## 后话

现在你已经成功搭建了云挂卡平台，尽情挂卡吧。
