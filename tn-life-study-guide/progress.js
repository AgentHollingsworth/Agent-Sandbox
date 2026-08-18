/* Live reading progress: each section's bar fills as you scroll through it.
   Nothing is stored — reload starts a fresh call. */
(function(){
  var items = Array.prototype.slice.call(document.querySelectorAll('details.ch')).map(function(d){
    return {d: d, bar: d.querySelector('.meter i')};
  }).filter(function(x){ return x.bar; });
  if(!items.length) return;
  var pending = false;
  function paint(){
    pending = false;
    var line = window.scrollY + window.innerHeight * 0.8;   // "reading line" ~80% down the screen
    items.forEach(function(x){
      var r = x.d.getBoundingClientRect();
      var top = r.top + window.scrollY;
      var p = r.height > 0 ? (line - top) / r.height : 0;
      p = Math.max(0, Math.min(1, p));
      x.bar.style.width = (p * 100).toFixed(1) + '%';
    });
  }
  function queue(){ if(!pending){ pending = true; setTimeout(paint, 80); } }
  window.addEventListener('scroll', queue, {passive: true});
  window.addEventListener('resize', queue);
  items.forEach(function(x){ x.d.addEventListener('toggle', queue); });
  paint();
})();
