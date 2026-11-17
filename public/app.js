import { businessInfo } from "./config.js?v=20261117c";
import { MENU } from "./menu-data.js?v=20261117c";
import { TEA_GROUPS } from "./tea-data.js?v=20261117c";
import { preparationPrice, seasonalProposal } from "./menu-extras.js?v=20261117c";
import {
  escapeHtml as esc, euro, sectionItems, slug, icons, formatAddress, formatHours,
  attachTopbarShadow, enableReadingProgress, animateRows, bindDialog,
  reducedMotion, setMetaDescription, setOpenGraph, captureRows, slidingIndicator,
} from "./ui.js?v=20261117c";

const results = document.querySelector("#menu-results");
const search = document.querySelector("#q");
const count = document.querySelector("#count");
const reset = document.querySelector("#reset");
const clear = document.querySelector("#clear");
const empty = document.querySelector("#empty");
const drinkFilters = document.querySelector(".drink-filters");
const teaFilters = document.querySelector(".tea-filters");
const proposal = document.querySelector("#seasonal-proposal");
const dialog = document.querySelector("#category-dialog");
const mobileCategories = document.querySelector(".mobile-categories");
const total = MENU.reduce((sum, section) => sum + sectionItems(section).length, 0);
const categories = [{ label: "Tutto", id: "all", count: total }, ...MENU.map((section) => ({
  label: section.category, id: slug(section.category), count: sectionItems(section).length,
}))];
const normalize = (text) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
const state = { category: "all", q: "", drink: "all", tea: "all" };
let proposalDismissed = false;
try { proposalDismissed = sessionStorage.getItem("icon-proposal-dismissed") === "yes"; } catch { /* Storage is optional. */ }
const suggestion = seasonalProposal();
proposal.dataset.season = suggestion.season;
proposal.innerHTML = `
  <div class="proposal-copy"><p class="proposal-eyebrow">La proposta del momento</p>
    <h2 id="proposal-title">${esc(suggestion.title)}</h2>
    <p class="proposal-description">${esc(suggestion.copy)}</p>
    <div class="proposal-links">${suggestion.links.map((link, index) => `<a href="?${esc(new URLSearchParams({ category: link.category, ...(link.q ? { q: link.q } : {}), ...(link.drink ? { drink: link.drink } : {}) }).toString())}" data-proposal="${index}">${esc(link.label)} ${icons.arrow}</a>`).join("")}</div>
  </div>
  <svg class="proposal-art" viewBox="0 0 80 90" aria-hidden="true">${suggestion.season === "warm" ? '<path d="M20 25h38l-6 50H26zM20 45h36M44 43l15-33h10M30 53l9 2-2 10-9-2zM47 49l5 7-8 5-5-7z"/>' : '<path class="steam steam-one" d="M29 30c-12-10 12-12 0-24"/><path class="steam steam-two" d="M43 30c-12-10 12-12 0-24"/><path d="M15 40h44v18c0 24-44 24-44 0zM59 43h4c18 0 18 20-5 20M11 82h52"/>'}</svg>
  <button class="icon-button proposal-close" type="button" aria-label="Nascondi la proposta">${icons.close}</button>`;
teaFilters.innerHTML = ["all", ...TEA_GROUPS].map((group) => `<button type="button" data-tea="${esc(group)}" aria-pressed="${group === "all"}">${group === "all" ? "Tutto" : esc(group)}</button>`).join("");

function readUrl() {
  const params = new URLSearchParams(location.search);
  const category = params.get("category");
  state.category = categories.some((item) => item.id === category) ? category : "all";
  state.q = params.get("q") || "";
  state.drink = state.category === "cocktails" && ["Con alcol", "Mocktails"].includes(params.get("drink")) ? params.get("drink") : "all";
  state.tea = state.category === "te-e-tisane" && TEA_GROUPS.includes(params.get("tea")) ? params.get("tea") : "all";
  search.value = state.q;
}

