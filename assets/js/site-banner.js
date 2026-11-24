(function(){
  var tapeSlot=document.getElementById('r25-tape');
  var stripSlot=document.getElementById('r25-strip');
  if(!tapeSlot&&!stripSlot) return;

  if(!document.getElementById('r25-banner-fonts')){
    var font=document.createElement('link');
    font.id='r25-banner-fonts';
    font.rel='stylesheet';
    font.href='https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700;800;900&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400;1,6..72,500&display=swap';
    document.head.appendChild(font);
  }

  var script=document.currentScript;
  if(!script){
    var tags=document.getElementsByTagName('script');
    for(var i=tags.length-1;i>=0;i--){
      if(tags[i].src&&tags[i].src.indexOf('site-banner.js')!==-1){script=tags[i];break;}
    }
  }
  var dataUrl='assets/data/market-tape.json';
  if(script&&script.src) dataUrl=script.src.replace(/\/js\/site-banner\.js(?:\?.*)?$/,'/data/market-tape.json');

  var LEAN={
    L:{cls:'landlord',letter:'L',label:'Landlord leaning'},
    R:{cls:'renter',letter:'R',label:'Renter leaning'},
    B:{cls:'balanced',letter:'B',label:'Balanced'}
  };

  function el(tag,cls,text){
    var node=document.createElement(tag);
    if(cls) node.className=cls;
    if(text!=null) node.textContent=text;
    return node;
  }

  function renderTape(data){
    if(!tapeSlot) return;
    var rate=data.rate||{};
    var down=rate.direction!=='up';
    var areas=data.areas||[];
    var leanWords=areas.map(function(area){
      var lean=LEAN[area.lean]||LEAN.B;
      return area.label+' '+lean.label.toLowerCase();
    }).join(', ');
    var link=el('a','r25-tape');
    link.href=data.href||'https://www.linkedin.com/company/realty25az/posts/';
    link.target='_blank';
    link.rel='noopener';
    link.setAttribute('aria-label','Mortgage rate and rental mood, '+String(data.week_label||'').replace(/^Week of /i,'week of ')+'. '+leanWords+'. See the Rental Mood posts on LinkedIn');

    var rateWrap=el('span','r25-tape-rate');
    rateWrap.appendChild(el('span','r25-tape-rate-label',rate.label||'MND 30Y Fixed'));
    rateWrap.appendChild(el('span','r25-tape-rate-val',rate.value||''));
    var arrow=el('span','r25-tape-arrow '+(down?'down':'up'));
    arrow.setAttribute('role','img');
    arrow.setAttribute('aria-label',(down?'Down from ':'Up from ')+(rate.prior||'')+' last week');
    arrow.innerHTML=down?'&#9660;':'&#9650;';
    rateWrap.appendChild(arrow);
    link.appendChild(rateWrap);

    var d1=el('span','r25-tape-div d1');
    d1.setAttribute('aria-hidden','true');
    link.appendChild(d1);

    var areaWrap=el('span','r25-tape-areas');
    areas.forEach(function(area,i){
      if(i){
        var sep=el('span','r25-tape-area-div');
        sep.setAttribute('aria-hidden','true');
        areaWrap.appendChild(sep);
      }
      var lean=LEAN[area.lean]||LEAN.B;
      var item=el('span','r25-tape-area');
      var dot=el('span','r25-mood '+lean.cls);
      dot.setAttribute('aria-hidden','true');
      item.appendChild(dot);
      var name=el('span','r25-area-name');
      if(area.prefix){
        var pre=el('span','r25-npre',area.prefix);
        name.appendChild(pre);
        name.appendChild(document.createTextNode(area.name||''));
      }else{
        name.textContent=area.name||area.label||'';
      }
      item.appendChild(name);
      var mark=el('em','r25-lean '+lean.cls,lean.letter);
      mark.setAttribute('role','img');
      mark.setAttribute('aria-label',lean.label);
      mark.title=lean.label;
      item.appendChild(mark);
      areaWrap.appendChild(item);
    });
    link.appendChild(areaWrap);

    var d2=el('span','r25-tape-div d2');
    d2.setAttribute('aria-hidden','true');
    link.appendChild(d2);
    link.appendChild(el('span','r25-tape-date',data.week_label||''));
    tapeSlot.textContent='';
    tapeSlot.appendChild(link);
  }

  function renderStrip(quotes){
    if(!stripSlot||!quotes||!quotes.length) return;
    var section=el('section','r25-strip');
    section.setAttribute('aria-label','Client quotes');
    section.setAttribute('aria-live','polite');
    var flip=el('div','r25-flip');
    var quote=el('p','r25-quote');
    var quoteText=el('span');
    quote.appendChild(quoteText);
    var src=el('span','r25-src');
    flip.appendChild(quote);
    flip.appendChild(src);
    section.appendChild(flip);
    stripSlot.textContent='';
    stripSlot.appendChild(section);

    var idx=0;
    var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function show(){
      quoteText.textContent=quotes[idx].text||'';
      src.textContent=quotes[idx].source||'Realty 25 AZ Client';
      if(!reduce){
        flip.classList.remove('r25-fade');
        void flip.offsetWidth;
        flip.classList.add('r25-fade');
      }
    }
    show();
    if(!reduce&&quotes.length>1){
      setInterval(function(){
        idx=(idx+1)%quotes.length;
        show();
      },4500);
    }
  }

  fetch(dataUrl).then(function(res){
    if(!res.ok) throw new Error('tape');
    return res.json();
  }).then(function(data){
    renderTape(data);
    renderStrip(data.quotes||[]);
  }).catch(function(){});
})();
