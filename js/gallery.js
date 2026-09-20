/* Renders one category's gallery. The page names its category via body[data-page]. */

(function gallery(){
  const gridEl = $('grid');
  if(!gridEl) return;

  const cat = CATALOGUE.find(c => c.slug === document.body.dataset.page);
  if(!cat) return;

  const searchEl      = $('search');
  const resultCountEl = $('resultCount');
  const emptyStateEl  = $('emptyState');
  const all = productsFor(cat);

  let searchTerm = "";

  function render(){
    const t = searchTerm.trim().toLowerCase();
    const list = t
      ? all.filter(p => [p.name, p.category, p.note].join(' ').toLowerCase().includes(t))
      : all;

    window.lightboxItems = list;
    resultCountEl.textContent = `${list.length} piece${list.length !== 1 ? 's' : ''}`;

    if(!list.length){
      gridEl.style.display = 'none';
      emptyStateEl.style.display = 'block';
      return;
    }
    gridEl.style.display = 'grid';
    emptyStateEl.style.display = 'none';

    gridEl.innerHTML = list.map((p, i) => {
      const msg = `Hi! I'm interested in the ${p.name} from Srinivasa Gold Works. Could you share more details and today's price?`;
      const eager = i < 4;
      return `
      <article class="card reveal" style="--d:${(i % 4) * 70}ms">
        <div class="card-media" data-index="${i}">
          <img src="${esc(p.image)}" alt="${esc(p.name)}"
               loading="${eager ? 'eager' : 'lazy'}" fetchpriority="${eager ? 'high' : 'auto'}" decoding="async"
               onerror="this.closest('.card-media').classList.add('no-photo'); this.remove();">
          <div class="zoom-hint" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.2 15.2 L21 21 M8 10.5 H13 M10.5 8 V13"/></svg>
          </div>
        </div>
        <div class="card-body">
          <div class="card-cat">22k Gold</div>
          <h3 class="card-name">${esc(p.name)}</h3>
          ${p.note ? `<p class="card-note">${esc(p.note)}</p>` : ''}
          <div class="card-price">Price on request</div>
          <div class="card-actions">
            <a class="btn-wa" href="${waLink(msg)}" target="_blank" rel="noopener">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.39 1.26 4.81L2 22l5.4-1.42a9.87 9.87 0 0 0 4.64 1.18h.01c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.5 2 12.04 2z"/></svg>
              Order on WhatsApp
            </a>
            <a class="btn-ig" href="${INSTAGRAM_URL}" target="_blank" rel="noopener">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.85s.02-3.58.07-4.85c.15-3.23 1.66-4.77 4.92-4.92 1.27-.06 1.65-.07 4.85-.07zM12 0C8.74 0 8.33.01 7.05.07c-4.35.2-6.78 2.62-6.98 6.98C.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.2-4.35-2.62-6.78-6.98-6.98C15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1 0 12 18.16 6.16 6.16 0 0 0 12 5.84zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.41-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"/></svg>
              Chat on Instagram
            </a>
          </div>
        </div>
      </article>`;
    }).join('');

    observeReveals();
  }

  gridEl.addEventListener('click', e => {
    const media = e.target.closest('.card-media');
    if(!media || media.classList.contains('no-photo')) return;
    window.openLightbox(Number(media.dataset.index));
  });

  searchEl.addEventListener('input', e => { searchTerm = e.target.value; render(); });
  $('clearSearch').addEventListener('click', () => {
    searchEl.value = ''; searchTerm = ''; render(); searchEl.focus();
  });

  if($('moreCats')){
    $('moreCats').innerHTML = categoryCardsHTML(liveCategories.filter(c => c.slug !== cat.slug));
  }

  render();
})();
