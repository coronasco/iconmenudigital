import { businessInfo, homeContent } from "./config.js?v=20260909";
import { MENU } from "./menu-data.js?v=20260909";
import {
  icons, wordmark, escapeHtml as esc, euro, sectionItems, slug, formatAddress,
  formatHours, attachTopbarShadow, enableMotion, enableParallax, bindDialog,
  setCurrentYear, setMetaDescription, setOpenGraph, reducedMotion,
} from "./ui.js?v=20260909";

const { hero, about, services, menuPreview, gallery, finalCta } = homeContent;
const address = formatAddress(businessInfo.address);
const hours = formatHours(businessInfo.hours);
const linkAttrs = (href) => href.startsWith("http") ? 'target="_blank" rel="noreferrer"' : "";
const categoryHref = (category) => businessInfo.menuRoute + "?category=" + slug(category);
const label = (text) => `<p class="section-label" data-reveal>${esc(text)}</p>`;

function preview(category) {
  const section = MENU.find((entry) => entry.category === category);
  if (!section) return "";
  return `<div class="preview-category" data-reveal>
    <a class="preview-category-title" href="${categoryHref(category)}"><span>${esc(category)}</span>${icons.diagonal}</a>
    ${sectionItems(section).slice(0, 2).map((item) => `<div class="preview-item"><span>${esc(item.name)}</span><strong>${esc(euro(item))}</strong></div>`).join("")}
  </div>`;
}

