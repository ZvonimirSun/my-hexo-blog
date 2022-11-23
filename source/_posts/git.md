---
title: Git实用技巧
date: 2022-11-10 17:28:50
updated: 2022-11-10 17:28:50
categories:
  - 技巧
tags:
  - git
---

Git 官方文档: [https://git-scm.com/docs](https://git-scm.com/docs)

<!--more-->

## 一、基本操作

### 1. 新建 git 仓库

```shell
git init
```

## ![image.png](https://cdn.nlark.com/yuque/0/2022/png/25824471/1668061621638-26d0d654-1d11-476e-ad42-779213954d3a.png#averageHue=%231a180e&clientId=ub96d4c89-475b-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=255&id=uec3bb9ee&margin=%5Bobject%20Object%5D&name=image.png&originHeight=255&originWidth=753&originalType=binary&ratio=1&rotation=0&showTitle=false&size=30677&status=done&style=none&taskId=ub98bd70b-f1c4-45ec-936a-b702c9e56ac&title=&width=753)

```shell
git init -b main
```

```shell
git config --global init.defaultBranch main
```

```shell
git branch -m main
```

### 2. 克隆远程仓库

```shell
git clone http://git.gtmap.cn/sunziyang/test.git
```

```shell
git clone http://git.gtmap.cn/sunziyang/test.git test
```

```shell
git clone http://git.gtmap.cn/sunziyang/test.git --depth=1 -b main
```

### 3. 提交代码

```shell
git add -a
```

```shell
git add -u
```

```shell
git add .
```

```shell
git commit
```

```shell
git commit -m "first commit"
```

```shell
git commit -am "first commit"
```

### 4. 查看仓库状态

```shell
git status
```

![image.png](https://cdn.nlark.com/yuque/0/2022/png/25824471/1668065792022-2f10cc69-8b64-490a-873b-4490d739ac4d.png#averageHue=%23eeebe3&clientId=ub96d4c89-475b-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=266&id=ubfc4c1f9&margin=%5Bobject%20Object%5D&name=image.png&originHeight=266&originWidth=514&originalType=binary&ratio=1&rotation=0&showTitle=false&size=17056&status=done&style=none&taskId=ub77e1215-ae37-4a2e-bce2-52bbf5a053c&title=&width=514)

```shell
git status -s
```

![image.png](https://cdn.nlark.com/yuque/0/2022/png/25824471/1668065823355-cc80fe1f-4c0d-458e-9caf-878aa6c4c539.png#averageHue=%23eceae1&clientId=ub96d4c89-475b-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=94&id=ub93edee7&margin=%5Bobject%20Object%5D&name=image.png&originHeight=94&originWidth=306&originalType=binary&ratio=1&rotation=0&showTitle=false&size=4934&status=done&style=none&taskId=ue0520f5c-7c4b-4726-826f-4f956392cfa&title=&width=306)

### 5. 查看提交历史

[https://git-scm.com/docs/git-log](https://git-scm.com/docs/git-log)

```shell
git log
```

![image.png](https://cdn.nlark.com/yuque/0/2022/png/25824471/1668067504751-d1ca6988-90c2-4e6e-8f94-7fae64114897.png#averageHue=%23edebe2&clientId=ub96d4c89-475b-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=284&id=u3e18e9e4&margin=%5Bobject%20Object%5D&name=image.png&originHeight=284&originWidth=460&originalType=binary&ratio=1&rotation=0&showTitle=false&size=18261&status=done&style=none&taskId=ucf014180-1861-44f3-852a-6ebda6ba773&title=&width=460)

### 6. 新建分支

```shell
git branch test
```

```shell
git checkout test
```

```shell
git checkout -b test
```

![image.png](https://cdn.nlark.com/yuque/0/2022/png/25824471/1668067736305-2544957f-7920-4ce9-84a9-68b15ec93403.png#averageHue=%23eae8de&clientId=ub96d4c89-475b-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=67&id=u6138a8f8&margin=%5Bobject%20Object%5D&name=image.png&originHeight=67&originWidth=357&originalType=binary&ratio=1&rotation=0&showTitle=false&size=3886&status=done&style=none&taskId=u72824e74-1f6b-4987-9488-a2e658aad04&title=&width=357)

### 7. 合并分支

```shell
git checkout main
git merge test
```

![image.png](https://cdn.nlark.com/yuque/0/2022/png/25824471/1668067797343-5d90568f-e122-4eb7-90ff-2ad1cfae876c.png#averageHue=%23ebe8df&clientId=ub96d4c89-475b-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=169&id=u269b62da&margin=%5Bobject%20Object%5D&name=image.png&originHeight=169&originWidth=333&originalType=binary&ratio=1&rotation=0&showTitle=false&size=9114&status=done&style=none&taskId=u90a3dc38-d1f3-4d70-acd4-1e90452beaf&title=&width=333)

### 8. 删除分支

```shell
git branch -d test-not-need
```

![image.png](https://cdn.nlark.com/yuque/0/2022/png/25824471/1668067838780-f1b53130-bb07-4b12-9aad-9b770b0de605.png#averageHue=%23e9e6dc&clientId=ub96d4c89-475b-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=62&id=u2370f562&margin=%5Bobject%20Object%5D&name=image.png&originHeight=62&originWidth=380&originalType=binary&ratio=1&rotation=0&showTitle=false&size=4233&status=done&style=none&taskId=ub35df9b2-5298-4a87-98aa-2e74d4bbb9b&title=&width=380)

### 9. 合并冲突

![image.png](https://cdn.nlark.com/yuque/0/2022/png/25824471/1668067914592-6e0fddf1-9985-426d-ae5b-aed6cbe18cd7.png#averageHue=%23ece9e0&clientId=ub96d4c89-475b-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=103&id=u20f88793&margin=%5Bobject%20Object%5D&name=image.png&originHeight=103&originWidth=499&originalType=binary&ratio=1&rotation=0&showTitle=false&size=7865&status=done&style=none&taskId=ucebc667b-79bb-4312-8ee8-254cd38c9e1&title=&width=499)
当两个分支都对同一行进行了修改，git 便会产生冲突，并标记为未合并
![image.png](https://cdn.nlark.com/yuque/0/2022/png/25824471/1668067991503-6e70f673-53ff-4128-ae69-a0bdf5bbfdf9.png#averageHue=%23edece4&clientId=ub96d4c89-475b-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=222&id=u4ee59a0c&margin=%5Bobject%20Object%5D&name=image.png&originHeight=222&originWidth=646&originalType=binary&ratio=1&rotation=0&showTitle=false&size=10709&status=done&style=none&taskId=u4c7ea403-ed55-41a3-b0b1-4fc2e4c111e&title=&width=646)
此时将每个文件进行修改，确认最后的内容，使用 git add 方法标记为冲突已解决

```shell
git add .\A.txt
```

在所有文件的冲突均已解决后，使用 commit 提交此次修改。
![image.png](https://cdn.nlark.com/yuque/0/2022/png/25824471/1668069129425-5e01c21f-729f-46a1-adfb-54124e62e2f0.png#averageHue=%23f4f0f0&clientId=ub96d4c89-475b-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=231&id=u0a104ab9&margin=%5Bobject%20Object%5D&name=image.png&originHeight=231&originWidth=217&originalType=binary&ratio=1&rotation=0&showTitle=false&size=5265&status=done&style=none&taskId=uf34e2edc-1b3c-4171-a0b7-1415373ec8d&title=&width=217)

```shell
git merge --abort
```

### 10. 远程仓库

```shell
git remote
```

默认应该为空

```shell
git remote add origin http://git.gtmap.cn/sunziyang/test.git
```

![image.png](https://cdn.nlark.com/yuque/0/2022/png/25824471/1668068523745-63687201-d938-4494-befb-57cca24fecfa.png#averageHue=%23ece9e0&clientId=ub96d4c89-475b-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=74&id=uc779cfc8&margin=%5Bobject%20Object%5D&name=image.png&originHeight=74&originWidth=615&originalType=binary&ratio=1&rotation=0&showTitle=false&size=6674&status=done&style=none&taskId=u31dc2c1c-a0e6-4bc9-8ea0-1c7704aa632&title=&width=615)

```shell
git push origin main
```

![image.png](https://cdn.nlark.com/yuque/0/2022/png/25824471/1668068742518-da3e5415-4ecf-4585-95a1-21883204aaff.png#averageHue=%23ebe8de&clientId=ub96d4c89-475b-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=159&id=ua8990786&margin=%5Bobject%20Object%5D&name=image.png&originHeight=159&originWidth=462&originalType=binary&ratio=1&rotation=0&showTitle=false&size=10110&status=done&style=none&taskId=ufe9f12fb-96ed-4a25-b4b5-e9a760df4ef&title=&width=462)

```shell
git fetch --all
```

```shell
git fetch origin
```

```shell
git branch --set-upstream-to=origin/main main
git branch -u origin/main main
```

![image.png](https://cdn.nlark.com/yuque/0/2022/png/25824471/1668068938744-515203f8-4a6f-43e7-bbc0-522e22a1226e.png#averageHue=%23ebe7de&clientId=ub96d4c89-475b-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=63&id=u6c235234&margin=%5Bobject%20Object%5D&name=image.png&originHeight=63&originWidth=425&originalType=binary&ratio=1&rotation=0&showTitle=false&size=4153&status=done&style=none&taskId=uf9fe9258-ee38-49f8-b351-99cbff36d71&title=&width=425)

```shell
git push -u origin main
```

```shell
git pull
```

```shell
git pull origin main
```

## 二、常见技巧

### 1. 临时保存成果

```shell
git stash
```

![image.png](https://cdn.nlark.com/yuque/0/2022/png/25824471/1668069378275-7d9723e8-f968-45a1-a935-2f7540fb323e.png#averageHue=%23eceae1&clientId=ub96d4c89-475b-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=322&id=ub9527e34&margin=%5Bobject%20Object%5D&name=image.png&originHeight=322&originWidth=519&originalType=binary&ratio=1&rotation=0&showTitle=false&size=23325&status=done&style=none&taskId=u0a78b019-d61d-447c-ad99-b92b7162850&title=&width=519)

```shell
git stash pop
```

![image.png](https://cdn.nlark.com/yuque/0/2022/png/25824471/1668069487321-01f9baf6-a5e2-4229-aad7-c4239fd249be.png#averageHue=%23eceae1&clientId=ub96d4c89-475b-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=388&id=ua7cbc212&margin=%5Bobject%20Object%5D&name=image.png&originHeight=388&originWidth=525&originalType=binary&ratio=1&rotation=0&showTitle=false&size=28749&status=done&style=none&taskId=udadaa4f7-105b-41e0-b8a7-476e313c817&title=&width=525)

### 2. 合并分支灵活选择 rebase/merge

```shell
git merge test
```

```shell
git rebase test
```

![image.png](https://cdn.nlark.com/yuque/0/2022/png/25824471/1668070029923-03a6023a-f289-4a7f-8d97-287b5481d0d5.png#averageHue=%23f7f6f6&clientId=ub96d4c89-475b-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=403&id=u5f38a90d&margin=%5Bobject%20Object%5D&name=image.png&originHeight=403&originWidth=424&originalType=binary&ratio=1&rotation=0&showTitle=false&size=17070&status=done&style=none&taskId=u6606d6f5-faf6-4398-803d-abf982ae461&title=&width=424)

### 3. cherry-pick

适合 hotfix

```shell
git cherry-pick 12d654f1d701cbf7cd9abb98ce84eeef460a24a7
```

![image.png](https://cdn.nlark.com/yuque/0/2022/png/25824471/1668070259530-0a9f15b2-6f04-4efc-9178-87b71593348d.png#averageHue=%23ece9e0&clientId=ub96d4c89-475b-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=74&id=u95fa0050&margin=%5Bobject%20Object%5D&name=image.png&originHeight=74&originWidth=623&originalType=binary&ratio=1&rotation=0&showTitle=false&size=7688&status=done&style=none&taskId=u55f4075a-f7f1-4101-af2e-b2c9c8e3278&title=&width=623)
![image.png](https://cdn.nlark.com/yuque/0/2022/png/25824471/1668070287061-158eab00-07ce-4b3a-986b-82138a35f0d7.png#averageHue=%23f9f8f8&clientId=ub96d4c89-475b-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=446&id=u041c3d65&margin=%5Bobject%20Object%5D&name=image.png&originHeight=446&originWidth=444&originalType=binary&ratio=1&rotation=0&showTitle=false&size=19422&status=done&style=none&taskId=u66e44180-6621-42e8-bc9e-6962a82f6a8&title=&width=444)

### 4. 修改上次提交

```shell
git commit --amend
```

会同时提交暂存的文件

### 5. 取消文件修改

```shell
git checkout .\C.txt
```

![image.png](https://cdn.nlark.com/yuque/0/2022/png/25824471/1668070393228-757e4a56-6231-42dc-853d-a125b8c72cf3.png#averageHue=%23e9e6dc&clientId=ub96d4c89-475b-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=54&id=ufb48917e&margin=%5Bobject%20Object%5D&name=image.png&originHeight=54&originWidth=364&originalType=binary&ratio=1&rotation=0&showTitle=false&size=3939&status=done&style=none&taskId=u97acef27-eb9d-4b80-a14e-1e74f9c8462&title=&width=364)

### 6. 弃用提交

```shell
# 保留文件
git reset --soft 12d654f1d701cbf7cd9abb98ce84eeef460a24a7

# 丢弃修改
git reset --hard 12d654f1d701cbf7cd9abb98ce84eeef460a24a7
```

### 7. 补丁文件

```shell
git diff [file] > a.patch
git apply a.patch
```
