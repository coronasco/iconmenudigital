import { businessInfo } from "./config.js?v=20260909";
import { MENU } from "./menu-data.js?v=20260909";
import {
  escapeHtml as esc, euro, sectionItems, slug, icons, formatAddress, formatHours,
  attachTopbarShadow, enableMotion, enableParallax, animateRows, bindDialog,
  reducedMotion, setMetaDescription, setOpenGraph,
} from "./ui.js?v=20260909";

const results = document.querySelector("#menu-results");
const search = document.querySelector("#q");
const count = document.querySelector("#count");
const reset = document.querySelector("#reset");
const clear = document.querySelector("#clear");
const empty = document.querySelector("#empty");
const drinkFilters = document.querySelector(".drink-filters");
const dialog = document.querySelector("#category-dialog");
const mobileCategories = document.querySelector(".mobile-categories");
const total = MENU.reduce((sum, section) => sum + sectionItems(section).length, 0);
const categories = [{ label: "Tutto", id: "all", count: total }, ...MENU.map((section) => ({
  label: section.category, id: slug(section.category), count: sectionItems(section).length,
}))];
const normalize = (text) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
const state = { category: "all", q: "", drink: "all" };

function readUrl() {
  const params = new URLSearchParams(location.search);
  const category = params.get("category");
  state.category = categories.some((item) => item.id === category) ? category : "all";
  state.q = params.get("q") || "";
  state.drink = state.category === "cocktails" && ["Con alcol", "Mocktails"].includes(params.get("drink")) ? params.get("drink") : "all";
  search.value = state.q;
}

function writeUrl(mode = "replace") {
  const url = new URL(location.href);
  for (const key of ["category", "q", "drink"]) url.searchParams.delete(key);
  if (state.category !== "all") url.searchParams.set("category", state.category);
  if (state.q.trim()) url.searchParams.set("q", state.q.trim());
  if (state.drink !== "all") url.searchParams.set("drink", state.drink);
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

const rowMarkup = (item, index) => `
  <li class="menu-item" data-reveal style="--delay:${Math.min(index % 5 * 35, 140)}ms">
    <div><p class="item-name">${esc(item.name)}</p>${item.desc ? `<p class="item-desc">${esc(item.desc)}</p>` : ""}</div>
    <span class="item-price">${esc(euro(item))}</span>
  </li>`;

results.innerHTML = MENU.map((section) => `
  <section class="menu-section" id="cat-${slug(section.category)}" aria-labelledby="title-${slug(section.category)}">
    <div class="menu-section-head"><h2 id="title-${slug(section.category)}">${esc(section.category)}</h2><span class="section-count"></span></div>
    ${(section.groups || [{ title: "", items: section.items }]).map((group) => `
      <div class="menu-group" data-group="${esc(group.title)}">
        ${group.title ? `<h3 class="group-heading">${esc(group.title)}</h3>` : ""}
        <ul class="item-list">${group.items.map(rowMarkup).join("")}</ul>
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
          text: normalize([section.category, group.title, item.name, item.desc || "", item.priceText || ""].join(" ")),
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
  const active = mobileCategories.querySelector('[aria-pressed="true"]');
  if (active) {
    mobileCategories.scrollTo({
      left: active.offsetLeft - mobileCategories.offsetLeft - 12,
      behavior: reducedMotion() ? "instant" : "smooth",
    });
  }
}

function render({ animate = false, anchor = false } = {}) {
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
  enableMotion(results);
  if (animate) requestAnimationFrame(() => animateRows(visibleRows));
}

const controlsAreSticky = () => document.querySelector(".menu-layout").getBoundingClientRect().top < document.querySelector(".site-header").offsetHeight + 5;
const closeCategories = bindDialog(dialog, document.querySelector("#category-picker"));

document.querySelectorAll("[data-category-list]").forEach((nav) => {
  nav.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    clearTimeout(searchTimer);
    if (dialog.open) await closeCategories();
    state.category = button.dataset.category;
    state.drink = "all";
    state.q = "";
    search.value = "";
    writeUrl("push");
    render({ animate: true, anchor: true });
  });
});

drinkFilters.addEventListener("click", (event) => {
  const button = event.target.closest("[data-drink]");
  if (!button) return;
  state.drink = button.dataset.drink;
  writeUrl("push");
  render({ animate: true, anchor: true });
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
  state.category = state.drink = "all";
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
enableParallax();
document.title = businessInfo.seo.menuTitle;
setMetaDescription(businessInfo.seo.menuDescription);
setOpenGraph({ title: businessInfo.seo.menuTitle, description: businessInfo.seo.menuDescription, url: businessInfo.seo.siteUrl + "/menu", image: businessInfo.seo.ogImage });
