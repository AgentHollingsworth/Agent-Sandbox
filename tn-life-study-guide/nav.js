/* close the guide menu on outside tap / Esc */
(function(){
  var d = document.querySelector('details.navmenu');
  if(!d) return;
  document.addEventListener('click', function(e){ if(d.open && !d.contains(e.target)) d.open = false; });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') d.open = false; });
})();