document.querySelector("#app").innerHTML = `
  <a class="skip-link" href="#main">Vai al contenuto</a>
  <div class="reading-progress" aria-hidden="true"></div>
  <header class="site-header">
    <div class="container header-inner">
      <a class="brand" href="/" aria-label="${esc(businessInfo.name)}">${wordmark}</a>
      <nav class="main-nav" aria-label="Navigazione principale">
        ${homeContent.nav.map((item) => `<a href="${item.href}">${esc(item.label)}</a>`).join("")}
      </nav>
      <a class="header-cta" href="${businessInfo.menuRoute}">Apri il menu ${icons.diagonal}</a>
      <button class="icon-button nav-toggle" id="nav-toggle" aria-label="Apri navigazione" aria-haspopup="dialog" aria-controls="nav-dialog" aria-expanded="false"><span></span><span></span></button>
    </div>
  </header>
  <main id="main">
    <section class="hero" id="top">
      <div class="container">
        <div class="hero-grid">
          <div class="hero-copy">
            <h1 class="hero-title" aria-label="${esc(hero.title)}"><span class="line"><span>ICON</span></span><span class="line"><span><i>Caffè</i></span></span></h1>
            <p class="hero-subtitle" data-reveal style="--delay:100ms">${esc(hero.subtitle)}</p>
            <p class="hero-lead" data-reveal style="--delay:180ms">${esc(hero.body)}</p>
            <div class="hero-actions" data-reveal style="--delay:260ms">
              <a class="button" href="${hero.primaryCta.href}">${esc(hero.primaryCta.label)} ${icons.arrow}</a>
              <a class="text-link" href="${hero.secondaryCta.href}">${esc(hero.secondaryCta.label)}</a>
            </div>
          </div>
          <figure class="hero-figure">
            <div class="hero-photo"><img src="/assets/bg.png" alt="${esc(businessInfo.heroImageAlt)}" width="682" height="1024" fetchpriority="high" data-parallax="0.12"></div>
            <figcaption>${esc(hero.quickInfo[0].value)}</figcaption>
          </figure>
        </div>
        <div class="hero-bottom">
          <span>${esc(hero.quickInfo[1].value)}</span>
          <a class="scroll-cue" href="#about"><span>Il bar</span>${icons.down}</a>
        </div>
      </div>
    </section>
    <section class="section about" id="about">
      <div class="container about-grid">
        <div>${label(about.kicker)}</div>
        <div class="about-copy">
          <h2 class="section-title" data-reveal>${esc(about.title)}</h2>
          <p class="section-body" data-reveal>${esc(about.body)}</p>
          ${about.details.map((text) => `<p class="section-body" data-reveal>${esc(text)}</p>`).join("")}
          <a class="text-link text-link--accent" href="${about.cta.href}" data-reveal>${esc(about.cta.label)} ${icons.diagonal}</a>
        </div>
      </div>
      <span class="about-echo" aria-hidden="true" data-parallax="0.12">ICON</span>
    </section>
    <section class="section services">
      <div class="container services-layout">
        <div class="services-intro">
          ${label(services.kicker)}
          <h2 class="section-title" data-reveal>${esc(services.title)}</h2>
          <p class="section-body" data-reveal>${esc(services.lead)}</p>
        </div>
        <div class="service-list">
          ${services.items.map((item, index) => `
            <a class="service-row" href="${categoryHref(item.title === "Pausa pranzo" ? "Panini" : item.title)}" data-reveal style="--delay:${index * 65}ms">
              <span class="service-number" aria-hidden="true">0${index + 1}</span>
              <h3>${esc(item.title)}</h3><p>${esc(item.text)}</p>${icons.diagonal}
            </a>`).join("")}
        </div>
      </div>
    </section>
    <section class="section menu-preview">
      <div class="container preview-layout">
        <div class="preview-intro">
          ${label(menuPreview.kicker)}
          <h2 class="section-title" data-reveal>${esc(menuPreview.title)}</h2>
          <p class="section-body" data-reveal>${esc(menuPreview.body)}</p>
          <a class="button button--light" href="${menuPreview.cta.href}" data-reveal>${esc(menuPreview.cta.label)} ${icons.arrow}</a>
        </div>
        <div class="preview-list">${menuPreview.categories.map(preview).join("")}</div>
      </div>
    </section>
    <section class="section atmosphere">
      <div class="container atmosphere-layout">
        <div>
          ${label(gallery.kicker)}
          <h2 class="section-title" data-reveal>${esc(gallery.title)}</h2>
          <p class="section-body" data-reveal>${esc(gallery.lead)}</p>
        </div>
        <figure data-reveal>
          <div class="atmosphere-photo"><img src="/assets/bg.png" alt="${esc(gallery.items[0].alt)}" width="682" height="1024" loading="lazy" data-parallax="0.1"></div>
          <figcaption class="atmosphere-caption"><span>${esc(gallery.items[0].title)}</span><span>${esc(gallery.items[0].note)}</span></figcaption>
        </figure>
      </div>
    </section>
    <section class="section info" id="info">
      <div class="container info-layout">
        ${label("Info e contatti")}
        <div class="info-columns">
          <div>
            <h2 class="section-title" data-reveal>Siamo qui per te.</h2>
            <p class="section-body" data-reveal>Orari, indirizzo e riferimenti essenziali, facili da aggiornare e chiari da consultare.</p>
          </div>
          <div>
            <div class="info-row" data-reveal>
              <span class="info-label">Indirizzo</span>
              <div class="info-value"><p>${esc(address)}</p><a class="text-link" href="${businessInfo.mapsUrl}" target="_blank" rel="noreferrer">Apri la posizione su Google Maps ${icons.arrow}</a></div>
            </div>
            <div class="info-row" data-reveal>
              <span class="info-label">Orari</span><div class="info-value">${hours.map((line) => `<p>${esc(line)}</p>`).join("")}<small>Dalla colazione all'aperitivo</small></div>
            </div>
            <div class="info-row" data-reveal>
              <span class="info-label">Instagram</span><div class="info-value"><a class="text-link" href="${businessInfo.instagram.url}" target="_blank" rel="noreferrer">${esc(businessInfo.instagram.label)} ${icons.diagonal}</a><small>Novità, drink e momenti dal locale</small></div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="cta" id="cta">
      <div class="container cta-inner">
        <h2 class="section-title" data-reveal>${esc(finalCta.title)}</h2>
        <p data-reveal>${esc(finalCta.body)}</p>
        <div class="cta-actions" data-reveal>
          ${finalCta.buttons.map((button) => `<a class="${button.style === "primary" ? "button" : "text-link"}" href="${button.href}" ${linkAttrs(button.href)}>${esc(button.label)} ${icons.arrow}</a>`).join("")}
        </div>
      </div>
    </section>
  </main>
  <footer class="site-footer">
    <div class="container footer-inner">
      <div class="footer-brand"><img src="/assets/logo.svg" alt="" width="28" height="50"><div>${wordmark}<small>${esc(businessInfo.descriptor)}</small></div></div>
      <div class="footer-links"><a href="${businessInfo.menuRoute}">Menu</a><a href="${businessInfo.instagram.url}" target="_blank" rel="noreferrer">Instagram</a><a href="${businessInfo.mapsUrl}" target="_blank" rel="noreferrer">Maps</a></div>
      <span class="footer-legal">© <span id="year"></span> ${esc(businessInfo.name)}</span>
    </div>
  </footer>
  <a class="icon-button back-top" href="#top" aria-label="Torna in alto" hidden>${icons.down}</a>
  <dialog class="sheet" id="nav-dialog" aria-labelledby="nav-title">
    <span class="sheet-handle" aria-hidden="true"></span>
    <div class="sheet-header"><h2 id="nav-title">ICON Caffè</h2><button class="icon-button" aria-label="Chiudi navigazione" data-close>${icons.close}</button></div>
    <nav class="sheet-nav" aria-label="Navigazione mobile">${homeContent.nav.map((item) => `<a href="${item.href}">${esc(item.label)} ${icons.diagonal}</a>`).join("")}</nav>
    <div class="sheet-contact"><p>${esc(address)}</p><p>${esc(hours.join(" · "))}</p></div>
  </dialog>
`;

