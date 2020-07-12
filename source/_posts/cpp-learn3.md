---
title: C++学习记录(3)——类与结构体
date: 2018-03-23 06:00:00
updated: 2018-03-23 06:00:00
categories:
  - 技能
  - 编程
tags:
  - Cpp
keywords: C++, C语言, class, struct, 结构体, 类
---

本次初步引入了 C++ 中的类，在这里准备将 C 语言中的结构体与 C++ 中的类做一个简单的对比。本文中指的结构体皆为 C 语言中的结构体。

<!--more-->

## 结构体

### 结构体的定义

```cpp
struct Date
{
	int year;
    int month;
    int day;
};
```

### 定义变量方法

```cpp
Date today,yesterday,tomorrow;

today.year=2018;
today.month=3;
today.day=23;

yesterday.day=22;
```

### 操作结构体变量

```cpp
void init(Date& date,int& year,int& month,int& day)
{
	date.year=year;
    date.month=month;
    date.day=day;
}

int main()
{
	Date today;
    init(today,2018,3,23);
    cout << today.year << "-" << today.month << "-" << today.day << endl;
    return 0;
}
```

## 类

### 类的声明

```cpp
class Date
{
private:
	int year;
    int month;
    int day;
public:
	void init(int year,int month,int day)
    {
    	this.year=year;
        this.month=month;
        this.day=day;
    }
    void print()
    {
    	cout << year << "-" << month << "-" << day << endl;
    }
};
```

### 对象的定义与操作

```cpp
int main()
{
	Date today;
	today.init(2018,3,23);
	today.print();
    return 0;
}
```

## 区别与联系

- 类本质上也是结构体
- 类比结构体增加了成员函数
- 结构体定义的是变量，类定义的是对象
- 类的对象有了操作自己数据的能力
- 类比结构体增加了访问权限的限制

## C++ 中的结构体

C++ 中也有结构体，已经和 C 语言有了很大的区别，对 C 语言中的结构体进行了扩充。C++ 中的结构体其实本质上和类已经没有区别了，也可以包含成员函数，也可以继承等等。

C++ 中 struct 和 class 的本质区别在于以下两点：

- 默认的继承访问权限。struct 是 public 的，class 是 private 的。
- 默认的数据访问控制。struct 是 public 的，class 是 private 的。
