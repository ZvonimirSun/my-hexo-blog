---
title: 平面多边形面积计算
date: 2018-01-17 12:00:00
updated: 2018-01-17 12:00:00
tags:
  - GIS
  - Csharp
  - 算法
---

## 算法描述

在这里实现了对任意平面多边形的面积计算，不适用于有重叠或边互相交叉的情况。

<!--more-->

## 实现

### 窗体设计

![](https://img.iszy.xyz/20190318213117.png)

### 代码

```csharp
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Windows.Forms;

namespace area
{
    public partial class Main : Form
    {
        private List<Point> list = new List<Point>();
        public Main()
        {
            InitializeComponent();
        }

        private void btnAdd_Click(object sender, EventArgs e)
        {
            if (txtX.Text != "" && txtY.Text != "")
            {
                //插入点
                if (Int32.TryParse(txtX.Text, out int x) && Int32.TryParse(txtY.Text, out int y))
                {
                    listPoint.BeginUpdate();
                    Point point = new Point(x, y);
                    list.Add(point);
                    listPoint.Items.Add(point);
                    listPoint.EndUpdate();

                    txtX.Text = "";
                    txtY.Text = "";
                    txtX.Focus();
                }
                else
                {
                    MessageBox.Show("请输入数字！");
                    txtX.Text = "";
                    txtY.Text = "";
                    txtX.Focus();
                }
            }
        }

        private void btnCalcu_Click(object sender, EventArgs e)
        {
            if (list.Count >= 3)
            {
                //将线首加入列表，保证多边形闭合
                list.Add(list[0]);

                //计算面积
                double area = 0;

                //根据公式进行计算
                for (int i = 0; i < list.Count - 1; i++)
                {
                    area += (list[i].X +list[i+1].X) * (list[i + 1].Y - list[i].Y);
                }

                //保证面积为正
                area = Math.Abs(area / 2);
                txtResult.Text = "面积：" + area.ToString("0.0");
                btnAdd.Enabled = false;
            }
            else
            {
                MessageBox.Show("请添加至少3个点！");
            }
        }

        private void btnClear_Click(object sender, EventArgs e)
        {
            //清空所有点
            list.Clear();
            listPoint.Items.Clear();
            txtX.Text = "";
            txtY.Text = "";
            txtResult.Text = "面积：";
            btnAdd.Enabled = true;
            txtX.Focus();
        }
    }
}
```
