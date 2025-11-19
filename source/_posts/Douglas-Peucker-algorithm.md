---
title: 道格拉斯—普克法
date: 2017-10-17 12:00:00
updated: 2017-10-17 12:00:00
tags:
  - GIS
  - Csharp
  - 算法
---

## 算法描述

道格拉斯-普克算法(Douglas–Peucker algorithm，亦称为拉默-道格拉斯-普克算法、迭代适应点算法、分裂与合并算法)是将曲线近似表示为一系列点，并减少点的数量的一种算法。它的优点是具有平移和旋转不变性，给定曲线与阈值后，抽样结果一定。

<!--more-->

## 思路

- 首先，将一条曲线首末点连一条直线
- 求出其余各点到该直线的距离
- 选其最大者与规定的临界值相比较
  - 若大于临界值，则离该直线距离最大的点保留
  - 否则将直线两端间各点全部舍去

![](https://img.iszy.cc/20190318212807.png)

## 要求

1. 根据道格拉斯一普克法，编写程序对经过兰勃特投影的中国版图数据进行抽稀处理 （不限语言）
2. 屏幕绘图显示压缩前后的地图数据
3. 数据压缩率为 50%

## 代码

Github 库地址:[https://github.com/ZvonimirSun/DouglasPeucker](https://github.com/ZvonimirSun/DouglasPeucker)

```csharp
using System;
using System.Collections.Generic;
using System.Windows.Forms;
using System.IO;

namespace 道格拉斯_普克法
{
    public partial class DouglasPeucker : Form
    {
        public DouglasPeucker()
        {
            InitializeComponent();
        }

        public struct Point
        {
            public double x { get; set; }
            public double y { get; set; }
            public bool existance { get; set; }
        }

        /// <summary>
        /// 道格拉斯普拉格压缩算法
        /// </summary>
        public class Compress
        {
            public List<Point[]> lineList = new List<Point[]>();
            private double e;// 误差限制

            /// <summary>
            /// 运行算法
            /// </summary>
            /// <param name="filePath">文档路径</param>
            /// <param name="outPath">输出路径</param>
            public Compress(string filePath, string outPath, double e)
            {
                this.e = e;
                readFile(filePath);
                for (int i = 0; i < lineList.Count; i++)
                {
                    compressFile(1, (int)lineList[i][0].x, i);
                }
                writeFile(outPath);
            }

            /// <summary>
            /// 读取文档
            /// </summary>
            /// <param name="P">文档所在路径</param>
            void readFile(string P)
            {
                try
                {
                    //
                    int flag = 0;
                    StreamReader sr = new StreamReader(P);
                    Point[] pointList = new Point[1000];
                    int count = 0;
                    while (!sr.EndOfStream)
                    {
                        // 按行读取文件
                        string line = sr.ReadLine();

                        // 判断是否为线的开始
                        int temp;
                        if (int.TryParse(line, out temp))
                        {
                            pointList = new Point[1000];
                            count = 0;
                            flag = 1;
                            continue;
                        }

                        // 判断结尾
                        if (line == "END")
                        {
                            // 线的结束
                            if (flag == 1)
                            {
                                pointList[0].x = count;

                                lineList.Add(pointList);
                                flag = 0;
                                continue;
                            }
                            if (flag == 0)
                            {
                                break;
                            }
                        }

                        // 如果不是开头或结尾，则读取点
                        string[] p = line.Split(',');

                        count++;
                        pointList[count].x = double.Parse(p[0]);
                        pointList[count].y = double.Parse(p[1]);
                        pointList[count].existance = true;
                    }
                }
                catch
                {
                    MessageBox.Show("Error!");
                }
            }

            /// <summary>
            /// 压缩算法
            /// </summary>
            /// <param name="FirstPoint">线的开始节点</param>
            /// <param name="LastPoint">线的结束节点</param>
            /// <param name="index">线的索引</param>
            void compressFile(int FirstPoint, int LastPoint, int index)
            {
                double max = 0;// 记录最大距离
                int FarthestPoint = 0;// 记录最远节点

                // 如果只剩两个节点则退出
                if ((LastPoint - FirstPoint) > 1)
                {
                    // 判断是否为环路
                    if (lineList[index][FirstPoint].x == lineList[index][LastPoint].x && lineList[index][FirstPoint].y == lineList[index][LastPoint].y)
                    {
                        int mid = (int)((FirstPoint + LastPoint) / 2);// 拆分环路
                        compressFile(FirstPoint, mid, index);
                        compressFile(mid, LastPoint, index);
                    }

                    // 寻找最大距离
                    for (int i = FirstPoint + 1; i < LastPoint; i++)
                    {
                        double temp = pointToLineDistance(lineList[index][FirstPoint], lineList[index][LastPoint], lineList[index][i]);
                        if (temp > max)
                        {
                            max = temp;
                            FarthestPoint = i;
                        }
                    }

                    // 根据界限判断是否压缩
                    if (max <= e)
                    {
                        for (int i = FirstPoint + 1; i < LastPoint; i++)
                        {
                            lineList[index][i].existance = false;
                        }
                    }
                    else
                    {
                        compressFile(FirstPoint, FarthestPoint, index);
                        compressFile(FarthestPoint, LastPoint, index);
                    }
                }
            }

            /// <summary>
            /// 输出压缩后的文件
            /// </summary>
            /// <param name="P">输出路径</param>
            void writeFile(string P)
            {
                try
                {
                    StreamWriter sw = new StreamWriter(File.Open(P, FileMode.Create));
                    for (int i = 0; i < lineList.Count; i++)
                    {
                        sw.WriteLine(i + 1);
                        for (int j = 1; j <= lineList[i][0].x; j++)
                        {
                            if (lineList[i][j].existance)
                            {
                                sw.Write("{0},{1}", lineList[i][j].x, lineList[i][j].y);
                                sw.WriteLine();
                            }
                        }
                        sw.WriteLine("END");
                    }
                    sw.WriteLine("END");
                    sw.Close();
                    MessageBox.Show("Success!");
                }
                catch
                {
                    MessageBox.Show("Error!");
                }
            }

            /// <summary>
            /// 计算点到线的距离
            /// </summary>
            /// <param name="A">直线的一个端点</param>
            /// <param name="B">直线的另一个端点</param>
            /// <param name="P">需要计算距离的点</param>
            /// <returns>返回距离</returns>
            double pointToLineDistance(Point A, Point B, Point P)
            {
                double normalLength = Math.Sqrt((B.x - A.x) * (B.x - A.x) + (B.y - A.y) * (B.y - A.y));
                return Math.Abs((P.x - A.x) * (B.y - A.y) - (P.y - A.y) * (B.x - A.x)) / normalLength;
            }
        }

        /// <summary>
        /// 打开文件
        /// </summary>
        private void btnOpen_Click(object sender, EventArgs e)
        {
            using (OpenFileDialog OpenFD = new OpenFileDialog())     //实例化一个 OpenFileDialog 的对象
            {
                OpenFD.Filter = "Generate Files (*.gen)|*.gen|" + "All files (*.*)|*.*";
                //定义打开的默认文件夹位置
                OpenFD.InitialDirectory = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);
                if (OpenFD.ShowDialog() == DialogResult.OK)                            //显示打开本地文件的窗体
                {
                    txtFile.Text = OpenFD.FileName;
                }
            }
        }

        /// <summary>
        /// 压缩文件并输出
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void btnCompress_Click(object sender, EventArgs e)
        {
            if (txtFile.Text != "")
            {
                if (txtE.Text != "")
                {
                    double temp;
                    if (double.TryParse(txtE.Text, out temp))
                    {
                        SaveFileDialog sfd = new SaveFileDialog();
                        sfd.Filter = "Generate Files (*.gen)|*.gen|" + "All files (*.*)|*.*";
                        sfd.InitialDirectory = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);
                        if (sfd.ShowDialog() == DialogResult.OK)
                        {
                            Compress c = new Compress(txtFile.Text, sfd.FileName, temp);
                        }
                    }
                    else
                    {
                        MessageBox.Show("请输入数字！");
                    }
                }
                else
                {
                    MessageBox.Show("请输入数字！");
                }
            }
            else
            {
                MessageBox.Show("请选择文件！");
            }
        }
    }
}

```

**代码如果存在问题，请一定帮我指正!大神，谢谢了!**
