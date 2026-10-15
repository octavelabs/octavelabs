const dialog = document.querySelector("#booking-dialog");
const form = document.querySelector("#booking-form");
const status = document.querySelector("#form-status");
let opener;
for (const button of document.querySelectorAll("[data-booking]")) {
  button.addEventListener("click", () => {
    opener = button;
    form.elements.plan.value = button.dataset.plan || "Not sure yet";
    if (button.dataset.service) form.elements.service.value = button.dataset.service;
    status.textContent = "";
    dialog.showModal();
  });
}
document
  .querySelector(".dialog-close")
  .addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) {
    const r = dialog.getBoundingClientRect();
    if (
      event.clientX < r.left ||
      event.clientX > r.right ||
      event.clientY < r.top ||
      event.clientY > r.bottom
    )
      dialog.close();
  }
});
dialog.addEventListener("close", () => opener?.focus());
const menu = document.querySelector(".menu-toggle");
const nav = document.querySelector(".navigation");
function closeMenu() {
  menu.setAttribute("aria-expanded", "false");
  nav.classList.remove("is-open");
}
menu.addEventListener("click", () => {
  const open = menu.getAttribute("aria-expanded") !== "true";
  menu.setAttribute("aria-expanded", String(open));
  nav.classList.toggle("is-open", open);
});
nav.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});
let submissionId;
form.addEventListener("input", () => {
  submissionId = undefined;
});
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const button = form.querySelector('[type="submit"]');
  button.disabled = true;
  status.dataset.error = "false";
  status.textContent = "Sending your enquiry…";
  submissionId ||= crypto.randomUUID();
  try {
    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": submissionId,
      },
      body: JSON.stringify(Object.fromEntries(new FormData(form))),
    });
    const result = await response.json();
    if (!response.ok)
      throw new Error(
        result.error || "We couldn’t send your enquiry. Please try again.",
      );
    status.textContent =
      "Thanks — your enquiry is on its way. We’ll be in touch by email.";
    form.reset();
    submissionId = undefined;
  } catch (error) {
    status.dataset.error = "true";
    status.textContent =
      error.message || "We couldn’t connect. Please try again.";
  } finally {
    button.disabled = false;
  }
});
