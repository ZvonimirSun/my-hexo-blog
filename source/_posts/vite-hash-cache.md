---
title: 解决Vite打包产生的hash缓存失效问题
categories:
  - 技术
tags:
  - Vite
  - Vue
date: 2023-11-01 12:49:36
---

如题，最近发现无论改多少内容，打包出来的所有文件的 hash 都会发生变化，这样就导致了浏览器缓存失效，每次都要重新加载所有文件，这样就导致了加载速度变慢，而且也浪费我服务器流量，姑且来看看能不能解决。

## 问题

在我的印象里，之前开发 Vue 项目，用 webpack 进行打包的时候，一般只有我修改的组件对应的 chunk 会更新。但现在的情况是，不管我改了什么，所有的文件都会被修改。

![](https://img.iszy.xyz/1698814232865.png)

这应当是 Vite 本身存在的问题，于是进行了一些搜索。

很快啊，我在 Vite 的项目下搜到了一个仍处于 open 状态的 issue，[[build] importing from hashed chunks makes caching terribly ineffective](https://github.com/vitejs/vite/issues/6773)。在这个 issue 中我发现了造成这个问题的一些原因，其实更多与使用的 rollup 打包工具有关。

## 示例

这里有个比较简单的例子来展示这个问题的产生：

比如有两个文件名为 `index.789123.js` 和 `a.123456.js`，内容如下：

index.789123.js

```js
import { a } from "./a.123456.js";
console.log("a: " + a);
```

a.123456.js

```js
const a = 1;
export { a };
```

如果 `a.123456.js` 文件内容发生了变化，计算 hash 后，文件名将变成比如 `a.abedef.js`。这时候，`index.789123.js` 文件中的 `a.123456.js` 就得改成新的 `a.abedef.js`，所以 `index.789123.js` 的内容也会发生变化，从而产生连锁反应。

## 解决

问题清晰了，但是这个 issue 是基于 Vite 2 提交的，在后续的 Vite 4 中经过测试也并没有进行解决。或许以后换成 rolldown 进行打包会避免这个问题吧，不过那就不知道要到什么时候了。

不过问题还是要解决的，只是不能简单的更新了事了。

在后续翻看这个 issue 的过程中，我发现了一个解决方案。

当把 entryFileNames 设置为 assets/[name].js 时，也就是我写在 index.html 里的入口文件 index.js 不要 hash 了，打包出来的文件就能符合预期了，不会造成所有文件进行联动修改了。

```js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: "assets/[name].js",
      },
    },
  },
});
```

当然产生的问题也是显而易见的，index.js 文件名固定了，而这个文件在打包后也是会更新的，所以为了让页面拿到最新的 index.js 文件，index.js 就不能进行缓存。

这个问题相对好解决，在 nginx 或者其他 web server 中给 `assets/index.js` 文件设置 `Cache-Control: must-revalidate, max-age=0` 不进行缓存即可。其他带 hash 的文件都可以缓存到永久，没有必要每次下载。

所以还是需要在，每次更新后重新下载每一个文件，还是每次访问时重新下载 index.js 文件，做一个抉择。更好的解决方案就需要官方来处理了。

不过对我来说，禁用 index.js 文件的缓存，是一个非常合适的方案。因为我同时在使用 `vite-plugin-pwa` 插件，首次请求完页面后就会进行缓存，在下次访问时，就不会再请求 index.js 文件了。而且打包出来的 workbox 文件都是带 hash 的，不会影响更新，在获取到新的 workbox 文件时，就会更新缓存。这样就能保证 index.js 文件的更新，又不会造成流量的浪费。建议 pwa 用户尝试我这里的方案，实测相当好用。
