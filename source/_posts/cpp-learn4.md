---
title: C++学习记录(4)——类
date: 2018-03-23 18:00:00
updated: 2018-03-23 18:00:00
categories:
  - 技能
  - 编程
tags:
  - Cpp
keywords: C++, class, 类
---

本次继续学习类，初步尝试编写一个类，涉及到类的成员函数和构造函数。在此记录一下所做的练习。

<!--more-->

## 练习 1

### 题目

创建一个时间类 Time，拥有时、分和秒 3 个数据成员，成员函数包括构造函数可以设置任意时、分和秒的值，Add 函数可以为秒的值加 1，Print 函数可以打印当前对象的值。

### 代码

我对实现的函数稍微进行了一点扩充。

```cpp
#include <iostream>
#include <math.h>
using namespace std;

class Time {
private:
	int h;//时
	int m;//分
	int s;//秒
public:
	Time() {
		h = 0;
		m = 0;
		s = 0;
	};
	Time(int h, int m, int s) :h(h), m(m), s(s) {};

	inline void Add();
	inline void Add(int s);
	inline void TimeSet(int h, int m, int s);

	void Print() {
		cout << "Time: " << h << "." << m << "." << s << endl;
	}
};

void Time::Add() {
	s++;
	if (s == 60) {
		s = 0;
		m++;
	}
	if (m == 60) {
		m = 0;
		h++;
	}
	if (h == 24) {
		h = 0;
	}
}

void Time::Add(int ss) {
	int t = 3600 * h + 60 * m + s + ss;
	t = t % (3600 * 24);
	s = t % 60;
	m = t / 60 % 60;
	h = t / 3600;
}

void Time::TimeSet(int hh, int mm, int ss) {
	h = hh;
	m = mm;
	s = ss;
}

int main() {
	cout << "Test:" << endl;

	cout << "初始化时间:" << endl;
	Time time(6, 59, 30);
	time.Print();

	cout << "加29秒" << endl;
	time.Add(29);
	time.Print();

	cout << "加1秒" << endl;
	time.Add();
	time.Print();

	getchar();
	return 0;
}
```

## 练习 2

### 题目

设计一个矩形类 Rectangle，其数据成员包括矩形的左下角和右上角的坐标，要求该类具有调整矩形左上角和右下角两个坐标的函数，可以求矩形的面积。

### 代码

```cpp
#include <iostream>
#include <math.h>
using namespace std;

class Rectangle {
private:
	int xl;
	int yl;
	int xr;
	int yr;
public:
	Rectangle() {
		xl = 0; yl = 0;
		xr = 0; yr = 0;
	};
	Rectangle(int xl, int yl, int xr, int yr) :xl(xl), yl(yl), xr(xr), yr(yr) {};
	inline void setLT(int x, int y);
	inline void setRB(int x, int y);
	inline int area();
	void print() {
		cout << "xl:" << xl << "\tyl:" << yl << endl;
		cout << "xr:" << xr << "\tyr:" << yr << endl;
		cout << "area:" << area() << endl;
	}
};

void Rectangle::setLT(int x, int y) {
	xl = x;
	yl = y;
}

void Rectangle::setRB(int x, int y) {
	xr = x;
	yr = y;
}

int Rectangle::area() {
	return abs((xl - xr)*(yl - yr));
}

int main() {
	cout << "测试:" << endl;
	cout << endl;
	cout << "初始化定义:" << endl;
	Rectangle rec(2, 2, 3, 4);
	rec.print();
	cout << endl;
	cout << "利用方法改变坐标:" << endl;
	rec.setLT(1, 1);
	rec.setRB(5, 6);
	rec.print();

	getchar();

	return 0;
}
```
