---
title: 日记
comments: false
sitemap: false
exturl: false
---

<div id="diaries" onclick="showDetail">
    {%- for diary in site.data.diaries %}
    <div class="diary show">
        <div class="diary-time">{{ diary.time.toLocaleString() }}</div>
        <div class="diary-content" title="{{ diary.content }}"><div class="diary-content-wrapper">{{ diary.content }}</div></div>
    </div>
    {%- endfor %}
</div>

<script src="/js/diaries.js"></script>
