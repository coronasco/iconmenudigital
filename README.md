# ICON Caffe

Site static cu landing page si meniu QR mobile-first. Nu necesita build sau dependente npm.

## Rulare locală

Din folderul proiectului:

```bash
python3 -m http.server 5173 --directory public
```

Apoi deschide `http://localhost:5173`.

## Verificare

```bash
node --test tests/*.test.mjs
```

## Continut

- `public/index.html` si `public/site.js`: landing page.
- `public/menu/index.html` si `public/app.js`: meniu, cautare, categorii si variante cu panna.
- `public/menu-data.js`: produsele si preturile originale; `panna: 0.5` adauga varianta optionala.
- `public/tea-data.js`: 14 ceaiuri Sir George, ingrediente si surse oficiale.
- `public/assets/sir-george/SOURCES.md`: provenienta fotografiilor si limitele listelor de ingrediente.
- `public/menu-extras.js`: preturi cu supliment si recomandari sezoniere dupa calendarul Europe/Rome.
- `public/experience.js`: motion pentru landing page, cu scroll nativ si reduced-motion.

Recomandari: noiembrie-martie bauturi calde, mai-septembrie bauturi racoritoare,
aprilie/octombrie selectie de tranzitie. Nu folosesc geolocatie sau date meteo.
Inchiderea recomandarii este memorata doar pentru sesiunea curenta.

Variantele de preparare afiseaza pretul, nu trimit o comanda. Pentru formulele
complete si actualizate ale ceaiurilor se consulta eticheta produsului din bar.