function writeUrl(mode = "replace") {
  const url = new URL(location.href);
  for (const key of ["category", "q", "drink", "tea"]) url.searchParams.delete(key);
  if (state.category !== "all") url.searchParams.set("category", state.category);
  if (state.q.trim()) url.searchParams.set("q", state.q.trim());
  if (state.drink !== "all") url.searchParams.set("drink", state.drink);
  if (state.tea !== "all") url.searchParams.set("tea", state.tea);
  if (url.href !== location.href) history[mode + "State"](null, "", url);
}

for (const nav of document.querySelectorAll("[data-category-list]")) {
  const sheet = nav.classList.contains("sheet-categories");
  const mobile = nav.classList.contains("mobile-categories");
  nav.innerHTML = categories.map((category) => `
    <button type="button" class="${sheet ? "sheet-category" : "category-button"}" data-category="${category.id}" aria-pressed="false" aria-controls="menu-results">
      <span>${esc(category.label)}</span>${mobile ? "" : `<small aria-hidden="true">${category.count}</small>`}
    </button>`).join("");
}

const indicators = [...document.querySelectorAll('.desktop-categories, .mobile-categories, .drink-filters, .tea-filters')].map(slidingIndicator);

const rowMarkup = (item) => `
  <li class="menu-item${item.image ? " tea-item" : ""}"${item.panna ? ` data-base-price="${item.price}" data-panna-price="${item.panna}"` : ""}>
    ${item.image ? `<div class="tea-photo"><img src="${item.image}" alt="Sir George ${esc(item.name)}" width="500" height="500" loading="lazy" decoding="async"></div>` : ""}
    <div class="item-copy"><p class="item-name">${esc(item.name)}</p>${item.desc ? `<p class="item-desc">${esc(item.desc)}</p>` : ""}
      ${item.ingredients ? `<p class="tea-ingredients"><span>${esc(item.ingredientLabel)}</span>${esc(item.ingredients)}</p>` : ""}
      ${item.name === "Tè caldo" ? '<a class="tea-discover" href="?category=te-e-tisane">Scopri i 14 gusti Sir George <span aria-hidden="true">↗</span></a>' : ""}
    </div>
    <span class="item-price">${esc(euro(item))}</span>
    ${item.panna ? `<div class="preparation-options" role="group" aria-label="Preparazione ${esc(item.name)}">
      <button type="button" data-panna="false" aria-pressed="true">Classico</button>
      <button type="button" data-panna="true" aria-pressed="false">Con panna <span>+${esc(euro({ price: item.panna }))}</span></button>
    </div>` : ""}
  </li>`;

results.innerHTML = MENU.map((section) => `
  <section class="menu-section" id="cat-${slug(section.category)}" aria-labelledby="title-${slug(section.category)}">
    <div class="menu-section-head"><h2 id="title-${slug(section.category)}">${esc(section.category)}</h2><span class="section-count"></span></div>
    ${section.brand ? `<p class="tea-brand">${esc(section.brand)}<span>Un piccolo rituale, il tuo gusto.</span></p>` : ""}
    ${(section.groups || [{ title: "", items: section.items }]).map((group) => `
      <div class="menu-group" data-group="${esc(group.title)}">
        ${group.title ? `<h3 class="group-heading">${esc(group.title)}</h3>` : ""}
        <ul class="item-list" role="list">${group.items.map(rowMarkup).join("")}</ul>
      </div>`).join("")}
    ${section.note ? `<p class="item-note">${esc(section.note)}</p>` : ""}
  </section>`).join("");

// Index the original data once; filtering changes visibility, never menu content.
const indexed = MENU.map((section, index) => {
  const element = results.children[index];
  return {
    id: slug(section.category),
    element,
    counter: element.querySelector(".section-count"),
    groups: (section.groups || [{ title: "", items: section.items }]).map((group, groupIndex) => {
      const groupElement = element.querySelectorAll(".menu-group")[groupIndex];
      return {
        title: group.title,
        element: groupElement,
        rows: group.items.map((item, itemIndex) => ({
          element: groupElement.querySelectorAll(".menu-item")[itemIndex],
          text: normalize([section.category, section.brand || "", group.title, item.name, item.desc || "", item.ingredients || "", item.panna ? "panna" : "", item.priceText || ""].join(" ")),
        })),
      };
    }),
  };
});

