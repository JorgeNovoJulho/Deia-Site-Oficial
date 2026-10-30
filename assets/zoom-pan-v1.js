(()=>{'use strict';
const connected=new WeakSet();
function attach(stage,selector){if(connected.has(stage))return;connected.add(stage);stage.style.overflow='auto';stage.style.touchAction='none';stage.style.cursor='grab';let p=null;stage.addEventListener('pointerdown',e=>{if(e.button!==0)return;p={x:e.clientX,y:e.clientY,l:stage.scrollLeft,t:stage.scrollTop};stage.setPointerCapture(e.pointerId);stage.style.cursor='grabbing'});stage.addEventListener('pointermove',e=>{if(!p)return;stage.scrollLeft=p.l+p.x-e.clientX;stage.scrollTop=p.t+p.y-e.clientY});for(const n of ['pointerup','pointercancel','lostpointercapture'])stage.addEventListener(n,()=>{p=null;stage.style.cursor='grab'})}
function scan(){document.querySelectorAll('.realm-viewer-stage').forEach(el=>attach(el));document.querySelectorAll('.codex-visual').forEach(el=>attach(el))}
scan();new MutationObserver(scan).observe(document.body,{childList:true,subtree:true});
})();