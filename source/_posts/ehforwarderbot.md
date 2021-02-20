---
title: 使用telegram来收发微信消息
date: 2018-09-18 14:10:09
updated: 2018-12-18 14:46:09
categories:
  - 技能
  - 应用部署
  - Linux
tags:
  - 微信
  - Telegram
  - EH Forwarder Bot
  - Python
---

我一直非常喜欢使用 telegram，我个人觉得这是最好用的社交聊天工具。微信，我就用的少很多了，但是有时候说不得还是要用一下的。今天发现了[EH Forwarder Bot](https://github.com/blueset/ehForwarderBot)这个好东西，可以用来在 telegram 上收发微信消息，当真是神奇。我马上决定来折腾一下。

<!--more-->

## 前期准备

### 首要条件

1. 你需要有一个能翻墙的服务器
2. 你需要有一个 telegram 账号
3. 你需要有一个微信账号

差不多就是这样了。

顺便我的系统是`Ubuntu 18.04`，仅供参考。

### 可能存在的问题

1. 这个 bot 其实是对微信网页版的一个封装，或许可能会被封微信网页版。我也不清楚，网上是这么说的来着，要做好心理准备。
2. 虽然可能初始配置比较麻烦，但是想到之后就能用美腻的 tg 来用微信就很期待了。
3. 由于是基于网页版微信，手机上的微信还不能关，但是由于微信支持在网页版微信登录的时候关闭手机上通知，所以还行吧。
4. 需要自行将消息分类，不然会所有消息堆在一起。

## 安装依赖

### 安装 python3 & pip3

```shell
apt install python3-pip python3-dev python3-setuptools libtiff5-dev libjpeg8-dev zlib1g-dev libfreetype6-dev liblcms2-dev libwebp-dev tcl8.5-dev tk8.5-dev libmagic-dev ffmpeg -y
```

### 安装 EH Forwarder Bot

```shell
pip3 install ehforwarderbot
pip3 install efb-telegram-master
pip3 install efb-wechat-slave
```

## 配置

### 配置 telegram

#### 创建 bot

搜索`botfather`，注意是图中圈出的，不要找错了。

![](https://img.iszy.xyz/20190318212915.png)

然后发送`/newbot`，开始创建 bot。

![](https://img.iszy.xyz/20190318212925.png)

如图所示，发过`/newbot`以后，先发送 bot 的名称，类似于昵称，可以重复。再发送用户名，用户名需要唯一。顺序注意不要搞错。当然左边也有说明，照着说明来一般没有问题。

结束后，就会把你的 http api 给你，注意保存。

#### 配置 bot

继续在`botfather`中进行。

1. 输入`/setprivacy`，选择你创建的 bot，选择`Disable`
2. 输入`/setjoingroups`，选择你创建的 bot，选择`Enable`
3. 输入`/setcommands`，选择你创建的 bot，输入以下内容：

```
link - 将会话绑定到 Telegram 群组
chat - 生成会话头
recog - 回复语音消息以进行识别
extra - 获取更多功能
```

![](https://img.iszy.xyz/20190318212939.png)

![](https://img.iszy.xyz/20190318212953.png)

![](https://img.iszy.xyz/20190318213004.png)

#### 获取个人 chat id

搜索`get_id_bot`，同样是图中圈出的。

![](https://img.iszy.xyz/20190318213016.png)

发送`/start`即可获取自己的 chat id，留作后用。

![](https://img.iszy.xyz/20190318213029.png)

### 配置 EH Forwarder Bot

2.0 版本的 EH Forwarder Bot 需要自行创建配置文件。

#### 创建配置文件

输入以下命令创建并编辑配置文件，路径可能不存在，需要另外创建。

```shell
vi ~/.ehforwarderbot/profiles/default/config.yaml
```

输入以下内容并保存。

```yml
master_channel: "blueset.telegram"
slave_channels:
  - "blueset.wechat"
```

#### 创建主端配置

输入以下命令创建并编辑主端配置文件。

```shell
vi ~/.ehforwarderbot/profiles/default/blueset.telegram/config.yaml
```

输入以下内容并保存，`token`后替换为之前在`botfather`处获得的 http api，`admins`后面替换成`get_id_bot`处查询到的个人 id。

```yml
token: "88888888:dGDe890Pml9lmp9PO9j9pJ9Pn9NMPO0nnki"
admins:
  - 88888888
```

## 运行

### 二维码扫描登录

首先需要登录一次，以得到相关文件。输入以下内容启动：

```
ehforwarderbot
```

终端上将会显示出一个二维码，使用手机微信扫一扫确认登陆。可以看到很快就会登陆成功，手机微信里也会显示网页微信已登录。

按下`ctrl+c`终止程序。

### 守护进程

守护进程肯定是需要的，总不能一直开着终端窗口吧。

创建 service 配置文件。

```
vi /etc/systemd/system/ehforwarderbot.service
```

输入以下内容并保存。

```
[Unit]
Description=EH Forwarder Bot instance
After=network.target
Wants=network.target
Documentation=https://github.com/blueset/ehForwarderBot

[Service]
Type=simple
Environment='EFB_PROFILE=/root/.ehforwarderbot/profiles/default/' 'LANG=en_US.UTF-8' 'PYTHONIOENCODING=utf_8' 'EFB_DATA_PATH=/root'
ExecStart=/usr/local/bin/ehforwarderbot --verbose --profile=${EFB_PROFILE}
Restart=on-abort
KillSignal=SIGINT
StandardOutput=journal+file:/var/log/efb.debug
StardardError=journal+file:/var/log/efb.error

[Install]
WantedBy=multi-user.target
Alias=efb
Alias=ehforwarderbot
```

`ExecStart`后的地址可能不同，可以输入`which ehforwarderbot`来查看你的地址进行替换。

接下来即可使用以下 service 操作。

- `service ehforwarderbot start`: 启动
- `service ehforwarderbot status`: 查看状态
- `service ehforwarderbot stop`: 停止

## 使用

### 添加 bot

添加刚刚创建的 bot，这个应该都明白吧。

### 常见命令

说明一下，后面的联系人参数是模糊查询，会列出找出的联系人并进行下一步操作。联系人包括人、群组、公众号。

- `/chat 联系人`：聊天
- `/link 联系人`：可以进行多种操作，将联系人消息绑定到某个群组，或者设置该联系人免打扰。再次运行可重新绑定或取消免打扰。

其他的可以查看参考文档研究研究。

### 消息分组

不能让所有消息都发到 bot 里吧，那也太乱了，所以需要对消息进行分组。

我讲一下将公众号消息全部分组到一个群里的过程。

1. 首先创建一个群组，似乎创建群组必须拉一个其他人的样子，我是自己有个小号，拉进去创建了群，再踢掉。
2. 进入你刚刚创建的 bot，输入`/link 联系人`，选择`绑定`，在弹出的窗口中选择你刚刚创建的群组，bot 将被加入那个群组，以后该联系人的消息将会发送到那个群组中。
3. 多个联系人可以绑定到一个群组中，重复进行第 2 步，即可将公众号都分组到一个群组里。

注意：

1. 当群组只绑定了一个群组时，直接发消息就是回复该联系人。可以用于绑定单个人或群组。
2. 当群组绑定了多个群组时，我没有试过直接回复会发生什么情况，或许需要使用`/chat`命令。我觉得一般用于绑定一堆不需要回复的公众号之类。
3. 这个程序仅支持网页版微信支持的消息类型，可能会有部分消息接收不正常，被网页微信截断的情况，会提醒你去移动端查看。

### 使用技巧（转）

> 原文链接：[Efb 的一些小技巧](https://meta.appinn.com/t/efb/3329)

1. 微信端退出后，可以在`Telegram Bot`里直接重新登录，但需要第二块屏幕来扫码二维码。
2. 可以将所有公众号绑定到一个`Group`里
3. 可以防止微信的撤回功能
4. 微信客户端可设置手机静音功能，即开启`EFB`的时候，微信不发送通知
5. 可以绑定「文件传输助手」，名称是`File Helper`
6. 使用`/link 李三`来绑定李三至`Group`
7. 使用`/info`来查看当前`Group`状态
8. 建议使用与微信相同的联系人头像，且为`Group`命名为`李三.WeChat`以便区分
9. Telegram 的贴纸、GIF 可以直接发往微信，微信可正常显示
10. 微信发来的表情、图片、视频等媒体文件，多数可正常显示，有部分有版权的表情无法显示，取决于微信网页端
11. 红包、语音提醒、位置等功能取决于微信网页端功能（目前 EFB 框架尚无计划支持朋友圈类社交功能和语音/视频通话）
12. 在单独绑定的会话中，指定回复一条消息可以在微信中同样引用。（仅适用于文本消息）
13. `Group`中除了添加`bot`，还能添加`Telegram`联系人，此时该`Telegram`联系人可以扮演老大哥的节奏，可以观察微信聊天，但微信端无法收到该联系人在`Group`中的消息
14. `EFB`可以实现微信聊天记录的无限制保存与漫游功能，此后，再也无需备份微信聊天内容，`Telegram`都帮你保存了。包括语音、视频、文件、位置、分享链接、甚至撤回提示。
15. `Telegram Inline Bot`生成的（已兼容格式的）内容可以直接发送到微信。
16. 手机微信上的未读数不会自动减少。

## 后话

我使用微信频率不高，一般也就看看公众号，觉得用着还是非常舒适的，请看官们自行斟酌自己的使用情况。喜欢折腾的也可以自己配置着玩玩，挺有意思的。有点期待，未来会不会也能用 tg 来收发 QQ 消息呢？