function syncControls() {
  for (const button of document.querySelectorAll("[data-category]")) {
    button.setAttribute("aria-pressed", String(button.dataset.category === state.category));
  }
  for (const button of drinkFilters.querySelectorAll("button")) {
    button.setAttribute("aria-pressed", String(button.dataset.drink === state.drink));
  }
  drinkFilters.hidden = state.category !== "cocktails";
  for (const button of teaFilters.querySelectorAll("button")) {
    button.setAttribute("aria-pressed", String(button.dataset.tea === state.tea));
  }
  teaFilters.hidden = state.category !== "te-e-tisane";
  proposal.hidden = proposalDismissed || state.category !== "all" || Boolean(state.q.trim());
  indicators.forEach((update) => update());
  const active = mobileCategories.querySelector('[aria-pressed="true"]');
  if (active) {
    mobileCategories.scrollTo({
      left: active.offsetLeft - mobileCategories.offsetLeft - 12,
      behavior: reducedMotion() ? "instant" : "smooth",
    });
  }
}

function render({ animate = false, anchor = false, direction = 1 } = {}) {
  const previous = animate ? captureRows(results) : null;
  const query = normalize(state.q);
  const terms = query.split(/\s+/).filter(Boolean);
  const visibleRows = [];
  for (const section of indexed) {
    let shown = 0;
    const matchesCategory = state.category === "all" || section.id === state.category;
    for (const group of section.groups) {
      let groupCount = 0;
      for (const row of group.rows) {
        const visible = matchesCategory
          && (state.drink === "all" || group.title === state.drink)
          && (state.tea === "all" || group.title === state.tea)
          && terms.every((term) => row.text.includes(term));
        row.element.hidden = !visible;
        if (visible) { groupCount++; visibleRows.push(row.element); }
      }
      group.element.hidden = groupCount === 0;
      shown += groupCount;
    }
    section.element.hidden = shown === 0;
    section.counter.textContent = shown + (shown === 1 ? " proposta" : " proposte");
  }
  const filtered = Boolean(query) || state.category !== "all" || state.drink !== "all";
  count.textContent = visibleRows.length + (filtered ? (visibleRows.length === 1 ? " risultato" : " risultati") : " prodotti");
  reset.hidden = !filtered;
  clear.hidden = !state.q;
  empty.hidden = visibleRows.length !== 0;
  syncControls();
  if (anchor) {
    // Keep the controls anchored when a long filtered list becomes shorter.
    const headerHeight = document.querySelector(".site-header").offsetHeight;
    window.scrollTo({ top: document.querySelector(".menu-layout").getBoundingClientRect().top + scrollY - headerHeight, behavior: "instant" });
  }
  if (animate) requestAnimationFrame(() => animateRows(visibleRows, previous, direction));
}

const controlsAreSticky = () => document.querySelector(".menu-layout").getBoundingClientRect().top < document.querySelector(".site-header").offsetHeight + 5;
const closeCategories = bindDialog(dialog, document.querySelector("#category-picker"));

document.querySelectorAll("[data-category-list]").forEach((nav) => {
  nav.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    clearTimeout(searchTimer);
    if (dialog.open) await closeCategories();
    const direction = Math.sign(categories.findIndex((entry) => entry.id === button.dataset.category)
      - categories.findIndex((entry) => entry.id === state.category)) || 1;
    state.category = button.dataset.category;
    state.drink = "all";
    state.tea = "all";
    state.q = "";
    search.value = "";
    writeUrl("push");
    render({ animate: true, anchor: true, direction });
  });
});

drinkFilters.addEventListener("click", (event) => {
  const button = event.target.closest("[data-drink]");
  if (!button) return;
  clearTimeout(searchTimer);
  state.q = search.value;
  state.drink = button.dataset.drink;
  writeUrl("push");
  render({ animate: true, anchor: true });
});

