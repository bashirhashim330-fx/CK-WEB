/* Demo viewer accessibility; user/account values are populated by app.js. */
(()=>{
 const modal=document.getElementById('modal-cert');if(!modal)return;
 let oldOverflow='',wasOpen=false;
 new MutationObserver(()=>{
   const open=modal.classList.contains('open');if(open===wasOpen)return;wasOpen=open;
   if(open){oldOverflow=document.body.style.overflow;document.body.style.overflow='hidden';}
   else{document.body.style.overflow=oldOverflow;const target=modal._certReturnFocus;if(target?.isConnected)target.focus({preventScroll:true});}
 }).observe(modal,{attributes:true,attributeFilter:['class']});
 modal.addEventListener('keydown',e=>{
   if(e.key==='Escape'){e.preventDefault();modal.classList.remove('open');}
   if(e.key==='Tab'){
     const buttons=[...modal.querySelectorAll('button')],first=buttons[0],last=buttons.at(-1);
     if(e.shiftKey&&(document.activeElement===first||document.activeElement.id==='cert-viewer-title')){e.preventDefault();last.focus();}
     else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
   }
 });
})();
