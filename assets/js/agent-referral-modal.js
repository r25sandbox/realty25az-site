/*
============================================================
agent-referral-modal.js
============================================================
Version : 1.0
Date    : 2026-08-27
Author  : Alik Levin / Realty 25 AZ

Purpose : Modal controller for Agent Referrals "See how it
          works" flow diagram lightbox on realty25az.com
          #agents section.

Hosted at : https://r25sandbox.github.io/agents/modal.js
Consumed by : Realty25_AgentReferral_Carrd_Embed v1.6+
Cache-bust  : Bump ?vNN on <script src> in embed on each deploy

Companion pattern to pricing-modal.js (pricing embed).
Externalized because inline JS in Carrd embeds triggers
"SyntaxError: Unexpected end of script" in the Carrd
parser (seen on agent v1.5, resolved by externalization).

Changelog
------------------------------------------------------------
v1.0 2026-08-27 Initial extraction from
                Realty25_AgentReferral_Carrd_Embed v1.5
                inline script. No logic changes. Opens
                #r25af-overlay on #r25af-open-btn click.
                Close via X button, click-outside, Esc.
                Img error handler shows fallback text.
============================================================
*/

(function(){
  function init(){
    var btn = document.getElementById('r25af-open-btn');
    var overlay = document.getElementById('r25af-overlay');
    var closeBtn = document.getElementById('r25af-close');
    var img = document.getElementById('r25af-img');
    var fallback = document.getElementById('r25af-fallback');
    if(!btn || !overlay || !closeBtn) return;

    function openModal(){ overlay.classList.add('r25af-open'); }
    function closeModal(){ overlay.classList.remove('r25af-open'); }

    btn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);

    overlay.addEventListener('click', function(e){
      if(e.target === overlay){ closeModal(); }
    });

    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && overlay.classList.contains('r25af-open')){
        closeModal();
      }
    });

    if(img){
      img.addEventListener('error', function(){
        img.style.display = 'none';
        if(fallback){ fallback.style.display = 'block'; }
      });
    }
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