const dialog = document.querySelector("#nav-dialog");
const closeNavigation = bindDialog(dialog, document.querySelector("#nav-toggle"));
dialog.querySelectorAll("a").forEach((anchor) => anchor.addEventListener("click", async (event) => {
  if (!anchor.hash || anchor.pathname !== location.pathname) return;
  event.preventDefault();
  await closeNavigation();
  document.querySelector(anchor.hash)?.scrollIntoView({ behavior: reducedMotion() ? "instant" : "smooth" });
  history.replaceState(null, "", anchor.hash);
}));

setCurrentYear("#year");
attachTopbarShadow(".site-header");
enableMotion();
enableParallax();
document.title = businessInfo.seo.homeTitle;
setMetaDescription(businessInfo.seo.homeDescription);
setOpenGraph({ title: businessInfo.seo.homeTitle, description: businessInfo.seo.homeDescription, url: businessInfo.seo.siteUrl, image: businessInfo.seo.ogImage });

const structuredData = document.createElement("script");
structuredData.type = "application/ld+json";
structuredData.textContent = JSON.stringify({
  "@context": "https://schema.org", "@type": "CafeOrCoffeeShop",
  name: businessInfo.name, description: businessInfo.description,
  url: businessInfo.seo.siteUrl, image: businessInfo.seo.ogImage,
  servesCuisine: ["Caffetteria", "Aperitivo", "Cocktail Bar"],
  address: { "@type": "PostalAddress", streetAddress: businessInfo.address.street, addressLocality: businessInfo.address.city, postalCode: businessInfo.address.postalCode, addressRegion: businessInfo.address.region, addressCountry: businessInfo.address.country },
  sameAs: [businessInfo.instagram.url],
  openingHoursSpecification: businessInfo.hours.map((entry, index) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: (index === 0 ? ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] : ["Sunday"]).map((day) => "https://schema.org/" + day),
    opens: entry.opens, closes: entry.closes,
  })),
});
document.head.appendChild(structuredData);
