---
title: "Conference Map"
permalink: /conference-map/
layout: single
classes: wide
author_profile: false
excerpt: "Conferences and places from my research journey. Click a dot to see photos and details."
---

<link rel="stylesheet" href="{{ '/assets/conference-map/conference-map.css' | relative_url }}">

<div id="conference-map-app">
  <noscript>
    <ul>
      {%- assign sorted = site.data.conferences | sort: "year" | reverse -%}
      {%- for c in sorted -%}
      <li><strong>{{ c.name }}</strong> — {{ c.city }}, {{ c.country }} ({{ c.date | default: c.year }})</li>
      {%- endfor -%}
    </ul>
  </noscript>
</div>

<script>
  window.CM_BASEURL = {{ site.baseurl | default: "" | jsonify }};
  window.CONFERENCES = {{ site.data.conferences | jsonify }};
  window.POST_URLS = {
    {%- for p in site.posts -%}
    {{ p.path | split: "/" | last | remove: ".md" | remove: ".markdown" | jsonify }}: {{ p.url | relative_url | jsonify }}{% unless forloop.last %},{% endunless %}
    {%- endfor -%}
  };
</script>
<script src="{{ '/assets/conference-map/world-map-data.js' | relative_url }}"></script>
<script src="{{ '/assets/conference-map/conference-map.js' | relative_url }}" defer></script>
