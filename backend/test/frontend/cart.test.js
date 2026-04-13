import test from 'node:test';
import assert from 'node:assert/strict';
import { importFresh, setupDom } from './test-helpers.js';

test('addToCart guarda el producto y actualiza el contador', async () => {
  const { elementsById, localStorage } = setupDom({ ids: ['cart-count'] });
  const cartModule = await importFresh('./../../../frontend/js/modules/cart.js');

  cartModule.addToCart({
    _id: 'p1',
    name: 'Blazer',
    price: 100,
    image: 'img/a.jpg',
    category: 'Sacos',
    stock: 3,
  });

  const cart = JSON.parse(localStorage.getItem('cart'));
  assert.equal(cart.length, 1);
  assert.equal(cart[0].quantity, 1);
  assert.equal(elementsById.get('cart-count').textContent, 1);
});

test('addToCart no supera el stock disponible', async () => {
  const { localStorage } = setupDom({ ids: ['cart-count'] });
  const cartModule = await importFresh('./../../../frontend/js/modules/cart.js');

  const product = {
    _id: 'p1',
    name: 'Blazer',
    price: 100,
    image: 'img/a.jpg',
    category: 'Sacos',
    stock: 2,
  };

  cartModule.addToCart(product);
  cartModule.addToCart(product);
  cartModule.addToCart(product);

  const cart = JSON.parse(localStorage.getItem('cart'));
  assert.equal(cart[0].quantity, 2);
});

test('buildCheckoutWhatsappUrl arma un mensaje con items y total', async () => {
  setupDom({ ids: ['cart-count'] });
  const cartModule = await importFresh('./../../../frontend/js/modules/cart.js');

  const url = cartModule.buildCheckoutWhatsappUrl([
    {
      _id: 'p1',
      name: 'Blazer',
      price: 100000,
      image: 'img/a.jpg',
      category: 'Sacos',
      stock: 3,
      quantity: 2,
    },
  ]);

  assert.match(url, /^https:\/\/wa\.me\//);
  assert.match(decodeURIComponent(url), /Blazer x2/);
  assert.match(decodeURIComponent(url), /Total:/);
});
