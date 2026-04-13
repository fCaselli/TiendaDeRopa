import { WHATSAPP_NUMBER } from "./config.js";

export function formatWhatsappDisplay(number) {
  if (!number) return "";
  const clean = String(number).replace(/\D/g, "");
  if (clean.length === 13 && clean.startsWith("549")) {
    return `+${clean.slice(0, 2)} ${clean.slice(2, 3)} ${clean.slice(3, 5)} ${clean.slice(5, 9)} ${clean.slice(9)}`;
  }
  return `+${clean}`;
}

export function initRuntimeConfig() {
  document.querySelectorAll('[data-whatsapp-link]').forEach((link) => {
    link.setAttribute('href', `https://wa.me/${WHATSAPP_NUMBER}`);
    if (link.target === '_blank') {
      link.setAttribute('rel', 'noopener noreferrer');
    }
  });

  document.querySelectorAll('[data-whatsapp-text]').forEach((node) => {
    node.textContent = formatWhatsappDisplay(WHATSAPP_NUMBER);
  });
}

export function formatPrice(price) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(price);
}

export function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toast.hideTimeout);
  toast.hideTimeout = setTimeout(() => toast.classList.remove("show"), 2200);
}

export function renderMessage(container, { title, text, actionText, actionHandler }) {
  if (!container) return;
  container.innerHTML = `
    <div class="state-card" role="status" aria-live="polite" tabindex="-1">
      <h3>${title}</h3>
      <p>${text}</p>
      ${actionText ? `<button class="btn btn--dark state-retry-btn" type="button">${actionText}</button>` : ""}
    </div>
  `;

  const stateCard = container.querySelector('.state-card');
  stateCard?.focus?.();

  if (actionText && actionHandler) {
    container.querySelector('.state-retry-btn')?.addEventListener('click', actionHandler);
  }
}

export function clearFieldErrors(form) {
  form.querySelectorAll('.field-error').forEach((el) => el.remove());
  form.querySelectorAll('[aria-invalid="true"]').forEach((input) => {
    input.setAttribute('aria-invalid', 'false');
    input.removeAttribute('aria-describedby');
  });
}

export function setFieldError(input, message) {
  const error = document.createElement('small');
  const errorId = `${input.id || input.name || 'field'}-error`;
  error.className = 'field-error';
  error.id = errorId;
  error.textContent = message;
  input.setAttribute('aria-invalid', 'true');
  input.setAttribute('aria-describedby', errorId);
  input.insertAdjacentElement('afterend', error);
}
