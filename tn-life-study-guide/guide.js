(function(){
  var chapters = Array.prototype.slice.call(document.querySelectorAll('details.ch'));
  var q = document.getElementById('q');
  var jump = document.getElementById('jump');
  var toggle = document.getElementById('toggleAll');
  var hint = document.getElementById('hint');

  // build the jump menu from the chapters themselves
  chapters.forEach(function(ch){
    var o = document.createElement('option');
    o.value = ch.id;
    o.textContent = ch.querySelector('.num').textContent + ' — ' + ch.querySelector('.name').textContent.replace(/[⭐⚑]/g,'').trim();
    jump.appendChild(o);
  });
  jump.addEventListener('change', function(){
    var t = document.getElementById(jump.value);
    if(!t) return;
    t.open = true;
    var y = t.getBoundingClientRect().top + window.pageYOffset - 110;
    window.scrollTo({top:y, behavior:'smooth'});
    jump.selectedIndex = 0;
  });

  toggle.addEventListener('click', function(){
    var opening = toggle.textContent.indexOf('Open') === 0;
    chapters.forEach(function(ch){ ch.open = opening; });
    toggle.textContent = opening ? 'Close all' : 'Open all';
  });

  function clearMarks(root){
    root.querySelectorAll('mark').forEach(function(m){
      var p = m.parentNode;
      p.replaceChild(document.createTextNode(m.textContent), m);
      p.normalize();
    });
  }
  function highlight(root, term){
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var nodes = [], n;
    while((n = walker.nextNode())) nodes.push(n);
    var low = term.toLowerCase();
    nodes.forEach(function(node){
      var txt = node.nodeValue, i = txt.toLowerCase().indexOf(low);
      if(i < 0) return;
      if(node.parentNode && node.parentNode.tagName === 'MARK') return;
      var frag = document.createDocumentFragment();
      var last = 0;
      while(i >= 0){
        frag.appendChild(document.createTextNode(txt.slice(last, i)));
        var m = document.createElement('mark');
        m.textContent = txt.slice(i, i + term.length);
        frag.appendChild(m);
        last = i + term.length;
        i = txt.toLowerCase().indexOf(low, last);
      }
      frag.appendChild(document.createTextNode(txt.slice(last)));
      node.parentNode.replaceChild(frag, node);
    });
  }

  var timer;
  q.addEventListener('input', function(){
    clearTimeout(timer);
    timer = setTimeout(function(){
      var term = q.value.trim();
      chapters.forEach(function(ch){ clearMarks(ch); });
      if(term.length < 2){
        chapters.forEach(function(ch){ ch.classList.remove('hide'); ch.open = false; });
        hint.textContent = 'Tap any section to open it.';
        return;
      }
      var hits = 0;
      chapters.forEach(function(ch){
        var match = ch.textContent.toLowerCase().indexOf(term.toLowerCase()) >= 0;
        ch.classList.toggle('hide', !match);
        ch.open = match;
        if(match){ hits++; highlight(ch.querySelector('.body'), term); }
      });
      hint.textContent = hits ? hits + (hits === 1 ? ' section matches' : ' sections match') + ' "' + term + '"' : 'Nothing found for "' + term + '"';
    }, 180);
  });
})();
