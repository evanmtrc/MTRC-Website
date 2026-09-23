(function(){
  var root = document.documentElement;
  var motionOK = function(){ return root.classList.contains('motion-ok'); };
  var $ = function(s, c){ return (c || document).querySelector(s); };
  var $$ = function(s, c){ return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ------------------------------------------------------------------ Mobile menu */
  var toggle = $('.menu-toggle'), nav = $('#site-nav');
  var bar = $('.menubar');
  var savedY = 0;
  function setMenu(open){
    if(open) savedY = window.scrollY || window.pageYOffset;
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    $('.label', toggle).textContent = open ? 'Close' : 'Menu';
    // Turn the header into a full-screen, independently scrolling sheet and lock the page behind it
    bar.classList.toggle('menu-open', open);
    root.classList.toggle('menu-open', open);
    if(open) bar.scrollTop = 0; else requestAnimationFrame(function(){ window.scrollTo({ top:savedY, behavior:'instant' }); });
  }
  if(toggle && nav){
    toggle.addEventListener('click', function(){ setMenu(!nav.classList.contains('open')); });
    nav.addEventListener('click', function(e){ if(e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && nav.classList.contains('open')){ setMenu(false); toggle.focus(); } });
    window.addEventListener('resize', function(){ if(window.innerWidth > 1180 && nav.classList.contains('open')) setMenu(false); });
  }

  /* ------------------------------------------------------------------ Dropdowns */
  var dds = $$('.nav .dd');
  function closeAll(except){
    dds.forEach(function(d){ if(d !== except){ d.classList.remove('open'); $('button', d).setAttribute('aria-expanded','false'); } });
  }
  dds.forEach(function(dd){
    var btn = $('button', dd);
    btn.addEventListener('click', function(e){
      e.stopPropagation();
      var open = !dd.classList.contains('open');
      closeAll(dd); dd.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });
  document.addEventListener('click', function(e){ dds.forEach(function(d){ if(!d.contains(e.target)){ d.classList.remove('open'); $('button', d).setAttribute('aria-expanded','false'); } }); });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape'){ var o = $('.nav .dd.open'); closeAll(null); if(o) $('button', o).focus(); }
  });

  /* ------------------------------------------------------------------ Text size */
  var sizeBtns = $$('.textsize button');
  function applySize(size){
    root.classList.toggle('text-large', size === 'large');
    sizeBtns.forEach(function(b){ b.setAttribute('aria-pressed', b.getAttribute('data-size') === size ? 'true' : 'false'); });
  }
  var savedSize = 'normal'; try{ savedSize = localStorage.getItem('mtrc-text') || 'normal'; }catch(e){}
  applySize(savedSize);
  sizeBtns.forEach(function(b){ b.addEventListener('click', function(){ var s = b.getAttribute('data-size'); applySize(s); try{ localStorage.setItem('mtrc-text', s); }catch(e){} }); });

  /* ------------------------------------------------------------------ Motion switch */
  var motionBtns = $$('.motion button');
  function syncMotionBtns(){ var on = motionOK(); motionBtns.forEach(function(b){ b.setAttribute('aria-pressed', (b.getAttribute('data-motion') === 'on') === on ? 'true' : 'false'); }); }
  motionBtns.forEach(function(b){
    b.addEventListener('click', function(){
      var on = b.getAttribute('data-motion') === 'on';
      root.classList.toggle('motion-ok', on); root.classList.toggle('reduce-motion', !on);
      try{ localStorage.setItem('mtrc-motion', on ? 'on' : 'off'); }catch(e){}
      if(!on){ $$('.reveal,.reveal-scale,.split').forEach(function(el){ el.classList.add('in'); }); }
      syncMotionBtns(); layoutDay();
    });
  });
  syncMotionBtns();

  /* ------------------------------------------------------------------ Open now (Pacific time) */
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
    cafe: function(d){ if(d===1) return null; return (d===0||d===6) ? [630,960] : [630,1020]; }
  };
  var dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  $$('[data-status]').forEach(function(el){
    var which = el.getAttribute('data-status'), now = pacificNow(), h = hours[which](now.day);
    var label = which === 'cafe' ? 'Café' : 'Club';
    if(h && now.mins >= h[0] && now.mins < h[1]){ el.classList.add('open'); el.textContent = label + ' open now, until ' + fmt(h[1]); return; }
    for(var i=0;i<8;i++){
      var d = (now.day + i) % 7, hh = hours[which](d);
      if(!hh || (i === 0 && now.mins >= hh[0])) continue;
      el.classList.add('closed');
      el.textContent = label + ' closed now. Opens ' + (i===0 ? 'today' : i===1 ? 'tomorrow' : dayNames[d]) + ' at ' + fmt(hh[0]);
      break;
    }
  });

  /* ------------------------------------------------------------------ Split headlines */
  $$('[data-split]').forEach(function(h){
    if(h.dataset.done) return; h.dataset.done = 1;
    var label = h.textContent.trim().replace(/\s+/g,' ');
    h.setAttribute('aria-label', label);
    var words = label.split(' ');
    h.innerHTML = words.map(function(w, i){ return '<span class="w" aria-hidden="true"><span style="--d:' + (0.08 + i*0.075).toFixed(3) + 's">' + w + '</span></span>'; }).join(' ');
    h.classList.add('split');
  });

  /* ------------------------------------------------------------------ Auto reveal */
  var autoTargets = [
    '.section h2', '.section .section-intro', '.section .kicker', '.tile', '.card-person', '.plan', '.classes li', '.steps li', '.stats li',
    '.timeline li', '.faq details', '.checks li', '.chips li', '.notice', '.callout', '.finder', '.bento a', '.statband > div', '.facts dl > div',
    '.contact-list li', 'blockquote.pull', '.feature', '.cta', '.quotes', '.pagehead .lede', '.pagehead .actions', '.hero .lede', '.hero .actions',
    '.feature-hero p', '.feature-hero .actions', '.feature-hero .role', '.two > div > p', '.infostrip .wrap > div', '.people + p', '.section p.lede'
  ].join(',');
  $$(autoTargets).forEach(function(el){
    if(el.closest('.day-track') || el.closest('.result') || el.classList.contains('reveal')) return;
    el.classList.add(el.matches('.bento a, .feature, .cta, .plan, .finder') ? 'reveal-scale' : 'reveal');
  });
  $$('.pagehead .art, .scene-card, .feature-hero .portrait-wrap').forEach(function(el){ el.classList.add('reveal-scale'); el.style.setProperty('--d','.25s'); });
  // stagger siblings
  var groups = new Map();
  $$('.reveal, .reveal-scale').forEach(function(el){
    var p = el.parentElement; if(!groups.has(p)) groups.set(p, 0);
    var i = groups.get(p); groups.set(p, i + 1);
    if(!el.style.getPropertyValue('--d')) el.style.setProperty('--d', Math.min(i * 0.08, 0.48).toFixed(2) + 's');
  });

  function reveal(el){
    el.classList.add('in');
    setTimeout(function(){ el.classList.add('done'); }, 1400);
    if(el.hasAttribute('data-count')) countUp(el);
    $$('[data-count]', el).forEach(countUp);
  }
  var revealables = $$('.reveal, .reveal-scale, .split');
  if('IntersectionObserver' in window && motionOK()){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){ if(en.isIntersecting){ reveal(en.target); io.unobserve(en.target); } });
    }, { rootMargin:'0px 0px -8% 0px', threshold:0.08 });
    revealables.forEach(function(el){ io.observe(el); });
    // counters outside reveal elements
    var cio = new IntersectionObserver(function(entries){
      entries.forEach(function(en){ if(en.isIntersecting){ countUp(en.target); cio.unobserve(en.target); } });
    }, { threshold:0.4 });
    $$('[data-count]').forEach(function(el){ cio.observe(el); });
  }else{
    revealables.forEach(function(el){ el.classList.add('in'); });
  }

  /* ------------------------------------------------------------------ Counters */
  function countUp(el){
    if(el.dataset.counted) return; el.dataset.counted = 1;
    var to = parseFloat(el.getAttribute('data-count')), from = parseFloat(el.getAttribute('data-from') || 0);
    var pre = el.getAttribute('data-prefix') || '', suf = el.getAttribute('data-suffix') || '';
    var comma = el.hasAttribute('data-comma');
    function show(v){ var n = Math.round(v); el.textContent = pre + (comma ? n.toLocaleString('en-US') : n) + suf; }
    if(!motionOK()){ show(to); return; }
    var start = null, dur = 1600;
    function step(t){
      if(!start) start = t; var p = Math.min((t - start) / dur, 1); var e = 1 - Math.pow(1 - p, 4);
      show(from + (to - from) * e); if(p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ------------------------------------------------------------------ Scroll: header, progress, parallax, timeline */
  var menubar = $('.menubar'), progress = $('.progress span');
  var m1 = $('.hs-m1'), m2 = $('.hs-m2'), m3 = $('.hs-m3');
  var timelines = $$('.timeline');
  var ticking = false;
  function onScroll(){
    var y = window.scrollY || window.pageYOffset;
    if(menubar) menubar.classList.toggle('scrolled', y > 24);
    if(progress){
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.setProperty('--p', max > 0 ? (y / max).toFixed(4) : 0);
    }
    if(motionOK() && m1 && y < 1200){
      m1.style.transform = 'translateY(' + (y * 0.05) + 'px)';
      m2.style.transform = 'translateY(' + (y * 0.1) + 'px)';
      m3.style.transform = 'translateY(' + (y * 0.16) + 'px)';
    }
    if(motionOK()){
      timelines.forEach(function(tl){
        var r = tl.getBoundingClientRect(), vh = window.innerHeight;
        var p = Math.min(Math.max((vh * 0.75 - r.top) / r.height, 0), 1);
        tl.style.setProperty('--tl', p.toFixed(3));
      });
    }
    dayScroll();
    ticking = false;
  }
  window.addEventListener('scroll', function(){ if(!ticking){ ticking = true; requestAnimationFrame(onScroll); } }, { passive:true });
  window.addEventListener('resize', function(){ layoutDay(); onScroll(); });

  /* ------------------------------------------------------------------ Pointer effects (fine pointers only) */
  var finePointer = window.matchMedia && window.matchMedia('(pointer:fine)').matches;
  if(finePointer){
    document.addEventListener('pointermove', function(e){
      var t = e.target.closest && e.target.closest('.tile, .btn');
      if(!t) return;
      var r = t.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      if(t.classList.contains('btn')){
        t.style.setProperty('--bx', x + 'px'); t.style.setProperty('--by', y + 'px');
        if(motionOK()) t.style.transform = 'translate(' + ((x - r.width/2) * 0.12).toFixed(1) + 'px,' + ((y - r.height/2) * 0.22).toFixed(1) + 'px)';
      }else{
        t.style.setProperty('--mx', x + 'px'); t.style.setProperty('--my', y + 'px');
      }
    });
    document.addEventListener('pointerout', function(e){
      var b = e.target.closest && e.target.closest('.btn');
      if(b && !b.contains(e.relatedTarget)) b.style.transform = '';
    });
    var scene = $('.scene-frame');
    if(scene){
      var heroEl = scene.closest('.hero');
      heroEl.addEventListener('pointermove', function(e){
        if(!motionOK()) return;
        var r = heroEl.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
        scene.style.setProperty('--ry', (px * 6).toFixed(2) + 'deg');
        scene.style.setProperty('--rx', (-py * 5).toFixed(2) + 'deg');
      });
      heroEl.addEventListener('pointerleave', function(){ scene.style.setProperty('--ry','0deg'); scene.style.setProperty('--rx','0deg'); });
    }
  }

  /* ------------------------------------------------------------------ "A day at Mt. Tam" pinned horizontal scroll */
  var day = $('.day'), dayPin = $('.day-pin'), dayTrack = $('.day-track'), dayBar = $('.day-bar span');
  function layoutDay(){
    if(!day) return;
    var canPin = motionOK() && window.innerWidth > 820 && window.innerHeight > 560;
    day.classList.toggle('no-pin', !canPin);
    if(!canPin){ dayPin.style.height = ''; dayTrack.style.transform = ''; return; }
    var extra = dayTrack.scrollWidth - window.innerWidth;
    dayPin.style.height = (window.innerHeight + Math.max(extra, 0)) + 'px';
    dayScroll();
  }
  function dayScroll(){
    if(!day || day.classList.contains('no-pin')) return;
    var r = dayPin.getBoundingClientRect(), total = dayPin.offsetHeight - window.innerHeight;
    var p = Math.min(Math.max(-r.top / (total || 1), 0), 1);
    var extra = dayTrack.scrollWidth - window.innerWidth;
    dayTrack.style.transform = 'translate3d(' + (-p * Math.max(extra,0)).toFixed(1) + 'px,0,0)';
    if(dayBar) dayBar.style.setProperty('--dp', p.toFixed(3));
  }
  layoutDay();

  /* ------------------------------------------------------------------ Quote carousel */
  var quotes = $$('.quote'), qBtns = $$('.q-controls [data-q]'), qPause = $('.q-controls [data-pause]');
  if(quotes.length){
    var qi = 0, qTimer = null, paused = !motionOK();
    function showQ(i){
      qi = (i + quotes.length) % quotes.length;
      quotes.forEach(function(q, j){ q.classList.toggle('on', j === qi); });
      qBtns.forEach(function(b, j){ b.setAttribute('aria-pressed', j === qi ? 'true' : 'false'); });
    }
    function startQ(){ stopQ(); if(!paused) qTimer = setInterval(function(){ showQ(qi + 1); }, 7000); }
    function stopQ(){ if(qTimer) clearInterval(qTimer); qTimer = null; }
    qBtns.forEach(function(b, j){ b.addEventListener('click', function(){ showQ(j); startQ(); }); });
    if(qPause){
      qPause.textContent = paused ? 'Play' : 'Pause';
      qPause.addEventListener('click', function(){ paused = !paused; qPause.textContent = paused ? 'Play' : 'Pause'; paused ? stopQ() : startQ(); });
    }
    showQ(0); startQ();
  }

  /* ------------------------------------------------------------------ Membership plan finder */
  var finder = document.getElementById('plan-finder');
  if(finder){
    var plans = {
      'tennis-family': { name:'Tennis, family', dues:446, init:2000 },
      'tennis-single': { name:'Tennis, single', dues:262, init:1200 },
      'swim-family':   { name:'Swim & Fitness, family', dues:341, init:1250 },
      'swim-single':   { name:'Swim & Fitness, single', dues:226, init:700 }
    };
    var out = document.getElementById('plan-result');
    // Current offer: prepay 3 months of dues instead of paying the initiation fee.
    var PROMO = { active:true, months:3 };
    function setNum(el, v){ if(!el) return; el.setAttribute('data-count', v); el.setAttribute('data-prefix','$'); el.setAttribute('data-comma',''); delete el.dataset.counted; countUp(el); }
    function money(n){ return '$' + n.toLocaleString('en-US'); }
    finder.addEventListener('change', function(){
      var who = $('input[name=who]:checked', finder), what = $('input[name=what]:checked', finder);
      if(!who || !what){ out.hidden = true; return; }
      var p = plans[(what.value === 'tennis' ? 'tennis' : 'swim') + '-' + who.value];
      var three = p.dues * PROMO.months;
      $('[data-f=name]', out).textContent = p.name;
      $('[data-f=dues]', out).textContent = money(p.dues);
      $('[data-f=initStrike]', out).textContent = money(p.init);
      setNum($('[data-f=init]', out), p.init);
      setNum($('[data-f=three]', out), three);
      setNum($('[data-f=three2]', out), three);
      setNum($('[data-f=regTotal]', out), p.init + three);
      setNum($('[data-f=promoTotal]', out), three);
      setNum($('[data-f=save]', out), p.init);
      $('[data-f=why]', out).textContent = what.value === 'tennis'
        ? 'Tennis members play with no court fees and get a free evaluation with our tennis director.'
        : what.value === 'unsure'
          ? 'Swim & Fitness is a great place to start. The front desk can help you switch to Tennis later.'
          : 'Swim & Fitness covers the pools, the gym and group classes.';
      var wasHidden = out.hidden; out.hidden = false;
      out.classList.remove('pop'); void out.offsetWidth; out.classList.add('pop');
      if(wasHidden && motionOK()) out.scrollIntoView({ behavior:'smooth', block:'nearest' });
    });
  }

  /* ------------------------------------------------------------------ Class guide filter (animated with View Transitions when available) */
  var filterBar = $('.filters');
  if(filterBar){
    var items = $$('.classes li'), count = document.getElementById('class-count');
    items.forEach(function(li, i){ li.style.viewTransitionName = 'cls-' + i; });
    filterBar.addEventListener('click', function(e){
      var b = e.target.closest('button'); if(!b) return;
      function apply(){
        $$('button', filterBar).forEach(function(x){ x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        var f = b.getAttribute('data-filter'), shown = 0;
        items.forEach(function(li){
          var show = f === 'all' || li.getAttribute('data-tags').split(' ').indexOf(f) !== -1;
          li.hidden = !show; if(show){ shown++; li.classList.add('in','done'); }
        });
        if(count) count.textContent = 'Showing ' + shown + (shown === 1 ? ' class type' : ' class types');
      }
      if(document.startViewTransition && motionOK()) document.startViewTransition(apply); else apply();
    });
  }

  onScroll();
})();
