export const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

// Scroll stays native. Only visual layers follow the damped frame clock.
export function initExperience() {
  const preference = matchMedia("(prefers-reduced-motion: reduce)");
  const hero = document.querySelector(".hero-scene");
  const header = document.querySelector(".site-header");
  const scenes = [...document.querySelectorAll("[data-scene]")];
  const rituals = [...document.querySelectorAll("[data-ritual]")];
  const progress = document.querySelector(".reading-progress");
  let frame = 0;
  let position = scrollY;
  let last = 0;

  function draw(time) {
    frame = 0;
    const delta = Math.min(64, time - (last || time - 16));
    last = time;
    const target = scrollY;
    position = preference.matches ? target : position + (target - position) * (1 - Math.exp(-delta / 85));
    if (Math.abs(target - position) < .1) position = target;
    const height = innerHeight;
    const travel = Math.max(1, hero.offsetHeight - height);
    hero.style.setProperty("--hero-progress", (preference.matches ? 0 : clamp(position / travel)).toFixed(4));
    hero.style.setProperty("--hero-drift", (preference.matches ? 0 : Math.min(position * .22, 180)).toFixed(2) + "px");
    header.classList.toggle("is-scrolled", target > 50);

    for (const scene of scenes) {
      const rect = scene.getBoundingClientRect();
      if (rect.bottom < -100 || rect.top > height + 100) continue;
      const top = rect.top + target - position;
      const revealDistance = Math.max(1, Math.min(height * .7, rect.height * .65));
      const entered = preference.matches ? 1 : clamp((height * .95 - top) / revealDistance);
      scene.style.setProperty("--entered", entered.toFixed(4));
      const flow = preference.matches ? 0 : clamp((height / 2 - top - rect.height / 2) / height, -1, 1);
      scene.style.setProperty("--flow", flow.toFixed(4));
    }
    for (const row of rituals) {
      const rect = row.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > height + 100) continue;
      const entered = preference.matches ? 1 : clamp((height * .94 - rect.top) / (height * .25));
      row.style.setProperty("--row-progress", entered.toFixed(4));
    }
    const distance = document.documentElement.scrollHeight - height;
    progress.style.transform = `scaleX(${distance > 0 ? clamp(target / distance) : 0})`;
    if (position !== target) frame = requestAnimationFrame(draw);
  }
  const schedule = () => { if (!frame) frame = requestAnimationFrame(draw); };
  addEventListener("scroll", schedule, { passive: true });
  addEventListener("resize", schedule, { passive: true });
  preference.addEventListener("change", schedule);
  new ResizeObserver(schedule).observe(document.body);
  document.fonts.ready.then(schedule);
  schedule();

  const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
  for (const link of document.querySelectorAll(".hero-menu, .portal-arrow, .contact-direction")) {
    link.addEventListener("pointermove", (event) => {
      if (!finePointer.matches || preference.matches) return;
      const rect = link.getBoundingClientRect();
      link.style.setProperty("--mx", ((event.clientX - rect.left - rect.width / 2) * .12).toFixed(2) + "px");
      link.style.setProperty("--my", ((event.clientY - rect.top - rect.height / 2) * .12).toFixed(2) + "px");
    });
    link.addEventListener("pointerleave", () => {
      link.style.setProperty("--mx", "0px");
      link.style.setProperty("--my", "0px");
    });
  }
}
