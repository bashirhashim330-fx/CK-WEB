/* Presentation controller. Navigation delegates to the existing state engine. */
(() => {
 'use strict';
 const root=document.getElementById('dashboard-view');
 if(!root)return;
 const sheet=document.getElementById('desk-more-backdrop');
 const sheetDialog=sheet.querySelector('[role=dialog]');
 const toggle=document.getElementById('desk-more-toggle');
 const picker=document.getElementById('desk-account-backdrop');
 const pickerDialog=document.getElementById('desk-account-dialog');
 const pickerTrigger=document.getElementById('desk-account-trigger');
 const selector=document.getElementById('dash-account-switcher');
 let pickerFocus;
 function closePicker(){picker.hidden=true;pickerTrigger.setAttribute('aria-expanded','false');document.body.style.overflow='';pickerFocus?.focus({preventScroll:true});}
 function openPicker(){if(sheet.classList.contains('open'))closeSheet();pickerFocus=document.activeElement;picker.hidden=false;pickerTrigger.setAttribute('aria-expanded','true');document.body.style.overflow='hidden';pickerDialog.focus();}
 pickerTrigger.addEventListener('click',()=>picker.hidden?openPicker():closePicker());
 document.getElementById('desk-account-close').addEventListener('click',closePicker);
 picker.addEventListener('click',e=>{if(e.target===picker)closePicker();});
 picker.addEventListener('keydown',e=>{
   if(e.key==='Escape'){e.preventDefault();closePicker();return;}
   const buttons=[...picker.querySelectorAll('button')].filter(el=>el.offsetParent!==null);
   if(e.key==='Tab'){
     if(e.shiftKey&&(document.activeElement===buttons[0]||document.activeElement===pickerDialog)){e.preventDefault();buttons.at(-1).focus();}
     else if(!e.shiftKey&&(document.activeElement===buttons.at(-1)||document.activeElement===pickerDialog)){e.preventDefault();buttons[0].focus();}
   }
   if(e.key==='ArrowDown'||e.key==='ArrowUp'){
     const rows=[...picker.querySelectorAll('[data-account-choice]')];
     const i=rows.indexOf(document.activeElement);e.preventDefault();rows[i<0?(e.key==='ArrowDown'?0:rows.length-1):(i+(e.key==='ArrowDown'?1:-1)+rows.length)%rows.length]?.focus();
   }
 });
 function renderPicker(detail){
   if(!detail)return;
   const active=detail.accounts.find(a=>a.id===detail.selectedId);
   if(!active)return;
   document.getElementById('desk-picker-id').textContent=active.id;
   document.getElementById('desk-picker-meta').textContent=`$${active.size.toLocaleString()} · ${active.model==='instant'?'Funded':`Phase ${active.step}`}`;
   const options=document.getElementById('desk-account-options');options.replaceChildren();
   detail.accounts.forEach(a=>{
     const btn=document.createElement('button');btn.type='button';btn.className='desk-account-option';btn.dataset.accountChoice=a.id;
     btn.setAttribute('aria-pressed',String(a.id===active.id));
     const icon=document.createElement('img');icon.src='assets/real/brand/ck-capital-logo-transparent.webp';icon.alt='';icon.width=40;icon.height=40;
     const body=document.createElement('span');body.className='desk-account-option-body';
     const title=document.createElement('strong');title.textContent=a.id;
     const info=document.createElement('small');info.textContent=`$${a.size.toLocaleString()} capital · ${a.platform}`;
     const phase=document.createElement('span');phase.className='desk-option-phase';phase.textContent=a.status.replace(' // ',' · ');
     body.append(title,info,phase);
     const end=document.createElement('span');end.className='desk-account-option-end';
     const bal=document.createElement('strong');bal.textContent=`$${a.balance.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}`;
     const check=document.createElement('span');check.textContent=a.id===active.id?'✓ Selected':'View account';end.append(bal,check);
     btn.append(icon,body,end);
     btn.addEventListener('click',()=>{closePicker();if(selector.value!==a.id){selector.value=a.id;selector.dispatchEvent(new Event('change',{bubbles:true}));}});
     options.append(btn);
   });
 }
 document.getElementById('desk-more-search').addEventListener('click',()=>{closeSheet();document.getElementById('btn-open-cmdk-dash').click();});
 document.getElementById('desk-more-logout').addEventListener('click',()=>{closeSheet();document.getElementById('btn-dash-logout').click();});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&sheet.classList.contains('open'))closeSheet();});
 // The mobile drawer is intentionally retired. All panels live in the dock/More.
 document.getElementById('workspace-sidebar').classList.remove('open');
 let lastFocus;
 function closeSheet(){sheet.classList.remove('open');toggle.setAttribute('aria-expanded','false');document.body.style.overflow='';lastFocus?.focus();}
 function openSheet(){if(!picker.hidden)closePicker();lastFocus=document.activeElement;sheet.classList.add('open');toggle.setAttribute('aria-expanded','true');document.body.style.overflow='hidden';sheetDialog.focus();}
 toggle.addEventListener('click',()=>sheet.classList.contains('open')?closeSheet():openSheet());
 document.getElementById('desk-more-close').addEventListener('click',closeSheet);
 sheet.addEventListener('click',e=>{if(e.target===sheet)closeSheet();});
 sheet.addEventListener('keydown',e=>{
   if(e.key==='Escape'){closeSheet();return;}
   if(e.key!=='Tab')return;
   const els=[...sheet.querySelectorAll('button')].filter(el=>el.offsetParent!==null);
   const first=els[0],last=els.at(-1);
   if(e.shiftKey&&(document.activeElement===first||document.activeElement===sheetDialog)){e.preventDefault();last.focus();}
   else if(!e.shiftKey&&(document.activeElement===last||document.activeElement===sheetDialog)){e.preventDefault();first.focus();}
 });
 function syncNav(){
   const pane=root.querySelector('.dash-tab-pane.active'),tab=pane?.id.replace('pane-','');
   const mainTabs=['overview','trades','accounts','payouts'];
   root.querySelectorAll('.desk-mobile-dock [data-desk-tab]').forEach(b=>{const active=b.dataset.deskTab===tab;b.classList.toggle('active',active);active?b.setAttribute('aria-current','page'):b.removeAttribute('aria-current');});
   toggle.classList.toggle('active',!mainTabs.includes(tab));
   root.querySelectorAll('.sb-item').forEach(b=>{b.dataset.tab===tab?b.setAttribute('aria-current','page'):b.removeAttribute('aria-current');});
   const name=root.querySelector(`.sb-item[data-tab="${tab}"] span`)?.textContent;
   const title=document.getElementById('desk-panel-title');if(title)title.textContent=name||'Overview';
 }
 root.querySelectorAll('[data-desk-tab]').forEach(btn=>btn.addEventListener('click',()=>{
   if(sheet.classList.contains('open'))closeSheet();
   if(!picker.hidden)closePicker();
   root.querySelector(`.sb-item[data-tab="${btn.dataset.deskTab}"]`)?.click();
 }));
 root.querySelectorAll('.sb-item').forEach(btn=>btn.addEventListener('click',()=>queueMicrotask(()=>{
   syncNav();window.scrollTo({top:0,behavior:'instant'});
   const h=root.querySelector('.dash-tab-pane.active h1,.dash-tab-pane.active h3');
   if(h){h.setAttribute('tabindex','-1');h.focus({preventScroll:true});}
 })));
 root.querySelectorAll('[data-desk-challenge]').forEach(btn=>btn.addEventListener('click',()=>{
   if(sheet.classList.contains('open'))closeSheet();
   root.querySelector('#pane-accounts [data-nav="challenges"]')?.click();
 }));
 // CK-native menus for journal filters and support category. Native controls
 // remain hidden as the single source of truth for the existing form engine.
 const filterPopover=document.createElement('div');filterPopover.className='desk-filter-popover';filterPopover.id='desk-filter-popover';filterPopover.setAttribute('role','listbox');filterPopover.hidden=true;root.append(filterPopover);
 let filterOwner=null;
 function closeFilter(focus=false){filterPopover.hidden=true;if(filterOwner){filterOwner.button.setAttribute('aria-expanded','false');if(focus)filterOwner.button.focus();}filterOwner=null;}
 root.querySelectorAll('select:not(#dash-account-switcher)').forEach(native=>{
   const button=document.createElement('button');button.type='button';button.className='desk-filter-trigger';button.id=native.id+'-trigger';
   button.setAttribute('aria-haspopup','listbox');button.setAttribute('aria-expanded','false');button.setAttribute('aria-controls',filterPopover.id);
   const label=({'trade-dir-filter':'Trade direction','trade-result-filter':'Trade result','sup-category':'Support category'})[native.id]||'Choose option';
   const text=document.createElement('span'),arrow=document.createElement('span');arrow.textContent='⌄';arrow.setAttribute('aria-hidden','true');button.append(text,arrow);native.after(button);native.hidden=true;native.tabIndex=-1;
   const sync=()=>{text.textContent=native.selectedOptions[0]?.textContent||label;button.setAttribute('aria-label',label+': '+text.textContent);};sync();native.addEventListener('change',sync);
   const open=()=>{
     if(filterOwner?.button===button){closeFilter();return;}closeFilter();filterOwner={button,native};button.setAttribute('aria-expanded','true');filterPopover.replaceChildren();filterPopover.setAttribute('aria-label',label);
     [...native.options].forEach(option=>{
       const row=document.createElement('button');row.type='button';row.setAttribute('role','option');row.setAttribute('aria-selected',String(option.selected));row.tabIndex=-1;
       const name=document.createElement('span');name.textContent=option.textContent;const mark=document.createElement('span');mark.textContent=option.selected?'✓':'';row.append(name,mark);row.disabled=option.disabled;
       row.addEventListener('click',()=>{native.value=option.value;native.dispatchEvent(new Event('change',{bubbles:true}));closeFilter(true);});filterPopover.append(row);
     });
     filterPopover.hidden=false;
     const r=button.getBoundingClientRect(),width=Math.min(Math.max(r.width,220),innerWidth-24),height=Math.min(filterPopover.scrollHeight,260),bottomSpace=innerHeight-r.bottom-(innerWidth<=900?105:20);
     filterPopover.style.width=width+'px';filterPopover.style.left=Math.min(Math.max(12,r.left),innerWidth-width-12)+'px';filterPopover.style.top=(bottomSpace>=height?r.bottom+7:Math.max(12,r.top-height-7))+'px';
     (filterPopover.querySelector('[aria-selected=true]')||filterPopover.querySelector('button'))?.focus();
   };
   button.addEventListener('click',open);button.addEventListener('keydown',e=>{if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();open();}});
 });
 filterPopover.addEventListener('keydown',e=>{
   if(e.key==='Escape'){e.preventDefault();closeFilter(true);}
   else if(e.key==='Tab'){closeFilter(true);}
   else if(e.key==='ArrowDown'||e.key==='ArrowUp'){
     const rows=[...filterPopover.querySelectorAll('button:not(:disabled)')],i=rows.indexOf(document.activeElement);e.preventDefault();rows[i<0?(e.key==='ArrowDown'?0:rows.length-1):(i+(e.key==='ArrowDown'?1:-1)+rows.length)%rows.length]?.focus();
   }
 });
 document.addEventListener('pointerdown',e=>{if(filterOwner&&!filterPopover.contains(e.target)&&!filterOwner.button.contains(e.target))closeFilter();});
 window.addEventListener('scroll',()=>closeFilter(),{passive:true});window.addEventListener('resize',()=>closeFilter());
 function labelTables(){root.querySelectorAll('.data-table').forEach(table=>{const heads=[...table.querySelectorAll('thead th')].map(th=>th.textContent);table.querySelectorAll('tbody tr').forEach(row=>[...row.children].forEach((td,i)=>td.dataset.label=heads[i]||''));});}
 root.addEventListener('desk:render',event=>{renderPicker(event.detail);labelTables();syncNav();
   if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&!document.body.classList.contains('dashboard-reduced-motion')){
     root.querySelectorAll('.desk-primary-number>strong,.desk-account-metrics strong,.desk-progress-ring strong').forEach((el,i)=>el.animate([{opacity:.35,transform:'translateY(4px)'},{opacity:1,transform:'none'}],{duration:350,delay:i*35,easing:'ease-out'}));
   }
 });
 const tableObserver=new MutationObserver(labelTables);root.querySelectorAll('.data-table tbody').forEach(t=>tableObserver.observe(t,{childList:true}));
 labelTables();syncNav();
 let sizeTimer;window.addEventListener('resize',()=>{clearTimeout(sizeTimer);sizeTimer=setTimeout(()=>{if(window.innerWidth>900&&sheet.classList.contains('open'))closeSheet();if(root.classList.contains('active'))root.querySelector('#chart-tf-selector .tf-btn.active')?.click();},160);});
})();
