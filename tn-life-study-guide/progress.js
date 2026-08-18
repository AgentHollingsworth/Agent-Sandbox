/* Live reading progress: each section's bar fills as you scroll through it,
   and holds the furthest point you've reached (scrolling back up never
   un-fills a bar). Nothing is stored — reload starts fresh. */
(function(){
  var items = Array.prototype.slice.call(document.querySelectorAll('details.ch')).map(function(d){
    return {d: d, bar: d.querySelector('.meter i'), max: 0};
  }).filter(function(x){ return x.bar; });
  if(!items.length) return;
  var pending = false;
  function paint(){
    pending = false;
    var line = window.scrollY + window.innerHeight * 0.8;   // "reading line" ~80% down the screen
    items.forEach(function(x){
      if(!x.d.open && x.max === 0) return;                  // never-opened sections stay empty
      var r = x.d.getBoundingClientRect();
      var top = r.top + window.scrollY;
      var p = r.height > 0 ? (line - top) / r.height : 0;
      p = Math.max(0, Math.min(1, p));
      if(p > x.max) x.max = p;                              // high-water mark: progress only grows
      x.bar.style.width = (x.max * 100).toFixed(1) + '%';
    });
  }
  function queue(){ if(!pending){ pending = true; setTimeout(paint, 80); } }
  window.addEventListener('scroll', queue, {passive: true});
  window.addEventListener('resize', queue);
  items.forEach(function(x){ x.d.addEventListener('toggle', queue); });
  paint();
})();
