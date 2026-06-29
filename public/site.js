import { businessInfo, homeContent } from "./config.js?v=20260619e";
import { MENU } from "./menu-data.js?v=20260619e";
import {
  attachTopbarShadow,
  enableMotion,
  escapeHtml,
  formatAddress,
  formatHours,
  setCurrentYear,
  setMetaDescription,
  setOpenGraph,
} from "./ui.js?v=20260619e";

const app = document.querySelector("#app");

const icon = {
  coffee: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7.5h10.5a1 1 0 0 1 1 1v3.2A5.3 5.3 0 0 1 11.2 17H9.8A5.3 5.3 0 0 1 4.5 11.7V8.5a1 1 0 0 1 1-1Z" /><path d="M16.5 9h1.7a2.3 2.3 0 0 1 0 4.6h-1.4" /><path d="M7 20h8" /></svg>`,
  glass: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4h8v2l-2.9 4.2v7.3l2 1.5H9l2-1.5v-7.3L8 6V4Z" /></svg>`,
  martini: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16l-7 7.2V18l3 2H8l3-2v-5.8L4 5Z" /></svg>`,
  plate: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9a7 7 0 1 1 14 0" /><path d="M4 12h16" /><path d="M7 15c1.6 1.3 3.2 2 5 2s3.4-.7 5-2" /></svg>`,
  pin: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s6-5.6 6-10.2A6 6 0 0 0 6 9.8C6 14.4 12 20 12 20Z" /><circle cx="12" cy="9.5" r="2.2" /></svg>`,
  clock: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" /><path d="M12 8v4.5l3 1.8" /></svg>`,
  instagram: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="5" width="14" height="14" rx="4" /><circle cx="12" cy="12" r="3.3" /><circle cx="16.7" cy="7.3" r="1" /></svg>`,
};

function revealStyle(delay = 0) {
  return delay ? ` style="--reveal-delay:${delay}ms"` : "";
}

function getSectionItems(section) {
  if (section.items) return section.items;
  return (section.groups || []).flatMap((group) => group.items);
}

function sectionHeader({ kicker, title, lead, centered = false }) {
  return `
    <header class="section-header${centered ? " section-header--centered" : ""}" data-reveal${revealStyle()}>
      ${kicker ? `<span class="section-header__kicker">${escapeHtml(kicker)}</span>` : ""}
      <h2 class="section-header__title">${escapeHtml(title)}</h2>
      ${lead ? `<p class="section-header__lead">${escapeHtml(lead)}</p>` : ""}
    </header>
  `;
}

function serviceCard(item, index) {
  return `
    <article class="service-card" data-reveal${revealStyle(index * 60)}>
      <div class="service-card__icon">${icon[item.icon]}</div>
      <h3 class="service-card__title">${escapeHtml(item.title)}</h3>
      <p class="service-card__text">${escapeHtml(item.text)}</p>
    </article>
  `;
}

function menuPreviewCard(category, index) {
  const section = MENU.find((entry) => entry.category === category);
  if (!section) return "";

  const sectionItems = getSectionItems(section);
  const items = sectionItems.slice(0, 2);
  return `
    <article class="menu-preview-card" data-reveal${revealStyle(index * 70)}>
      <div class="menu-preview-card__head">
        <h3>${escapeHtml(section.category)}</h3>
        <span>${sectionItems.length} proposte</span>
      </div>
      <div class="menu-preview-card__items">
        ${items
          .map(
            (item) => `
              <div class="menu-preview-card__item">
                <span>${escapeHtml(item.name)}</span>
                <strong>${item.priceText ? escapeHtml(item.priceText) : `${Number(item.price).toFixed(2).replace(".", ",")} €`}</strong>
              </div>
            `
          )
          .join("")}
      </div>
    </article>
  `;
}

function galleryCard(item, index) {
  if (item.type === "image") {
    return `
      <figure class="gallery-card gallery-card--image gallery-card--${index + 1}" data-reveal${revealStyle(index * 60)}>
        <img src="./assets/bg.png" alt="${escapeHtml(item.alt)}" loading="lazy" />
        <figcaption>
          <span>${escapeHtml(item.title)}</span>
          <small>${escapeHtml(item.note)}</small>
        </figcaption>
      </figure>
    `;
  }

  return `
    <!-- Replace this placeholder tile with a real gallery photo when available. -->
    <article class="gallery-card gallery-card--placeholder gallery-card--${index + 1}" data-reveal${revealStyle(index * 60)}>
      <div class="gallery-card__placeholder">
        <span>${escapeHtml(item.title)}</span>
        <p>${escapeHtml(item.note)}</p>
      </div>
    </article>
  `;
}

function infoCard({ iconName, label, body, href, meta }, index = 0) {
  const content = href
    ? `<a class="info-card__value info-card__value--link" href="${href}" target="${href.startsWith("http") ? "_blank" : "_self"}" rel="${href.startsWith("http") ? "noreferrer" : ""}">${escapeHtml(body)}</a>`
    : `<div class="info-card__value">${escapeHtml(body)}</div>`;

  return `
    <article class="info-card" data-reveal${revealStyle(index * 70)}>
      <div class="info-card__icon">${icon[iconName]}</div>
      <div class="info-card__copy">
        <span class="info-card__label">${escapeHtml(label)}</span>
        ${content}
        ${meta ? `<small class="info-card__meta">${escapeHtml(meta)}</small>` : ""}
      </div>
    </article>
  `;
}

function buildStructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    name: businessInfo.name,
    description: businessInfo.description,
    url: businessInfo.seo.siteUrl,
    image: businessInfo.seo.ogImage,
    servesCuisine: ["Caffetteria", "Aperitivo", "Cocktail Bar"],
    address: {
      "@type": "PostalAddress",
      streetAddress: businessInfo.address.street,
      addressLocality: businessInfo.address.city,
      postalCode: businessInfo.address.postalCode,
      addressRegion: businessInfo.address.region,
      addressCountry: businessInfo.address.country,
    },
    sameAs: [businessInfo.instagram.url],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "https://schema.org/Monday",
          "https://schema.org/Tuesday",
          "https://schema.org/Wednesday",
          "https://schema.org/Thursday",
          "https://schema.org/Friday",
          "https://schema.org/Saturday",
        ],
        opens: "05:00",
        closes: "23:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "https://schema.org/Sunday",
        opens: "06:30",
        closes: "23:00",
      },
    ],
  };

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

function buildHome() {
  const addressLine = formatAddress(businessInfo.address);
  const hoursLines = formatHours(businessInfo.hours);
  const infoCards = [
    {
      iconName: "pin",
      label: "Indirizzo",
      body: addressLine,
      href: businessInfo.mapsUrl,
      meta: "Apri la posizione su Google Maps",
    },
    {
      iconName: "clock",
      label: "Orari",
      body: hoursLines.join(" · "),
      meta: "Dalla colazione all'aperitivo",
    },
    {
      iconName: "instagram",
      label: "Instagram",
      body: businessInfo.instagram.label,
      href: businessInfo.instagram.url,
      meta: "Novità, drink e momenti dal locale",
    },
  ];

  app.innerHTML = `
    <header class="sitebar" id="top">
      <div class="container sitebar__inner">
        <a class="sitebar__brand" href="/" aria-label="${escapeHtml(businessInfo.name)}">
          <img class="sitebar__logo" src="./assets/logo.svg" alt="" aria-hidden="true" />
          <span class="sitebar__wordmark">${escapeHtml(businessInfo.name)}</span>
        </a>
        <nav class="sitebar__nav" aria-label="Navigazione principale">
          ${homeContent.nav
            .map((item) => `<a class="sitebar__link" href="${item.href}">${escapeHtml(item.label)}</a>`)
            .join("")}
        </nav>
        <div class="sitebar__actions">
          <a class="sitebar__cta" href="${businessInfo.menuRoute}">Apri il menu</a>
        </div>
      </div>
    </header>

    <main>
      <section class="hero">
        <div class="hero__backdrop" data-parallax="0.14"></div>
        <div class="hero__overlay"></div>
        <div class="container hero__inner">
          <div class="hero__content" data-reveal>
            <div class="hero__copy">
              <h1 class="hero__title" aria-label="${escapeHtml(homeContent.hero.title)}">
                <span>ICON</span>
                <span>Caffè</span>
              </h1>
              <p class="hero__subtitle">${escapeHtml(homeContent.hero.subtitle)}</p>
              <p class="hero__lead">${escapeHtml(homeContent.hero.body)}</p>
            </div>
            <div class="hero__actions">
              <a class="btn btn--primary" href="${homeContent.hero.primaryCta.href}">${escapeHtml(homeContent.hero.primaryCta.label)}</a>
              <a class="hero__textlink" href="${homeContent.hero.secondaryCta.href}">${escapeHtml(homeContent.hero.secondaryCta.label)}</a>
            </div>
            <div class="hero__details" aria-label="Informazioni essenziali">
              <span>${escapeHtml(addressLine)}</span>
              <span>${escapeHtml(hoursLines.join(" · "))}</span>
            </div>
            <a class="hero__scrollcue" href="#about" aria-label="Scorri alla sezione successiva">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 5v12" />
                <path d="m7 12 5 5 5-5" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      <section class="section section--light" id="about">
        <div class="container split-section">
          <figure class="split-section__media" data-reveal>
            <img src="./assets/bg.png" alt="${escapeHtml(businessInfo.heroImageAlt)}" loading="lazy" />
          </figure>
          <div class="split-section__copy">
            ${sectionHeader({
              kicker: homeContent.about.kicker,
              title: homeContent.about.title,
              lead: homeContent.about.body,
            })}
            <div class="split-section__text" data-reveal>
              ${homeContent.about.details.map((line) => `<p>${escapeHtml(line)}</p>`).join("")}
            </div>
            <a class="btn btn--tertiary" href="${homeContent.about.cta.href}" data-reveal>${escapeHtml(homeContent.about.cta.label)}</a>
          </div>
        </div>
      </section>

      <section class="section section--cream">
        <div class="container">
          ${sectionHeader({
            kicker: homeContent.services.kicker,
            title: homeContent.services.title,
            lead: homeContent.services.lead,
            centered: true,
          })}
          <div class="services-grid">
            ${homeContent.services.items.map(serviceCard).join("")}
          </div>
        </div>
      </section>

      <section class="section section--dark section--menu-preview">
        <div class="container menu-preview">
          <div class="menu-preview__intro">
            ${sectionHeader({
              kicker: homeContent.menuPreview.kicker,
              title: homeContent.menuPreview.title,
              lead: homeContent.menuPreview.body,
            })}
            <a class="btn btn--primary" href="${homeContent.menuPreview.cta.href}" data-reveal>${escapeHtml(homeContent.menuPreview.cta.label)}</a>
          </div>
          <div class="menu-preview__content">
            <div class="menu-preview__chips" data-reveal>
              ${homeContent.menuPreview.categories
                .map((category) => `<span class="menu-preview-chip">${escapeHtml(category)}</span>`)
                .join("")}
            </div>
            <div class="menu-preview__grid">
              ${homeContent.menuPreview.categories.map(menuPreviewCard).join("")}
            </div>
          </div>
        </div>
      </section>

      <section class="section section--light">
        <div class="container">
          ${sectionHeader({
            kicker: homeContent.gallery.kicker,
            title: homeContent.gallery.title,
            lead: homeContent.gallery.lead,
          })}
          <div class="gallery-grid">
            ${homeContent.gallery.items.map(galleryCard).join("")}
          </div>
        </div>
      </section>

      <section class="section section--cream" id="info">
        <div class="container info-section">
          <div class="info-section__copy">
            ${sectionHeader({
              kicker: "Info e contatti",
              title: "Siamo qui per te.",
              lead: "Orari, indirizzo e riferimenti essenziali, facili da aggiornare e chiari da consultare.",
            })}
          </div>
          <div class="info-grid">
            ${infoCards.map(infoCard).join("")}
          </div>
        </div>
      </section>

      <section class="section section--cta" id="cta">
        <div class="container cta-band" data-reveal${revealStyle()}>
          <div class="cta-band__copy">
            <h2>${escapeHtml(homeContent.finalCta.title)}</h2>
            <p>${escapeHtml(homeContent.finalCta.body)}</p>
          </div>
          <div class="cta-band__actions">
            ${homeContent.finalCta.buttons
              .map(
                (button) => `
                  <a class="btn ${button.style === "primary" ? "btn--primary" : "btn--secondary"}" href="${button.href}" ${
                    button.href.startsWith("http") ? 'target="_blank" rel="noreferrer"' : ""
                  }>
                    ${escapeHtml(button.label)}
                  </a>
                `
              )
              .join("")}
          </div>
        </div>
      </section>
    </main>

    <footer class="sitefooter">
      <div class="container sitefooter__inner">
        <div class="sitefooter__brand">
          <img class="sitefooter__logo" src="./assets/logo.svg" alt="" aria-hidden="true" />
          <div>
            <strong>${escapeHtml(businessInfo.name)}</strong>
            <span>${escapeHtml(businessInfo.descriptor)}</span>
          </div>
        </div>
        <div class="sitefooter__links">
          <a href="${businessInfo.menuRoute}">Menu</a>
          <a href="${businessInfo.instagram.url}" target="_blank" rel="noreferrer">Instagram</a>
          <a href="${businessInfo.mapsUrl}" target="_blank" rel="noreferrer">Maps</a>
        </div>
        <div class="sitefooter__legal">© <span id="year"></span> ${escapeHtml(businessInfo.name)}</div>
      </div>
    </footer>
  `;

  setCurrentYear("#year");
  attachTopbarShadow(".sitebar");
  enableMotion();
  buildStructuredData();
}

document.title = businessInfo.seo.homeTitle;
setMetaDescription(businessInfo.seo.homeDescription);
setOpenGraph({
  title: businessInfo.seo.homeTitle,
  description: businessInfo.seo.homeDescription,
  url: businessInfo.seo.siteUrl,
  image: businessInfo.seo.ogImage,
});

buildHome();
