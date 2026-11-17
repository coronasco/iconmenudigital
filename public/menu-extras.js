export function preparationPrice(item, withPanna = false) {
  return (Math.round(item.price * 100) + (withPanna ? Math.round((item.panna || 0) * 100) : 0)) / 100;
}

export function seasonalProposal(date = new Date()) {
  const month = Number(new Intl.DateTimeFormat("en", { month: "numeric", timeZone: "Europe/Rome" }).format(date));
  if (month >= 11 || month <= 3) return {
    season: "cold", title: "Il piacere di una pausa calda.",
    copy: "Tè, tisane e cioccolata calda. Prenditi il tuo tempo.",
    links: [
      { label: "Tè e tisane", category: "te-e-tisane" },
      { label: "Cioccolata calda", category: "caffetteria", q: "Cioccolata calda" },
    ],
  };
  if (month >= 5 && month <= 9) return {
    season: "warm", title: "Una pausa, tutta freschezza.",
    copy: "Qualcosa di fresco, un caffè shakerato o un drink senza alcol.",
    links: [
      { label: "Bibite", category: "bibite" },
      { label: "Shakerato", category: "caffetteria", q: "Shakerato" },
      { label: "Mocktails", category: "cocktails", drink: "Mocktails" },
    ],
  };
  return {
    season: "mild", title: "Il tuo momento, con calma.",
    copy: "Dal primo caffè a un infuso profumato: scegli la tua pausa.",
    links: [
      { label: "Caffetteria", category: "caffetteria" },
      { label: "Tè e tisane", category: "te-e-tisane" },
    ],
  };
}
