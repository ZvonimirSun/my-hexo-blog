---
title: 日记
comments: false
sitemap: false
exturl: false
---

<div id="diaries">
    {%- for diary in site.data.diaries %}
    <div class="diary show" onclick="showDetail(this)">
        <div class="diary-time">{{ diary.time.toLocaleString() }}</div>
        {%- set ps = diary.content.split('\n') %}
        <div class="diary-content">
            <div class="diary-content-wrapper">
            {%- for p in ps %}
            <p>{{ p }}</p>
            {%- endfor %}
            </div>
        </div>
    </div>
    {%- endfor %}
    <i></i><i></i><i></i><i></i><i></i>
</div>

<script src="/js/diaries.js"></script>
