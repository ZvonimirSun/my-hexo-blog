---
title: ElasticSearch使用text类型字段排序报错
date: 2021-02-24 04:19:04
updated: 2021-02-24 04:19:04
tags:
  - ElasticSearch
---

在使用 ElasticSearch 进行查询时，排序是相当常见的一种操作。不过，一般情况下，我们都会对数字、日期类型等进行排序，较少直接对 text 类型进行排序。今天偶然遇到了需要对 text 类型进行排序的情况，就一不小心掉坑里了，这边记录下解决方法。

<!--more-->

## 问题还原

我们的问题是，对 text 类型进行排序时，ES 会报错。

错误内容形如:

```text
Fielddata is disabled on text fields by default.  Set `fielddata=true` on
[`your_field_name`] in order to load  fielddata in memory by uninverting the
inverted index. Note that this can however use significant memory.
```

## 解决问题

默认的 text 类型字段的 mapping 大概是这样的。

```json
{
  "dm": { "type": "text" }
}
```

根据上面的错误信息，我们可以去 ES 的文档中查一下`Fielddata`这个属性的说明。

> [fielddata mapping parameter](https://www.elastic.co/guide/en/elasticsearch/reference/current/text.html#fielddata-mapping-param)

![fielddata mapping parameter](https://img.iszy.cc/20210224173812.png)

按照官方的说明，text 类型的字段默认不支持聚合、排序等操作，此时如果进行聚合、排序等操作就会出现上文所示的错误信息。

### 第一种方法

那么，第一种启用 text 字段的聚合、排序等操作的方法也就清楚了，就是在 mapping 中将`fielddata`设置为`true`，此属性默认为`false`。这样，就能对该 text 字段进行常规的聚合、排序等操作了。

```json
{
  "properties": {
    "my_field": {
      "type": "text",
      "fielddata": true
    }
  }
}
```

不过需要注意的是，启用`fielddata`会将数据存储到程序的堆中，可能会带来性能、内存使用量增大等问题，这通常是没有必要的。

### 第二种方法【推荐】

![Before enabling fielddata](https://img.iszy.cc/20210224180354.png)

为了解决上面提到的性能和资源的浪费，官方更推荐使用多字段映射的方式。也就是一方面保留原字段来进行全文搜索，另一方面使用一个未做处理的`keyword`字段来进行聚合、排序等操作。配置方法如下示例所示。

```json
{
  "properties": {
    "my_field": {
      "type": "text",
      "fields": {
        "keyword": {
          "type": "keyword"
        }
      }
    }
  }
}
```

在这样配置以后，在进行搜索时使用`my_field`字段，在进行聚合、排序等操作时使用`my_field.keyword`字段，这样能够比直接启用`fielddata`获得更好的性能表现。
