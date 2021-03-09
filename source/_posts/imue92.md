---
title: Elasticsearch 节点磁盘使用率过高，导致ES索引无法写入
date: 2020-09-15 18:31:15
updated: 2021-03-09 18:31:15
categories:
  - 编程
tags:
  - ElasticSearch
---

解决一下因为 Elasticsearch 节点磁盘使用率过高，导致 ES 索引无法写入的问题。

<!--more-->

## 原因

经过查阅[官方文档](https://www.elastic.co/guide/en/elasticsearch/reference/current/modules-cluster.html#disk-based-shard-allocation)，我们可以看到 ES 的默认配置是当集群中的某个节点磁盘达到使用率为 `85%` 的时候，就不会在该节点进行创建副本，当磁盘使用率达到 `90%` 的时候，尝试将该节点的副本重分配到其他节点。当磁盘使用率达到 `95%` 的时候，当前节点的所有索引将被设置为只读索引。

> - `cluster.routing.allocation.disk.threshold_enabled`
>   (Dynamic) Defaults to . Set to to disable the disk allocation decider. truefalse
> - `cluster.routing.allocation.disk.watermark.low`
>   (Dynamic) Controls the low watermark for disk usage. It defaults to , meaning that Elasticsearch will not allocate shards to nodes that have more than 85% disk used. It can also be set to an absolute byte value (like ) to prevent Elasticsearch from allocating shards if less than the specified amount of space is available. This setting has no effect on the primary shards of newly-created indices but will prevent their replicas from being allocated. 85%500mb
> - `cluster.routing.allocation.disk.watermark.high`
>   (Dynamic) Controls the high watermark. It defaults to , meaning that Elasticsearch will attempt to relocate shards away from a node whose disk usage is above 90%. It can also be set to an absolute byte value (similarly to the low watermark) to relocate shards away from a node if it has less than the specified amount of free space. This setting affects the allocation of all shards, whether previously allocated or not. 90%
> - `cluster.routing.allocation.disk.watermark.enable_for_single_data_node`
>   (Static) For a single data node, the default is to disregard disk watermarks when making an allocation decision. This is deprecated behavior and will be changed in 8.0. This setting can be set to to enable the disk watermarks for a single data node cluster (will become default in 8.0). true
> - `cluster.routing.allocation.disk.watermark.flood_stage`
>   (Dynamic) Controls the flood stage watermark, which defaults to 95%. Elasticsearch enforces a read-only index block () on every index that has one or more shards allocated on the node, and that has at least one disk exceeding the flood stage. This setting is a last resort to prevent nodes from running out of disk space. The index block is automatically released when the disk utilization falls below the high watermark.index.blocks.read_only_allow_delete

## 解决方法

### 调整物理环境

扩大磁盘，或者删除部分数据来空出一些磁盘，这个没什么好多说的。

### 调整 es 配置

#### 通过配置文件(需要重启)

更改配置文件`elasticsearch.yml`，调高锁定的阈值，需要重启 ES。

```yaml
cluster.routing.allocation.disk.threshold_enabled: true
cluster.routing.allocation.disk.watermark.low: 90%
cluster.routing.allocation.disk.watermark.high: 95%
cluster.routing.allocation.disk.watermark.flood_stage: 98%
```

#### 通过接口(无需重启)

通过 ES api 调整配置。transient 临时更改，persistent 是永久更改。

- 永久更改 `persistent`

  ```json
  {
    "persistent": {
      "cluster.routing.allocation.disk.watermark.low": "90%",
      "cluster.routing.allocation.disk.watermark.high": "95%",
      "cluster.routing.allocation.disk.watermark.flood_stage": "98%",
      "cluster.info.update.interval": "1m"
    }
  }
  ```

- 临时更改 `transient`

  ```json
  {
    "transient": {
      "cluster.routing.allocation.disk.watermark.low": "90%",
      "cluster.routing.allocation.disk.watermark.high": "95%",
      "cluster.routing.allocation.disk.watermark.flood_stage": "98%",
      "cluster.info.update.interval": "1m"
    }
  }
  ```

通过向`/_cluster/settings`提交`PUT`请求来修改，示例如下。

```bash
curl -H "Content-Type: application/json" -XPUT localhost:9200/_cluster/settings  -d '
{
  "transient": {
    "cluster.routing.allocation.disk.watermark.low": "90%",
    "cluster.routing.allocation.disk.watermark.high": "95%",
    "cluster.routing.allocation.disk.watermark.flood_stage": "98%",
    "cluster.info.update.interval": "1m"
  }
}'
```

![](https://img.iszy.xyz/20210309190311.png)

## 解锁已经锁定的索引

```bash
curl -H "Content-Type: application/json" -XPUT http://localhost:9200/_cluster/settings -d '{"transient":{"cluster.routing.allocation.disk.threshold_enabled":false}}'
curl -H "Content-Type: application/json" -XPUT http://localhost:9200/_all/_settings -d '{"index.blocks.read_only_allow_delete":null}'
```
