import { clearCart, checkoutByWhatsapp, renderCart, updateCartCount } from "./modules/cart.js";
import { handleContactSubmit } from "./modules/contact.js";
import { elements } from "./modules/dom.js";
import { loadCategories, loadProductDetail, loadProducts } from "./modules/products.js";
import { state } from "./modules/state.js";
import { initRuntimeConfig, showToast } from "./modules/ui.js";

function initMenu() {
  if (elements.menuToggle && elements.nav) {
    elements.menuToggle.addEventListener("click", () => elements.nav.classList.toggle("active"));
  }
}

function initAnimations() {
  if (!elements.animatedItems.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  elements.animatedItems.forEach((item) => observer.observe(item));
}

function initSearch() {
  elements.searchButton?.addEventListener("click", () => {
    state.currentSearch = elements.searchInput ? elements.searchInput.value : "";
    loadProducts();
  });
  elements.searchInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      state.currentSearch = elements.searchInput.value;
      loadProducts();
    }
  });
}

function initForms() {
  elements.contactForm?.addEventListener("submit", handleContactSubmit);
  elements.newsletterForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    showToast("Te suscribiste correctamente");
    elements.newsletterForm.reset();
  });
}

function initCartActions() {
  elements.clearCartButton?.addEventListener("click", clearCart);
  elements.checkoutWhatsappButton?.addEventListener("click", checkoutByWhatsapp);
}

function init() {
  initRuntimeConfig();
  initMenu();
  initAnimations();
  initSearch();
  initForms();
  initCartActions();
  updateCartCount();
  if (elements.categoriesContainer) loadCategories();
  if (elements.productsContainer) loadProducts();
  if (elements.productDetailContainer) loadProductDetail();
  if (elements.cartContainer) renderCart();
}

init();
