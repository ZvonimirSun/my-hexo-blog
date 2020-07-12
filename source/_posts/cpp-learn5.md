---
title: C++学习记录(5)——析构函数与复制构造函数
date: 2018-04-02 18:00:00
updated: 2018-04-02 18:00:00
categories:
  - 技能
  - 编程
tags:
  - Cpp
keywords: C++, class, 类, 析构函数, 复制构造函数
---

上一篇文章中，学习了如何写一个类，和使用类的构造函数。这篇文章记录一下类的析构函数和复制构造函数。顺便吐槽一下，这老师讲课真的是太慢了呀。

<!--more-->

## 析构函数

### 简介

程序的运行中，内存一般分为如下几段。

- 代码段：显而易见，是用来存放运行代码的
- 数据段：用于存储全局变量和静态成员等，在程序开始时开辟空间，结束时自动释放
- 栈：用于存储局部变量，在函数运行完成时自动释放
- 堆：用于存储使用 malloc 或 new 等申请的内存空间，不会自动释放内存

由于堆中的内存空间不会被自动清理，在程序结束后，这部分内存将不再可用，被称之为内存泄漏。新版本系统已经会在程序结束后自动清理内存，不会再出现这种问题，但这样的错误还是要避免的，这就需要在析构函数中释放这些内存。

### 特点

- 在没有写析构函数的程序中，编译器将自动添加一个空的默认析构函数。
- 析构函数无法重载，只能有一个析构函数。
- 将在对象生命周期结束时，自动执行

### 实例

```cpp
#include <iostream>
using namespace std;

class Person {
private:
	char* pName;
public:
	Person(const char* pN = "noName") {
		cout << "Constructing " << pN << "\n";
		pName = new char[strlen(pN) + 1];
		if (pName)
			strcpy(pName, pN);
	}
	~Person() {
		cout << "Destructing " << pName << "\n";
		delete[]pName;
	}
};

void main() {
	Person p1("Randy");
}
```

## 复制构造函数

### 简介

当需要用到用一个已有的对象复制出多个完全相同的对象，将会调用复制对象函数。

### 特点

- 参数需要加上 const 声明
- 参数必须使用引用类型
- 未添加时会自动添加一个空复制构造函数

### 实例

```cpp
#include <iostream>
using namespace std;

class CPoint
{
public:
	CPoint(int x = 0, int y = 0) {
		nPosX = x;
		nPosY = y;
	}
	CPoint(const CPoint& pt) :nPosX(pt.nPosX), nPosY(pt.nPosY) {}
	~CPoint() {}
	void print() {
		cout << "X=" << nPosX << ",Y=" << nPosY << endl;
	}
private:
	int nPosX, nPosY;
};

void main() {
	CPoint pt1(1, 2);
	pt1.print();
	CPoint pt2(pt1);
	pt2.print();
	CPoint pt3 = pt2, pt4(pt3);
	pt3.print();
	pt4.print();
}
```
