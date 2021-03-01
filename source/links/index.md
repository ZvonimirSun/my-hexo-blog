---
title: 友情链接
date: 2018-12-19 10:11:00
updated: 2019-11-15 08:11:00
exturl: false
---

> 友谊是人生的调味品，也是人生的止痛药。

## 友情链接

<div id="links">
    <div class="links-content">
        <div class="link-navigation">
        {% for link in site.data.links %}
        <div class="card">
            <a href="{{ link.site }}" target="_blank">
            <img class="ava" src="{{ link.avatar }}"/></a>
            <div class="card-header">
                <div>
                    <a href="{{ link.site }}" target="_blank">{{ link.name }}</a>
                </div>
                <div class="info" title="{{ link.info }}">{{ link.info }}</div>
            </div>
        </div>
        {% endfor %}
        </div>
    </div>
</div>

以上排名不分先后，仅按添加的时间顺序排序。

## 交换友联

欢迎大家来交换友链，只要在下面[评论区](#comments)留下你的网站信息即可，建议填写邮箱一栏以防收不到回复通知。留言格式参考[本站信息](#本站信息)即可，我看着没啥问题就会把你加上啦。

**本站信息**

- 名称: 随遇而安
- 地址: [https://www.iszy.cc/links/](https://www.iszy.cc/links/)
- 简介: 生活吐槽 & 学习记录
- 头像: [https://www.iszy.cc/images/avatar.png](https://www.iszy.cc/images/avatar.png)
