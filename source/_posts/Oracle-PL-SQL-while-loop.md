---
title: Oracle PL/SQL while loop循环实例
date: 2017-11-29 12:00:00
updated: 2017-11-29 12:00:00
categories:
  - 技能
  - 数据库
tags:
  - Oracle
  - SQL
keywords: Oracle, while-loop, 循环, PL/SQL
---

用 while loop 语句进行循环计算的一个实例。最近做题遇到，在此记录。

<!--more-->

## WHILE-LOOP 语法

当**条件为真**时，执行语句。

```sql
WHILE condition LOOP
	some_statements;
END LOOP;
```

## 实例

### 题目

给出一个 Power 表(表 1)的数据如下：

![](https://img.iszy.cc/20190318215310.png)

1. 3 日的电费=1 日+2 日
2. 4 日的电费=2 日+3 日

**要求:**

编写 SQL 语句，最终显示出六月所有电费。

### 答题

#### 创建表，存入初始数据

```sql
create table power(mon int,day int,fee int);
insert into power values(6,1,60);
insert into power values(6,2,34);
```

![](https://img.iszy.cc/20190318215323.png)

#### 计算整月的电费

```sql
declare
	a number;
	b number;
	x number;
	y number;
begin
	a:=1;
	b:=2;
	while (b<=29) loop
		select fee
		into x
		from power
		where day=a;
		select fee
		into y
		from power
		where day=b;
		insert into power values(6,a+2,x+y);
		a:=a+1;
		b:=b+1;
	end loop;
end;
/
```

![](https://img.iszy.cc/20190318215335.png)

#### 显示结果

```sql
select * from power;
```

![](https://img.iszy.cc/20190318215348.png)
