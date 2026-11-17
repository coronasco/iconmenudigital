import { businessInfo, homeContent } from "./config.js?v=20261117c";
import {
  icons, wordmark, escapeHtml as esc, slug, formatAddress, formatHours,
  bindDialog, setCurrentYear, setMetaDescription, setOpenGraph, reducedMotion,
} from "./ui.js?v=20261117c";
import { initExperience } from "./experience.js?v=20261117c";

const { hero, about, services, menuPreview } = homeContent;
const address = formatAddress(businessInfo.address);
const hours = formatHours(businessInfo.hours);
const categoryHref = (category) => businessInfo.menuRoute + "?category=" + slug(category);
const nav = homeContent.nav.filter((item) => ["Il bar", "Menu", "Contatti"].includes(item.label));

document.querySelector("#app").innerHTML = `
  <a class="skip-link" href="#main">Vai al contenuto</a>
  <div class="reading-progress" aria-hidden="true"></div>
  <header class="site-header">
    <div class="container header-inner">
      <a class="brand" href="/" aria-label="${esc(businessInfo.name)}">${wordmark}</a>
      <nav class="main-nav" aria-label="Navigazione principale">${nav.map((item) => `<a href="${item.href}">${esc(item.label)}</a>`).join("")}</nav>
      <a class="header-cta" href="${businessInfo.menuRoute}">Apri il menu ${icons.diagonal}</a>
      <button class="icon-button nav-toggle" id="nav-toggle" aria-label="Apri navigazione" aria-haspopup="dialog" aria-controls="nav-dialog" aria-expanded="false"><span></span><span></span></button>
    </div>
  </header>
  <main id="main">
    <section class="hero-scene" id="top" aria-label="ICON Caffè">
      <div class="hero-stage">
        <div class="hero-media"><img src="/assets/bg.png" alt="${esc(businessInfo.heroImageAlt)}" width="682" height="1024" fetchpriority="high"></div>
        <div class="hero-shade" aria-hidden="true"></div>
        <div class="container hero-content">
          <div class="hero-intro"><p>${esc(hero.subtitle)}</p><span>Torino, Italia</span></div>
          <div class="hero-lockup">
            <h1 class="hero-title" aria-label="ICON Caffè">${[..."ICON"].map((letter, i) => `<span class="hero-letter" aria-hidden="true" style="--i:${i}"><span>${letter}</span></span>`).join("")}</h1>
            <div class="hero-signature"><span>Caffè</span><span>Dal primo espresso<br>all'aperitivo.</span></div>
          </div>
          <div class="hero-bottom">
            <a class="hero-menu" href="${businessInfo.menuRoute}"><span>Apri il menu</span><span class="arrow-disc">${icons.diagonal}</span></a>
            <a class="hero-address" href="${businessInfo.mapsUrl}" target="_blank" rel="noreferrer">${esc(hero.quickInfo[0].value)}</a>
            <a class="scroll-cue" href="#about" aria-label="Scopri il bar">${icons.down}</a>
          </div>
        </div>
        <div class="hero-frame" aria-hidden="true"></div>
      </div>
    </section>
    <section class="intro-section" id="about" data-scene>
      <div class="container">
        <div class="section-meta"><span>01 / Il bar</span><span>ICON Caffè, Torino</span></div>
        <div class="intro-layout">
          <h2 class="statement" aria-label="${esc(about.title)}">
            <span class="statement-line"><span data-line="0">Semplice,</span></span>
            <span class="statement-line"><span data-line="1">curato,</span></span>
            <span class="statement-line statement-line--accent"><span data-line="2">contemporaneo.</span></span>
          </h2>
          <div class="intro-copy"><p>${esc(about.body)}</p><p>${esc(about.details[0])}</p><a class="text-link" href="${about.cta.href}">${esc(about.cta.label)} ${icons.diagonal}</a></div>
        </div>
      </div>
    </section>
    <section class="ritual-section" data-scene>
      <div class="container">
        <div class="ritual-heading"><h2>${esc(services.title)}</h2><p>${esc(services.lead)}</p></div>
        <div class="ritual-list">
          ${services.items.map((item, index) => `
            <a class="ritual-row" href="${categoryHref(item.title === "Pausa pranzo" ? "Panini" : item.title)}" data-ritual>
              <span class="ritual-index">0${index + 1}</span>
              <h3><span>${esc(item.title)}</span></h3>
              <p>${esc(item.text)}</p><span class="ritual-arrow">${icons.diagonal}</span>
            </a>`).join("")}
        </div>
      </div>
    </section>
    <section class="menu-invitation" data-scene>
      <div class="container">
        <div class="section-meta"><span>02 / ${esc(menuPreview.kicker)}</span><span>Caffetteria & cocktails</span></div>
        <a class="menu-portal" href="${businessInfo.menuRoute}" aria-label="Vai al menu completo">
          <span class="portal-type" aria-hidden="true"><span>Il menu.</span></span><span class="portal-arrow">${icons.diagonal}</span>
        </a>
        <div class="invitation-bottom"><p>${esc(menuPreview.title)}</p><a class="text-link" href="${businessInfo.menuRoute}">${esc(menuPreview.cta.label)} ${icons.arrow}</a></div>
      </div>
    </section>
    <section class="contact-section" id="info">
      <div class="container" id="cta">
        <div class="section-meta"><span>03 / Info e contatti</span><span>Ci trovi qui</span></div>
        <div class="contact-heading"><h2>Siamo qui<br>per te.</h2><a class="contact-direction" href="${businessInfo.mapsUrl}" target="_blank" rel="noreferrer" aria-label="Come raggiungerci">${icons.diagonal}</a></div>
        <div class="contact-grid">
          <div><h3>Indirizzo</h3><a href="${businessInfo.mapsUrl}" target="_blank" rel="noreferrer">${esc(businessInfo.address.street)}<br>${esc(businessInfo.address.postalCode)} ${esc(businessInfo.address.city)} (${esc(businessInfo.address.region)}) ${icons.diagonal}</a></div>
          <div><h3>Orari</h3>${hours.map((line) => `<p>${esc(line)}</p>`).join("")}</div>
          <div><h3>Restiamo in contatto</h3><a href="${businessInfo.instagram.url}" target="_blank" rel="noreferrer">${esc(businessInfo.instagram.label)} ${icons.diagonal}</a><a href="${businessInfo.menuRoute}">Menu digitale ${icons.diagonal}</a></div>
        </div>
      </div>
    </section>
  </main>
  <footer class="site-footer" data-scene>
    <div class="container footer-word" aria-hidden="true"><span>ICON</span><small>Caffè</small></div>
    <div class="container footer-bottom"><span>© <span id="year"></span> ${esc(businessInfo.name)}</span><span>${esc(businessInfo.descriptor)}</span><a href="#top">Torna in alto ${icons.arrow}</a></div>
  </footer>
  <dialog class="sheet navigation-sheet" id="nav-dialog" aria-labelledby="nav-title">
    <span class="sheet-handle" aria-hidden="true" data-drag-handle></span>
    <div class="sheet-header"><h2 id="nav-title">ICON Caffè</h2><button class="icon-button" aria-label="Chiudi navigazione" data-close>${icons.close}</button></div>
    <nav class="sheet-nav" aria-label="Navigazione mobile">${homeContent.nav.map((item, index) => `<a href="${item.href}"><small>0${index + 1}</small><span>${esc(item.label)}</span>${icons.diagonal}</a>`).join("")}</nav>
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
initExperience();
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
