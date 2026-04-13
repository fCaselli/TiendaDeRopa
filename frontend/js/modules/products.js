import { apiFetch } from "./api.js";
import { CATEGORIES_API_URL, PRODUCTS_API_URL, WHATSAPP_NUMBER } from "./config.js";
import { elements } from "./dom.js";
import { state } from "./state.js";
import { addToCart } from "./cart.js";
import { formatPrice, renderMessage } from "./ui.js";

const OBJECT_ID_REGEX = /^[a-f\d]{24}$/i;

function isValidObjectId(value) {
  return OBJECT_ID_REGEX.test(String(value || ""));
}

export function renderCategories(categories) {
  if (!elements.categoriesContainer) return;
  elements.categoriesContainer.innerHTML = `
    <button class="filter-btn active" data-category="all" type="button">Todo</button>
    ${categories.map((category) => `<button class="filter-btn" data-category="${category}" type="button">${category}</button>`).join("")}
  `;

  const filterButtons = elements.categoriesContainer.querySelectorAll(".filter-btn");
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      state.currentCategory = button.dataset.category || "all";
      loadProducts();
    });
  });
}

export async function loadCategories() {
  if (!elements.categoriesContainer) return;
  try {
    const data = await apiFetch(CATEGORIES_API_URL);
    renderCategories(data.data || []);
  } catch (error) {
    renderMessage(elements.categoriesContainer, {
      title: "No se pudieron cargar las categorías",
      text: error.message,
      actionText: "Reintentar",
      actionHandler: loadCategories,
    });
  }
}

export function renderProducts(products) {
  if (!elements.productsContainer) return;
  if (!products.length) {
    renderMessage(elements.productsContainer, {
      title: "No se encontraron productos",
      text: "Probá con otra búsqueda o cambiá la categoría seleccionada.",
    });
    return;
  }

  elements.productsContainer.innerHTML = products.map((product) => `
    <article class="product-card fade-up visible">
      <div class="product-card__image">
        <img src="${product.image}" alt="${product.name}" onerror="this.onerror=null;this.src='img/placeholder.jpg';" />
        <span class="badge">${product.category}</span>
      </div>
      <div class="product-card__content">
        <p class="product-card__category">${product.category}</p>
        <h3>${product.name}</h3>
        <div class="product-card__bottom">
          <strong>${formatPrice(product.price)}</strong>
          <div class="product-card__buttons">
            <button class="btn btn--light add-card-btn" data-id="${product._id}" type="button" ${product.stock <= 0 ? 'disabled' : ''}>${product.stock > 0 ? 'Agregar' : 'Sin stock'}</button>
            <a href="producto.html?id=${product._id}" class="btn btn--dark">Ver</a>
          </div>
        </div>
      </div>
    </article>
  `).join("");

  document.querySelectorAll(".add-card-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const product = products.find((item) => item._id === button.dataset.id);
      if (product) addToCart(product);
    });
  });
}

export async function loadProducts() {
  if (!elements.productsContainer) return;
  renderMessage(elements.productsContainer, { title: "Cargando productos", text: "Esperá un momento..." });
  try {
    const params = new URLSearchParams();
    if (state.currentCategory !== "all") params.append("category", state.currentCategory);
    if (state.currentSearch.trim()) params.append("search", state.currentSearch.trim());
    const url = params.toString() ? `${PRODUCTS_API_URL}?${params.toString()}` : PRODUCTS_API_URL;
    const data = await apiFetch(url);
    renderProducts(data.data || []);
  } catch (error) {
    renderMessage(elements.productsContainer, {
      title: "No se pudieron cargar los productos",
      text: error.message,
      actionText: "Reintentar",
      actionHandler: loadProducts,
    });
  }
}

export function renderProductDetail(product) {
  if (!elements.productDetailContainer) return;
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}`;
  elements.productDetailContainer.innerHTML = `
    <div class="product-detail-card fade-up visible">
      <div class="product-detail-card__gallery">
        <div class="product-detail-card__image">
          <img src="${product.image}" alt="${product.name}" onerror="this.onerror=null;this.src='img/placeholder.jpg';" />
        </div>
      </div>
      <div class="product-detail-card__info">
        <div class="product-detail-card__top">
          <span class="product-detail-card__category">${product.category}</span>
          <h2>${product.name}</h2>
          <p class="product-detail-card__description">${product.description}</p>
        </div>
        <div class="product-detail-card__price-row">
          <strong>${formatPrice(product.price)}</strong>
          <span class="product-detail-card__stock ${product.stock > 0 ? "in-stock" : "out-stock"}">${product.stock > 0 ? "En stock" : "Sin stock"}</span>
        </div>
        <div class="sizes">
          <button type="button">Talle S</button>
          <button class="active" type="button">Talle M</button>
          <button type="button">Talle L</button>
          <button type="button">Talle XL</button>
        </div>
        <div class="product-detail-card__actions">
          <button class="btn btn--dark add-dynamic-cart" type="button" ${product.stock <= 0 ? 'disabled' : ''}>${product.stock > 0 ? 'Agregar al carrito' : 'Sin stock'}</button>
          <a href="${whatsappHref}" target="_blank" rel="noopener noreferrer" class="btn btn--light">Consultar por WhatsApp</a>
        </div>
        <div class="product-detail-card__meta">
          <div class="product-meta-box"><h3>Categoría</h3><p>${product.category}</p></div>
          <div class="product-meta-box"><h3>Stock disponible</h3><p>${product.stock} unidades</p></div>
          <div class="product-meta-box"><h3>Envío</h3><p>Despacho dentro de las 24/48 hs hábiles.</p></div>
        </div>
      </div>
    </div>
  `;

  document.querySelector(".add-dynamic-cart")?.addEventListener("click", () => addToCart(product));
}

export async function loadProductDetail() {
  if (!elements.productDetailContainer) return;
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");
  if (!productId || !isValidObjectId(productId)) {
    renderMessage(elements.productDetailContainer, {
      title: "Producto inválido",
      text: "No se indicó un producto válido.",
      actionText: "Volver al catálogo",
      actionHandler: () => { window.location.href = "catalogo.html"; },
    });
    return;
  }

  renderMessage(elements.productDetailContainer, { title: "Cargando producto", text: "Esperá un momento..." });
  try {
    const data = await apiFetch(`${PRODUCTS_API_URL}/${productId}`);
    renderProductDetail(data.data);
  } catch (error) {
    const isNotFound = error.status === 404;
    renderMessage(elements.productDetailContainer, {
      title: isNotFound ? "Producto no encontrado" : "No se pudo cargar el producto",
      text: isNotFound
        ? "Puede que el producto ya no esté disponible o haya sido removido."
        : error.message,
      actionText: isNotFound ? "Volver al catálogo" : "Reintentar",
      actionHandler: isNotFound
        ? () => { window.location.href = "catalogo.html"; }
        : loadProductDetail,
    });
  }
}
