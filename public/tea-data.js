const productRoot = "https://www.masterciok.it/it/prodotti/bevande-calde/te-e-tisane/sir-george/referenze/";
const photoRoot = "https://www.masterciok.it/files/masterciock_Files/Foto/";

function tea(name, id, photo, source, ingredients, ingredientLabel = "Ingredienti principali") {
  return { name, price: 3, ingredients, ingredientLabel, image: `/assets/sir-george/${id}.png`, photoSource: `${photoRoot}${photo}_2.PNG`, source: productRoot + source };
}

export const TEA_SECTION = {
  category: "Tè e tisane",
  brand: "Sir George · Master Ciok",
  kind: "tea",
  note: "Composizioni e note aromatiche dalle schede del produttore. Per l'elenco completo aggiornato e gli allergeni, chiedi al personale prima di ordinare.",
  groups: [
    { title: "Tè neri", items: [
      tea("English Breakfast", "english-breakfast", "25777", "sir-george-the-nero-english-breakfast.1.3.871.gp.8429.uw", "Tè nero, dal gusto corposo e deciso."),
      tea("Imperial Earl Grey", "imperial-earl-grey", "25781", "sir-george-the-nero-imperial-earl-grey.1.3.871.gp.8430.uw", "Tè nero aromatizzato al bergamotto."),
    ] },
    { title: "Tè verdi", items: [
      tea("Della Fortuna", "della-fortuna", "25785", "sir-george-the-verde-della-fortuna.1.3.871.gp.7903.uw", "Tè verde e tè nero, petali di rosa, osmanto e fiordaliso."),
      tea("Summer Solstice", "summer-solstice", "25789", "sir-george-the-verde-summer-solstice.1.3.871.gp.7902.uw", "Tè verde, honeybush, petali di girasole e di rosa, fiori di fiordaliso, aromi.", "Ingredienti"),
      tea("Mint Gunpowder", "mint-gunpowder", "26605", "sir-george-te-verde-mint-gunpowder-new.1.3.871.gp.13534.uw", "Tè verde e foglie di menta."),
    ] },
    { title: "Infusi", items: [
      tea("Frutti di Bosco", "frutti-di-bosco", "25765", "sir-george-infuso-frutti-di-bosco.1.3.871.gp.7906.uw", "Sambuco, karkadè, mela, ribes nero, mora, fragola e lampone."),
      tea("Fuoco del Caminetto", "fuoco-del-caminetto", "25769", "sir-george-infuso-fuoco-del-caminetto.1.3.871.gp.7905.uw", "Mela, cannella, estratto di vaniglia e mandorle."),
      tea("Sul Nilo", "sul-nilo", "25773", "sir-george-infuso-sul-nilo.1.3.871.gp.7904.uw", "Rooibos, radice di liquirizia e papaya."),
      tea("Profumi d'Inverno", "profumi-d-inverno", "26589", "sir-george-infuso-profumi-d-inverno-new-special-edition.1.3.871.gp.13532.uw", "Arancia, mela, fiori e cannella."),
    ] },
    { title: "Tisane", items: [
      tea("Bonne Nuit", "bonne-nuit", "25797", "sir-george-tisana-bonne-nuit.1.3.871.gp.8434.uw", "Mela, fiori di camomilla, rosa canina, foglie di verbena, ribes nero, petali di fiori d'arancio, aromi, fiori di tiglio e petali di fiordaliso.", "Ingredienti"),
      tea("Brezza di Agrumi", "brezza-di-agrumi", "25817", "sir-george-tisana-brezza-di-agrumi.1.3.871.gp.13392.uw", "Eucalipto, lemongrass, mandarino e carota."),
      tea("Dopo Pasto", "dopo-pasto", "25805", "sir-george-tisana-dopo-pasto.1.3.871.gp.8435.uw", "Foglie di menta piperita, fiori di camomilla, semi di finocchio e di anice, aromi.", "Ingredienti"),
      tea("Oro Vivace", "oro-vivace", "26585", "sir-george-tisana-oro-vivace-new-special-edition.1.3.871.gp.13533.uw", "Miele di Manuka, scorze di limone e zenzero.", "Note aromatiche"),
      tea("Ventre Plat", "ventre-plat", "25813", "sir-george-tisana-ventre-plat.1.3.871.gp.8433.uw", "Semi di finocchio, radice di liquirizia, foglie di menta piperita, fiori di camomilla, anice verde e cumino.", "Ingredienti"),
    ] },
  ],
};

export const TEA_GROUPS = TEA_SECTION.groups.map(({ title }) => title);
