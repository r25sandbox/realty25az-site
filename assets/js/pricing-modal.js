/*
============================================================
pricing-modal.js
============================================================
Version : 1.3
Date    : 2026-07-10
Purpose : Service Request modal logic. Loaded by Carrd
          Pricing embed (Realty25_Pricing_Carrd_Embed.html
          v1.17+) via <script src> reference. Modal HTML and
          CSS still live inline in the embed - only the JS
          payload is externalized to keep the embed under
          Carrd's parser size threshold.

Repo    : pricing/pricing-modal.js (dedicated repo)
Hosting : GitHub Pages of `pricing` repo
Cache   : Bump ?vNN on embed <script src> after each commit.

Pairs with: Realty25_Pricing_Carrd_Embed.html v1.17+
Backend   : rentalcomp-proxy v2.19 POST /inspection-request
            (dev: rentalcomp-proxy-dev.alik-levin.workers.dev)
            (prod: rentalcomp-proxy.alik-levin.workers.dev)

------------------------------------------------------------
Changelog (most recent 5)
------------------------------------------------------------
v1.3  2026-07-10  Static generic title. Removed dynamic
                  title swap and TYPE_LABELS map. Modal now
                  always reads "Request Service" regardless
                  of type (matches embed v1.17 static title;
                  survives future offering copy changes).
                  Payload key inspectionType:currentType
                  UNCHANGED - PCI/MoveOut still sent to
                  Worker; backend contract intact. Pairs with
                  embed v1.17 (?v03 -> ?v04 cache-bust).
v1.2  2026-05-24  PROD cutover. ENDPOINT swapped from
                  rentalcomp-proxy-dev -> rentalcomp-proxy
                  (Worker v2.19 confirmed live on prod by
                  RentalComp chat, all 4 smoke tests passed).
                  Contract identical to dev - no other code
                  changes. Pairs with Carrd embed v1.12
                  (?v02 -> ?v03 cache-bust).
v1.1  2026-05-24  Wired doSubmit() to real backend.
                  POSTs to rentalcomp-proxy-dev
                  /inspection-request (Worker v2.19). Body:
                  { firstName, lastName, email, phone,
                  inspectionType }.
                  Response handling per Worker contract:
                  - 200 {ok:true} -> terminal success state
                    (matches placeholder v1.0 UX)
                  - 400 -> inline red error from response.error
                  - 405/500/network -> generic retry message,
                    button re-enabled so user can retry
                  Endpoint constant ENDPOINT at top of IIFE
                  for one-line dev->prod swap at cutover.
                  "Sending..." button label during in-flight
                  request to prevent double-submit.
v1.0  2026-05-23  Initial extraction. Logic identical to v1.9
                  inline IIFE. Placeholder success state.
============================================================
*/

(function(){
  // -- Endpoint --
  // DEV:  https://rentalcomp-proxy-dev.alik-levin.workers.dev/inspection-request
  // PROD: https://rentalcomp-proxy.alik-levin.workers.dev/inspection-request
  // Currently: PROD (Worker v2.19 promoted 2026-05-24)
  var ENDPOINT="https://rentalcomp-proxy.alik-levin.workers.dev/inspection-request";

  function gi(id){return document.getElementById(id);}
  var overlay=gi("r25ir-overlay");
  if(!overlay) return; // embed not on page - bail silently
  var closeBtn=gi("r25ir-close");
  var titleEl=gi("r25ir-title");
  var submitBtn=gi("r25ir-submit");
  var msg=gi("r25ir-msg");
  var formBox=gi("r25ir-form");
  var first=gi("r25ir-first");
  var last=gi("r25ir-last");
  var email=gi("r25ir-email");
  var phone=gi("r25ir-phone");
  var currentType="";

  function showMsg(text,color){
    msg.style.color=color||"#111113";
    msg.textContent=text;
  }
  function clrMsg(){msg.textContent="";}

  function resetForm(){
    first.value="";last.value="";email.value="";phone.value="";
    submitBtn.disabled=false;
    submitBtn.textContent="Submit Request";
    formBox.style.display="block";
    clrMsg();
  }

  function openModal(type){
    currentType=type;
    titleEl.textContent="Request Service";
    resetForm();
    overlay.classList.add("r25ir-open");
    document.body.style.overflow="hidden";
    setTimeout(function(){first.focus();},50);
  }

  function closeModal(){
    overlay.classList.remove("r25ir-open");
    document.body.style.overflow="";
  }

  function validEmail(e){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);}

  function doSubmit(){
    clrMsg();
    var f=first.value.trim();
    var l=last.value.trim();
    var e=email.value.trim();
    var p=phone.value.trim();
    if(!f){showMsg("Please enter your first name.","#B42318");return;}
    if(!l){showMsg("Please enter your last name.","#B42318");return;}
    if(!e||!validEmail(e)){showMsg("Please enter a valid email.","#B42318");return;}

    submitBtn.disabled=true;
    submitBtn.textContent="Sending...";

    var payload={
      firstName:f,
      lastName:l,
      email:e,
      phone:p,
      inspectionType:currentType
    };

    fetch(ENDPOINT,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(payload)
    }).then(function(res){
      // Try to parse body regardless of status - server returns JSON for both success and error
      return res.json().then(function(data){return {status:res.status,data:data};}).catch(function(){return {status:res.status,data:null};});
    }).then(function(r){
      if(r.status===200&&r.data&&r.data.ok===true){
        // Terminal success - per Worker contract, do not retry
        submitBtn.textContent="Sent";
        showMsg("Thanks - request received. Our team will be in touch shortly.","#1E8449");
        return;
      }
      if(r.status===400&&r.data&&r.data.error){
        // Validation failure from server - show its message inline
        submitBtn.disabled=false;
        submitBtn.textContent="Submit Request";
        showMsg(r.data.error,"#B42318");
        return;
      }
      // 405/500/anything else
      submitBtn.disabled=false;
      submitBtn.textContent="Submit Request";
      showMsg("Something went wrong. Please try again.","#B42318");
    }).catch(function(){
      // Network failure
      submitBtn.disabled=false;
      submitBtn.textContent="Submit Request";
      showMsg("Network error. Please try again.","#B42318");
    });
  }

  // Wire Request pill buttons
  var pills=document.querySelectorAll("#r25-pricing .req-pill[data-r25ir-type], .req-pill[data-r25ir-type]");
  for(var i=0;i<pills.length;i++){
    pills[i].addEventListener("click",function(ev){
      ev.preventDefault();
      var t=this.getAttribute("data-r25ir-type");
      openModal(t);
    });
  }

  closeBtn.addEventListener("click",closeModal);
  submitBtn.addEventListener("click",doSubmit);
  overlay.addEventListener("click",function(e){if(e.target===overlay){closeModal();}});
  document.addEventListener("keydown",function(e){
    if(e.key==="Escape"&&overlay.classList.contains("r25ir-open")){closeModal();}
  });
})();
