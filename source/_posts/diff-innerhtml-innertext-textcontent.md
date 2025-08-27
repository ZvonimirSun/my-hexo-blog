---
title: textContent、innerText与innerHTML的区别
tags:
  - JavaScript
  - DOM
date: 2022-05-16 13:26:50
---

textContent、innerText 与 innerHTML 三个接口，在我们想要获取或改变一个 DOM 的内容时，经常会用到，有时候会搞混其中的用法，在此做个记录。

<!--more-->

## 示例

没有什么比直接运行一段代码的效果更加直接了

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Document</title>
  </head>
  <body>
    <style>
      button {
        border: 1px solid red;
      }
    </style>
    <div class="contain">
      北京上海广州<span style="display:none">深圳厦门</span>陕西西安
      <p>台湾香港澳门</p>
    </div>
    <button onclick="myFunction()">我是按钮</button>
    <script>
      function myFunction() {
        console.log(event.type);
      }
      let container = document.querySelector("body");
      console.log("textContent的内容是:\n", container.textContent);
      console.log("innerText的内容是:\n", container.innerText);
      console.log("innerHTML的内容是:\n", container.innerHTML);
    </script>
  </body>
</html>
```

![](https://img.iszy.xyz/1652678013076.png)

从结果里我们可以清晰的看出 textContent、innerText 和 innerHTML 的区别。

- textContent 会获取除标签外的所有内容
- innerText 会受到 css 的影响，仅会获取实际可以看到的内容，隐藏内容会被忽略
- innerHTML 会获取所有内容，包括标签

## 总结差异

1. 行为区别

   - `textContent` 和 `innerText` 获取的是元素内容；`innerHTML` 获取的是元素的 html 文本
   - `textContent` 会获取所有元素的内容，包括 `script` 和 `style` 元素；`innerText` 不会
   - `innerText` 会受到 css 影响，不会返回隐藏内容；`textContent` 不会
   - 使用 `innerHTML` 设置内容，会将内容解析为 html，所以性能相对较差，还可能存在 XSS 攻击；而因为文本不会被解析，则 `textContent` 和 `innerText` 不会有这个问题，性能更好。
   - 因为 `innerText` 受样式影响，会触发重排，而 `textContent` 不会。

2. 归属区别

   - `textContent` 是 `Node` 对象的属性
   - `innerText` 是 `Element` 对象的属性
   - `innerHTML` 是 `HTMLElement` 对象的属性
