/* Compact in-memory catalogue.
   Photos live on disk as images/{folder}/{file}-01.jpg …
   Only bump `count` when you drop new numbered files.
   Put names, notes, or weight on a piece only when it differs from the category defaults. */

const BRACELET_NOTE = "Assorted chain-link designs. Mention the design position when you message us.";

const CATALOGUE = [
  { category:"Bracelets",       id:"b",  folder:"bracelets",        file:"bracelet",       label:"Bracelet Design Sheet",       count:6,  note:BRACELET_NOTE },
  { category:"Necklaces",       id:"n",  folder:"necklaces",        file:"necklace",       label:"Light-Weight Necklace",       count:17, note:"" },
  { category:"Stone Necklaces", id:"sn", folder:"stone-necklaces",  file:"stone-necklace", label:"Light-Weight Stone Necklace", count:59, note:"" },
  { category:"Black Beads",     id:"bb", folder:"black-beads",      file:"black-beads",    label:"Black Beads Design",          count:0,  note:"" },
  { category:"Rings",           id:"r",  folder:"rings",            file:"ring",           label:"Ring Design",                 count:0,  note:"" },
  { category:"Earrings",        id:"e",  folder:"earrings",         file:"earring",        label:"Earring Design",              count:0,  note:"" },
];

const PIECES = {
  /* Example:
  sn12: { name:"Temple stone necklace", note:"Adjustable hook clasp." },
  */
};

const pad = n => String(n).padStart(2, "0");

function productFrom(cat, index){
  const n = index + 1;
  const id = `${cat.id}${n}`;
  const extra = PIECES[id] || {};
  return {
    id,
    name:     extra.name || `${cat.label} ${pad(n)}`,
    category: cat.category,
    note:     extra.note != null ? extra.note : cat.note,
    image:    `images/${cat.folder}/${cat.file}-${pad(n)}.jpg`,
  };
}

const PRODUCTS = CATALOGUE.flatMap(c =>
  Array.from({ length:c.count }, (_, i) => productFrom(c, i))
);

const PRODUCT_BY_ID = Object.create(null);
for(const p of PRODUCTS) PRODUCT_BY_ID[p.id] = p;
