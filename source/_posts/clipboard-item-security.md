---
title: 将 Blob 数据保存到剪贴板
categories:
  - JavaScript
  - Browser
tags:
  - JavaScript
  - Clipboard
  - ClipboardItem
permalink: /posts/j/
date: 2022-04-07 11:15:19
---

将 Blob 数据保存到剪贴板，需要调用浏览器的 Clipboard API，浏览器会做一些安全限制，不是所有情况都能调用的到。

<!--more-->

## 示例

```js
async function writeClipboard(blob) {
  try {
    await navigator.clipboard.write([
      new ClipboardItem({
        [blob.type]: blob,
      }),
    ]);
    console.log("Blob copied.");
  } catch (err) {
    console.error(err.name, err.message);
  }
}
```

## 限制

要将 Blob 数据保存到剪贴板，需要构建一个 ClipboardItem 对象，然后通过 Clipboard API 写入到剪贴板。

1. 浏览器支持

   首先你的浏览器要能够支持此接口，可以根据 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Clipboard) 上的说明来确定是否兼容。

2. 仅支持通过在 Https 加密的安全域名或 localhost 下调用

   Clipboard API 包含 Clipboard、ClipboardItem、ClipboardEvent 三个接口。在满足要求的时候，是都可以调用到的；否则将只能调用 ClipboardEvent 接口，其他两个将会表现为未定义。
