---
title: 日记
comments: false
sitemap: false
exturl: false
---

<div id="diaries">
    {%- for diary in site.data.diaries %}
    <div class="diary">
        <div class="diary-time">{{ diary.time }}</div>
        <div class="diary-content" title="{{ diary.content }}">{{ diary.content }}</div>
    </div>
    {%- endfor %}
</div>
