---
layout: null
---
{% assign comments = site.data.comments sort %}
{% for comment in comments %}
  {% assign name = comment[1].name %}
  {% assign date = comment[1].date %}
  {% assign message = comment[1].message %}
  {{ name }}<br>
  {{ date | date: '%a %-d %b %Y @%H:%M' }}<br>
  {{ message }}<br>
{% endfor %}
