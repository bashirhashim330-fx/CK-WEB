/* Public menu accessibility and explicit unconnected social-sign-in previews. */
(()=>{'use strict';
 const drawer=document.getElementById('mobile-drawer'),close=document.getElementById('btn-close-drawer'),ham=document.getElementById('btn-hamburger');
 close?.addEventListener('click',()=>ham?.focus({preventScroll:true}));
 drawer?.addEventListener('keydown',e=>{if(e.key!=='Tab'||!drawer.classList.contains('open'))return;const els=[...drawer.querySelectorAll('button,a[href]')].filter(el=>el.offsetParent!==null);if(e.shiftKey&&document.activeElement===els[0]){e.preventDefault();els.at(-1).focus();}else if(!e.shiftKey&&document.activeElement===els.at(-1)){e.preventDefault();els[0].focus();}});
 window.addEventListener('resize',()=>{if(innerWidth>900&&drawer?.classList.contains('open'))close?.click();});
 document.addEventListener('keydown',e=>{if(drawer?.classList.contains('open')&&(e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){close?.click();}});
 for(const [id,provider] of [['btn-social-google','Google'],['btn-social-discord','Discord']])document.getElementById(id)?.addEventListener('click',async()=>{await window.CKDialogs.confirm({title:`${provider} sign-in preview`,message:`“Continue with ${provider}” is a social sign-in option. It isn’t connected in this prototype and won’t sign you in or open ${provider}. Use the demo email sign-in form to explore the dashboard.`,action:'Got it'});});
})();
