export function escapeHtml(value = "") {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

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

  const onScroll = () => {
    element.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

export function enableMotion() {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealElements = [...document.querySelectorAll("[data-reveal]")];

  if (prefersReducedMotion) {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.15, rootMargin: "0px 0px -6% 0px" }
  );

  revealElements.forEach((element) => {
    if (element.dataset.revealBound === "true") return;
    element.dataset.revealBound = "true";
    const bounds = element.getBoundingClientRect();
    if (bounds.top < window.innerHeight * 0.92) {
      element.classList.add("is-visible");
      return;
    }
    revealObserver.observe(element);
  });

  if (window.__iconMotionReady) return;
  window.__iconMotionReady = true;

  const parallaxItems = [...document.querySelectorAll("[data-parallax]")];
  if (!parallaxItems.length) return;

  let ticking = false;

  const update = () => {
    const y = window.scrollY;
    for (const element of parallaxItems) {
      const speed = Number(element.dataset.parallax || "0");
      const offset = y * speed;
      element.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
    }
    ticking = false;
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  };

  update();
  window.addEventListener("scroll", onScroll, { passive: true });
}

export function setMetaDescription(content) {
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute("content", content);
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
    const tag = document.querySelector(selector);
    if (tag) tag.setAttribute("content", value);
  }
}
