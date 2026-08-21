/* close the guide menu on outside tap / Esc */
(function(){
  var d = document.querySelector('details.navmenu');
  if(!d) return;
  document.addEventListener('click', function(e){ if(d.open && !d.contains(e.target)) d.open = false; });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') d.open = false; });
})();

/* deep links like /checklist.html#dailycall land with the section open */
(function(){
  function openHash(){
    var id = location.hash.slice(1);
    if(!id) return;
    var t = document.getElementById(id);
    if(t && t.tagName === 'DETAILS'){
      t.open = true;
      var go = function(){
        var y = t.getBoundingClientRect().top + window.pageYOffset - 110;
        window.scrollTo({top: y});
      };
      // native anchor scrolling can land late and drift past the section
      // once it expands, so assert the position a few times
      go(); setTimeout(go, 120); setTimeout(go, 400);
    }
  }
  window.addEventListener('hashchange', openHash);
  openHash();
})();
