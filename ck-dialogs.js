/* CK-branded confirmations; no native alert/confirm/prompt UI. */
(()=>{'use strict';
 const logo='assets/real/brand/ck-capital-logo-transparent.webp';
 const d=document.createElement('dialog');d.id='ck-confirm';d.className='ck-confirm';
 d.innerHTML=`<form method="dialog"><img src="${logo}" alt="" width="42" height="42"><small>YOUR CK WORKSPACE</small><h2 id="ck-confirm-title"></h2><p id="ck-confirm-message"></p><div><button value="cancel" autofocus>Stay here</button><button value="accept" id="ck-confirm-accept">Continue</button></div></form>`;
 d.setAttribute('aria-labelledby','ck-confirm-title');d.setAttribute('aria-describedby','ck-confirm-message');document.body.append(d);
 let pending=null,focus;
 window.CKDialogs=Object.freeze({confirm({title,message,action}){if(pending)return Promise.resolve(false);focus=document.activeElement;d.querySelector('h2').textContent=title;d.querySelector('p').textContent=message;d.querySelector('#ck-confirm-accept').textContent=action;d.returnValue='';d.showModal();return new Promise(resolve=>pending=resolve);}});
 d.addEventListener('close',()=>{const resolve=pending;pending=null;resolve?.(d.returnValue==='accept');focus?.isConnected&&focus.focus({preventScroll:true});});
 d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close('cancel');}});
 // Covers selectors outside the dashboard (registration, checkout, payout modal).
 function boot(){
 const menu=document.createElement('div');menu.className='ck-options';menu.setAttribute('role','listbox');menu.id='ck-options';menu.hidden=true;document.body.append(menu);let owner;
 const close=(restore=false)=>{menu.hidden=true;if(owner){owner.button.setAttribute('aria-expanded','false');if(restore)owner.button.focus();}owner=null;};
 document.querySelectorAll('select').forEach(native=>{
   if(native.hidden||native.closest('#dashboard-view'))return;
   const button=document.createElement('button');button.type='button';button.className='ck-select-trigger form-input';button.id=native.id+'-trigger';button.setAttribute('aria-haspopup','listbox');button.setAttribute('aria-expanded','false');button.setAttribute('aria-controls',menu.id);
   const label=document.querySelector(`label[for="${native.id}"]`)?.textContent.trim()||({'reg-country':'Country','co-size-select':'Account size'})[native.id]||'Choose option';
   const sync=()=>{button.textContent=(native.selectedOptions[0]?.textContent||label)+'  ⌄';button.setAttribute('aria-label',label+': '+(native.selectedOptions[0]?.textContent||''));};sync();native.addEventListener('change',sync);native.after(button);native.hidden=true;native.tabIndex=-1;
   const open=()=>{if(owner?.button===button){close(true);return;}close();owner={button,native};button.setAttribute('aria-expanded','true');menu.replaceChildren();menu.setAttribute('aria-label',label);
     [...native.options].forEach(o=>{const row=document.createElement('button');row.type='button';row.setAttribute('role','option');row.setAttribute('aria-selected',String(o.selected));row.textContent=o.textContent+(o.selected?'  ✓':'');row.disabled=o.disabled;row.addEventListener('click',()=>{native.value=o.value;native.dispatchEvent(new Event('change',{bubbles:true}));close(true);});menu.append(row);});menu.hidden=false;
     const r=button.getBoundingClientRect(),w=Math.min(Math.max(r.width,220),innerWidth-24),h=Math.min(menu.scrollHeight,260);menu.style.width=w+'px';menu.style.left=Math.max(12,Math.min(r.left,innerWidth-w-12))+'px';menu.style.top=(innerHeight-r.bottom>h+12?r.bottom+6:Math.max(12,r.top-h-6))+'px';menu.querySelector('[aria-selected=true]')?.focus();};
   button.addEventListener('click',open);button.addEventListener('keydown',e=>{if(['ArrowDown','ArrowUp'].includes(e.key)){e.preventDefault();open();}});new MutationObserver(sync).observe(native,{childList:true,subtree:true});
 });
 menu.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();close(true);}else if(e.key==='Tab')close(true);else if(['ArrowDown','ArrowUp','Home','End'].includes(e.key)){e.preventDefault();const rows=[...menu.querySelectorAll('button:not(:disabled)')],i=rows.indexOf(document.activeElement),n=e.key==='Home'?0:e.key==='End'?rows.length-1:(i+(e.key==='ArrowDown'?1:-1)+rows.length)%rows.length;rows[n]?.focus();}});
 document.addEventListener('pointerdown',e=>{if(owner&&!menu.contains(e.target)&&!owner.button.contains(e.target))close();});window.addEventListener('resize',()=>close());window.addEventListener('scroll',()=>close(),{passive:true});document.addEventListener('click',e=>{if(e.target.closest('[data-close-modal]'))close();});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
