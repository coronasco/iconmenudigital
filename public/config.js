export const businessInfo = {
  name: "ICON Caffè",
  shortName: "ICON",
  descriptor: "Bar, caffetteria, aperitivi e cocktail.",
  description:
    "Dal caffè del mattino all'aperitivo, ICON Caffè è un luogo caldo e contemporaneo dove fermarsi, incontrarsi e godersi il momento.",
  address: {
    street: "Via Pietro Cossa 79/B",
    city: "Torino",
    region: "TO",
    postalCode: "10136",
    country: "IT",
  },
  hours: [
    { days: "Lun - Sab", opens: "05:00", closes: "23:00" },
    { days: "Domenica", opens: "06:30", closes: "23:00" },
  ],
  instagram: {
    label: "@icon_caffe",
    url: "https://instagram.com/icon_caffe",
  },
  phone: "",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Via+Pietro+Cossa+79%2FB%2C+10136+Torino",
  menuRoute: "/menu",
  heroImageAlt: "Bancone di ICON Caffè con croissant e luci calde",
  seo: {
    homeTitle: "ICON Caffè | Bar, caffetteria, aperitivi e cocktail a Torino",
    homeDescription:
      "ICON Caffè a Torino: colazioni, caffetteria, aperitivi e cocktail in un ambiente caldo, essenziale e contemporaneo.",
    menuTitle: "Menu | ICON Caffè Torino",
    menuDescription:
      "Menu digitale di ICON Caffè con caffetteria, bibite, panini, aperitivi, cocktails, vini, birre e distillati.",
    ogImage: "https://iconcaffe.com/assets/bg.png",
    siteUrl: "https://iconcaffe.com",
  },
};

export const homeContent = {
  nav: [
    { label: "Home", href: "#top" },
    { label: "Il bar", href: "#about" },
    { label: "Menu", href: "/menu" },
    { label: "Info", href: "#info" },
    { label: "Contatti", href: "#cta" },
  ],
  hero: {
    title: "ICON Caffè",
    subtitle: "Bar, caffetteria, aperitivi e cocktail.",
    body:
      "Dal primo espresso all'aperitivo, un ambiente curato dove il ritmo del quartiere incontra una presenza elegante e quotidiana.",
    primaryCta: { label: "Apri il menu", href: "/menu" },
    secondaryCta: { label: "Contatti e orari", href: "#info" },
    quickInfo: [
      { label: "Indirizzo", value: "Via Pietro Cossa 79/B, Torino" },
      { label: "Orari", value: "Lun - Sab 05:00 - 23:00 · Dom 06:30 - 23:00" },
      { label: "Instagram", value: "@icon_caffe", href: "https://instagram.com/icon_caffe" },
    ],
    highlights: ["Colazioni", "Aperitivo", "Cocktails", "Ambiente curato"],
  },
  about: {
    kicker: "Il bar",
    title: "Semplice, curato, contemporaneo.",
    body:
      "ICON nasce come punto d'incontro quotidiano: caffetteria, aperitivi, distillati e snack essenziali serviti con attenzione, in un'atmosfera essenziale e accogliente.",
    details: [
      "Servizio rapido al mattino, pausa breve ben fatta e ritmi più morbidi verso sera.",
      "Una presenza di quartiere con carattere contemporaneo, pensata per chi cerca qualità senza eccessi.",
    ],
    cta: { label: "Scopri il menu", href: "/menu" },
  },
  services: {
    kicker: "Cosa trovi",
    title: "Ogni momento ha il suo ritmo.",
    lead:
      "Una proposta essenziale, pensata per accompagnare la giornata con gusto, precisione e un'atmosfera sempre coerente.",
    items: [
      {
        icon: "coffee",
        title: "Caffetteria",
        text: "Espresso, cappuccino e proposte calde per iniziare bene la giornata.",
      },
      {
        icon: "glass",
        title: "Aperitivo",
        text: "Classici, drink e piccoli momenti da condividere con calma.",
      },
      {
        icon: "martini",
        title: "Cocktails",
        text: "Spritz, classici e drink analcolici con una selezione chiara e ben bilanciata.",
      },
      {
        icon: "plate",
        title: "Pausa pranzo",
        text: "Panini, toast e snack scelti per una pausa semplice ma soddisfacente.",
      },
    ],
  },
  menuPreview: {
    kicker: "Menu digitale",
    title: "Una selezione essenziale, pensata per accompagnare ogni momento della giornata.",
    body:
      "Dal banco colazioni ai cocktails della sera, il menu resta leggibile, veloce da consultare e sempre a portata di mano.",
    cta: { label: "Vai al menu completo", href: "/menu" },
    categories: ["Caffetteria", "Cocktails", "Aperitivo", "Liquori e distillati"],
  },
  gallery: {
    kicker: "Atmosfera",
    title: "Un ambiente caldo, essenziale, autentico.",
    lead:
      "Luci morbide, dettagli materici e un bancone che accompagna dalla prima colazione al dopo cena.",
    items: [
      {
        title: "Bancone",
        type: "image",
        alt: "Croissant sul bancone di ICON Caffè",
        note: "Foto reale del locale",
      },
      {
        title: "Sala interna",
        type: "placeholder",
        note: "Sostituisci con una foto reale della sala o dei tavoli.",
      },
      {
        title: "Cocktail & aperitivo",
        type: "placeholder",
        note: "Sostituisci con una foto reale dei drink o dell'aperitivo.",
      },
      {
        title: "Dettagli del locale",
        type: "placeholder",
        note: "Sostituisci con dettagli di insegna, bottigliera o macchina del caffè.",
      },
    ],
  },
  finalCta: {
    title: "Scopri cosa ti aspetta da ICON.",
    body:
      "Consulta il menu digitale o seguici su Instagram per novità, momenti dal locale e aggiornamenti quotidiani.",
    buttons: [
      { label: "Menu", href: "/menu", style: "primary" },
      { label: "Instagram", href: "https://instagram.com/icon_caffe", style: "secondary" },
      { label: "Contatti", href: "#info", style: "secondary" },
    ],
  },
};
