---
title: Linux自建KMS服务器
date: 2019-01-11 16:36:00
updated: 2020-06-30 12:36:00
categories:
  - 应用
tags:
  - KMS
  - Linux
  - Docker
---

今天来简单介绍一下如何自建 KMS 激活 Windows 以及 Office。不想自己部署的也可以直接跳到[激活](#激活)，我提供了自建的 KMS 地址，大家可以使用。

<!--more-->

## KMS 简介

KMS 是一种专为中型和大型企业设计的 Microsoft 产品的激活方法。 在标准 SOHO 环境中，您在安装期间输入产品密钥，然后通过 Internet 激活产品。这是通过向`microsoft.com`上的服务器发送请求来完成的，然后该服务器授予或拒绝激活。

通过输入称为通用批量许可证密钥（GVLK）的特殊密钥（又名“KMS 客户端密钥”），产品不再要求 Microsoft 服务器进行激活，而是通常驻留在公司内部网中的用户定义服务器（称为 KMS 服务器）。 Microsoft 仅将其 KMS 服务器提供给签署了所谓“选择合同”的公司。

KMS 激活大家应该比较熟悉，网上的激活工具基本都是使用 KMS 激活的，激活的期限一般是 180 天。不过激活工具相当于开了一个 KMS 服务器运行在你的电脑上，每过 180 天，系统会自动连接激活服务器进行激活，所以只要 KMS 服务器还在就不用担心失效的问题。如果 KMS 不在了，换一个即可，180 天总能找到一个，或者像本文这样自建一个就不怕失效了。

## vlmscd 介绍和安装

vlmcsd 是完全与 Microsoft 兼容的 KMS 服务器，是 KMS 服务器的一个独立开源实现，可供所有人使用。可为客户端提供产品激活服务，是 Microsoft KMS 服务器的直接替代品。可以在 Windows 和 Linux 上运行。可以运行在大多数嵌入式系统上，如路由器，NAS，移动电话，平板电脑，电视，机顶盒等。相对于 Microsoft KMS 服务器仅激活客户已支付的产品，vlmcsd 从不拒绝激活。

虽然 vlmcsd 既不需要激活密钥也不需要付费，但它并不是宣扬盗版 Windows。 其目的是确保合法副本的所有者可以无限制地使用他们的软件。例如，如果购买新计算机或主板，由于硬件更改，密钥将无法从 Microsoft 服务器激活，这种情况下可以通过使用 vlmcsd 激活来继续使用。

项目地址：[Wind4/vlmcsd](https://github.com/Wind4/vlmcsd)

### 安装 Docker

为了避免系统环境不同引发未知问题，在这里使用 Docker。

Ubuntu 安装脚本：

```bash
wget -qO- https://get.docker.com/ | sh
```

CentOS 安装脚本：

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

### 安装 vlmscd

```bash
docker pull mikolatero/vlmcsd
docker run -d -p 1688:1688 --restart=always --name="vlmcsd" mikolatero/vlmcsd
```

### 防火墙

需要打开 1688 端口供 vlmcsd 使用。在这里举两个常用的。

#### UFW

```bash
ufw allow 1688
```

#### iptables

```bash
iptables -A INPUT -p tcp --dport 1688 -j ACCEPT
iptables -A OUTPUT -p tcp --sport 1688 -j ACCEPT
```

## 激活

在此我提供一下我个人使用的 KMS 服务器，不想自行安装的可以使用以下服务器。

```
KMS服务器: kms.iszy.xyz
端口: 1688
```

### 激活 Windows

用管理员权限打开 cmd(命令提示符)，输入以下命令。

#### 配置 GVLK

一般情况下，新装的系统，没有输入过其他 key 的，系统会自带 GVLK，可以忽略此步，当然做了也没有影响。输入过其他 key 的则需要此步。

将以下命令中的 Key 替换成对应系统版本的 Key。

```powershell
#slmgr /ipk GVLK
#Example:
slmgr /ipk GCRJD-8NW9H-F2CDX-CCM8D-9D6T9
```

部分 GVLK 列表

|             GVLK              | 系统版本                                   |
| :---------------------------: | :----------------------------------------- |
| TX9XD-98N7V-6WMQ6-BX7FG-H8Q99 | Windows 10 Home                            |
| 3KHY7-WNT83-DGQKR-F7HPR-844BM | Windows 10 Home N                          |
| 7HNRX-D7KGG-3K4RQ-4WPJ4-YTDFH | Windows 10 Home Single Language            |
| PVMJN-6DFY6-9CCP6-7BKTT-D3WVR | Windows 10 Home Country Specific           |
| 789NJ-TQK6T-6XTH8-J39CJ-J8D3P | Windows 8.1 Professional with Media Center |
| M9Q9P-WNJJT-6PXPY-DWX8H-6XWKK | Windows 8.1 Core                           |
| 7B9N3-D94CG-YTVHR-QBPX3-RJP64 | Windows 8.1 Core N                         |
| BB6NG-PQ82V-VRDPW-8XVD2-V8P66 | Windows 8.1 Core Single Language           |
| NCTT7-2RGK8-WMHRF-RY7YQ-JTXG3 | Windows 8.1 Core Country Specific          |
| GNBB8-YVD74-QJHX6-27H4K-8QHDG | Windows 8 Professional with Media Center   |
| BN3D2-R7TKB-3YPBD-8DRP2-27GG4 | Windows 8 Core                             |
| 8N2M2-HWPGY-7PGT9-HGDD8-GVGGY | Windows 8 Core N                           |
| 2WN2H-YGCQR-KFX6K-CD6TF-84YXQ | Windows 8 Core Single Language             |
| 4K36P-JN4VD-GDC6V-KDT89-DYFKP | Windows 8 Core Country Specific            |

更多 GVLK[点击这里](https://docs.microsoft.com/zh-cn/windows-server/get-started/kmsclientkeys)查看。

#### 配置使用 KMS 服务器

```powershell
# slmgr /skms kms-server[:tcp-port]
# Example:
slmgr /skms kms.iszy.xyz:1688
```

将 IP 换成你的 vlmscd 所在服务器即可。1688 是默认端口，如果之前是按照本文进行配置，此端口可以不写。

#### 进行激活

```powershell
slmgr /ato
```

等待一会儿会看到激活成功的提示。

可以输入以下命令查看激活状态，一般显示`批量激活将于 xxxx/x/x xx:xx:xx 过期`，一般是 180 天或 45 天的有效期。过期后，如果 KMS 服务器还在，会自动续期的。

```powershell
slmgr /xpr
```

### 激活 Office

你需要安装 Vol 版 Office 才能使用 KMS。可以去[MSDN](https://msdn.itellyou.cn/)上找一找，一般 Vol 版的文件都带 VL，文件名一般以 SW 开头。

#### 配置 GVLK

同样，没装过 key 的，一般可以忽略此步。

将以下命令中的 Key 替换成对应软件版本的 Key。

```powershell
if exist "C:\Program Files (x86)\Microsoft Office\Office14\ospp.vbs" (cd "C:\Program Files (x86)\Microsoft Office\Office14") else (cd "c:\Program Files\Microsoft Office\Office14")
if exist "C:\Program Files (x86)\Microsoft Office\Office15\ospp.vbs" (cd "C:\Program Files (x86)\Microsoft Office\Office15") else (cd "c:\Program Files\Microsoft Office\Office15")
if exist "C:\Program Files (x86)\Microsoft Office\Office16\ospp.vbs" (cd "C:\Program Files (x86)\Microsoft Office\Office16") else (cd "c:\Program Files\Microsoft Office\Office16")
# cscript ospp.vbs /inpkey:GVLK
# Example:
cscript ospp.vbs /inpkey:YC7DK-G2NP3-2QQC3-J6H88-GVGXT
```

部分 GVLK 列表

|             GVLK              | 软件版本                      |
| :---------------------------: | :---------------------------- |
| NMMKJ-6RK4F-KMJVX-8D9MJ-6MWKP | Office Professional Plus 2019 |
| 6NWWJ-YQWMR-QKGCB-6TMB3-9D9HK | Office Standard 2019          |
| B4NPR-3FKK7-T2MBV-FRQ4W-PKD2B | Project Professional 2019     |
| C4F7P-NCP8C-6CQPT-MQHV9-JXD2M | Project Standard 2019         |
| 9BGNQ-K37YR-RQHF2-38RQ3-7VCBB | Visio Professional 2019       |
| 7TQNQ-K3YQQ-3PFH7-CCPPM-X4VQ2 | Visio Standard 2019           |
| XQNVK-8JYDB-WJ9W3-YJ8YR-WFG99 | Office Professional Plus 2016 |
| JNRGM-WHDWX-FJJG3-K47QV-DRTFM | Office Standard 2016          |
| YG9NW-3K39V-2T3HJ-93F3Q-G83KT | Project Professional 2016     |
| GNFHQ-F6YQM-KQDGJ-327XX-KQBVC | Project Standard 2016         |
| PD3PC-RHNGV-FXJ29-8JK7D-RJRJK | Visio Professional 2016       |
| 7WHWN-4T7MP-G96JF-G33KR-W8GF4 | Visio Standard 2016           |

更多 GVLK[点击这里](https://docs.microsoft.com/zh-cn/DeployOffice/vlactivation/gvlks)查看。

#### 配置使用 KMS 服务器

将 IP 换成你的 vlmscd 所在服务器即可。1688 是默认端口，如果之前是按照本文进行配置，第二条命令可以不写。

```powershell
# cscript ospp.vbs /sethst:kms-server
# Example:
cscript ospp.vbs /sethst:kms.iszy.xyz
# cscript ospp.vbs /setprt:tcp-port
# Example:
cscript ospp.vbs /setprt:1688
```

#### 进行激活

```powershell
cscript ospp.vbs /act
```

等一会儿会显示激活成功。

可以输入以下命令查看激活状态，一般是 180 天或 45 天的有效期。过期后，如果 KMS 服务器还在，会自动续期的。

```powershell
cscript ospp.vbs /dstatus
```

## 后话

到此，自建 KMS 到激活都介绍完了，按照本文介绍应该已经正常激活了，享受你的软件吧。如果 KMS 服务器出现问题，180 天应该早就解决了吧。
