---
title: ArcGIS批量生成UUID作为唯一ID
date: 2019-09-06 12:00:00
updated: 2019-09-06 12:00:00
categories:
  - GIS
tags:
  - ArcGIS
  - Python
keywords: arcgis,uuid,python,批量
---

最近需要将一批数据添加唯一 ID，UUID 作为一个具有唯一性的通用编号方案，正适合承担这个任务。

<!--more-->

## UUID

通用唯一识别码（英语：Universally Unique Identifier，缩写：UUID）是用于计算机体系中以识别信息数目的一个 128 位标识符，还有相关的术语：全局唯一标识符（GUID）。根据标准方法生成，不依赖中央机构的注册和分配，UUID 具有唯一性，这与其他大多数编号方案不同。重复 UUID 码概率接近零，可以忽略不计。

UUID 主要有五个算法，也就是五种方法来实现：

| 算法  | 方式                    | 介绍                                                                                                                                             |
| ----- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| uuid1 | 基于时间戳              | 由 MAC 地址、当前时间戳、随机数生成。可以保证全球范围内的唯一性，但 MAC 的使用同时带来安全性问题，局域网中可以使用 IP 来代替 MAC。               |
| uuid2 | 基于分布式计算环境 DCE  | 算法与 uuid1 相同，不同的是把时间戳的前 4 位置换为 POSIX 的 UID。实际中很少用到该方法。                                                          |
| uuid3 | 基于名字的 MD5 散列值   | 通过计算名字和命名空间的 MD5 散列值得到，保证了同一命名空间中不同名字的唯一性，和不同命名空间的唯一性，但同一命名空间的同一名字生成相同的 uuid。 |
| uuid4 | 基于随机数              | 由伪随机数得到，有一定的重复概率，该概率可以计算出来。                                                                                           |
| uuid5 | 基于名字的 SHA-1 散列值 | 算法与 uuid3 相同，不同的是使用 Secure Hash Algorithm 1 算法                                                                                     |

## 解决方案

通过上面的介绍，我们可以看出来，为了保证全局的唯一性，我们将使用 uuid1 方法来完成这项工作。

我们用 ArcGIS 打开我们需要创建唯一字段的矢量数据属性表，创建一个类型为 text 的新字段，打开字段编辑器(Field Calculator)。Parser 选择`Python`，勾选`Show Codeblock`，分别输入以下内容。

- Pre-Logic Script Code:

  ```python
  import uuid
  def getUUID():
    val=(str(uuid.uuid1())).lower()
    return val
  ```

- UUID = (你刚刚创建的字段名)

  ```python
  getUUID()
  ```

![](https://img.iszy.xyz/20190909102342.png)

点击 OK，等待运算完成，你将能看到所有的 feature 已经被赋予了 UUID。