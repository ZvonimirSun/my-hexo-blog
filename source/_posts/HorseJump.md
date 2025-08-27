---
title: 跳马算法
date: 2017-09-26 06:00:00
updated: 2017-09-26 06:00:00
tags:
  - GIS
  - Csharp
  - 算法
keywords: 跳马算法, C#, GIS算法
---

有一 m \* n 的棋盘(即棋盘由 m 行和 n 列)，一马放在棋盘中任意位置，马按中国象棋跳法，从初始位置起跳，跳至边界后返回，求所有能返回初始位置的周游路线。

<!--more-->

## 原理

1. 遍历棋盘
2. 记录路径
3. 到达目标后，打印路径
4. 进行回溯，继续寻找路径

## 代码

Github 库地址：[https://github.com/ZvonimirSun/HorseJump](https://github.com/ZvonimirSun/HorseJump)

```csharp
using System;

namespace 跳马
{
    class Horse
    {
        //记录路径数
        public int num { get; set; }

        int x0, y0, cx, cy;
        int[,] dir = { { 1, 2 }, { 2, 1 }, { 2, -1 }, { 1, -2 }, { -1, -2 }, { -2, -1 }, { -2, 1 }, { -1, 2 } };           //方位矩阵
        int[,] path = new int[100, 2];         //记录路径
        int[,] result = new int[20, 20];          //记录结果

        // 通过构造函数获得初始位置，棋盘大小等信息，
        // 并运行计算
        public Horse(int x0, int y0, int cx, int cy)
        {
            path[0, 0] = this.x0 = x0;
            path[0, 1] = this.y0 = y0;
            this.cx = cx;
            this.cy = cy;
            num = 0;
            Move(x0, y0, 0, 1);
        }

        //计算路径
        void Move(int x, int y, int m, int step)
        {
            int x1, y1;//记录棋子当前位置
            for (int i = m; i < 8; i++)
            {
                int flag = 0;//用作标记

                //朝某一方向前进一步
                x1 = x + dir[i, 0];
                y1 = y + dir[i, 1];

                //如果超出棋盘，回退
                if (x1 < 1 || x1 > cx || y1 < 1 || y1 > cy)
                {
                    x1 -= dir[i, 0];
                    y1 -= dir[i, 1];
                    continue;
                }

                //判断是否走过，走过回退
                for (int j = 1; j <= step; j++)
                {
                    if (x1 == path[j, 0] && y1 == path[j, 1])
                    {
                        flag = 1;
                        break;
                    }
                }
                if (flag == 1)
                {
                    x1 -= dir[i, 0];
                    y1 -= dir[i, 1];
                    continue;
                }

                //符合要求，计入路径
                path[step, 0] = x1;
                path[step, 1] = y1;

                //判断是否回到原点
                if (x1 == x0 && y1 == y0)
                {
                    //如果回到原点，判断是否已经到达过棋盘边缘，初始不算
                    for (int j = 1; j <= step; j++)
                    {
                        if (path[j, 0] == 1 || path[j, 0] == cx || path[j, 1] == 1 || path[j, 1] == cy)
                        {
                            flag = 1;
                        }
                    }

                    //如果到过棋盘边缘，说明路径符合要求，存入路径数组
                    if (flag == 1)
                    {
                        num++;//路径数加一

                        //打印路径
                        Console.Write("方案{0}：", num);
                        for (int j = 0; j <= step; j++)
                        {
                            Console.Write("({0},{1})", path[j, 0], path[j, 1]);
                        }
                        Console.WriteLine();

                        path[step, 0] = 0;
                        path[step, 1] = 0;

                        //回退并继续寻找其他方案
                        step--;
                        i++;

                        Move(path[step,0], path[step,1], i, step + 1);
                    }
                }
                else
                {
                    //未到过边缘，不符合要求，继续寻找路径
                    Move(x1, y1, 1, step + 1);
                }
            }
        }

    }

    class Program
    {
        static void Main(string[] args)
        {
            int x0, y0, cx, cy;

            //获取数据
            Console.Write("请输入棋盘宽度(3≤cx≤20)：");
            cx = int.Parse(Console.ReadLine());
            Console.Write("请输入棋盘长度(3≤cy≤20)：");
            cy = int.Parse(Console.ReadLine());
            Console.Write("请输入起始位置(1≤x0≤cx)：");
            x0 = int.Parse(Console.ReadLine());
            Console.Write("请输入起始位置(1≤y0≤cy)：");
            y0 = int.Parse(Console.ReadLine());

            //进行计算并打印
            Horse horse = new Horse(x0, y0, cx, cy);
            Console.WriteLine("总方案数：{0}", horse.num);

            Console.ReadKey(true);
        }
    }
}
```

## 操作示意

![](https://img.iszy.xyz/20190318213447.png)

**代码如果存在问题，请一定帮我指正!大神，谢谢了!**
