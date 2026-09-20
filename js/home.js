/* Overview page: category cards, marquee, hero photo fallback. */

(function categoryCards(){
  const el = $('catTiles');
  if(!el) return;
  el.innerHTML = categoryCardsHTML(liveCategories, { includeSoon:true });
})();

(function buildMarquee(){
  const track = $('marqueeTrack');
  if(!track) return;
  const items = ["22k gold","Handcrafted in Mangalagiri","Light-weight necklaces",
                 "Chain-link bracelets","Confirmed on WhatsApp"];
  track.innerHTML = [...items, ...items].map(t => `<span>${t}</span>`).join('');
})();

(function heroPhoto(){
  const img = $('heroPhoto');
  const tpl = $('framePlaceholder');
  if(!img || !tpl) return;
  const fail = () => {
    if(!img.isConnected) return;
    img.insertAdjacentHTML('afterend', tpl.innerHTML);
    img.remove();
  };
  if(img.complete && img.naturalWidth === 0) fail();
  else img.addEventListener('error', fail, { once:true });
})();

observeReveals();
