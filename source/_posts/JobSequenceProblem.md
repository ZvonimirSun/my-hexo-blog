---
title: 最佳工作序列算法
date: 2017-09-26 09:00:00
updated: 2017-09-26 09:00:00
categories:
  - 技能
  - 编程
tags:
  - GIS
  - Csharp
  - 算法
keywords: 最佳工作序列, C#, GIS算法
---

有 N 件工作，输入每件工作的费时、最后完成的期限及工作的价值，试求可能的一个完成工作序列，使价值和最大。

<!--more-->

## 原理

1. 按照最后期限越短越先，其次价值越高越先，再次费时越短越先的标准对所有任务进行排序。
2. 将综合排序最高的加入背包
3. 计算是否超出期限
4. 重复前面的步骤，知道所有任务完成

## 代码

Github 库地址：[https://github.com/ZvonimirSun/JobSequenceProblem](https://github.com/ZvonimirSun/JobSequenceProblem)

```csharp
// Program to find the maximum profit job sequence from a given array
// of jobs with deadlines and profits

using System;

namespace 最佳工作序列
{
    class Program
    {
        //任务结构
        public struct Job
        {
            public int id { get; set; }
            public int time { get; set; }
            public int ddl { get; set; }
            public int profit { get; set; }
        }

        public class Work
        {
            //选出价值较大的
            public bool compare(Job a, Job b)
            {
                return (a.profit > b.profit);
            }

            //选出较小值
            public int min(int a, int b)
            {
                if (a <= b)
                    return a;
                else
                    return b;
            }

            //选出较大值
            public int max(int a, int b)
            {
                if (a >= b)
                    return a;
                else
                    return b;
            }

            //冒泡排序算法
            void Sort(Job[] arr)
            {
                for (int i = 0; i < arr.Length - 1; i++)
                {
                    for (int j = 0; j < arr.Length - i - 1; j++)
                    {
                        if (compare(arr[j + 1], arr[j]))
                        {
                            Job tem = arr[j];
                            arr[j] = arr[j + 1];
                            arr[j + 1] = tem;
                        }
                    }
                }
            }

            //计算最佳工作序列
            public void printJobScheduling(Job[] arr, int n)
            {
                //对所有工作进行排序
                Sort(arr);

                //统计最大期限
                int T = 0;
                for (int i = 0; i < n; i++)
                {
                    T = max(T, arr[i].ddl);
                }

                int[] result = new int[n]; //存储队列
                int[] slot = new int[T];  //监控时间间隙

                int t = 0;//工作序列耗时
                int worth = 0;//工作序列总价值

                //初始化时间数组为-1
                for (int i = 0; i < T; i++)
                    slot[i] = -1;

                //计算最佳序列
                for (int i = 0; i < n; i++)
                {
                    //查找期限中是否有时间空位
                    for (int j = arr[i].ddl - 1; j >= 0; j--)
                    {
                        //如果有空位，判断是否有足够费时的时长空隙
                        if (slot[j] == -1)
                        {
                            //标记
                            int flag = 0;

                            //如果空位少于费时，标记为1，并退出
                            for (int k = j; k >= j - arr[i].time + 1; k--)
                            {
                                if (j - arr[i].time + 1 < 0)
                                {
                                    flag = 1;
                                    break;
                                }
                                if (slot[k] != -1) flag = 1;
                            }

                            //当有足够时间，将时间数组命名为任务引导号
                            if (flag == 0)
                            {
                                for (int k = j; k >= j - arr[i].time + 1; k--)
                                    slot[k] = i;
                                break;
                            }
                        }
                    }
                }

                //录入结果
                for (int i = 0; i < n; i++)
                {
                    result[i] = -1;
                }
                for (int i = 0, j = 0; i < n && j < T; j++)
                {
                    if (j == 0)
                    {
                        if (slot[j] != -1)
                        {
                            result[i] = arr[slot[j]].id;
                            t += arr[slot[j]].time;
                            worth += arr[slot[j]].profit;
                            i++;
                            continue;
                        }
                    }
                    if (slot[j] == -1)
                        continue;
                    else if (slot[j] != slot[j - 1])
                    {
                        result[i] = slot[j];
                        t += arr[slot[j]].time;
                        worth += arr[slot[j]].profit;
                        i++;
                        continue;
                    }
                }

                //打印结果
                for (int i = 0; i < n; i++)
                {
                    if (result[i] != -1)
                        Console.Write("{0}", arr[result[i]].id);
                }
                Console.WriteLine();

                //打印时间序列
                Console.Write("时间序列:");
                for(int i=0;i<T;i++)
                {
                    if (slot[i] == -1)
                        Console.Write("0");
                    else
                        Console.Write("{0}", arr[slot[i]].id);
                }
                Console.WriteLine();

                Console.WriteLine("总耗时为:{0}", t);
                Console.WriteLine("总价值为:{0}", worth);
            }
        }

        static void Main(string[] args)
        {
            Work work = new Work();
            Console.Write("请输入任务个数:");
            int n = int.Parse(Console.ReadLine());//记录信息个数

            //输入任务信息
            Job[] arr = new Job[n];
            for (int i = 0; i < n; i++)
            {
                arr[i].id = i + 1;
                Console.Write("请输入任务{0}的费时:", i + 1);
                arr[i].time = int.Parse(Console.ReadLine());
                Console.Write("请输入任务{0}的最后期限:", i + 1);
                arr[i].ddl = int.Parse(Console.ReadLine());
                Console.Write("请输入任务{0}的价值:", i + 1);
                arr[i].profit = int.Parse(Console.ReadLine());
            }

            //打印任务表
            Console.WriteLine();
            Console.WriteLine("ID\t费时\t期限\t价值");
            for (int i = 0; i < n; i++)
            {
                Console.WriteLine("{0}\t{1}\t{2}\t{3}", arr[i].id, arr[i].time, arr[i].ddl, arr[i].profit);
            }
            Console.WriteLine();

            Console.WriteLine("下面即为最佳工作序列");
            work.printJobScheduling(arr, n);
            Console.ReadKey(true);
        }
    }
}
```

## 操作示意

![](https://img.iszy.cc/20190318213542.png)

**代码如果存在问题，请一定帮我指正!大神，谢谢了!**

---

**参考链接:**

1. [Job Sequencing Problem - Set 1 (Greedy Algorithm)](http://www.geeksforgeeks.org/job-sequencing-problem-set-1-greedy-algorithm/)
2. [Job Sequencing Problem - Set 2 (Using Disjoint Set)](http://www.geeksforgeeks.org/job-sequencing-using-disjoint-set-union/)
