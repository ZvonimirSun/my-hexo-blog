---
title: "zsh (anon):12: character not in range"
categories:
  - 技巧
tags:
  - Linux
  - Zsh
  - Locale
date: 2022-04-07 14:30:15
---

运行`source ~/.zshrc`，报错`zsh (anon):12: character not in range`

<!--more-->

这是由于环境变量 LC_ALL 和 LANG 未设置的缘故。

只需要在`~/.zshrc`文件前面加入

```bash
export LC_ALL=C.UTF-8
export LANG=C.UTF-8
```

然后运行`source ~/.zshrc`即可。
