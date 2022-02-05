---
title: 如何在JAVA中比较两个String对象
date: 2019-07-24 19:00:00
updated: 2019-07-24 19:00:00
categories:
  - 技术
tags:
  - Java
  - 知识笔记
---

记录一下，最近在 JAVA 中比较两个 String 对象遇到的一个小坑。

<!--more-->

## 问题

最近写程序的时候，遇到了需要比较两个 String 对象是否相等的情况，我习惯性的写了形如`if(a == "a"){}`的语句，IDEA 跳出警告，内容如下:

```text
String values are compared using '==', not 'equals()'.
```

也就是说我刚刚那句话应该写成`if(a.equals("a")){}`才对，果然不再标红了。

## 说明

那么，为什么会这样呢？`==`和`equals()`分别是什么效果呢？

对于基本数据类型`byte`(字节型)、`short`(短整型)、`int`(整型)、`long`(长整型)、`float`(单精度浮点型)、`double`(双精度浮点型)、`boolean`(布尔型)、`char`(字符型)，`==`比较的就是他们的值，也不存在`equals()`方法。

而对于`String`这样的引用数据类型，`==`比较的是两个对象的**引用地址**即内存地址是否相同，如果内存地址相同，自然就是同一个对象了，同一个对象之间有啥好比的。

我们一般的应用场景主要是要比较两个 String 对象的内容，那就需要使用`equals()`方法。我们可以看一下`java.lang.String`中`equals()`方法的定义，可以看到`equals()`才是在比较两个 String 对象的值。

```java
/**
* Compares this string to the specified object.  The result is {@code
* true} if and only if the argument is not {@code null} and is a {@code
* String} object that represents the same sequence of characters as this
* object.
*
* @param  anObject
*         The object to compare this {@code String} against
*
* @return  {@code true} if the given object represents a {@code String}
*          equivalent to this string, {@code false} otherwise
*
* @see  #compareTo(String)
* @see  #equalsIgnoreCase(String)
*/
public boolean equals(Object anObject) {
    if (this == anObject) {
        return true;
    }
    if (anObject instanceof String) {
        String anotherString = (String)anObject;
        int n = value.length;
        if (n == anotherString.value.length) {
            char v1[] = value;
            char v2[] = anotherString.value;
            int i = 0;
            while (n-- != 0) {
                if (v1[i] != v2[i])
                    return false;
                i++;
            }
            return true;
        }
    }
    return false;
}
```

还有一个特例的情况，比如`"abcde" == "abcde"`或是`"abcde" == "abc" + "de"`都是会返回`true`的，因为双方都是由编译器直接实现的，没有被声明为变量。

## 小结

当然，如果你知道自己在做什么，就是要利用`==`的这个特性，自然是没有问题的。其他时候用`equals()`方法即可。
