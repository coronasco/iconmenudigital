const MENU = [
  {
    category: "Caffetteria",
    items: [
      { name: "Caffè", price: 1.2 },
      { name: "Caffè Dek", price: 1.3 },
      { name: "Caffè Corretto", price: 1.6 },
      { name: "Caffè Shakerato", price: 2.5 },
      { name: "Orzo", price: 1.3 },
      { name: "Ginseng", price: 1.3 },
      { name: "Cappuccino", price: 1.5 },
      { name: "Latte Macchiato", price: 2.0 },
      { name: "Latte (bicchiere)", price: 1.2 },
      { name: "Marocchino", price: 1.8 },
      { name: "Tè caldo", price: 2.0 },
      { name: "Cioccolata calda", price: 2.5 },
      { name: "Brioche", price: 1.2 },
      { name: "Brioche di pasticceria", price: 1.5 },
    ],
  },
  {
    category: "Soft drink",
    items: [
      { name: "Red Bull", price: 3.0 },
      { name: "Chinotto", price: 3.5 },
      { name: "Ginger Beer", price: 3.5 },
    ],
  },
  {
    category: "Panini (vari gusti)",
    items: [
      { name: "Panino", price: 4.0 },
      { name: "Piadina", price: 4.0 },
      { name: "Toast", price: 3.0 },
      { name: "Tramezzino", price: 3.0 },
      { name: "Pizzatine (s/p carciofi)", price: 1.5 },
      { name: "Tagliere (3 pers.)", price: 4.0 },
    ],
  },
  {
    category: "Vini",
    items: [
      { name: "Prosecco", price: 3.5 },
      { name: "Vino rosso (bicchiere)", price: 3.5 },
      { name: "Chardonnay", price: 3.5 },
      { name: "Vino (bottiglia)", priceText: "12€ / 14€" },
    ],
  },
  {
    category: "Bibite",
    items: [
      { name: "Coca Cola (lattina)", priceText: "2.50€ / 3.00€" },
      { name: "Fanta", price: 2.0 },
      { name: "Lemon Soda (lattina)", priceText: "2.50€ / 3.00€" },
      { name: "Schweppes (lattina)", priceText: "2.50€ / 3.00€" },
      { name: "Tè freddo al limone", price: 2.5 },
      { name: "Succo di frutta", price: 3.0 },
      { name: "Spremuta (fresh)", price: 4.0 },
    ],
  },
  {
    category: "Birre",
    items: [
      { name: "Heineken (33cl)", price: 3.0 },
      { name: "Beck's (33cl)", price: 3.0 },
      { name: "Moretti (66cl)", price: 3.0 },
      { name: "Corona (33cl)", price: 3.0 },
      { name: "Ichnusa (33cl)", price: 3.0 },
      { name: "Menabrea (33cl)", price: 3.0 },
      { name: "Ceres (33cl)", price: 3.0 },
      { name: "Tennents (33cl)", price: 3.7 },
    ],
  },
  {
    category: "Aperitivo",
    items: [
      { name: "Spritz", price: 5.0 },
      { name: "Campari Soda / Cedrato", price: 3.0 },
      { name: "Campari Soda + Gin", price: 4.0 },
    ],
  },
  {
    category: "Liquori",
    items: [
      { name: "Grappa Borsciata", price: 3.5 },
      { name: "Grappa Candolini", price: 3.5 },
      { name: "Grappa Nonino", price: 3.5 },
      { name: "Grappa Nardini", price: 3.5 },
      { name: "Grappa Julia", price: 3.0 },
      { name: "Amaro Del Capo", price: 3.5 },
      { name: "Amaro Disaronno", price: 3.5 },
      { name: "Amaro Jägermeister", price: 3.5 },
      { name: "Amaro Lucano", price: 3.5 },
      { name: "Amaro Montenegro", price: 3.5 },
      { name: "Amaro San Simone", price: 3.5 },
      { name: "Amaro Fernet Branca", price: 3.5 },
      { name: "Amaro Unicum", price: 3.5 },
      { name: "Amaro Ramazzotti", price: 3.5 },
      { name: "Amaro di Torino", price: 3.5 },
      { name: "Amaro Mirto", price: 3.5 },
      { name: "Rum Havana Club", price: 3.5 },
      { name: "Rum Pampero", price: 3.5 },
    ],
  },
  {
    category: "Distillati",
    items: [
      { name: "Vodka Sky", price: 3.0 },
      { name: "Vodka Absolut", price: 3.5 },
      { name: "Vodka Belvedere", price: 7.0 },
      { name: "Vodka Iceberg", price: 3.0 },
      { name: "Gin Tanqueray", price: 3.5 },
      { name: "Gin Bombay", price: 4.0 },
      { name: "Gin Gordon's", price: 3.5 },
      { name: "Gin Nally", price: 6.0 },
      { name: "Gin Mare", price: 7.0 },
      { name: "Tequila Jose Cuervo", price: 3.5 },
      { name: "Tequila Especial", price: 4.0 },
      { name: "Whisky Jack D", price: 5.0 },
      { name: "Whisky J.D. Fire", price: 6.0 },
      { name: "Whisky J.D. Apple", price: 5.0 },
      { name: "Whisky J.D. Honey", price: 5.0 },
      { name: "Whisky Chivas", price: 5.0 },
      { name: "Whisky Ballantine's", price: 4.0 },
      { name: "Whisky Glen Grant", price: 4.0 },
      { name: "Whisky Red Label", price: 4.0 },
      { name: "Sambuca", price: 3.5 },
      { name: "Vecchia Romagna", price: 3.5 },
      { name: "Couvosier", price: 5.0 },
      { name: "Grand Marnier", price: 4.0 },
      { name: "Baileys", price: 3.5 },
      { name: "Limoncello", price: 3.0 },
    ],
  },
  {
    category: "Cocktails",
    items: [
      { name: "Mojito", price: 6.0 },
      { name: "Mojito Passion", price: 8.0 },
      { name: "Cuba Libre", price: 6.0 },
      { name: "Long Island", price: 8.0 },
      { name: "Cosmopolitan", price: 6.0 },
      { name: "Daiquiri", price: 6.0 },
      { name: "Moscow Mule", price: 8.0 },
      { name: "Negroni", price: 6.0 },
      { name: "Gin Tonic", price: 6.0 },
      { name: "Mimosa", price: 6.0 },
      { name: "Midori Sour", price: 6.0 },
    ],
  },
  {
    category: "Analcolici",
    items: [
      { name: "San Francisco", price: 5.0 },
      { name: "Icon", price: 6.0 },
      { name: "Rose Lemon Spritzer", price: 5.0 },
    ],
  },
];

