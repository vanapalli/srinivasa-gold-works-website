/* Catalogue data shared by every page.
   Photos live on disk as images/{folder}/{file}-01.jpg upward.
   Bump `count` when new numbered files are added to a folder. */

const WHATSAPP_NUMBER = "919704073141";
const INSTAGRAM_URL = "https://www.instagram.com/srinivasagoldworks/";
const MAPS_QUERY = "Srinivasa Gold Works, Ramalayam Street, Indiranagar, Mangalagiri, Guntur District, Andhra Pradesh 522503";

const BRACELET_NOTE = "Assorted chain-link designs. Mention the design position when you message us.";

const CATALOGUE = [
  { category:"Bracelets", slug:"bracelets", id:"b", folder:"bracelets", file:"bracelet",
    label:"Bracelet Design Sheet", count:6, note:BRACELET_NOTE,
    cover:"images/covers/bracelets.jpg",
    blurb:"Chain-link bracelets in 22k gold, shown as design sheets so you can compare several patterns at once." },

  { category:"Necklaces", slug:"necklaces", id:"n", folder:"necklaces", file:"necklace",
    label:"Light-Weight Necklace", count:17, note:"",
    cover:"images/covers/necklaces.jpg",
    blurb:"Temple and antique-finish necklaces kept deliberately light, so they sit comfortably through a long day." },

  { category:"Stone Necklaces", slug:"stone-necklaces", id:"sn", folder:"stone-necklaces", file:"stone-necklace",
    label:"Light-Weight Stone Necklace", count:74, note:"",
    cover:"images/covers/stone-necklaces.jpg",
    blurb:"Ruby, emerald and pearl settings on light-weight gold frames — our widest range, added to most often." },

  { category:"Black Beads", slug:"black-beads", id:"bb", folder:"black-beads", file:"black-beads",
    label:"Black Beads Design", count:122, note:"",
    cover:"images/covers/black-beads.jpg",
    blurb:"Mangalsutra and black-bead chains, from everyday short chains to heavier two-line designs." },

  { category:"Rings", slug:"rings", id:"r", folder:"rings", file:"ring",
    label:"Ring Design", count:0, note:"", blurb:"" },

  { category:"Earrings", slug:"earrings", id:"e", folder:"earrings", file:"earring",
    label:"Earring Design", count:0, note:"", blurb:"" },
];

const pad = n => String(n).padStart(2, "0");

const esc = s => String(s).replace(/[&<>"']/g, c =>
  ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));

function waLink(text){
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

function productsFor(cat){
  return Array.from({ length:cat.count }, (_, i) => ({
    id:       `${cat.id}${i + 1}`,
    name:     `${cat.label} ${pad(i + 1)}`,
    category: cat.category,
    note:     cat.note,
    image:    `images/${cat.folder}/${cat.file}-${pad(i + 1)}.jpg`,
  }));
}

const PRODUCTS = CATALOGUE.flatMap(productsFor);

const liveCategories = CATALOGUE.filter(c => c.count > 0);
const comingSoonCategories = CATALOGUE.filter(c => c.count === 0);
