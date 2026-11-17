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

export function captureRows(root) {
  const positions = new Map();
  for (const row of root.querySelectorAll(".menu-item:not([hidden])")) {
    const rect = row.getBoundingClientRect();
    row.getAnimations().forEach((animation) => animation.cancel());
    if (rect.height && rect.bottom > 0 && rect.top < innerHeight) positions.set(row, rect);
  }
  return { positions, scroll: scrollY };
}

export function animateRows(rows, previous = null, direction = 1) {
  if (reducedMotion()) return;
  let index = 0;
  for (const row of rows) {
    const rect = row.getBoundingClientRect();
    if (rect.top > innerHeight || rect.bottom < 0) continue;
    row.getAnimations().forEach((animation) => animation.cancel());
    const old = previous?.positions.get(row);
    if (old) {
      const delta = Math.max(-220, Math.min(220, old.top + previous.scroll - scrollY - rect.top));
      if (Math.abs(delta) < 1) continue;
      row.animate([
        { transform: `translateY(${delta}px)` },
        { transform: "translateY(0)" },
      ], { duration: 440, easing: "cubic-bezier(.22,1,.36,1)" });
    } else {
      row.animate([
        { transform: `translateX(${direction * 24}px)`, clipPath: "inset(0 0 95% 0)" },
        { transform: "translateX(0)", clipPath: "inset(0 0 0% 0)" },
      ], { duration: 380, delay: Math.min(index++ * 24, 120), easing: "cubic-bezier(.22,1,.36,1)", fill: "backwards" });
    }
  }
}

export function slidingIndicator(container) {
  const indicator = document.createElement("span");
  indicator.className = "nav-indicator";
  indicator.setAttribute("aria-hidden", "true");
  container.prepend(indicator);
  let positioned = false;
  const update = () => {
    const selected = container.querySelector('[aria-pressed="true"]');
    if (!selected || !container.offsetWidth) return;
    indicator.style.transition = positioned && !reducedMotion()
      ? "transform 420ms cubic-bezier(.2,.9,.25,1.12), width 420ms cubic-bezier(.22,1,.36,1), height 420ms cubic-bezier(.22,1,.36,1)"
      : "none";
    indicator.style.width = selected.offsetWidth + "px";
    indicator.style.height = selected.offsetHeight + "px";
    indicator.style.transform = `translate(${selected.offsetLeft}px, ${selected.offsetTop}px)`;
    positioned = true;
  };
  new ResizeObserver(update).observe(container);
  document.fonts.ready.then(update);
  return update;
}

