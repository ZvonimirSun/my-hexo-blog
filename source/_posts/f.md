---
title: JavaScript LeetCode 1.两数之和
date: 2022-03-20 22:55:23
updated: 2022-03-20 22:55:23
categories:
  - 技术
tags:
  - LeetCode
  - 力扣
  - JavaScript
mathjax: true
---

> [两数之和 - 力扣](https://leetcode-cn.com/problems/two-sum/)

**难度简单**

<!--more-->

## 题目

给定一个整数数组`nums`和一个整数目标值`target`，请你在该数组中找出**和为目标值**`target`的那**两个**整数，并返回它们的数组下标。

你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。

你可以按任意顺序返回答案。

**示例 1：**

```
输入：nums = [2,7,11,15], target = 9
输出：[0,1]
解释：因为 nums[0] + nums[1] == 9 ，返回 [0, 1] 。
```

**示例 2：**

```
输入：nums = [3,2,4], target = 6
输出：[1,2]
```

**示例 3：**

```
输入：nums = [3,3], target = 6
输出：[0,1]
```

**提示：**

- $2 \leq nums.length \leq 10^4$
- $-10^9 \leq nums[i] \leq 10^9$
- $-10^9 \leq target \leq 10^9$
- **只会存在一个有效答案**

**进阶：**你可以想出一个时间复杂度小于`O(n2)`的算法吗？

## 解答

通过一个对象存储**值**对应的**索引值**，当**与当前值的和**等于**目标值**的数字可以在对象中找到，即返回该数字索引和当前索引。

```js
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function (nums, target) {
  const map = {};
  for (const i in nums) {
    if (map[target - nums[i]]) {
      return [i, map[target - nums[i]]];
    }
    map[nums[i]] = i;
  }
};
```
