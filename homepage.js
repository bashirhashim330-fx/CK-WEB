/** CK Capital homepage presentation controller.
 * No pricing, account or authentication state is duplicated here.
 * All financial values originate in the existing app engine or supplied images.
 */
(() => {
  'use strict';
  const home = document.querySelector('.home-v5');
  if (!home) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const proofs = [
    ['payout-ski-804.png', 'Ski', '$804.00'],
    ['payout-mohamed-imran-950.png', 'Mohamed Imran', '$950.00'],
    ['payout-saiuran-govender-319.png', 'Saiuran Govender', '$319.00'],
    ['payout-troy-498.png', 'Troy', '$498.00'],
    ['payout-ed-193.png', 'Ed', '$193.00'],
    ['payout-homen-255.png', 'Homen', '$255.00'],
    ['payout-siryi21-190.png', 'Siryi21', '$190.00']
  ].map(([file, name, amount]) => ({ src: `assets/real/payouts/${file}`, title: `${name} / ${amount}`, name, amount }));
  const products = [
    { src: 'assets/real/product/dashboard-overview-mobile.png', title: 'Dashboard overview / original mobile view' },
    { src: 'assets/real/product/dashboard-objectives-mobile.png', title: 'Challenge objectives / original mobile view' },
    { src: 'assets/real/product/homepage-wolf-mobile-reference.png', title: 'CK homepage / original mobile reference' }
  ];
  const modal = document.getElementById('modal-proof-viewer');
  const modalImage = document.getElementById('proof-modal-image');
  let viewerSet = proofs, viewerIndex = 0, returnFocus = null;
  const updateViewer = () => {
    const item = viewerSet[viewerIndex];
    modalImage.src = item.src;
    modalImage.alt = item.title;
    document.getElementById('proof-modal-title').textContent = item.title;
    document.getElementById('proof-modal-source').textContent = viewerSet === proofs ? 'ORIGINAL CK CAPITAL COMMUNITY POST' : 'ORIGINAL SUPPLIED CK CAPITAL INTERFACE';
    document.getElementById('viewer-position').textContent = `${viewerIndex + 1} / ${viewerSet.length}`;
  };
  function openViewer(set, index, source) {
    if (!set[index]) return;
    viewerSet = set; viewerIndex = index; returnFocus = source;
    updateViewer(); modal.classList.add('open');
    document.body.classList.add('home-media-open');
    home.inert = true;
    modal.querySelector('.modal-close').focus();
  }
  function closeViewer() { modal.classList.remove('open'); }
  function stepViewer(step) { viewerIndex = (viewerIndex + step + viewerSet.length) % viewerSet.length; updateViewer(); }
  new MutationObserver(() => {
    if (!modal.classList.contains('open')) {
      document.body.classList.remove('home-media-open'); home.inert = false;
      returnFocus?.focus({ preventScroll: true }); returnFocus = null;
    }
  }).observe(modal, { attributes: true, attributeFilter: ['class'] });
  home.querySelectorAll('[data-proof-open]').forEach(button => button.addEventListener('click', () => openViewer(proofs, Number(button.dataset.proofOpen), button)));
  home.querySelectorAll('[data-product-open]').forEach(button => button.addEventListener('click', () => openViewer(products, Number(button.dataset.productOpen), button)));
  let mediaTouchX = 0, mediaTouchY = 0;
  modalImage.style.touchAction = 'pan-y pinch-zoom';
  modalImage.addEventListener('pointerdown', event => { mediaTouchX = event.clientX; mediaTouchY = event.clientY; });
  modalImage.addEventListener('pointerup', event => {
    const deltaX = event.clientX - mediaTouchX, deltaY = event.clientY - mediaTouchY;
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY)) stepViewer(deltaX < 0 ? 1 : -1);
  });
  document.getElementById('viewer-prev').addEventListener('click', () => stepViewer(-1));
  document.getElementById('viewer-next').addEventListener('click', () => stepViewer(1));
  modal.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); closeViewer(); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); stepViewer(-1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); stepViewer(1); }
    if (event.key === 'Tab') {
      const controls = [...modal.querySelectorAll('button')];
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });

  // Continuous certificate procession: lower right → raised center → lower left.
  // One shared timeline, composited 2D transforms, original decoded source images.
  const deck = document.getElementById('certificate-deck');
  deck.classList.add('h9-orbit');
  const cards = [...deck.querySelectorAll('[data-deck-index]')];
  const dots = [...home.querySelectorAll('[data-proof-index]')];
  const deckImages = cards.map(card => card.querySelector('img'));
  const status = document.createElement('span');status.className='sr-only';status.setAttribute('aria-live','polite');deck.append(status);
  let active=0, orbitAnimations=[], orbitReady=false, orbitVisible=false, autoEnabled=true;
  let orbitFrame=0, pointerHeld=false;
  const orbitDuration=35000;
  const caption=index=>{
    if(active===index && deck.dataset.active===String(index))return;
    active=index;deck.dataset.active=String(index);
    cards.forEach((card,i)=>{card.classList.toggle('is-selected',i===index);card.setAttribute('aria-pressed',String(i===index));card.tabIndex=i===index?0:-1;});
    dots.forEach((dot,i)=>dot.setAttribute('aria-pressed',String(i===index)));
    document.getElementById('featured-proof-name').textContent=proofs[index].name;
    document.getElementById('featured-proof-amount').textContent=proofs[index].amount;
    document.getElementById('featured-proof-card').dataset.proofOpen=String(index);
  };
  const frame=()=>{
    orbitFrame=0;
    let nearest=0,dist=Infinity;
    orbitAnimations.forEach((anim,i)=>{const t=((Number(anim.currentTime)||0)/orbitDuration)%1;const d=Math.abs(t-.5);if(d<dist){dist=d;nearest=i;}});
    caption(nearest);
    if(orbitAnimations.some(anim=>anim.playState==='running'))orbitFrame=requestAnimationFrame(frame);
  };
  const syncOrbit=()=>{
    const run=orbitReady&&orbitVisible&&autoEnabled&&!motion.matches&&!document.hidden&&home.classList.contains('active')&&!modal.classList.contains('open')&&!pointerHeld;
    orbitAnimations.forEach(anim=>run?anim.play():anim.pause());
    deck.dataset.motion=motion.matches?'reduced':run?'running':'paused';
    if(!run&&orbitFrame){cancelAnimationFrame(orbitFrame);orbitFrame=0;}
    if(run&&!orbitFrame)orbitFrame=requestAnimationFrame(frame);
    const control=document.getElementById('proof-autoplay-toggle');
    control.disabled=motion.matches;control.setAttribute('aria-pressed',String(autoEnabled&&!motion.matches));
    control.textContent=motion.matches?'Automatic motion off · reduced motion':autoEnabled?'Pause photo motion':'Play photo motion';
  };
  const buildOrbit=()=>{
    if(!orbitReady)return;
    const oldTime=orbitAnimations[0]?.currentTime;
    const anchor=oldTime==null?((.5+active/7)%1)*orbitDuration:Number(oldTime);
    orbitAnimations.forEach(anim=>anim.cancel());orbitAnimations=[];
    cards.forEach(card=>{card.classList.remove('is-outgoing','deck-wrap');card.style.removeProperty('--offset');card.style.removeProperty('--abs');card.style.removeProperty('--z');});
    if(motion.matches){caption(active);syncOrbit();return;}
    const cardWidth=cards[0].offsetWidth;
    const travel=Math.max(deck.clientWidth+cardWidth*3.1,cardWidth*8.6);
    const arcSpan=(deck.clientWidth+cardWidth)/2*.95;
    const rise=innerWidth<=640?78:88;
    cards.forEach((card,i)=>{
      const keyframes=Array.from({length:121},(_,k)=>{
        const t=k/120,x=(.5-t)*travel,arc=Math.max(0,1-(x/arcSpan)**2),y=104-rise*arc;
        const opacity=Math.min(1,t/.07,(1-t)/.07);
        return {offset:t,transform:`translateX(calc(-50% + ${x.toFixed(3)}px)) translateY(${y.toFixed(3)}px) rotate(${(Math.max(-1,Math.min(1,x/arcSpan))*7).toFixed(3)}deg) scale(${(.83+.17*arc).toFixed(4)})`,opacity};
      });
      const anim=card.animate(keyframes,{duration:orbitDuration,iterations:Infinity,easing:'linear'});
      anim.pause();anim.currentTime=((anchor-i*orbitDuration/7)%orbitDuration+orbitDuration)%orbitDuration;orbitAnimations.push(anim);
    });
    caption(active);syncOrbit();
  };
  const select=index=>{
    const chosen=(index+proofs.length)%proofs.length;caption(chosen);
    orbitAnimations.forEach((anim,i)=>anim.currentTime=((.5+(chosen-i)/7)%1+1)%1*orbitDuration);
    status.textContent=`Certificate ${chosen+1} of 7: ${proofs[chosen].title}. Open full screen with a tap.`;
    syncOrbit();
  };
  cards.forEach((card,i)=>{
    card.setAttribute('aria-label',`Open ${proofs[i].title} full screen`);
    card.addEventListener('click',()=>{pointerHeld=false;openViewer(proofs,i,card);syncOrbit();});
  });
  dots.forEach(dot=>dot.addEventListener('click',()=>select(Number(dot.dataset.proofIndex))));
  document.getElementById('proof-prev').addEventListener('click',()=>select(active-1));
  document.getElementById('proof-next').addEventListener('click',()=>select(active+1));
  deck.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();select(active+(event.key==='ArrowLeft'?-1:1));}});
  deck.addEventListener('pointerdown',()=>{pointerHeld=true;syncOrbit();},{passive:true});
  const release=()=>{pointerHeld=false;syncOrbit();};window.addEventListener('pointerup',release,{passive:true});window.addEventListener('pointercancel',release,{passive:true});
  deckImages.forEach(img=>{img.loading='eager';img.decoding='async';img.draggable=false;});
  Promise.all(deckImages.map(img=>img.decode().catch(()=>{}))).then(()=>{orbitReady=true;deck.classList.add('images-ready');buildOrbit();});
  caption(0);

  // Touch uses native overflow; mouse drag is an additive archive interaction.
  const archive = home.querySelector('.h5-archive-viewport');
  home.querySelectorAll('[data-archive-step]').forEach(button => button.addEventListener('click', () => archive.scrollBy({ left: Number(button.dataset.archiveStep) * 300, behavior: motion.matches ? 'auto' : 'smooth' })));
  let dragging = false, dragX = 0, dragScroll = 0, moved = false;
  archive.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    dragging = true; moved = false; dragX = e.clientX; dragScroll = archive.scrollLeft;
  });
  window.addEventListener('pointermove', e => {
    if (!dragging) return;
    if (Math.abs(e.clientX - dragX) > 8) { moved = true; archive.classList.add('is-dragging'); archive.scrollLeft = dragScroll - (e.clientX - dragX); }
  }, { passive: true });
  window.addEventListener('pointerup', () => { dragging = false; archive.classList.remove('is-dragging'); });
  archive.addEventListener('dragstart', e => e.preventDefault());
  archive.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopImmediatePropagation(); moved = false; } }, true);

  // Read the existing selector engine's rendered values rather than copying its matrix.
  const syncConfiguration = () => {
    const selected = document.querySelector('#sizes-container .active');
    if (!selected) return;
    const size = Number(selected.dataset.size);
    document.getElementById('allocation-display').textContent = size ? `$${size.toLocaleString('en-US')}` : selected.textContent;
    home.querySelector('.cfg-allocation-line i').style.width = `${Math.min(100, 24 + Math.log2((size || 5000) / 5000 + 1) * 14)}%`;
    document.querySelectorAll('#model-selector button,#platform-selector button,#preference-selector button').forEach(button => button.setAttribute('aria-pressed', String(button.classList.contains('active'))));
    const output = home.querySelector('.cfg-terminal-output');
    output.classList.remove('is-updating');
    if (!motion.matches) { void output.offsetWidth; output.classList.add('is-updating'); }
  };
  new MutationObserver(syncConfiguration).observe(document.getElementById('sizes-container'), { childList: true });
  new MutationObserver(syncConfiguration).observe(document.getElementById('spec-price'), { childList: true, characterData: true, subtree: true });
  syncConfiguration();
  document.querySelectorAll('#model-selector,#platform-selector,#preference-selector').forEach(selector => {
    new MutationObserver(syncConfiguration).observe(selector, { subtree: true, attributes: true, attributeFilter: ['class'] });
  });
  document.getElementById('footer-btn-login-secondary')?.addEventListener('click', () => document.getElementById('nav-btn-auth').click());
  const faqButtons = [...home.querySelectorAll('.faq-q')];
  const syncFAQ = () => faqButtons.forEach(button => button.setAttribute('aria-expanded', String(button.closest('.faq-item').classList.contains('active'))));
  faqButtons.forEach((button, index) => {
    const answer = button.nextElementSibling; answer.id = `home-faq-answer-${index}`;
    button.setAttribute('aria-controls', answer.id);
    new MutationObserver(syncFAQ).observe(button.closest('.faq-item'), { attributes: true, attributeFilter: ['class'] });
  }); syncFAQ();


  // Complete the reference's missing cards using existing CK selector/offer behavior.
  home.querySelectorAll('[data-use-platform]').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelector(`#platform-selector [data-platform="${button.dataset.usePlatform}"]`)?.click();
      document.getElementById('challenge-terminal').scrollIntoView({ behavior: motion.matches ? 'auto' : 'smooth' });
    });
  });
  const copyOffer = document.getElementById('copy-home-offer');
  copyOffer.addEventListener('click', async () => {
    const feedback = document.getElementById('home-offer-status');
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText('CONSISTENCY');
      feedback.textContent = 'Copied. Apply CONSISTENCY at checkout.';
    } catch (_) {
      // Do not claim a successful copy when the browser blocks clipboard access.
      feedback.textContent = 'Copy this code manually: CONSISTENCY';
    }
  });
  const featureTrack = home.querySelector('.h6-benefit-track');
  home.querySelectorAll('[data-feature-step]').forEach(button => button.addEventListener('click', () => {
    const card = featureTrack.querySelector('.h6-benefit-card');
    const gap = parseFloat(getComputedStyle(featureTrack).gap) || 20;
    featureTrack.scrollBy({ left: Number(button.dataset.featureStep) * (card.offsetWidth + gap), behavior: motion.matches ? 'auto' : 'smooth' });
  }));
  const featureProgress = () => {
    const max = featureTrack.scrollWidth - featureTrack.clientWidth;
    const value = max > 0 ? featureTrack.scrollLeft / max * 200 : 0;
    home.querySelector('.h6-benefit-progress').style.setProperty('--feature-progress', `${value}%`);
    home.querySelectorAll('[data-feature-step]').forEach(button => {
      const end = Number(button.dataset.featureStep) < 0 ? featureTrack.scrollLeft < 2 : featureTrack.scrollLeft >= max - 2;
      button.disabled = max <= 2 || end;
    });
  };
  featureTrack.addEventListener('scroll', featureProgress, { passive: true });
  window.addEventListener('resize', featureProgress, { passive: true });
  featureProgress();

  // Pause at the exact current position in the full-screen viewer, then resume.
  document.getElementById('proof-autoplay-toggle').addEventListener('click',()=>{autoEnabled=!autoEnabled;syncOrbit();});
  document.addEventListener('visibilitychange',syncOrbit);
  new MutationObserver(syncOrbit).observe(modal,{attributes:true,attributeFilter:['class']});
  new MutationObserver(()=>{syncOrbit();if(home.classList.contains('active'))requestAnimationFrame(featureProgress);}).observe(home,{attributes:true,attributeFilter:['class']});
  motion.addEventListener('change',buildOrbit);
  let orbitResize;window.addEventListener('resize',()=>{clearTimeout(orbitResize);orbitResize=setTimeout(buildOrbit,120);},{passive:true});
  if('IntersectionObserver' in window){
    const orbitObserver=new IntersectionObserver(entries=>{orbitVisible=entries.some(entry=>entry.isIntersecting);syncOrbit();},{threshold:.08});orbitObserver.observe(deck);
    window.addEventListener('pagehide',()=>{orbitVisible=false;syncOrbit();});
    window.addEventListener('pageshow',()=>{orbitVisible=deck.getBoundingClientRect().bottom>0&&deck.getBoundingClientRect().top<innerHeight;syncOrbit();});
  }else{orbitVisible=true;syncOrbit();}
  syncOrbit();
  // Source imagery is untouched; this light sweep is strictly a device-frame effect.
  home.querySelectorAll('.h5-phone-screen,.h5-laptop-screen').forEach(screen => {
    const sheen = document.createElement('span'); sheen.className = 'h6-device-sheen';
    sheen.setAttribute('aria-hidden', 'true'); screen.append(sheen);
  });

  // One-shot reveals + event-driven parallax: no scroll hijack or permanent RAF loop.
  if ('IntersectionObserver' in window) {
    const reveals = home.querySelectorAll('[data-home-reveal]');
    if (!motion.matches) home.classList.add('motion-ready');
    const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); }
    }), { threshold: 0.1, rootMargin: '0px 0px -25px 0px' });
    reveals.forEach(el => revealObserver.observe(el));
    const scenes = [...home.querySelectorAll('[data-depth-scene]')], visible = new Set();
    let raf = 0;
    const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
    function requestDepth() {
      if (raf || motion.matches || document.hidden || !home.classList.contains('active')) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        visible.forEach(scene => {
          const rect = scene.getBoundingClientRect();
          const scrollOffset = Math.max(-22, Math.min(22, (innerHeight / 2 - rect.top - rect.height / 2) * 0.055));
          scene.querySelectorAll('[data-depth]').forEach(layer => {
            const factor = Number(layer.dataset.depth);
            layer.style.setProperty('--scene-tilt', `${finePointer.matches ? scrollOffset * 0.09 : 0}deg`);
            layer.style.setProperty('--depth-x', `${(scene._pointerX || 0) * factor}px`);
            layer.style.setProperty('--depth-y', `${(scrollOffset + (scene._pointerY || 0)) * factor}px`);
          });
        });
      });
    }
    const sceneObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { visible.add(entry.target); entry.target.classList.add('scene-visible'); } else visible.delete(entry.target);
      requestDepth();
    }));
    scenes.forEach(scene => {
      sceneObserver.observe(scene);
      scene.addEventListener('pointermove', e => {
        if (!finePointer.matches || motion.matches) return;
        const rect = scene.getBoundingClientRect();
        scene._pointerX = (e.clientX - rect.left - rect.width / 2) / rect.width * 13;
        scene._pointerY = (e.clientY - rect.top - rect.height / 2) / rect.height * 9;
        requestDepth();
      }, { passive: true });
      scene.addEventListener('pointerleave', () => { scene._pointerX = scene._pointerY = 0; requestDepth(); });
    });
    window.addEventListener('scroll', requestDepth, { passive: true });
    window.addEventListener('resize', requestDepth, { passive: true });
    motion.addEventListener('change', () => {
      home.classList.toggle('motion-ready', !motion.matches);
      if (motion.matches) reveals.forEach(el => el.classList.add('is-visible'));
      requestDepth();
    });
    window.addEventListener('pagehide', event => {
      cancelAnimationFrame(raf); raf = 0;
      if (!event.persisted) { sceneObserver.disconnect(); revealObserver.disconnect(); }
    });
    window.addEventListener('pageshow', requestDepth);
  }
})();
