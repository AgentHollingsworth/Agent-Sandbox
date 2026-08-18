/* Call-flow scrolling: while you're reading an open section, the next closed
   section opens itself just before you reach it — so the script reads like
   one continuous page on a live call.
   Tapping a section closed pins it closed (and pauses the chain there) until
   you tap something open again — so tap-to-study mode still works. */
(function(){
  var chs = Array.prototype.slice.call(document.querySelectorAll('details.ch'));
  if(!chs.length) return;

  // Only closes/opens done by tapping the header count as "user intent".
  chs.forEach(function(d){
    var sum = d.querySelector('summary');
    if(!sum) return;
    sum.addEventListener('click', function(){
      setTimeout(function(){
        if(d.open) delete d.dataset.stop;
        else d.dataset.stop = '1';
      }, 0);
    });
  });

  var pending = false;
  function check(){
    pending = false;
    var lookAhead = window.scrollY + window.innerHeight + 400;
    for(var i = 1; i < chs.length; i++){
      var d = chs[i];
      if(d.open || d.dataset.stop || d.classList.contains('hide')) continue;
      var prev = chs[i-1];
      if(!prev.open || prev.classList.contains('hide')) continue;
      var top = d.getBoundingClientRect().top + window.scrollY;
      if(top < lookAhead) d.open = true;
    }
  }
  window.addEventListener('scroll', function(){
    if(!pending){ pending = true; setTimeout(check, 60); }
  }, {passive:true});
})();
