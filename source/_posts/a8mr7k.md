---
title: NexT主题v8配置自定义字体
date: 2021-02-25 03:53:59
updated: 2021-02-25 03:53:59
categories:
  - 折腾
tags:
  - Hexo
  - NexT
---

今天改了一下 NexT 主题的字体配置，发现还是有一些需要注意的地方的，在此记录一下。

<!--more-->

## 简要说明

在此篇文章发布时，我用的是 v8.2.1 版本的[next-theme/hexo-theme-next](https://github.com/next-theme/hexo-theme-next)，通过`npm install hexo-theme-next`安装，所以尽量不想改动主题源文件。

现在这里展示下最终的配置，只改动了主题的配置(字体部分)，符合我一开始的期望。

这边的配置是这样的，可以改成自己喜欢的

- 中文字体: Noto Serif SC
- 英文字体: EB Garamond
- 站点标题字体: Cinzel Decorative
- 代码字体: JetBrains Mono

```yaml
font:
  enable: true

  # Uri of fonts host, e.g. https://fonts.googleapis.com (Default).
  host:

  # Font options:
  # `external: true` will load this font family from `host` above.
  # `family: Times New Roman`. Without any quotes.
  # `size: x.x`. Use `em` as unit. Default: 1 (16px)

  # Global font settings used for all elements inside <body>.
  global:
    external: true
    family: "EB Garamond, 'Noto Serif SC'"
    size:

  # Font settings for site title (.site-title).
  title:
    external: true
    family: Cinzel Decorative
    size:

  # Font settings for headlines (<h1> to <h6>).
  headings:
    external: true
    family:
    size:

  # Font settings for posts (.post-body).
  posts:
    external: true
    family:

  # Font settings for <code> and code blocks.
  codes:
    external: true
    family: JetBrains Mono
```

如果只需要看最后是怎么配置的，到这里就可以结束了，下面是我折腾的过程。

## 折腾过程

涉及到的文件有以下几个。

- config.next.yml(主题配置文件)
- node_modules/hexo-theme-next/source/css/\_variables/base.styl(主题源文件中关于字体配置的 css 变量)
- source/\_data/styles.styl(自定义样式文件)

### 查询资料

虽说之前就看过主题配置文件中有这个字体配置的地方，姑且还是在网上查了一下其他人是怎么配置的。

然后我发现完整展示实际配置内容的较少，且基本上每一个类型都只配置了一个 font family，在其中一篇博文中还表示多在 NexT 主题的这个配置下多 font family 的配置是不支持的，这个我还是感觉比较诧异的，应该会有不少人有这样的需求吧。

![](https://img.iszy.xyz/20210225171504.png)

所以根据网上的说法，就有以下两个方法进行字体配置。

1. 简单配置

   在 NexT 配置中直接进行配置，内容为单个 font-family 值。

2. 复杂配置

   1. 在主题配置文件中指定自定义样式文件

      ```yaml
      custom_file_path:
        #head: source/_data/head.njk
        #header: source/_data/header.njk
        #sidebar: source/_data/sidebar.njk
        #postMeta: source/_data/post-meta.njk
        #postBodyEnd: source/_data/post-body-end.njk
        #footer: source/_data/footer.njk
        #bodyEnd: source/_data/body-end.njk
        #variable: source/_data/variables.styl
        #mixin: source/_data/mixins.styl
        style: source/_data/styles.styl
      ```

   2. ，在对应路径下创建自定义样式文件，然后在文件中直接对对应的 html 标签编写 css。

      ```css
      body,
      h1,
      h2,
      h3,
      h4,
      h5,
      h6,
      .post-body {
        font-family: EB Garamond, "Noto Serif SC", sans-serif;
      }

      .site-title {
        font-family: Cinzel Decorative, EB Garamond, "Noto Serif SC", sans-serif;
      }

      pre,
      code {
        font-family: JetBrains Mono, consolas, Menlo, monospace, "Noto Serif SC";
      }
      ```

### 探寻方案

不过直接加 css 有点不太优雅，万一以后多了什么标签，我还得手动改 css，那就要看看为什么不支持了。

在主题的代码中，我们能找到这么一段关于字体的配置。

```scss
get_font_family(config) {
  $custom-family = hexo-config('font.' + config + '.family');
  return $custom-family is a 'string' ? unquote($custom-family) : null;
}

// Font families.
$font-family-chinese      = 'PingFang SC', 'Microsoft YaHei';

$font-family-base         = $font-family-chinese, sans-serif;
$font-family-base         = get_font_family('global'), $font-family-chinese, sans-serif if get_font_family('global');

$font-family-logo         = $font-family-base;
$font-family-logo         = get_font_family('title'), $font-family-base if get_font_family('title');

$font-family-headings     = $font-family-base;
$font-family-headings     = get_font_family('headings'), $font-family-base if get_font_family('headings');

$font-family-posts        = $font-family-base;
$font-family-posts        = get_font_family('posts'), $font-family-base if get_font_family('posts');

$font-family-monospace    = consolas, Menlo, monospace, $font-family-chinese;
$font-family-monospace    = get_font_family('codes'), consolas, Menlo, monospace, $font-family-chinese if get_font_family('codes');
```

我们可以看到这边最主要的就是这个`get_font_family`方法，做的事情就是获取配置文件中对应项的值，如果不为空就去掉一下引号返回，否则返回`null`。

从代码上来看，并没有不支持多 font family 配置，所以我就试了以下几个配置看看效果。

```yaml
global:
  external: true
  family: EB Garamond, Noto Serif SC
  size:
```

首先这个配置，`EB Garamond`这个字体是生效了的，但`Noto Serif SC`没有生效。经过查询，在 css 规范中([css 校验器](http://jigsaw.w3.org/css-validator/))带空格的 font family 是要加引号的，于是改为了以下配置。

```yaml
global:
  external: true
  family: 'EB Garamond', 'Noto Serif SC'
  size:
```

好家伙，这个配置直接在 yaml 结构上就不支持，会报错。应当是被当作 map 解析了，不过结构也不正确，果断跳过。

经过查询，`unquote`这个方法，只是去除最外层引号的，而我将整个配置都套进双引号，应当就会被解析为字符串了，所以有了下面的配置。

```yaml
global:
  external: true
  family: "'EB Garamond', 'Noto Serif SC'"
  size:
```

这个配置其实已经成功了，所有字体都展示得很正常。不过，我们平常确实能看到很多带空格的 font family 是没有加引号的，这又是为什么呢？

### 无所谓的优化

经过进一步的查询，font family 在什么情况下要加引号和转义情况还是比较复杂的，需要先搞清楚 css 字符串和标识符之间的区别。

#### 字符串和标识符

关于[字符串](https://www.w3.org/TR/CSS2/syndata.html#strings)，w3c 表示

> 字符串可以放在单引号也可以放在双引号里，引号里面的相同引号需要转义。
>
> Strings can either be written with double quotes or with single quotes. Double quotes cannot occur inside double quotes, unless escaped (e.g., as '\"' or as '\22'). Analogously for single quotes (e.g., "\'" or "\27").

而[标识符](https://www.w3.org/TR/CSS2/syndata.html#characters)的定义如下

> 在 CSS 里，标识符(包括元素名称，类名，选择器里的 ID)只能包含字符[a-zA-Z0-9]，ISO 10646 里比 U+00A0 大的字符，还有连字符（-）和下划线（\_）。标识符不能以数字，两个下划线后者一个下划线后面跟一个数字开头。标识符也能包含转义字符还有 ISO 10646 定义的数字编码。举个例子：`B&W?`应该写成`B\&W\?`或者 `B\26 W\3F`。
>
> In CSS, identifiers (including element names, classes, and IDs in selectors) can contain only the characters [a-zA-Z0-9] and ISO 10646 characters U+00A0 and higher, plus the hyphen (-) and the underscore (\_); they cannot start with a digit, two hyphens, or a hyphen followed by a digit. Identifiers can also contain escaped characters and any ISO 10646 character as a numeric code (see next item). For instance, the identifier "B&W?" may be written as "B\&W\?" or "B\26 W\3F".

#### 空白字符

[css 规范](https://drafts.csswg.org/css-fonts-3/#font-family-prop)指出

> 字体族的名字要么作为字符串用引号包含起来，要么作为标识符，不需要引号。这就意味着在没有引号的名称里，开头的大多数标点符号和数字都需要被转义
>
> Font family names other than generic families must either be given quoted as strings, or unquoted as a sequence of one or more identifiers. This means most punctuation characters and digits at the start of each token must be escaped in unquoted font family names.

规范里用一个新的段落来说明：

> 如果 font family 的名字是一系列标识符。那么计算机识别的最终值是单个空格分隔的标识符转换成字符串后的值。
>
> If **a sequence of identifiers** is given as a font family name, the computed value is the name converted to a string by joining all the identifiers in the sequence by single spaces.

所以`Microsoft YaHei`表示由多个空格分隔的标识符组成了单一字体族名称，而带引号的`'Microsoft YaHei'`仅是简单的字符串，都是合法的 CSS。

#### 字体族关键字

规范定义了一些通用关键字，

> 通用关键字: serif, sans-serif, cursive, fantasy, 和 monospace.这些关键字可以作为普通的回退机制，以防期望的字体不可以用的时候。
>
> The following generic family keywords are defined: ‘serif’, ‘sans-serif’, ‘cursive’, ‘fantasy’, and ‘monospace’.

关于和关键字相同名称的字体族，

> 当字体族名称恰好和关键字名称一样，那就必须套上引号来防止冲突。
>
> Font family names that happen to be the same as keyword value (‘inherit’, ‘serif’, etc.) must be quoted to prevent confusion with the keywords with the same names.

另，关键字都是不区分大小写的。

#### 总结

所以问题也就明晰了，之前不加引号，`Noto Serif SC`字体应用有问题，就是因为这个字体族名称中有`Serif`关键字，被解析成了`serif`并使用了浏览器默认配置的`serif`字体。

所以就能把配置进一步优化成我的最终配置。

```yaml
global:
  external: true
  family: "EB Garamond, 'Noto Serif SC'"
  size:
```

当然去除引号不是必要操作，加上引号还是比较保险的，单字体族的配置中遇到保留关键字也需要套上引号。要像下面这样套多层引号，否则编译的时候会被去掉一层。

```yaml
global:
  external: true
  family: "'Noto Serif SC'"
  size:
```
