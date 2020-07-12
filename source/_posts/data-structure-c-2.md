---
title: 数据结构(C语言版)——单链表顺序存储结构
date: 2018-07-13 12:00:00
updated: 2018-07-13 12:00:00
categories:
  - 技能
  - 编程
tags:
  - 数据结构
  - C语言
keywords: 单链表,顺序存储,数据结构,C语言,C,绪论,严蔚敏,吴伟民
---

单链表顺序存储结构的代码实现。

<!--more-->

## 定义与声明

```c
#ifndef _LINEAR_LIST_H_
#define _LINEAR_LIST_H_
#include <stdio.h>

#define LIST_INIT_SIZE 100
#define LISTINCREMENT 10

typedef int ElemType;

typedef struct {
	ElemType *elem;
	int length;
	int listsize;
}Sqlist;

int InitList(Sqlist*);
void DestroyList(Sqlist*);
void ClearList(Sqlist*);
int ListEmpty(Sqlist);
int ListLength(Sqlist);
int GetElem(Sqlist, int, ElemType*);
int LocateElem(Sqlist, ElemType, int compare(ElemType, ElemType));
int PriorElem(Sqlist, ElemType, ElemType*);
int NextElem(Sqlist, ElemType, ElemType*);
int ListInsert(Sqlist*, int, ElemType);
int ListDelete(Sqlist*, int, ElemType*);
int ListTraverse(Sqlist, int visitor(ElemType));

#endif // !_LINEAR_LIST_H_

```

## 函数实现

```c
#include <stdio.h>
#include <stdlib.h>
#include "linear_list.h"

int InitList(Sqlist* L) {
	(*L).elem = (ElemType*)malloc(LIST_INIT_SIZE * sizeof(ElemType));
	(*L).length = 0;
	(*L).listsize = LIST_INIT_SIZE;
	return 1;
}

void DestroyList(Sqlist* L) {
	free(L->elem);
	L->elem = NULL;
	L->length = 0;
	L->listsize = 0;
}

void ClearList(Sqlist* L) {
	L->length = 0;
}

int ListEmpty(Sqlist L) {
	return L.length == 0 ? 1 : 0;
}

int ListLength(Sqlist L) {
	return L.length;
}

int GetElem(Sqlist L, int i, ElemType* e) {
	if (i<0 || i>L.length)
		return 0;
	else
		*e = L.elem[i - 1];
	return 1;
}

int LocateElem(Sqlist L, ElemType e, int compare(ElemType, ElemType)) {
	for (int i = 1; i <= L.length; i++) {
		if (compare(e, L.elem[i - 1]))
			return i;
	}
	return 0;
}

int PriorElem(Sqlist L, ElemType cur_e, ElemType* pri_e) {
	if (L.elem[0] != cur_e) {
		for (int i = 1; i < L.length; i++) {
			if (L.elem[i] == cur_e) {
				*pri_e = L.elem[i - 1];
				return 1;
			}
		}
	}
	return 0;
}

int NextElem(Sqlist L, ElemType cur_e, ElemType* next_e) {

	for (int i = 0; i < L.length - 1; i++) {
		if (L.elem[i] == cur_e) {
			*next_e = L.elem[i + 1];
			return 1;
		}
	}
	return 0;
}

int ListInsert(Sqlist* L, int i, ElemType e) {
	ElemType *tmp, *p, *q;
	if (i < 1 || i>L->length + 1)
		return 0;
	if (L->length >= L->listsize) {
		tmp = (ElemType*)realloc(L->elem, (L->length + LISTINCREMENT) * sizeof(ElemType));
		if (!tmp)
			exit(-2);
		L->elem = tmp;
		L->listsize += LISTINCREMENT;
	}
	q = &(L->elem[i - 1]);
	for (p = &(L->elem[L->length - 1]); p >= q; p--)
		*(p + 1) = *p;
	*q = e;
	L->length++;
	return 1;
}

int ListDelete(Sqlist* L, int i, ElemType* e) {
	ElemType *p, *q;
	if (i<1 || i>L->length)
		return 0;
	q = &(L->elem[i - 1]);
	*e = *q;
	for (p = &(L->elem[L->length - 1]), ++q; q <= p; ++q)
		*(q - 1) = *q;
	L->length--;
	return 1;
}

int ListTraverse(Sqlist L, int visitor(ElemType)) {
	for (int i = 0; i < L.length; i++) {
		if (!visitor(L.elem[i]))
			return 0;
	}
	return 1;
}
```
