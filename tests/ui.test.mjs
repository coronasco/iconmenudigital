import test from "node:test";
import assert from "node:assert/strict";
import { bindDialog, animateRows, euro, sectionItems } from "../public/ui.js";
import { MENU } from "../public/menu-data.js";

function dialogFixture(reduce) {
  const classes = new Set();
  globalThis.window = { matchMedia: () => ({ matches: reduce }) };
  globalThis.document = {
    documentElement: { classList: { add: (name) => classes.add(name), remove: (name) => classes.delete(name) } },
  };
  globalThis.getComputedStyle = () => ({ transform: "none" });
  const events = new Map();
  const attributes = new Map();
  const opener = {
    addEventListener: (name, callback) => events.set("opener:" + name, callback),
    setAttribute: (name, value) => attributes.set(name, value),
    click: () => events.get("opener:click")(),
  };
  const dialog = {
    open: false,
    style: {},
    animationCount: 0,
    addEventListener: (name, callback) => events.set(name, callback),
    querySelector: () => null,
    querySelectorAll: () => [],
    getAnimations: () => [],
    animate() { this.animationCount++; return { finished: Promise.resolve() }; },
    showModal() { this.open = true; },
    close() { this.open = false; events.get("close")(); },
  };
  return { dialog, opener, classes, attributes, close: bindDialog(dialog, opener) };
}

test("reduced-motion dialog can close and reopen repeatedly", async () => {
  const fixture = dialogFixture(true);
  for (let cycle = 0; cycle < 3; cycle++) {
    fixture.opener.click();
    assert.equal(fixture.dialog.open, true);
    assert.equal(fixture.attributes.get("aria-expanded"), "true");
    assert.equal(fixture.classes.has("dialog-open"), true);
    await fixture.close();
    assert.equal(fixture.dialog.open, false);
    assert.equal(fixture.attributes.get("aria-expanded"), "false");
    assert.equal(fixture.classes.has("dialog-open"), false);
  }
  assert.equal(fixture.dialog.animationCount, 0);
});

test("animated dialog shares concurrent close requests and reopens", async () => {
  const fixture = dialogFixture(false);
  fixture.opener.click();
  const first = fixture.close();
  assert.equal(fixture.close(), first);
  await first;
  fixture.opener.click();
  assert.equal(fixture.dialog.open, true);
  await fixture.close();
  assert.equal(fixture.classes.has("dialog-open"), false);
});

test("reduced motion skips list animations", () => {
  globalThis.window = { matchMedia: () => ({ matches: true }) };
  animateRows([{ getBoundingClientRect() { assert.fail("Should not measure or animate rows"); } }]);
});

test("menu keeps all products, cocktail groups, and displayed prices", () => {
  assert.equal(MENU.flatMap(sectionItems).length, 110);
  const cocktails = MENU.find((section) => section.category === "Cocktails");
  assert.deepEqual(cocktails.groups.map((group) => [group.title, group.items.length]), [["Con alcol", 9], ["Mocktails", 5]]);
  assert.ok(cocktails.groups.flatMap((group) => group.items).every((item) => item.desc && euro(item)));
  assert.equal(euro({ price: 1.3 }), "1,30 €");
  assert.equal(euro({ priceText: "2,50 € / 3,00 €" }), "2,50 € / 3,00 €");
});
