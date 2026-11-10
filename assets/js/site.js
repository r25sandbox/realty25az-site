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
})();
