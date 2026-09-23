(function(){
  // ---------- Mobile menu ----------
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('site-nav');
  if(toggle && nav){
    toggle.addEventListener('click', function(){
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.querySelector('.label').textContent = open ? 'Close' : 'Menu';
    });
  }

  // ---------- Dropdown menus (desktop) ----------
  var dds = document.querySelectorAll('.nav .dd');
  function closeAll(except){
    dds.forEach(function(d){
      if(d !== except){ d.classList.remove('open'); d.querySelector('button').setAttribute('aria-expanded','false'); }
    });
  }
  dds.forEach(function(dd){
    var btn = dd.querySelector('button');
    btn.addEventListener('click', function(e){
      e.stopPropagation();
      var open = !dd.classList.contains('open');
      closeAll(dd);
      dd.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });
  document.addEventListener('click', function(e){
    dds.forEach(function(d){ if(!d.contains(e.target)){ d.classList.remove('open'); d.querySelector('button').setAttribute('aria-expanded','false'); } });
  });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape'){
      var openDd = document.querySelector('.nav .dd.open');
      closeAll(null);
      if(openDd) openDd.querySelector('button').focus();
    }
  });

  // ---------- Text size ----------
  var root = document.documentElement;
  var sizeBtns = document.querySelectorAll('.textsize button');
  function applySize(size){
    root.classList.toggle('text-large', size === 'large');
    sizeBtns.forEach(function(b){ b.setAttribute('aria-pressed', b.getAttribute('data-size') === size ? 'true' : 'false'); });
  }
  var saved = 'normal';
  try{ saved = localStorage.getItem('mtrc-text') || 'normal'; }catch(e){}
  applySize(saved);
  sizeBtns.forEach(function(b){
    b.addEventListener('click', function(){
      var s = b.getAttribute('data-size'); applySize(s);
      try{ localStorage.setItem('mtrc-text', s); }catch(e){}
    });
  });

  // ---------- Open now (Pacific time) ----------
  // Club: Mon–Fri 4:45–22:00, Sat–Sun 6:45–21:00. Café: Tue–Fri 11–17, Sat–Sun 11–16, closed Mon.
  function pacificNow(){
    try{
      var parts = new Intl.DateTimeFormat('en-US',{timeZone:'America/Los_Angeles',weekday:'short',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date());
      var o = {}; parts.forEach(function(p){ o[p.type] = p.value; });
      var days = {Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6};
      return { day: days[o.weekday], mins: (parseInt(o.hour,10) % 24) * 60 + parseInt(o.minute,10) };
    }catch(e){ var d = new Date(); return { day:d.getDay(), mins:d.getHours()*60 + d.getMinutes() }; }
  }
  function fmt(m){ var h = Math.floor(m/60), mm = m%60, ap = h >= 12 ? 'PM' : 'AM'; h = h%12 || 12; return h + (mm ? ':' + (mm<10?'0':'') + mm : '') + ' ' + ap; }
  var hours = {
    club: function(d){ return (d===0||d===6) ? [405,1260] : [285,1320]; },
    cafe: function(d){ if(d===1) return null; return (d===0||d===6) ? [660,960] : [660,1020]; }
  };
  document.querySelectorAll('[data-status]').forEach(function(el){
    var which = el.getAttribute('data-status'); var now = pacificNow(); var h = hours[which](now.day);
    var label = which === 'cafe' ? 'Café' : 'Club';
    if(h && now.mins >= h[0] && now.mins < h[1]){
      el.classList.add('open'); el.textContent = label + ' open now, until ' + fmt(h[1]);
    }else{
      // find next opening
      for(var i=0;i<8;i++){
        var d = (now.day + i) % 7, hh = hours[which](d);
        if(!hh) continue;
        if(i === 0 && now.mins >= hh[0]) continue;
        el.classList.add('closed');
        el.textContent = label + ' closed now. Opens ' + (i===0 ? 'today' : i===1 ? 'tomorrow' : ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][d]) + ' at ' + fmt(hh[0]);
        break;
      }
    }
  });

  // ---------- Membership plan finder ----------
  var finder = document.getElementById('plan-finder');
  if(finder){
    var plans = {
      'tennis-family': { name:'Tennis, family', dues:446, init:2000 },
      'tennis-single': { name:'Tennis, single', dues:262, init:1200 },
      'swim-family':   { name:'Swim & Fitness, family', dues:341, init:1250 },
      'swim-single':   { name:'Swim & Fitness, single', dues:226, init:700 }
    };
    var out = document.getElementById('plan-result');
    function money(n){ return '$' + n.toLocaleString('en-US'); }
    function update(){
      var who = finder.querySelector('input[name=who]:checked');
      var what = finder.querySelector('input[name=what]:checked');
      if(!who || !what){ out.hidden = true; return; }
      var track = what.value === 'tennis' ? 'tennis' : 'swim';
      var p = plans[track + '-' + who.value];
      out.querySelector('[data-f=name]').textContent = p.name;
      out.querySelector('[data-f=dues]').textContent = money(p.dues);
      out.querySelector('[data-f=init]').textContent = money(p.init);
      out.querySelector('[data-f=year]').textContent = money(p.dues * 12);
      out.querySelector('[data-f=why]').textContent = what.value === 'tennis'
        ? 'Tennis members play with no court fees and get a free evaluation with our tennis director.'
        : what.value === 'unsure'
          ? 'Swim & Fitness is a great place to start. You can talk to the front desk about switching to Tennis later.'
          : 'Swim & Fitness covers the pools, the gym and group classes.';
      out.hidden = false;
    }
    finder.addEventListener('change', update);
  }

  // ---------- Class guide filter ----------
  var filterBar = document.querySelector('.filters');
  if(filterBar){
    var items = document.querySelectorAll('.classes li');
    var count = document.getElementById('class-count');
    filterBar.addEventListener('click', function(e){
      var b = e.target.closest('button'); if(!b) return;
      filterBar.querySelectorAll('button').forEach(function(x){ x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      var f = b.getAttribute('data-filter'), shown = 0;
      items.forEach(function(li){
        var tags = li.getAttribute('data-tags').split(' ');
        var show = f === 'all' || tags.indexOf(f) !== -1;
        li.hidden = !show; if(show) shown++;
      });
      if(count) count.textContent = 'Showing ' + shown + (shown === 1 ? ' class type' : ' class types');
    });
  }
})();
