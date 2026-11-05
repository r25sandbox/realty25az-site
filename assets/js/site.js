(function(){
  var burger=document.getElementById('burger');
  var nav=document.getElementById('nav');
  if(burger&&nav){
    burger.addEventListener('click',function(){
      var open=nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', open?'true':'false');
      burger.setAttribute('aria-label', open?'Close menu':'Open menu');
    });
    nav.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click',function(){
        nav.classList.remove('open');
        burger.setAttribute('aria-expanded','false');
        burger.setAttribute('aria-label','Open menu');
      });
    });
  }
})();
