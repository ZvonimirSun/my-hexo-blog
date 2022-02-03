---
title: Oracle PL/SQL BREAK-ON排列实例
date: 2017-12-05 12:00:00
updated: 2017-12-05 12:00:00
categories:
  - 技术
tags:
  - Oracle
  - SQL
keywords: 笔记, Oracle, break on, SQL*Plus
---

使用 BREAK ON 语句进行排列的实例

<!--more-->

## BREAK ON 语法

1. `BRE[AK][ON report_element [action [action]]] ...`

   - report_element 的语法为`{column|expr|ROW|REPORT}`

   - action 的语法为`[SKI[P] n|[SKI[P]] PAGE][NODUP[LICATES]|DUP[LICATES]]`

2. 指定报告中发生更改的位置以及要执行的格式化操作，比如：

   - 抑制显示给定列的重复值。
   - 每次给定列值更改时跳过一行。
   - 每次给定列值发生变化或在报告结束时打印计算的数字。

3. 不带参数直接输入 BREAK 来查看当前的 BREAK 定义。

4. 此语句经常和 Compute 命令配合使用。

### 英文原文

`BRE[AK][ON report_element [action [action]]] ...`

where report_element has the syntax `{column|expr|ROW|REPORT}`

and action has the syntax `[SKI[P] n|[SKI[P]] PAGE][NODUP[LICATES]|DUP[LICATES]]`

Specifies where changes occur in a report and the formatting action to perform, such as:

- suppressing display of duplicate values for a given column

- skipping a line each time a given column value changes

- printing computed figures each time a given column value changes or at the end of the report.

See the [COMPUTE](https://docs.oracle.com/cd/E11882_01/server.112/e16604/ch_twelve014.htm#i2697257) command.

Enter BREAK with no clauses to list the current BREAK definition.

### 命令参数

| 语句            | 含义                  |
| :-------------- | :-------------------- |
| clear breaks    | 清除所有的 break 定义 |
| break on column | 在该列上中断          |
| break on row    | 在每一行上中断        |
| break on Page   | 在每一页上中断        |
| break on report | 在每一报告上中断      |
| skip n          | 跳过 n 行             |
| skip page       | 跳过未用完的页        |

## 实例

### 题目

**基于 Oracle 11g 下 hr 用户进行计算。**

显示所有部门的部门编号、名称、员工数和平均薪金，同时显示在每个部门中工作的员工的姓名、薪金和职务。

![](https://img.iszy.xyz/20190318215229.png)

### 答题

- 指定 break 参数

```sql
break on department_id on department_name on num on avg skip 1
```

- 进行查询

```sql
select d.department_id,d.department_name,
count(e1.employee_id) num,
nvl(to_char(avg(e1.salary),'999999.99'),'Null') avg,
e2.last_name,e2.salary,e2.job_id
from departments d,employees e1,employees e2
where d.department_id=e1.department_id(+)
and d.department_id=e2.department_id(+)
group by d.department_id,d.department_name,e2.last_name,e2.salary,e2.job_id
order by d.department_id,num;
```

- 清除 break 定义

```sql
clear breaks
```

### 部分结果

![](https://img.iszy.xyz/20190318215243.png)

![](https://img.iszy.xyz/20190318215256.png)
