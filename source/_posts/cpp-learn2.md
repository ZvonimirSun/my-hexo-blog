---
title: C++学习记录(2)——关于字符串
date: 2018-03-13 15:00:00
updated: 2018-03-13 15:00:00
categories:
  - 技能
  - 编程
tags:
  - Cpp
  - C语言
keywords: C++, C语言, string, char
---

本次练习是为了比较 C-字符串与 string 类型在函数实现和函数功能方面的区别与共同点，比较不使用 C++ 标准库函数和使用 C++ 标准库函数在函数实现上的区别。

<!--more-->

## 题目

判断字符串 s1 中是否包含字符串 s2，如果包含则返回第 1 个 s2 在 s1 中的第 1 个字符位置，如果 s1 中包含多个 s2，则只需找到第一个子串。按要求完成如下工作：

1. 使用 C-字符串类型表示字符串 s1 和 s2，设计一个函数实现以上功能。
2. 使用 string 类型表示字符串 s1 和 s2，并且不使用 C++ 标准库函数，设计一个函数实现以上功能。
3. 使用 string 类型表示字符串 s1 和 s2，使用 C++ 标准库函数，设计一个函数实现以上功能。

要求在 main 函数中输入两个字符串，并在 main 函数中输出 s2 在 s1 中的起始位置。

## 程序实现

### 程序 1

要求使用 C-字符串类型实现。

#### 代码

```cpp
#include <stdio.h>
#include <string.h>

int main() {
	char s1[] = { "abcdedcba" };
	char s2[] = { "dcb" };

	printf("s1: %s\n", s1);
	printf("s2: %s\n", s2);

	for (int i = 0; i < 7; i++) {
    	//长度不足的部分不需要判断
		if (s1[i] == '\0') {
			break;
		}

		if (s1[i] == s2[0]) {
			int count = 0;
			for (int j = 0; j < 3; j++) {
				if (s1[i + j] == s2[j]) {
					count++;
				}
			}
			if (count == 3) {
				printf("s1包含s2，位置为%d\n", i + 1);
				getchar();
				return 0;
			}
		}
	}
	printf("s1不包含s2\n");
	getchar();
	return 0;
}
```

#### 运行效果

![](https://img.iszy.cc/20190318212316.png)

### 程序 2

要求使用 string 类型，且不使用标准库函数。

#### 代码

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
	string s1 = "abcdedcba";
	string s2 = "dcb";

	cout << "s1: " << s1 << endl;
	cout << "s2: " << s2 << endl;

	for (int i = 0; i < s1.length() - s2.length(); i++) {
    	//长度不足的部分不需要判断
		if (s1[i] == s2[0]) {
			int count = 0;
			for (int j = 0; j < 3; j++) {
				if (s1[i + j] == s2[j]) {
					count++;
				}
			}
			if (count == s2.length()) {
				cout << "s1包含s2，位置为" << i + 1 << endl;
				getchar();
				return 0;
			}
		}
	}
	cout << "s1不包含s2" << endl;
	getchar();
	return 0;
}
```

#### 运行效果

参考程序 1，不再展示，下同。

### 程序 3

要求使用 string 类型，并使用标准库函数。

#### 代码

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
	string s1 = "abcdedcba";
	string s2 = "dcb";

	cout << "s1: " << s1 << endl;
	cout << "s2: " << s2 << endl;

	for (int i = 0; i < s1.length() - s2.length(); i++) {
    	//长度不足的部分不需要判断
		string tmp = s1.substr(i, s2.length());
		if (tmp == s2) {
			cout << "s1包含s2，位置为" << i + 1 << endl;
			getchar();
			return 0;
		}
	}

	cout << "s1不包含s2" << endl;
	getchar();
	return 0;
}
```

改，使用 string 类自带的 find 函数，之前写的那个方法感觉有点蠢呐：

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
	string s1 = "abcdedcba";
	string s2 = "dcb";

	cout << "s1: " << s1 << endl;
	cout << "s2: " << s2 << endl;

    if (s1.find(s2, 0)) {
		int i = s1.find(s2, 0);
		cout << "s1包含s2，位置为" << i + 1 << endl;
		getchar();
		return 0;
	}

	cout << "s1不包含s2" << endl;
	getchar();
	return 0;
}
```

## 思考

string 类可以方便地执行 C 字符串所不能直接完成的一切操作，它可以将字符串(string)当做一个类似于整形量的一般类型使用。拥有标准库函数的 string 类可以比 C 字符串更加高效地完成更多操作，而且不用担心出现问题。
