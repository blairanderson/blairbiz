---
layout: post
title: "Google Maps Embed without API Key"
date: 2024-09-15
categories: Business
---

Quick note about embedding a google maps on your website. Seems recently they force you through the api-key setup. 

A simpler way I found is to do a maps SEARCH with an embed output. 


```html
<iframe width="100%" height="300" id="gmap_canvas" 
  src="https://maps.google.com/maps?q=[Your+Full+Address+Here]&amp;t=&amp;z=13&amp;ie=UTF8&amp;iwloc=&amp;output=embed" 
  frameborder="0" 
  scrolling="no" 
  marginheight="0" 
  marginwidth="0"></iframe>
```

Notice you need to change `[Your+Full+Address+Here]` with your business address! 
