export function escapeHtml(value = "") {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

export const icons = {
  arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>',
  diagonal: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12"/></svg>',
  down: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v16m-6-6 6 6 6-6"/></svg>',
  search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg>',
  close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6"/></svg>',
  grid: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="5" height="5" rx="1"/><rect x="15" y="4" width="5" height="5" rx="1"/><rect x="4" y="15" width="5" height="5" rx="1"/><rect x="15" y="15" width="5" height="5" rx="1"/></svg>',
};

export const wordmark = '<span class="wordmark">ICON <i>Caffè</i></span>';
export const euro = (item) => item.priceText || Number(item.price).toFixed(2).replace(".", ",") + " €";
export const sectionItems = (section) => section.items || section.groups.flatMap((group) => group.items);
export const slug = (text) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");
export const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function formatAddress(address) {
  return `${address.street}, ${address.postalCode} ${address.city} (${address.region})`;
}

export function formatHours(hours) {
  return hours.map((entry) => `${entry.days} ${entry.opens} - ${entry.closes}`);
}

export function setCurrentYear(selector) {
  const target = document.querySelector(selector);
  if (target) target.textContent = String(new Date().getFullYear());
}

export function attachTopbarShadow(selector) {
  const element = document.querySelector(selector);
  if (!element) return;
  const onScroll = () => element.classList.toggle("is-scrolled", window.scrollY > 12);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

let revealObserver;
const observed = new WeakSet();

export function enableMotion(root = document) {
  if (!revealObserver && "IntersectionObserver" in window) {
    revealObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    }, { threshold: 0.06, rootMargin: "0px 0px -18px 0px" });
  }
  for (const element of root.querySelectorAll("[data-reveal]")) {
    if (observed.has(element)) continue;
    observed.add(element);
    if (reducedMotion() || !revealObserver) element.classList.add("is-visible");
    else {
      element.classList.add("will-reveal");
      revealObserver.observe(element);
    }
  }
}

export function animateRows(rows) {
  if (reducedMotion()) return;
  rows.filter((row) => {
    const rect = row.getBoundingClientRect();
    return rect.top < innerHeight + 100 && rect.bottom > 0;
  }).forEach((row, index) => {
    row.getAnimations().forEach((animation) => animation.cancel());
    row.classList.add("is-visible");
    row.animate([
      { opacity: 0, transform: "translateY(14px)" },
      { opacity: 1, transform: "translateY(0)" },
    ], { duration: 450, delay: Math.min(index * 38, 220), easing: "cubic-bezier(.22,1,.36,1)", fill: "backwards" });
  });
}

export function enableParallax() {
  const elements = [...document.querySelectorAll("[data-parallax]")];
  const progress = document.querySelector(".reading-progress");
  const backTop = document.querySelector(".back-top");
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  let frame = 0;
  const update = () => {
    frame = 0;
    const viewport = innerHeight;
    for (const element of elements) {
      const rect = element.parentElement.getBoundingClientRect();
      if (rect.bottom < -100 || rect.top > viewport + 100) continue;
      const amount = preference.matches ? 0 : Math.max(-50, Math.min(50,
        (viewport / 2 - rect.top - rect.height / 2) * Number(element.dataset.parallax)));
      // Keep scroll motion independent of entrance animations.
      element.style.setProperty("--parallax-y", `${amount.toFixed(2)}px`);
    }
    const distance = document.documentElement.scrollHeight - viewport;
    if (progress) progress.style.transform = `scaleX(${distance > 0 ? scrollY / distance : 0})`;
    if (backTop) backTop.hidden = scrollY < viewport * 1.2;
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  preference.addEventListener("change", schedule);
  new ResizeObserver(schedule).observe(document.body);
  update();
}

export function bindDialog(dialog, opener) {
  let closing = false;
  const close = async () => {
    if (!dialog.open || closing) return;
    closing = true;
    if (!reducedMotion()) {
      await dialog.animate([{ opacity: 1, transform: "translateY(0)" },
        { opacity: 0, transform: "translateY(32px)" }],
      { duration: 180, easing: "ease-in" }).finished.catch(() => {});
    }
    dialog.close();
    closing = false;
  };
  opener.addEventListener("click", () => {
    dialog.showModal();
    document.documentElement.classList.add("dialog-open");
    opener.setAttribute("aria-expanded", "true");
    if (!reducedMotion()) dialog.animate([
      { opacity: 0, transform: "translateY(48px)" },
      { opacity: 1, transform: "translateY(0)" },
    ], { duration: 420, easing: "cubic-bezier(.22,1,.36,1)" });
  });
  dialog.addEventListener("cancel", (event) => { event.preventDefault(); close(); });
  dialog.addEventListener("close", () => {
    document.documentElement.classList.remove("dialog-open");
    opener.setAttribute("aria-expanded", "false");
  });
  dialog.addEventListener("click", (event) => {
    if (event.target.closest("[data-close]")) close();
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close();
  });
  return close;
}

export function setMetaDescription(content) {
  document.querySelector('meta[name="description"]')?.setAttribute("content", content);
}

export function setOpenGraph(seo) {
  const tags = {
    'meta[property="og:title"]': seo.title,
    'meta[property="og:description"]': seo.description,
    'meta[property="og:url"]': seo.url,
    'meta[property="og:image"]': seo.image,
    'meta[name="twitter:title"]': seo.title,
    'meta[name="twitter:description"]': seo.description,
    'meta[name="twitter:image"]': seo.image,
  };
  for (const [selector, value] of Object.entries(tags)) {
    document.querySelector(selector)?.setAttribute("content", value);
  }
}
