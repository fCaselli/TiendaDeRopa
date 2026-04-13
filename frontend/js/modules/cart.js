import { elements } from "./dom.js";
import { WHATSAPP_NUMBER } from "./config.js";
import { formatPrice, renderMessage, showToast } from "./ui.js";

export function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

export function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

export function updateCartCount() {
  const totalItems = getCart().reduce((acc, item) => acc + item.quantity, 0);
  elements.cartCountElements.forEach((el) => {
    el.textContent = totalItems;
  });
}

export function addToCart(product) {
  const cart = getCart();
  const existingProduct = cart.find((item) => item._id === product._id);

  if (product.stock <= 0) {
    showToast("Este producto no tiene stock disponible");
    return;
  }

  if (existingProduct) {
    if (existingProduct.quantity >= product.stock) {
      showToast("No podés agregar más unidades que el stock disponible");
      return;
    }
    existingProduct.quantity += 1;
  } else {
    cart.push({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      stock: product.stock,
      quantity: 1,
    });
  }

  saveCart(cart);
  showToast("Producto agregado al carrito");
}

export function removeFromCart(productId) {
  const cart = getCart().filter((item) => item._id !== productId);
  saveCart(cart);
  renderCart();
}

export function increaseQuantity(productId) {
  const cart = getCart();
  const product = cart.find((item) => item._id === productId);
  if (!product) return;
  if (product.quantity >= product.stock) {
    showToast("No podés superar el stock disponible");
    return;
  }
  product.quantity += 1;
  saveCart(cart);
  renderCart();
}

export function decreaseQuantity(productId) {
  const cart = getCart();
  const product = cart.find((item) => item._id === productId);
  if (!product) return;
  product.quantity -= 1;
  if (product.quantity <= 0) {
    removeFromCart(productId);
    return;
  }
  saveCart(cart);
  renderCart();
}

export function clearCart() {
  localStorage.removeItem("cart");
  updateCartCount();
  renderCart();
}

export function buildCheckoutWhatsappUrl(cart = getCart()) {
  if (!cart.length) return null;
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const message = `Hola! Quiero hacer un pedido:\n\n${cart.map((item) => `- ${item.name} x${item.quantity} (${formatPrice(item.price * item.quantity)})`).join("\n")}\n\nTotal: ${formatPrice(subtotal)}`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function checkoutByWhatsapp() {
  const cart = getCart();
  if (!cart.length) {
    showToast("Tu carrito está vacío");
    return;
  }

  const url = buildCheckoutWhatsappUrl(cart);
  window.open(url, "_blank", "noopener,noreferrer");
}

export function renderCart() {
  if (!elements.cartContainer) return;
  const cart = getCart();

  if (!cart.length) {
    renderMessage(elements.cartContainer, {
      title: "Tu carrito está vacío",
      text: "Agregá productos desde el catálogo para empezar tu pedido.",
      actionText: "Ir al catálogo",
      actionHandler: () => { window.location.href = "catalogo.html"; },
    });
    if (elements.cartSubtotal) elements.cartSubtotal.textContent = formatPrice(0);
    return;
  }

  elements.cartContainer.innerHTML = `
    <div class="cart-list">
      ${cart.map((item) => `
        <article class="cart-item">
          <div class="cart-item__image">
            <img src="${item.image}" alt="${item.name}" onerror="this.onerror=null;this.src='img/placeholder.jpg';" />
          </div>
          <div class="cart-item__content">
            <p class="cart-item__category">${item.category}</p>
            <h3>${item.name}</h3>
            <strong>${formatPrice(item.price)}</strong>
            <small>Stock disponible: ${item.stock}</small>
            <div class="cart-item__controls">
              <button class="qty-btn" data-action="decrease" data-id="${item._id}" type="button">−</button>
              <span>${item.quantity}</span>
              <button class="qty-btn" data-action="increase" data-id="${item._id}" type="button" ${item.quantity >= item.stock ? 'disabled' : ''}>+</button>
            </div>
          </div>
          <div class="cart-item__side">
            <p class="cart-item__total">${formatPrice(item.price * item.quantity)}</p>
            <button class="cart-remove" data-id="${item._id}" type="button">Eliminar</button>
          </div>
        </article>
      `).join("")}
    </div>
  `;

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  if (elements.cartSubtotal) elements.cartSubtotal.textContent = formatPrice(subtotal);

  document.querySelectorAll(".qty-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.action;
      const id = button.dataset.id;
      if (action === "increase") increaseQuantity(id);
      if (action === "decrease") decreaseQuantity(id);
    });
  });

  document.querySelectorAll(".cart-remove").forEach((button) => {
    button.addEventListener("click", () => removeFromCart(button.dataset.id));
  });
}
