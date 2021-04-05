---
title: 日记
comments: false
sitemap: false
exturl: false
---

<div id="diaries">
    {%- for diary in site.data.diaries %}
    <div class="diary">
        <div class="diary-time"><div class="diary-time-wrapper">{{ diary.time.toLocaleString() }}</div></div>
        <div class="diary-content" title="{{ diary.content }}"><div class="diary-content-wrapper">{{ diary.content }}</div></div>
    </div>
    {%- endfor %}
</div>
