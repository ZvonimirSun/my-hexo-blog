---
title: 解决Elasticsearch查询记录超过10000时的异常
date: 2021-02-26 03:50:06
updated: 2021-02-26 03:50:06
categories:
  - 编程
tags:
  - ElasticSearch
---

最近遇到使用 ElasticSearch 做分页查询时，前面的页码都正常，后面的页码就会 500 错误的问题，一度怀疑是接口页码算错了。后来想起 ES 有个 10000 条数据的限制，默认返回数据量为 10000 条，超过的话就会报错。这里记录下解决办法。

<!--more-->

## 异常信息

```log
Caused by: ElasticsearchException[Elasticsearch exception [type=illegal_argument_exception, reason=Result window is too large, from + size must be less than or equal to: [10000] but was [10100]. See the scroll api for a more efficient way to request large data sets. This limit can be set by changing the [index.max_result_window] index level setting.]]; nested: ElasticsearchException[Elasticsearch exception [type=illegal_argument_exception, reason=Result window is too large, from + size must be less than or equal to: [10000] but was [10100]. See the scroll api for a more efficient way to request large data sets. This limit can be set by changing the [index.max_result_window] index level setting.]];
```

从错误信息里面其实已经能看到解决方法了。

```log
This limit can be set by changing the [index.max_result_window] index level setting.
```

## 解决办法

1. 修改配置文件(需要重启 ES 服务)

   修改 ES 配置文件`config/elasticsearch.yml`，在文件末尾添加一行:

   ```yaml
   max_result_window: 200000000
   ```

   在 5.x 版本以上的 ES 中已经不再支持。

   ![](https://img.iszy.xyz/20210226173324.png)

2. 通过接口修改索引的配置(推荐)

   修改 max_result_window 设置的最大索引值，注意以 put 方式提交。这种方式只能对每个 index 单独开启，毕竟也不是每个索引都需要返回那么大数据量。

   ```bash
   curl -X PUT "http://localhost:9200/my_index/_settings?pretty" -H 'Content-Type: application/json' -d '
   {
    "index":{
        "max_result_window":200000000
    }
   }
   '
   ```
