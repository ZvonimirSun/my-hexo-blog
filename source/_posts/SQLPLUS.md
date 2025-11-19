---
title: Oracle SQLPLUS命令
date: 2017-09-26 15:00:00
updated: 2017-09-26 15:00:00
tags:
  - SQL
  - 数据库
  - Oracle
keywords: SQL
---

今天学习了 Oracle SQL\*PLUS 的语句，就在这里总结一下。

<!--more-->

## 官方的 HELP INDEX 截图

![](https://img.iszy.cc/20190318220212.png)

## 语句总结

|        SQL 语句         |                  说明                   |
| :---------------------: | :-------------------------------------: |
|            @            |              运行指定脚本               |
|           @@            |      同@，运行 nest script 时使用       |
|            /            |              执行最近脚本               |
|         Accept          |     接受用户输入行存储到替代变量中      |
|         Append          |          向当前 SQL 行追加文本          |
|       Archive log       |           查看和管理归档信息            |
|        attribute        |      设置 object 类型 column 属性       |
|          break          |               分开重复列                |
|         Btitle          |             设置 report 尾              |
|         change          |              修改错误代码               |
|          clear          |                  清楚                   |
|         column          |                 命令集                  |
|         Compute         |             运算查询结果集              |
|         Connect         |           会话中切换连接命令            |
|          Copy           |                  复制                   |
|         Define          |                定义变量                 |
|           Del           |         删除 SQL BUFFER 指定行          |
|        Describe         |  描述表、视图的列以及函数、程序的说明   |
|       Disconnect        |                断开连接                 |
|          Edit           |           创建或编辑 sql 脚本           |
|           Get           | 将 sql 脚本从文件 load into sql buffer  |
|          Help           |                  帮助                   |
|          Host           | sql 会话模式利用 host 命令调用 cmd 命令 |
|          Input          |        追加新行 enter a new line        |
|          List           |       列出 SQL BUFFER 中 sql 语句       |
|        Password         |         修改 current user 密码          |
|          Pause          |                  暂停                   |
|          Print          |                打印变量                 |
|         Prompt          |           向 screen 发送消息            |
|          Quit           |               用法同 exit               |
|        Recovery         |            恢复数据库等操作             |
|         Remark          |                单行注释                 |
|        Repfooter        |       放置 report 头（见 ttitle）       |
|        Repheader        |             放置 report 角              |
|  Reserved words (SQL)   |               SQL 保留字                |
| Reserved words (PL/SQL) |              PL/SQL 保留字              |
|           Run           |   列出 sql buffer 内容同时执行该内容    |
|          Save           |             保存缓冲区内容              |
|           Set           |                  设置                   |
|          Show           |            显示变量或参数值             |
|        Shutdown         |       关闭数据库（DBA 用户执行）        |
|          Spool          |          将屏幕显示保存到文件           |
|         Sqlplus         |                                         |
|          Start          |             恢复 set 变量值             |
|         Startup         |       启动数据库（DBA 用户执行）        |
|          Store          |             存储 set 变量值             |
|         Timing          |                 计时器                  |
|         Ttitle          |            设置 report 抬头             |
|        Undefined        |                                         |
|        Variable         |       声明绑定变量供 PLSQL 块引用       |
|    Whenever oserror     |         执行命令中遇到系统异常          |
|   Whenerror sqlerror    |         执行命令中遇到 SQL 异常         |
|         Xquery          |            运行 xquery 语句             |
