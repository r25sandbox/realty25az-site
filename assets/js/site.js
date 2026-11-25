(function(){
  var burger=document.getElementById('burger');
  var nav=document.getElementById('nav');
  var drop=document.querySelector('.nav-drop');
  var dropBtn=drop&&drop.querySelector('.nav-drop-btn');

  function closeDrop(){
    if(!drop||!dropBtn) return;
    drop.classList.remove('is-open');
    dropBtn.setAttribute('aria-expanded','false');
  }
  function closeNav(){
    if(!nav||!burger) return;
    nav.classList.remove('open');
    burger.setAttribute('aria-expanded','false');
    burger.setAttribute('aria-label','Open menu');
  }

  if(burger&&nav){
    burger.addEventListener('click',function(){
      var open=nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', open?'true':'false');
      burger.setAttribute('aria-label', open?'Close menu':'Open menu');
      if(!open) closeDrop();
    });
    nav.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click',function(){
        closeNav();
        closeDrop();
      });
    });
  }

  if(drop&&dropBtn){
    dropBtn.addEventListener('click',function(e){
      e.stopPropagation();
      var open=drop.classList.toggle('is-open');
      dropBtn.setAttribute('aria-expanded', open?'true':'false');
    });
    document.addEventListener('click',function(e){
      if(!drop.contains(e.target)) closeDrop();
    });
    document.addEventListener('keydown',function(e){
      if(e.key==='Escape'){
        var was=drop.classList.contains('is-open');
        closeDrop();
        if(was) dropBtn.focus();
      }
    });
  }

  // iOS Safari shows a Markdown link inline and ignores the download name.
  // The link still has download set, so it saves without this script elsewhere.
  var ios=/iP(hone|ad|od)/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  if(ios&&window.fetch){
    document.querySelectorAll('a.md-download').forEach(function(a){
      a.addEventListener('click',function(e){
        var name=a.getAttribute('download');
        if(!name) return;
        e.preventDefault();
        fetch(a.href).then(function(r){return r.blob();}).then(function(blob){
          var file=new Blob([blob],{type:'application/octet-stream'});
          var url=URL.createObjectURL(file);
          var tmp=document.createElement('a');
          tmp.href=url;
          tmp.download=name;
          document.body.appendChild(tmp);
          tmp.click();
          tmp.remove();
          setTimeout(function(){URL.revokeObjectURL(url);},1500);
        }).catch(function(){
          window.location.href=a.href;
        });
      });
    });
  }
})();
