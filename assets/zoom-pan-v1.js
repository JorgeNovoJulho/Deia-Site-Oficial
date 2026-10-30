(()=>{'use strict';
const connected=new WeakSet();
function attach(stage){
  if(connected.has(stage))return;
  connected.add(stage);
  // A centered flex item with auto margins can suppress one side of the scroll range.
  // A normal top-left scroll origin makes all four directions reachable.
  stage.style.setProperty('overflow','auto','important');
  stage.style.setProperty('display','flex','important');
  stage.style.setProperty('align-items','flex-start','important');
  stage.style.setProperty('justify-content','flex-start','important');
  stage.style.touchAction='none';
  stage.style.cursor='grab';
  stage.style.overscrollBehavior='contain';
  const img=stage.querySelector('img');
  if(img){
    img.style.setProperty('margin','0','important');
    img.style.setProperty('flex','0 0 auto','important');
    img.style.userSelect='none';
    img.draggable=false;
  }
  let p=null;
  stage.addEventListener('pointerdown',e=>{
    if(e.pointerType==='mouse'&&e.button!==0)return;
    if(e.target.closest('button,a,input'))return;
    p={id:e.pointerId,x:e.clientX,y:e.clientY,l:stage.scrollLeft,t:stage.scrollTop};
    stage.setPointerCapture(e.pointerId);
    stage.style.cursor='grabbing';
    e.preventDefault();
  });
  stage.addEventListener('pointermove',e=>{
    if(!p||p.id!==e.pointerId)return;
    stage.scrollLeft=p.l+p.x-e.clientX;
    stage.scrollTop=p.t+p.y-e.clientY;
    e.preventDefault();
  });
  function end(e){if(p&&e.pointerId!==undefined&&p.id!==e.pointerId)return;p=null;stage.style.cursor='grab'}
  for(const name of ['pointerup','pointercancel','lostpointercapture'])stage.addEventListener(name,end);
}
function scan(){
  document.querySelectorAll('.realm-viewer-stage,.codex-visual').forEach(attach);
}
scan();
new MutationObserver(scan).observe(document.body,{childList:true,subtree:true});
})();