const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
const revealObserver = new IntersectionObserver(entries => {
  for (const entry of entries) if (entry.isIntersecting) {
    entry.target.classList.remove('awaiting-reveal');
    revealObserver.unobserve(entry.target);
  }
}, { threshold: .05 });
for (const section of document.querySelectorAll('.case-reveal')) {
  if (!motionPreference.matches) section.classList.add('awaiting-reveal');
  revealObserver.observe(section);
}
motionPreference.addEventListener('change', () => {
  if (motionPreference.matches) document.querySelectorAll('.awaiting-reveal').forEach(section => section.classList.remove('awaiting-reveal'));
});
const viewer = document.querySelector('.image-viewer');
let imageOpener;
for (const link of document.querySelectorAll('[data-image-viewer]')) {
  link.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    imageOpener = link;
    const image = viewer.querySelector('img');
    image.src = link.href;
    image.alt = link.querySelector('img').alt;
    viewer.showModal();
    viewer.querySelector('.image-viewer-scroll').scrollTop = 0;
  });
}
viewer.querySelector('button').addEventListener('click', () => viewer.close());
viewer.addEventListener('click', event => { if (event.target === viewer) viewer.close(); });
viewer.addEventListener('close', () => imageOpener?.focus());
