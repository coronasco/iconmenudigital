import test from "node:test";
import assert from "node:assert/strict";
import { clamp, initExperience } from "../public/experience.js";

test("scroll progress cannot overshoot scene endpoints", () => {
  assert.equal(clamp(-.4), 0);
  assert.equal(clamp(.45), .45);
  assert.equal(clamp(1.6), 1);
});

test("bidirectional parallax stays within its travel bounds", () => {
  assert.equal(clamp(-3, -1, 1), -1);
  assert.equal(clamp(.3, -1, 1), .3);
  assert.equal(clamp(3, -1, 1), 1);
});

test("reduced motion shows all scene content without parallax", async () => {
  const variables = new Map();
  const style = { setProperty: (name, value) => variables.set(name, value) };
  const scene = { style, getBoundingClientRect: () => ({ top: 300, bottom: 700, height: 400 }) };
  const progress = { style: {} };
  const frames = [];
  globalThis.scrollY = 300;
  globalThis.innerHeight = 800;
  globalThis.matchMedia = () => ({ matches: true, addEventListener() {} });
  globalThis.addEventListener = () => {};
  globalThis.requestAnimationFrame = (callback) => { frames.push(callback); return frames.length; };
  globalThis.ResizeObserver = class { observe() {} };
  globalThis.document = {
    body: {},
    documentElement: { scrollHeight: 2400 },
    fonts: { ready: Promise.resolve() },
    querySelector: (selector) => ({
      ".hero-scene": { style, offsetHeight: 1000 },
      ".site-header": { classList: { toggle() {} } },
      ".reading-progress": progress,
    })[selector],
    querySelectorAll: (selector) => ["[data-scene]", "[data-ritual]"].includes(selector) ? [scene] : [],
  };
  initExperience();
  await Promise.resolve();
  frames.shift()(16);
  assert.equal(variables.get("--hero-progress"), "0.0000");
  assert.equal(variables.get("--hero-drift"), "0.00px");
  assert.equal(variables.get("--entered"), "1.0000");
  assert.equal(variables.get("--row-progress"), "1.0000");
  assert.equal(frames.length, 0);
});
