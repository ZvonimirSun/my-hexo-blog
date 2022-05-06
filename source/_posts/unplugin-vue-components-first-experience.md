---
title: Antfu大佬的unplugin-vue-components神器初体验
categories:
  - Wiki
  - JavaScript
  - Vite
tags:
  - Vue
  - Vite
  - JavaScript
date: 2022-05-06 10:54:20
---

`unplugin-vue-components`(后称插件) 是一个按需自动引入 vue 组件的插件，是 Antfu 大佬的一个杰作，今天来体验一下。

<!--more-->

## 需求

为了减少项目大小，将组件库按需引入是很常见的。不过，如果你的项目中使用组件库内容非常频繁，甚至还需要引入多个组件库，这就会变的非常麻烦，有可能在一个组件中需要 import 十几个组件，还要手动加入到 Components 中才能使用。这样的行为，在一个项目中，可能会重复很多遍，费时费力。

那么插件解决了一个什么问题呢，插件基于 `unplugin`，对 Vue Components 做了支持。它能够预设条件匹配组件 template 中使用的组件，然后自动进行按需引入。另外可以指定一个目录，插件会将目录中的组件进行注册，这样，在全局范围内，也就可以直接使用这些组件而无需导入了。

## 使用

`unplugin-vue-components`支持比较广泛。

按照官方说明：

- 支持 Vue 2 和 Vue 3
- 支持 components 和 directives
- 支持 Vite, Webpack, Vue CLI, Rollup, esbuild 等，这个主要还是看 unplugin 支持什么
- 支持 tree-shaking，只导入使用到的组件
- 完整支持 TypeScript
- 内置了很多流行组件库的解析支持，比如说我需要使用的 Ant Design Vue 3

更多说明请访问 [antfu/unplugin-auto-import](https://github.com/antfu/unplugin-auto-import)

### 安装

```bash
npm install unplugin-vue-components -D
```

或者

```bash
yarn add unplugin-vue-components -D
```

### 自动导入 UI 库

在这里以 vite 为例

```js
// vite.config.js
import { defineConfig } from "vite";
import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";

export default defineConfig({
  plugins: [
    Components({
      resolvers: [AntDesignVueResolver()],
    }),
  ],
});
```

现在已经可以在项目中随意使用 Ant Design Vue 组件了，插件会自动匹配，引入对应的组件和样式文件，可以说是体验非常良好了，这也是 Ant Design Vue 现阶段推荐使用方式。

### 自动导入组件

```js
// vite.config.js
import { defineConfig } from "vite";
import Components from "unplugin-vue-components/vite";

export default defineConfig({
  plugins: [
    Components({
      // 组件所在位置
      dirs: ["src/components"],
      //   resolvers: [AntDesignVueResolver()]
      dts: "src/components.d.ts",
    }),
  ],
});
```

如果安装有 TypeScript，插件将会自动开启 dts 选项，生成`./auto-imports.d.ts`文件。

注意不要有重名组件，重名组件将被自动忽略防止冲突。

### 完整配置项定义

```ts
export interface Options {
  /**
   * Preset names or custom imports map
   *
   * @default []
   */
  imports?: Arrayable<ImportsMap | PresetName>;

  /**
   * Identifiers to be ignored
   */
  ignore?: (string | RegExp)[];

  /**
   * Pass a custom function to resolve the component importing path from the component name.
   *
   * The component names are always in PascalCase
   */
  resolvers?: Arrayable<Arrayable<Resolver>>;

  /**
   * Filepath to generate corresponding .d.ts file.
   * Default enabled when `typescript` is installed locally.
   * Set `false` to disable.
   *
   * @default './auto-imports.d.ts'
   */
  dts?: string | boolean;

  /**
   * Allow overriding imports sources from multiple presets.
   *
   * @default false
   */
  presetOverriding?: boolean;

  /**
   * Rules to include transforming target.
   *
   * @default [/\.[jt]sx?$/, /\.vue\??/]
   */
  include?: FilterPattern;

  /**
   * Rules to exclude transforming target.
   *
   * @default [/node_modules/, /\.git/]
   */
  exclude?: FilterPattern;

  /**
   * Generate source map.
   *
   * @default false
   */
  sourceMap?: boolean;

  /**
   * Generate corresponding .eslintrc-auto-import.json file.
   */
  eslintrc?: ESLintrc;
}
```