const $ = (sel) => document.querySelector(sel);
const menuEl = $("#menu");
const qEl = $("#q");
const clearEl = $("#clear");
const resetEl = $("#reset");
const chipsEl = document.querySelector(".chips");
const countEl = $("#count");
const searchWrap = document.querySelector(".search");
const topbarEl = document.querySelector(".topbar");

const euro = (n) => `${n.toFixed(2)} €`.replace(".", ",");

function normalize(s) {
  return (s || "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function buildChips() {
  const cats = MENU.map((c) => c.category);
  for (const cat of cats) {
    const b = document.createElement("button");
    b.className = "chip";
    b.type = "button";
    b.dataset.chip = cat;
    b.textContent = cat;
    chipsEl.appendChild(b);
  }
}

function setActiveChip(value) {
  for (const el of chipsEl.querySelectorAll(".chip")) {
    el.classList.toggle("is-active", el.dataset.chip === value);
  }
}

function getState() {
  const active = chipsEl.querySelector(".chip.is-active")?.dataset?.chip || "all";
  return { q: qEl.value, chip: active };
}

function render() {
  const { q, chip } = getState();
  const nq = normalize(q);
  const chipFilter = chip && chip !== "all" ? chip : null;

  menuEl.innerHTML = "";

  let shown = 0;
  let total = 0;

  for (const section of MENU) {
    if (chipFilter && section.category !== chipFilter) continue;

    const filteredItems = section.items.filter((it) => {
      if (!nq) return true;
      const hay = normalize(`${section.category} ${it.name} ${it.desc || ""} ${it.priceText || ""}`);
      return hay.includes(nq);
    });

    total += section.items.length;
    shown += filteredItems.length;

    if (filteredItems.length === 0) continue;

    const s = document.createElement("section");
    s.className = "section";
    s.id = `cat-${normalize(section.category).replace(/\s+/g, "-")}`;

    const header = document.createElement("div");
    header.className = "section__header";

    const title = document.createElement("div");
    title.className = "section__title";
    title.textContent = section.category;

    const badge = document.createElement("div");
    badge.className = "section__badge";
    badge.textContent = `${filteredItems.length}/${section.items.length}`;

    header.appendChild(title);
    header.appendChild(badge);

    const itemsWrap = document.createElement("div");
    itemsWrap.className = "items";

    for (const it of filteredItems) {
      const row = document.createElement("div");
      row.className = "item";

      const left = document.createElement("div");
      left.className = "item__left";

      const name = document.createElement("div");
      name.className = "item__name";
      name.textContent = it.name;

      left.appendChild(name);

      if (it.desc) {
        const desc = document.createElement("div");
        desc.className = "item__desc";
        desc.textContent = it.desc;
        left.appendChild(desc);
      }

      const price = document.createElement("div");
      price.className = "item__price";
      price.textContent = it.priceText ? it.priceText : euro(Number(it.price));

      row.appendChild(left);
      row.appendChild(price);
      itemsWrap.appendChild(row);
    }

    s.appendChild(header);
    s.appendChild(itemsWrap);

    if (section.note) {
      const note = document.createElement("div");
      note.className = "item";
      note.innerHTML = `<div class="item__left"><div class="item__desc">${section.note}</div></div><div class="item__price"></div>`;
      s.appendChild(note);
    }

    menuEl.appendChild(s);
  }

  const isFiltered = Boolean(nq) || (chipFilter && chipFilter !== "all");
  countEl.textContent = isFiltered ? `${shown} risultati` : `${total} prodotti`;

  searchWrap.classList.toggle("has-value", qEl.value.trim().length > 0);
}

function resetAll() {
  qEl.value = "";
  setActiveChip("all");
  render();
  qEl.focus({ preventScroll: true });
}

chipsEl.addEventListener("click", (e) => {
  const btn = e.target?.closest?.(".chip");
  if (!btn) return;
  setActiveChip(btn.dataset.chip);
  render();
});

qEl.addEventListener("input", render);
clearEl.addEventListener("click", () => {
  qEl.value = "";
  render();
  qEl.focus({ preventScroll: true });
});
resetEl.addEventListener("click", resetAll);

buildChips();
render();

// subtle elevation on scroll for a more premium feel
const onScroll = () => {
  topbarEl?.classList?.toggle("topbar--scrolled", window.scrollY > 6);
};
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

// keep content perfectly offset under fixed topbar
const setTopbarOffset = () => {
  const h = topbarEl?.offsetHeight || 0;
  document.documentElement.style.setProperty("--topbar-offset", `${h}px`);
};
setTopbarOffset();
window.addEventListener("resize", setTopbarOffset, { passive: true });
