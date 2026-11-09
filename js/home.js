/* Overview page: category cards and the hero photo fallback. */

(function categoryCards(){
  const el = $('catTiles');
  if(!el) return;
  el.innerHTML = categoryCardsHTML(liveCategories, { includeSoon:true });
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
