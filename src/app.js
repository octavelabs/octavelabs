const services = [...document.querySelectorAll(".service")];
function openService(target, opening = true) {
  for (const service of services) {
    const open = service === target && opening;
    service.classList.toggle("is-open", open);
    service.querySelectorAll("[data-service-toggle]").forEach(button => button.setAttribute("aria-expanded", String(open)));
    const panel = service.querySelector(".service-description");
    if (panel) panel.hidden = !open;
  }
}
const autoOpenedServices = new Set();
for (const toggle of document.querySelectorAll("[data-service-toggle]")) {
  toggle.addEventListener("click", () => {
    const target = document.querySelector("#service-" + toggle.dataset.serviceToggle);
    autoOpenedServices.add(target);
    openService(target, !target.classList.contains("is-open"));
  });
}
const resizeArt = () =>
  document.querySelectorAll(".project-image").forEach((art) => {
    if (window.innerWidth <= 680) {
      const available = art.parentElement.clientWidth;
      art.style.setProperty(
        "--art-scale",
        String(Math.min(1, available / 480)),
      );
    }
  });
window.addEventListener("resize", resizeArt);
resizeArt();
// Decorative intro runs once per tab, and never blocks interaction.
const intro = document.querySelector("#intro");
const finishIntro = () => {
  document.documentElement.classList.remove("intro-pending");
  intro?.remove();
  try {
    sessionStorage.setItem("octave-intro", "seen");
  } catch {}
};
if (document.documentElement.classList.contains("intro-pending")) {
  intro.addEventListener("animationend", (event) => {
    if (event.target === intro) finishIntro();
  });
  setTimeout(finishIntro, 2200);
  window.addEventListener("pointerdown", finishIntro, { once: true });
  window.addEventListener("keydown", finishIntro, { once: true });
} else finishIntro();
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const valueHeading = document.querySelector(".value h2");
const words = [...document.querySelectorAll(".value-word")];
let pendingFrame = false;
function revealValue() {
  pendingFrame = false;
  const rect = valueHeading.getBoundingClientRect();
  const progress = Math.max(
    0,
    Math.min(
      1,
      (innerHeight * 0.9 - rect.top) / (innerHeight * 0.45 + rect.height * 0.3),
    ),
  );
  document.documentElement.classList.toggle(
    "motion-ready",
    !reducedMotion.matches,
  );
  words.forEach((word, i) =>
    word.classList.toggle(
      "is-lit",
      reducedMotion.matches || i / words.length < progress,
    ),
  );
}
function scheduleReveal() {
  if (!pendingFrame) {
    pendingFrame = true;
    requestAnimationFrame(revealValue);
  }
}
window.addEventListener("scroll", scheduleReveal, { passive: true });
window.addEventListener("resize", scheduleReveal);
reducedMotion.addEventListener("change", () => {
  if (reducedMotion.matches) finishIntro();
  scheduleReveal();
});
revealValue();

// Open each service as its heading reaches the reading area. Once-per-pass
// avoids layout changes repeatedly opening and closing neighbouring panels.
const serviceObserver = new IntersectionObserver(entries => {
  for (const entry of entries) {
    const service = entry.target.closest('.service');
    if (entry.isIntersecting && !autoOpenedServices.has(service)) {
      autoOpenedServices.add(service);
      // Keep earlier content open so expanding a later panel cannot shift it
      // past the reader or cause observer feedback loops.
      service.classList.add('is-open');
      service.querySelectorAll('[data-service-toggle]').forEach(button => button.setAttribute('aria-expanded', 'true'));
      const panel = service.querySelector('.service-description');
      if (panel) panel.hidden = false;
    }
  }
}, { rootMargin: '-12% 0px -38% 0px', threshold: 0 });
services.forEach(service => serviceObserver.observe(service.querySelector('h3')));
const processObserver = new IntersectionObserver(entries => {
  for (const entry of entries) if (entry.isIntersecting) {
    entry.target.classList.remove('awaiting-reveal');
    entry.target.classList.add('is-revealed');
    processObserver.unobserve(entry.target);
  }
}, { threshold: .15 });
document.querySelectorAll('.process-card').forEach(card => {
  if (!reducedMotion.matches) card.classList.add('awaiting-reveal');
  processObserver.observe(card);
});

const pricing = document.querySelector('.pricing-scroll');
const pricingStage = pricing.querySelector('.pricing-stage');
const packagePanels = [...pricing.querySelectorAll('.package-panel')];
const packageTabs = [...pricing.querySelectorAll('.package-tab')];
let activePackage = -1;
let pricingFrame;
function activatePackage(index) {
  if (index === activePackage) return;
  activePackage = index;
  packageTabs.forEach((tab, i) => tab.setAttribute('aria-pressed', String(i === index)));
  packagePanels.forEach((panel, i) => {
    panel.classList.toggle('is-active', i === index);
    panel.inert = pricing.classList.contains('pricing-is-pinned') && i !== index;
  });
}
function updatePricing() {
  pricingFrame = undefined;
  if (pricing.classList.contains('pricing-is-pinned')) {
    const distance = Math.max(1, pricing.offsetHeight - innerHeight);
    const progress = Math.max(0, Math.min(1, -pricing.getBoundingClientRect().top / distance));
    activatePackage(Math.min(3, Math.floor(progress * 4)));
  } else {
    let index = 0;
    packagePanels.forEach((panel, i) => { if (panel.getBoundingClientRect().top < innerHeight * .5) index = i; });
    activatePackage(index);
  }
}
function schedulePricing() {
  if (!pricingFrame) pricingFrame = requestAnimationFrame(updatePricing);
}
function sizePricing() {
  const eligible = innerWidth > 1100 && innerHeight >= 780 && !reducedMotion.matches;
  pricing.classList.toggle('pricing-is-pinned', eligible);
  // Small laptop heights or larger text fall back to normal document flow.
  if (eligible && pricingStage.getBoundingClientRect().height > innerHeight - 40) pricing.classList.remove('pricing-is-pinned');
  activePackage = -1;
  schedulePricing();
}
packageTabs.forEach((tab, index) => tab.addEventListener('click', () => {
  if (pricing.classList.contains('pricing-is-pinned')) {
    const start = scrollY + pricing.getBoundingClientRect().top;
    const step = (pricing.offsetHeight - innerHeight) / 4;
    window.scrollTo({ top:start + step * (index + .12), behavior:reducedMotion.matches ? 'instant' : 'smooth' });
  } else packagePanels[index].scrollIntoView({ behavior:reducedMotion.matches ? 'instant' : 'smooth', block:'start' });
}));
window.addEventListener('scroll', schedulePricing, { passive:true });
window.addEventListener('resize', sizePricing);
reducedMotion.addEventListener('change', sizePricing);
document.fonts.ready.then(sizePricing);
sizePricing();
