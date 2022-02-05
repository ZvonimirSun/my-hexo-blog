---
title: 八数码问题宽度优先算法
date: 2018-10-04 22:25:00
updated: 2018-10-04 22:25:00
categories:
  - 技术
tags:
  - Cpp
  - 算法
---

作业做到八数码问题，在此记录一下我的宽度优先算法的实现。

<!--more-->

## 问题描述

3×3 九宫格，放置 1 到 8 的 8 个数和一个空格，通过向空格的移动数字来改变九宫格的布局，最终达到目标状态。

要求：根据给定初始状态和目标状态，如何移动才能从初始状态到达目标状态。

## 功能设计

- 宽度优先，open 表先进先出，采用队列实现，可以将 open 表和 close 表简化为同一张表。
- 约束条件是不能将空格移出九宫格。
- 只能前进，不允许后退。

## 步骤

1. 初始状态存入 open 表
2. 若 open 表为空，则无解
3. 若 open 表不为空，open 表头移入 close 表
4. 扩展该节点并存入 open 表，如果有目标节点，则结束。
5. 没有目标节点，则转到 2。

## 程序设计

### 类声明

```cpp
//队列节点
class Node {
public:
    Node *father;//父节点
    int p;//八数码空白位置
    int cal;//操作符
    int data[9];//状态数组
    Node *next;//队列下一节点

    Node() {}
    Node(int p, int cal, int d[9]);
};

//队列
class Queue {
private:
    Node* front;//头指针
    Node* open;//open表指针
    Node* close;//close表指针
public:
    Queue();//队列初始化
    void EnQueue(Node *);//节点入队
    int DeQueue();//open表移入close表，扩展节点
    bool IsEnd();//判断算法终止
    bool IsExist(int d[9]);//判断状态是否存在
    void PrintResult();//打印结果
};
```

几个用到的函数声明

```cpp
int target[9] = { 1,2,3,8,0,4,7,6,5 };//目标状态
bool CanGo(int, int);//判断操作是否可行
bool equal(int d1[9], int d2[9]);//判断状态是否相等
```

### 函数实现

```cpp
//创建节点
Node::Node(int p, int cal, int d[9]) {
    this->p = p;
    this->cal = cal;
    for (int i = 0; i < 9; i++) {
        data[i] = d[i];
    }
}

//队列初始化
Queue::Queue() {
    front = close = open = new Node();
}

//将节点存入open表
void Queue::EnQueue(Node *n) {
    n->next = NULL;
    n->father = close;
    open->next = n;
    open = n;
    return;
}

//一次运算
int Queue::DeQueue() {
    //判断算法是否结束，未结束则将open表开头移入close表
    if (close->next) {
        close = close->next;
    }
    else {
        return -1;
    }

    //拓展节点并存入open表
    int p = close->p;
    if (CanGo(p, 1)) {
        Node* n = new Node(p - 1, 1, close->data);
        n->data[p - 1] = n->data[p - 2]; n->data[p - 2] = 0;//移动空白位置
        //判断是否为目标
        if (equal(n->data, target)) {
            EnQueue(n);
            return 1;
        }
        //不存在则入队
        if (!IsExist(n->data)) EnQueue(n);
    }
    if (CanGo(p, 2)) {
        Node* n = new Node(p - 3, 2, close->data);
        n->data[p - 1] = n->data[p - 4]; n->data[p - 4] = 0;
        if (equal(n->data, target)) {
            EnQueue(n);
            return 1;
        }
        if (!IsExist(n->data)) EnQueue(n);
    }
    if (CanGo(p, 3)) {
        Node* n = new Node(p + 3, 3, close->data);
        n->data[p - 1] = n->data[p + 2]; n->data[p + 2] = 0;
        if (equal(n->data, target)) {
            EnQueue(n);
            return 1;
        }
        if (!IsExist(n->data)) EnQueue(n);
    }
    if (CanGo(p, 4)) {
        Node* n = new Node(p + 1, 4, close->data);
        n->data[p - 1] = n->data[p]; n->data[p] = 0;
        if (equal(n->data, target)) {
            EnQueue(n);
            return 1;
        }
        if (!IsExist(n->data)) EnQueue(n);
    }
    return 0;
}

//判断算法是否终止，如果open表为空，说明没有解法
bool Queue::IsEnd() {
    if (close == open) return true;
    else return false;
}

//遍历表，判断状态是否存在过
bool Queue::IsExist(int d[9]) {
    Node* tmp = front;
    do {
        tmp = tmp->next;
        if (equal(tmp->data, d)) return true;
    } while (tmp->next);
    return false;
}

//打印结果
void Queue::PrintResult() {
    Node* tmp = open;
    for (int i = 0; i < 9; i++) {
        cout << tmp->data[i] << "\t";
        if (i % 3 == 2) cout << endl;
    }
    while (tmp->father->p > 0)
    {
        tmp = tmp->father;
        cout << endl << "\t/\\" << endl << "\t||" << endl << endl;
        for (int i = 0; i < 9; i++) {
            cout << tmp->data[i] << "\t";
            if (i % 3 == 2) cout << endl;
        }
    }
}

//判断操作是否可行
bool CanGo(int p, int cal) {
    if (cal == 1 && p != 1 && p != 4 && p != 7) return true;
    if (cal == 2 && p != 1 && p != 2 && p != 3) return true;
    if (cal == 3 && p != 7 && p != 8 && p != 9) return true;
    if (cal == 4 && p != 3 && p != 6 && p != 9) return true;
    return false;
}

//判断两个数组是否完全相等，用于判断八数码状态是否经历过
bool equal(int d1[9], int d2[9]) {
    int i;
    for (i = 0; i < 9; i++) {
        if (d1[i] != d2[i]) {
            break;
        }
    }
    if (i >= 9) return true;
    return false;
}
```

### 主函数

```cpp
int main() {
    int d[9] = { 2,8,3,1,6,4,7,0,5 };//初始状态
    int success = 0;//结果标志
    Node* f = new Node(8, -1, d);//建立初始节点
    Queue table;//新建链表
    table.EnQueue(f);//将起始节点放入open表

    //当open表不为空，则继续运算
    while (!table.IsEnd()) {
        success = table.DeQueue();
        if (success == -1) break;
        if (success == 1) break;
    }

    if (success == 1) table.PrintResult();//打印节点
    else printf("No result!");

    system("pause");//按任意键退出

    return 0;
}
```

### 实现效果

![](https://img.iszy.xyz/20190318211228.png)

## 后话

程序不太好看，仅仅满足实现，欢迎指正。
