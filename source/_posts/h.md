---
title: JavaScript LeetCode 3.无重复字符的最长子串
date: 2022-03-21 00:10:23
updated: 2022-03-21 00:10:23
categories:
  - 技术
tags:
  - LeetCode
  - 力扣
  - JavaScript
mathjax: true
---

<!--more-->

## 题目

> [无重复字符的最长子串 - 力扣](https://leetcode-cn.com/problems/longest-substring-without-repeating-characters/)

**难度中等**

给定一个字符串`s`，请你找出其中不含有重复字符的**最长子串**的长度。

**示例 1：**

```
输入: s = "abcabcbb"
输出: 3
解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。
```

**示例 2：**

```
输入: s = "bbbbb"
输出: 1
解释: 因为无重复字符的最长子串是 "b"，所以其长度为 1。
```

**示例 3：**

```
输入: s = "pwwkew"
输出: 3
解释: 因为无重复字符的最长子串是 "wke"，所以其长度为 3。
     请注意，你的答案必须是 子串 的长度，"pwke" 是一个子序列，不是子串。
```

**提示：**

- $0 \leq s.length \leq 5 \times 10^4$
- `s`由英文字母、数字、符号和空格组成

## 解答

遍历字符串。

- 当没有遇见重复字符，则将当前字符拼入临时字符串。
- 当遇见了重复字符，将临时字符串中重复字符及以前的字符串移除，然后将当前字符拼入临时字符串。
- 如果此时临时字符串长度大于记录的最大长度，则更新最大长度。

所以总的来说，只需要遍历一遍字符串即可。

```js
/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function (s) {
  if (!s) {
    return 0;
  }
  let result = 0;
  let tmp = "";
  for (let i = 0; i < s.length; i++) {
    const index = tmp.indexOf(s[i]);
    if (index === -1) {
      tmp += s[i];
      if (tmp.length > result) {
        result = tmp.length;
      }
    } else {
      tmp = tmp.substring(index + 1) + s[i];
    }
  }
  return result;
};
```
