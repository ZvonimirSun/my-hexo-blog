---
title: 强制删除 Kubernetes Namespace
tags:
  - Docker
  - Kubernetes
  - K8s
date: 2022-08-12 16:43:41
---

记一次 Kubernetes NameSpace 的强制删除。

<!--more-->

## 一、前情

我在使用 Kubernetes 时，遇到了 Kubernetes NameSpace 无法正常删除的问题。

NameSpace 状态保持在 Terminating 已经挺久了，我决定强制删除这个 NameSpace。

## 二、步骤

### 1. 查看存在的 NameSpace

```bash
[root@master ~]# kubectl get ns
NAME                   STATUS        AGE
default                Active        5h46m
istio-system           Terminating   11m
kube-node-lease        Active        5h46m
kube-public            Active        5h46m
kube-system            Active        5h46m
kubernetes-dashboard   Active        5h46m
```

### 2. 尝试强制删除 NameSpace

```bash
[root@master ~]# kubectl delete ns istio-system --force --grace-period=0
warning: Immediate deletion does not wait for confirmation that the running resource has been terminated. The resource may continue to run on the cluster indefinitely.
```

卡了挺久也没有效果，看来是删不掉，得强制删了

### 2. 获取需要强制删除的 NameSpace 信息

```bash
[root@master ~]# kubectl get namespace istio-system -o json > istio-system.json
```

### 3. 删除 finalizers 相关内容

![](https://img.iszy.xyz/1660293510641.png)

### 4. 运行 kube-proxy

```bash
[root@master ~]# kubectl proxy
Starting to serve on 127.0.0.1:8001
```

### 5. 通过 API 强制删除 NameSpace

新运行个终端，调用 API 删除 NameSpace

```bash
[root@master ~]# curl -k -H "Content-Type: application/json" -X PUT --data-binary @istio-system.json http://127.0.0.1:8001/api/v1/namespaces/istio-system/finalize
```

### 6. 关闭 kube-proxy 并确认 NameSpace 已删除

按 `CTRL-C` 关闭 kube-proxy，然后确认下现在的 NameSpace

```bash
[root@master ~]# kubectl get ns
NAME                   STATUS        AGE
default                Active        5h48m
kube-node-lease        Active        5h48m
kube-public            Active        5h48m
kube-system            Active        5h48m
kubernetes-dashboard   Active        5h48m
```

可以看到 NameSpace 已经被强制删除了。
