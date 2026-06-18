import { businessInfo } from "./config.js?v=20260618h";
import { MENU } from "./menu-data.js?v=20260618h";
import { attachTopbarShadow, enableMotion, setMetaDescription, setOpenGraph } from "./ui.js?v=20260618h";

const $ = (sel) => document.querySelector(sel);
const menuEl = $("#menu");
const qEl = $("#q");
const clearEl = $("#clear");
const resetEl = $("#reset");
const chipsEl = document.querySelector(".chips");
const countEl = $("#count");
const searchWrap = document.querySelector(".search");
const topbarEl = document.querySelector(".menu-topbar");

const euro = (n) => `${n.toFixed(2)} €`.replace(".", ",");

function getSectionItems(section) {
  if (section.items) return section.items;
  return (section.groups || []).flatMap((group) => group.items);
}

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

function renderItem(item) {
  const row = document.createElement("div");
  row.className = "item";

  const left = document.createElement("div");
  left.className = "item__left";

  const name = document.createElement("div");
  name.className = "item__name";
  name.textContent = item.name;
  left.appendChild(name);

  if (item.desc) {
    const desc = document.createElement("div");
    desc.className = "item__desc";
    desc.textContent = item.desc;
    left.appendChild(desc);
  }

  const price = document.createElement("div");
  price.className = "item__price";
  price.textContent = item.priceText ? item.priceText : euro(Number(item.price));

  row.appendChild(left);
  row.appendChild(price);

  return row;
}

function render() {
  const { q, chip } = getState();
  const nq = normalize(q);
  const chipFilter = chip && chip !== "all" ? chip : null;

  menuEl.innerHTML = "";

  let shown = 0;
  let total = 0;
  let sectionIndex = 0;

  for (const section of MENU) {
    if (chipFilter && section.category !== chipFilter) continue;

    const sectionItems = getSectionItems(section);
    const filteredItems = sectionItems.filter((it) => {
      if (!nq) return true;
      const hay = normalize(`${section.category} ${it.name} ${it.desc || ""} ${it.priceText || ""}`);
      return hay.includes(nq);
    });

    total += sectionItems.length;
    shown += filteredItems.length;

    if (filteredItems.length === 0) continue;

    const s = document.createElement("section");
    s.className = "section-card";
    if (section.groups) s.classList.add("section-card--wide");
    s.id = `cat-${normalize(section.category).replace(/\s+/g, "-")}`;
    s.setAttribute("data-reveal", "");
    s.style.setProperty("--reveal-delay", `${Math.min(sectionIndex * 70, 220)}ms`);
    sectionIndex += 1;

    const header = document.createElement("div");
    header.className = "section-card__header";

    const title = document.createElement("h2");
    title.className = "section-card__title";
    title.textContent = section.category;

    const badge = document.createElement("div");
    badge.className = "section-card__badge";
    badge.textContent = `${filteredItems.length}/${sectionItems.length}`;

    header.appendChild(title);
    header.appendChild(badge);

    let itemsWrap;
    if (section.groups) {
      itemsWrap = document.createElement("div");
      itemsWrap.className = "section-card__groups";

      for (const group of section.groups) {
        const matching = group.items.filter((it) => {
          if (!nq) return true;
          const hay = normalize(`${section.category} ${group.title} ${it.name} ${it.desc || ""} ${it.priceText || ""}`);
          return hay.includes(nq);
        });

        if (!matching.length) continue;

        const groupWrap = document.createElement("div");
        groupWrap.className = "items-group";

        const groupTitle = document.createElement("h3");
        groupTitle.className = "items-group__title";
        groupTitle.textContent = group.title;
        groupWrap.appendChild(groupTitle);

        const groupItems = document.createElement("div");
        groupItems.className = "section-card__items";
        for (const item of matching) {
          groupItems.appendChild(renderItem(item));
        }

        groupWrap.appendChild(groupItems);
        itemsWrap.appendChild(groupWrap);
      }
    } else {
      itemsWrap = document.createElement("div");
      itemsWrap.className = "section-card__items";
      for (const item of filteredItems) {
        itemsWrap.appendChild(renderItem(item));
      }
    }

    s.appendChild(header);
    s.appendChild(itemsWrap);

    if (section.note) {
      const note = document.createElement("div");
      note.className = "item item--note";
      note.innerHTML = `<div class="item__left"><div class="item__desc">${section.note}</div></div><div class="item__price"></div>`;
      s.appendChild(note);
    }

    menuEl.appendChild(s);
  }

  const isFiltered = Boolean(nq) || (chipFilter && chipFilter !== "all");
  countEl.textContent = isFiltered ? `${shown} risultati` : `${total} prodotti`;

  searchWrap.classList.toggle("has-value", qEl.value.trim().length > 0);
  enableMotion();
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

document.title = businessInfo.seo.menuTitle;
setMetaDescription(businessInfo.seo.menuDescription);
setOpenGraph({
  title: businessInfo.seo.menuTitle,
  description: businessInfo.seo.menuDescription,
  url: `${businessInfo.seo.siteUrl}/menu`,
  image: businessInfo.seo.ogImage,
});

attachTopbarShadow(".menu-topbar");

// keep content perfectly offset under fixed topbar
const setTopbarOffset = () => {
  const h = topbarEl?.offsetHeight || 0;
  document.documentElement.style.setProperty("--topbar-offset", `${h}px`);
};
setTopbarOffset();
window.addEventListener("resize", setTopbarOffset, { passive: true });
