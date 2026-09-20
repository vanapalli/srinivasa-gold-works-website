/* Behaviour shared by every page: contact links, nav, reveals, sticky header, lightbox. */

const $ = id => document.getElementById(id);

const GENERAL_MSG = "Hi! I'd love to know more about your jewellery collection.";

['headerWa','heroWa','visitWa','fabWa'].forEach(id => {
  const el = $(id);
  if(el) el.href = waLink(GENERAL_MSG);
});

['headerIg','visitIg'].forEach(id => {
  const el = $(id);
  if(el) el.href = INSTAGRAM_URL;
});

if($('mapLink')) $('mapLink').href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAPS_QUERY)}`;
if($('year')) $('year').textContent = new Date().getFullYear();
if($('pieceCount')) $('pieceCount').textContent = PRODUCTS.length;

/* Category links in the header and footer, marking the page you are on. */
const currentSlug = document.body.dataset.page || "";

function categoryLinks(){
  return liveCategories.map(c =>
    `<a href="${c.slug}.html" aria-current="${c.slug === currentSlug ? 'page' : 'false'}">${esc(c.category)}</a>`
  ).join('');
}

if($('navChips')){
  $('navChips').innerHTML =
    `<a href="index.html" aria-current="${currentSlug === 'home' ? 'page' : 'false'}">Overview</a>` +
    categoryLinks();
}

if($('footCats')){
  $('footCats').innerHTML = liveCategories.map(c =>
    `<li><a href="${c.slug}.html">${esc(c.category)}</a></li>`).join('');
}

/* Category cards, used on the overview page and at the foot of each gallery. */
function categoryCardsHTML(cats, { includeSoon = false } = {}){
  const live = cats.filter(c => c.count > 0).map(c => `
    <a class="cat-tile has-cover" href="${c.slug}.html">
      <img class="cat-tile-img" src="${esc(c.cover)}" alt="${esc(c.category)} from Srinivasa Gold Works" loading="lazy">
      <div class="cat-tile-body">
        <div class="count">${c.count} pieces</div>
        <div class="catname">${esc(c.category)}</div>
        ${c.blurb ? `<p class="cat-blurb">${esc(c.blurb)}</p>` : ''}
        <span class="cat-go">View the ${esc(c.category.toLowerCase())} &rsaquo;</span>
      </div>
    </a>`).join('');

  const soon = includeSoon ? comingSoonCategories.map(c => `
    <div class="cat-tile soon">
      <div class="cat-tile-body">
        <div class="count">Coming soon</div>
        <div class="catname">${esc(c.category)}</div>
      </div>
    </div>`).join('') : '';

  return live + soon;
}

/* Reveal-on-scroll. */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let revealObserver = null;

if(!reduceMotion && 'IntersectionObserver' in window){
  revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold:0.12, rootMargin:'0px 0px -40px 0px' });
}

function observeReveals(){
  const nodes = document.querySelectorAll('.reveal:not(.is-visible)');
  if(!revealObserver){ nodes.forEach(n => n.classList.add('is-visible')); return; }
  nodes.forEach(n => revealObserver.observe(n));
}

/* Sticky header shadow once the page scrolls. */
(function stickyHeader(){
  const headerEl = $('siteHeader');
  if(!headerEl) return;
  const sentinel = document.createElement('div');
  sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:1px;pointer-events:none;';
  document.body.prepend(sentinel);
  new IntersectionObserver(
    ([e]) => headerEl.classList.toggle('stuck', !e.isIntersecting),
    { threshold:1 }
  ).observe(sentinel);
})();

/* Image preview: zoom, pan and step through whatever the page is showing.
   Pages provide the list by setting window.lightboxItems to [{image, name}]. */
window.lightboxItems = window.lightboxItems || [];

(function lightbox(){
  const lb = $('lightbox');
  if(!lb) return;

  const stage   = $('lbStage');
  const img     = $('lbImg');
  const caption = $('lbCaption');
  const prevBtn = $('lbPrev');
  const nextBtn = $('lbNext');

  let index = -1;
  let scale = 1;
  let tx = 0, ty = 0;
  let dragging = false, lastX = 0, lastY = 0;

  function applyTransform(){
    img.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
    stage.classList.toggle('zoomed', scale > 1);
  }

  function resetZoom(){
    scale = 1; tx = 0; ty = 0;
    applyTransform();
  }

  function show(i){
    const items = window.lightboxItems;
    if(!items.length) return;
    index = (i + items.length) % items.length;
    const item = items[index];
    img.src = item.image;
    img.alt = item.name;
    caption.textContent = `${item.name} — ${index + 1} of ${items.length}`;
    resetZoom();
    prevBtn.disabled = items.length < 2;
    nextBtn.disabled = items.length < 2;
  }

  function close(){
    lb.hidden = true;
    document.body.style.overflow = '';
  }

  function zoomBy(factor){
    scale = Math.min(4, Math.max(1, scale * factor));
    if(scale === 1){ tx = 0; ty = 0; }
    applyTransform();
  }

  window.openLightbox = function(i){
    show(i);
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
  };

  $('lbClose').addEventListener('click', close);
  lb.addEventListener('click', e => { if(e.target === lb) close(); });
  prevBtn.addEventListener('click', () => show(index - 1));
  nextBtn.addEventListener('click', () => show(index + 1));
  $('lbZoomIn').addEventListener('click', () => zoomBy(1.5));
  $('lbZoomOut').addEventListener('click', () => zoomBy(1 / 1.5));
  $('lbZoomReset').addEventListener('click', resetZoom);
  img.addEventListener('dblclick', () => zoomBy(scale > 1 ? (1 / scale) : 2));

  document.addEventListener('keydown', e => {
    if(lb.hidden) return;
    if(e.key === 'Escape') close();
    else if(e.key === 'ArrowLeft') show(index - 1);
    else if(e.key === 'ArrowRight') show(index + 1);
    else if(e.key === '+' || e.key === '=') zoomBy(1.5);
    else if(e.key === '-') zoomBy(1 / 1.5);
  });

  stage.addEventListener('wheel', e => {
    e.preventDefault();
    zoomBy(e.deltaY < 0 ? 1.12 : 1 / 1.12);
  }, { passive:false });

  stage.addEventListener('pointerdown', e => {
    if(scale <= 1) return;
    dragging = true;
    stage.classList.add('dragging');
    lastX = e.clientX; lastY = e.clientY;
    stage.setPointerCapture(e.pointerId);
  });
  stage.addEventListener('pointermove', e => {
    if(!dragging) return;
    tx += e.clientX - lastX;
    ty += e.clientY - lastY;
    lastX = e.clientX; lastY = e.clientY;
    applyTransform();
  });
  ['pointerup','pointercancel','pointerleave'].forEach(evt =>
    stage.addEventListener(evt, () => { dragging = false; stage.classList.remove('dragging'); })
  );
})();

observeReveals();