export function enableParallax() {
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const elements = [...document.querySelectorAll("[data-parallax]")].map((element) => ({ element, current: 0 }));
  const scenes = [...document.querySelectorAll("[data-scene]")];
  const ink = [...document.querySelectorAll("[data-ink]")].map((element) => {
    const text = element.textContent.trim();
    element.classList.add("ink-title");
    element.setAttribute("aria-label", text);
    element.replaceChildren();
    text.split(/\s+/).forEach((word, index) => {
      if (index) element.append(" ");
      const span = document.createElement("span");
      span.className = "ink-word";
      span.textContent = span.dataset.word = word;
      span.setAttribute("aria-hidden", "true");
      element.append(span);
    });
    return { element, words: [...element.children] };
  });
  const progress = document.querySelector(".reading-progress");
  const backTop = document.querySelector(".back-top");
  let frame = 0;
  let lastTime = 0;
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const update = (time) => {
    const alpha = 1 - Math.exp(-Math.min(64, time - (lastTime || time - 16)) / 70);
    lastTime = time;
    frame = 0;
    let settling = false;
    for (const item of elements) {
      const rect = item.element.parentElement.getBoundingClientRect();
      if (rect.bottom < -100 || rect.top > innerHeight + 100) continue;
      const target = preference.matches ? 0 : clamp(
        (innerHeight / 2 - rect.top - rect.height / 2) * Number(item.element.dataset.parallax), -42, 42);
      item.current += (target - item.current) * alpha;
      if (Math.abs(target - item.current) > .1) settling = true;
      else item.current = target;
      item.element.style.setProperty("--parallax-y", item.current.toFixed(2) + "px");
    }
    for (const scene of scenes) {
      const rect = scene.getBoundingClientRect();
      const amount = preference.matches ? 0 : clamp(-rect.top / innerHeight, 0, 1);
      scene.style.setProperty("--scene-progress", amount.toFixed(3));
      scene.style.setProperty("--media-scale", (1.14 + amount * .06).toFixed(3));
    }
    for (const { element, words } of ink) {
      const rect = element.getBoundingClientRect();
      const amount = preference.matches ? 1 : clamp((innerHeight * .86 - rect.top) / (innerHeight * .42), 0, 1);
      words.forEach((word, index) => word.style.setProperty("--word-fill",
        clamp((amount * (words.length + 1) - index) * 100, 0, 100).toFixed(1) + "%"));
    }
    const distance = document.documentElement.scrollHeight - innerHeight;
    if (progress) progress.style.transform = `scaleX(${distance > 0 ? clamp(scrollY / distance, 0, 1) : 0})`;
    if (backTop) backTop.hidden = scrollY < innerHeight * 1.2;
    if (settling) frame = requestAnimationFrame(update);
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  preference.addEventListener("change", schedule);
  new ResizeObserver(schedule).observe(document.body);
  schedule();
}

export function bindDialog(dialog, opener) {
  let closePromise = null;
  let drag = null;
  const animate = (frames, options) => {
    dialog.getAnimations().forEach((animation) => animation.cancel());
    return dialog.animate(frames, options).finished.catch(() => {});
  };
  const close = () => {
    if (!dialog.open) return Promise.resolve();
    if (closePromise) return closePromise;
    closePromise = (async () => {
      if (!reducedMotion()) {
        const from = getComputedStyle(dialog).transform;
        await animate([{ transform: from }, { transform: "translateY(105%)" }],
          { duration: 240, easing: "cubic-bezier(.4,0,1,1)" });
      }
      dialog.close();
      dialog.style.transform = "";
    })().finally(() => { closePromise = null; });
    return closePromise;
  };
  opener.addEventListener("click", () => {
    if (dialog.open || closePromise) return;
    dialog.showModal();
    document.documentElement.classList.add("dialog-open");
    opener.setAttribute("aria-expanded", "true");
    if (!reducedMotion()) {
      animate([
        { transform: "translateY(100%)" },
        { transform: "translateY(-6px)", offset: .78 },
        { transform: "translateY(0)" },
      ], { duration: 460, easing: "cubic-bezier(.22,1,.36,1)" });
      dialog.querySelectorAll("nav button, nav a").forEach((row, index) => row.animate([
        { transform: "translateY(18px)" }, { transform: "translateY(0)" },
      ], { duration: 420, delay: Math.min(index * 20, 140), easing: "cubic-bezier(.22,1,.36,1)", fill: "backwards" }));
    }
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
  const handle = dialog.querySelector("[data-drag-handle]");
  handle?.addEventListener("pointerdown", (event) => {
    if (closePromise || (event.pointerType === "mouse" && event.button !== 0)) return;
    dialog.getAnimations().forEach((animation) => animation.cancel());
    handle.setPointerCapture(event.pointerId);
    drag = { y: event.clientY, offset: 0 };
  });
  handle?.addEventListener("pointermove", (event) => {
    if (!drag) return;
    drag.offset = Math.max(0, event.clientY - drag.y);
    dialog.style.transform = `translateY(${drag.offset}px)`;
  });
  const release = (event) => {
    if (!drag) return;
    const offset = drag.offset;
    drag = null;
    if (event.type !== "pointercancel" && offset > 80) { close(); return; }
    const from = dialog.style.transform;
    dialog.style.transform = "";
    if (!reducedMotion()) animate([{ transform: from }, { transform: "translateY(0)" }],
      { duration: 300, easing: "cubic-bezier(.2,.9,.25,1.1)" });
  };
  handle?.addEventListener("pointerup", release);
  handle?.addEventListener("pointercancel", release);
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