teaFilters.addEventListener("click", (event) => {
  const button = event.target.closest("[data-tea]");
  if (!button) return;
  clearTimeout(searchTimer);
  state.q = search.value;
  state.tea = button.dataset.tea;
  writeUrl("push");
  render({ animate: true, anchor: true });
});

results.addEventListener("click", (event) => {
  const button = event.target.closest("[data-panna]");
  if (!button) return;
  const row = button.closest(".menu-item");
  const withPanna = button.dataset.panna === "true";
  const price = euro({ price: preparationPrice({ price: Number(row.dataset.basePrice), panna: Number(row.dataset.pannaPrice) }, withPanna) });
  row.querySelector(".item-price").textContent = price;
  row.querySelectorAll("[data-panna]").forEach((option) => option.setAttribute("aria-pressed", String(option === button)));
  document.querySelector("#preparation-status").textContent = `${row.querySelector(".item-name").textContent}, ${withPanna ? "con panna" : "classico"}: ${price}`;
});

proposal.addEventListener("click", (event) => {
  if (event.target.closest(".proposal-close")) {
    proposalDismissed = true;
    proposal.hidden = true;
    try { sessionStorage.setItem("icon-proposal-dismissed", "yes"); } catch { /* Storage is optional. */ }
    search.focus({ preventScroll: true });
    return;
  }
  const link = event.target.closest("[data-proposal]");
  if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  clearTimeout(searchTimer);
  const selected = suggestion.links[Number(link.dataset.proposal)];
  state.category = selected.category;
  state.q = search.value = selected.q || "";
  state.drink = selected.drink || "all";
  state.tea = "all";
  writeUrl("push");
  render({ animate: true, anchor: true });
  search.focus({ preventScroll: true });
});

let searchTimer;
search.addEventListener("input", () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    state.q = search.value;
    writeUrl();
    render({ animate: true, anchor: controlsAreSticky() });
  }, 90);
});
search.addEventListener("keydown", (event) => {
  if (event.key === "Enter") { event.preventDefault(); search.blur(); }
  if (event.key === "Escape" && search.value) {
    clearTimeout(searchTimer);
    search.value = state.q = "";
    writeUrl();
    render({ animate: true, anchor: controlsAreSticky() });
  }
});
clear.addEventListener("click", () => {
  clearTimeout(searchTimer);
  const anchor = controlsAreSticky();
  search.value = state.q = "";
  writeUrl();
  render({ animate: true, anchor });
  search.focus({ preventScroll: true });
});
function resetAll() {
  clearTimeout(searchTimer);
  const anchor = controlsAreSticky();
  state.category = state.drink = state.tea = "all";
  search.value = state.q = "";
  writeUrl("push");
  render({ animate: true, anchor });
}
reset.addEventListener("click", resetAll);
document.querySelector("#empty-reset").addEventListener("click", () => {
  resetAll();
  search.focus({ preventScroll: true });
});
window.addEventListener("popstate", () => {
  clearTimeout(searchTimer);
  readUrl();
  render({ animate: true, anchor: controlsAreSticky() });
});

document.querySelector("#menu-contact").innerHTML = `
  <p>${esc(formatAddress(businessInfo.address))}</p>
  <p>${esc(formatHours(businessInfo.hours).join(" · "))}</p>
  <a class="text-link" href="${businessInfo.mapsUrl}" target="_blank" rel="noreferrer">Indicazioni ${icons.diagonal}</a>`;
readUrl();
render();
attachTopbarShadow(".site-header");
enableReadingProgress();
document.title = businessInfo.seo.menuTitle;
setMetaDescription(businessInfo.seo.menuDescription);
setOpenGraph({ title: businessInfo.seo.menuTitle, description: businessInfo.seo.menuDescription, url: businessInfo.seo.siteUrl + "/menu", image: businessInfo.seo.ogImage });
