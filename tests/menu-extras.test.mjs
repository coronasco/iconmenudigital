import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { MENU } from "../public/menu-data.js";
import { TEA_SECTION } from "../public/tea-data.js";
import { preparationPrice, seasonalProposal } from "../public/menu-extras.js";
import { sectionItems, slug } from "../public/ui.js";

test("14 Sir George teas have ingredients, official photos and the agreed EUR 3 price", () => {
  const teas = sectionItems(TEA_SECTION);
  assert.equal(teas.length, 14);
  assert.equal(new Set(teas.map((tea) => tea.image)).size, 14);
  for (const tea of teas) {
    assert.equal(tea.price, 3);
    assert.ok(tea.ingredients.length > 15);
    assert.ok(tea.ingredientLabel);
    assert.ok(tea.source.startsWith("https://www.masterciok.it/"));
    const photo = readFileSync(new URL("../public" + tea.image, import.meta.url));
    assert.equal(photo.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
  }
});

test("panna adds exactly 50 cents without altering any base price", () => {
  const items = MENU.flatMap(sectionItems).filter((item) => item.panna);
  assert.deepEqual(items.map((item) => item.name), ["Caffè", "Caffè Dek", "Marocchino", "Cioccolata calda"]);
  for (const item of items) {
    const base = item.price;
    assert.equal(preparationPrice(item, true), (Math.round(base * 100) + 50) / 100);
    assert.equal(preparationPrice(item, false), base);
    assert.equal(item.price, base);
  }
  assert.equal(preparationPrice(items.find((item) => item.name === "Marocchino"), true), 3);
  assert.equal(preparationPrice(items.find((item) => item.name === "Cioccolata calda"), true), 3.5);
});

test("seasonal recommendations cover every month and link to real menu content", () => {
  const expected = ["cold", "cold", "cold", "mild", "warm", "warm", "warm", "warm", "warm", "mild", "cold", "cold"];
  for (let month = 0; month < 12; month++) {
    const proposal = seasonalProposal(new Date(Date.UTC(2026, month, 15, 12)));
    assert.equal(proposal.season, expected[month]);
    for (const link of proposal.links) {
      const section = MENU.find((entry) => slug(entry.category) === link.category);
      assert.ok(section);
      if (link.q) assert.ok(sectionItems(section).some((item) => item.name.includes(link.q)));
      if (link.drink) assert.ok(section.groups.some((group) => group.title === link.drink));
    }
  }
});

test("season changes follow the bar's Europe/Rome calendar, not visitor timezone", () => {
  assert.equal(seasonalProposal(new Date("2026-10-31T23:30:00Z")).season, "cold");
  assert.equal(seasonalProposal(new Date("2026-04-30T22:30:00Z")).season, "warm");
});
