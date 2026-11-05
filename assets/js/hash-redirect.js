(function(){
  var map={
    faq:'faq/',
    pricing:'pricing/',
    reviews:'reviews/',
    calc:'tools/cash-flow-calculator/',
    equitycalc:'tools/equity-calculator/',
    comps:'tools/rental-comp/',
    agents:'agents/',
    about:'about/'
  };
  var h=(location.hash||'').replace(/^#/,'').toLowerCase();
  if(!h) return;
  if(h==='home'){
    history.replaceState(null,'',location.pathname + location.search);
    return;
  }
  if(!(h in map)) return;
  var base = location.href.replace(/[#?].*$/,'').replace(/index\.html$/i,'');
  if(!/\/$/.test(base)) base += '/';
  location.replace(base + map[h]);
})();
