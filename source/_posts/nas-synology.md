---
title: 折腾的尽头是群晖，终究还是把家里NAS换成群晖了
date: 2024-03-23 23:17:35
categories:
  - 折腾
tags:
  - 群晖
  - Nas
---

大家都说折腾的尽头是群晖，以前我不相信，折腾来折腾去，终究还是上了个群晖 DS1821+。

<!-- more -->

## 为什么用 Nas

个人需求

- 收纳数据
- 家庭影院
- 多端数据同步
- 允许开源服务

刚开始将服务搭建在欧洲的大盘云服务器上，不过访问速度不太能接受。换到国内的服务器上，随着服务的增多，对云服务器的性能和内存要求也越来越大。这时候我就开始寻求一种能够存储大量数据，方便访问，还能运行各种开源服务的方案。

Nas 作为文件存储服务器本身能够存储大量的数据，和网盘相比，同样的存储容量性价比高太多，不需要开会员，凭着千兆宽带附带的上传带宽，使用体验也完全足够，家用宽带也不用担心云服务器高额的网络费用，如果内网访问速度更是可以直接拉满。无论是自己搭建 Nas 还是成品 Nas，运行一些负载不会太高的个人服务，性能都绰绰有余，加内存的成本也完全可以接受。

总结一下

- 相比网盘
  - 存储容量大
  - 访问速度快
  - 不需要会员
- 相比云服务器
  - 性能成本低
  - 存储成本低

## 折腾之路

### TrueNas Core

一开始，我经过了一些调研，看到了翼王的视频，[【翼王】DIY 一台高性能的 MINI ITX 文件服务器，还要能使用万兆网络-哔哩哔哩](https://b23.tv/ZlVlpGE)，我决定使用类似配置自己搭建一个 Nas 出来。

在淘宝搜索相关配件的时候，找到了一个叫做优易的店，根据我的配置，人家能给出现成的整机，那我还整啥，直接上了，微调了下配置，内存干到 32G ECC，使用最新的 TrueNas Core 系统。然后在闲鱼上整了两块万兆网卡，将电脑和 Nas 通过光纤直连。

看过我先前文章的朋友可能知道，后面我使用 TrueNas 系统一直不是很满意。也是我能力有限，不知道哪里配置存在问题，5 块盘组了 RAIDZ，32G 内存，还加了 NVME 的固态作为缓存，但是读写速度一直不算很高，远远达不到万兆的水平。

另外就是我原来了解不到位，当我发现我想增加硬盘的时候，我现有的配置根本没法增加，只能增加新的存储池。

最后就是这个 TrueNas Core 系统里面，他基于 FreeBSD，稳定是稳定，不过我对这个很不熟悉，而且不支持 Docker，让我这个 Docker 狂魔非常难受，自带的容器用起来非常难受。当然后面 TrueNas Scale 换成 Linux 内核了，原生支持 Docker 了，但是毕竟版本还比较早期，而且 Docker 的可视化使用体验也是一言难尽。

### Unraid

然后就轮到 Unraid 了，这个是我在看 LTT 视频的时候看到的，当时对这个好玩的系统很感兴趣。这个系统的一个很大的特点就是不做 RAID，就算盘坏了，也就损失那个盘的数据，而且也可以通过校验盘的方式来保障数据的安全。我比较喜欢的一点就是，这个系统的各种信息都非常简介明了，操作简单，而且对 Docker 的支持上做的不错。正好赶上我想要更新换代台式电脑，Nas 也跟着换了。

换上了新的银欣 CS381 机箱，换上了从台式机上淘汰的 3600，换上了以前闲置的 450W 海盗船电源。甚至还新买了一块华硕 TUF Gaming B550M-Plus WIFI 版主板，得益于 AMD 对 ECC 内存的支持，我能够直接用上老 Nas 的 32G ECC 内存。为了安静，连机箱风扇和 CPU 散热都用的猫扇。

硬盘上我又增加了两块机械，上到了 7 块。还增加了两块致钛 1TB 的 SSD 来做缓存。原来的光口万兆模块换成了两个电口万兆模块，通过网线连到了新上的 4 口 2.5G + 2 口 10G 的威联通交换机上。

为了实现硬解，还上了一块 Nvidia T600 显卡，用来解码。

使用起来还是比较舒服的，我用 Seafile 实现了我多平台数据的同步，还将服务器上的部分服务逐步迁移到了 Nas 上。得益于 Docker，我甚至不需要做什么配置，即能完成迁移。由于使用的是 3600，主频不低，我甚至在服务器上起了 Palworld 游戏服务器。

不过不知道是我装系统的 U 盘原因，Unraid 在升级系统后总有几率出现奇怪问题，让我心惊胆战，中间也有出现过丢失配置的问题。后面起了游戏服务器，由于这个 Palworld 本身内存压力比较大，可能对服务器产生了未知的影响，出现了多次远程连不上，系统无响应，只能重启解决。重启后，我也找不到在哪里能看到先前出现问题的日志，让我对这个系统失去了信心。

### 群晖

终于我觉得吧，Nas 这个东西啊，还是稳定最重要，其他的嘛，咱也能妥协妥协，说实话，我这个需求也不是太高，之前的配置完完全全过剩了嘛，要不搞个大厂的成品 Nas 算球了。

那么首先就想到群晖了，当然中间也对比了一下威联通、绿联、华为、Asus 子品牌的一些 Nas 产品。在功能扩展性、系统易用性以及使用广泛性的综合考虑下，还是选择群晖了。咱已经那么多个盘了，只好上 8 盘位了，这就是 DS1821+ 了。

更低配置，首先是硬盘位不够，然后就是没有 PCI-E 口进行扩展，以及 M.2 位做缓存。更高的配置，比如 DS1823xs+，虽然说直接自带万兆口，不用再进行扩展，是最佳的选择，奈何价格实在太高，没能忍下心。DS1821+ 的原价我其实也不太能接受，好在在闲鱼有价格优惠不少的特别产品，内存加到 32G，八千多，比官方便宜太多。特别的，这个只能用类似笔记本内存的那种插槽，我原来的内存条不能用了，大为心痛。

唯一的 PCI-E 位置，通过 x8 转 x16 的转接卡接了显卡了。群晖支持 4 网口的链路聚合，网速还算凑合，暂时不准备上万兆网卡了。欸，其实我这个威联通交换机不支持 IEEE 802.3ad，所以不支持真的链路聚合，现在只能说是负载均衡，这个后面再看看怎么搞。

群晖 DS1821+ 的这颗 CPU 说实话，性能还是比较出乎我的意料的，虽然性能指标一般般，运行 Palworld 游戏服务器压力却也并不大，运行我其他 Docker 服务也没啥压力，性能其实非常够用了。看来我真是高估我对这 Nas 的性能需求了。

## 总结

总的来说，我最终还是入了群晖了，大概我是不太会再换了吧。

初步评价下这个 DS1821+ 吧，

1. 对我来说，性能够用，扩展性满足需求。
2. 运行非常安静，指示灯也不打扰人，能关。
3. 系统稳定易用，和前面两个系统相比，使用门槛低，配置简单，还能有技术支持。

具体的使用，待我多用用，再分享吧。
