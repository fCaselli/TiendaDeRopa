import test from 'node:test';
import assert from 'node:assert/strict';
import { importFresh, setupDom } from './test-helpers.js';

test('render de productos y detalle mantiene links y datos clave', async () => {
  const { elementsById } = setupDom({ ids: ['products-container', 'product-detail-container'] });
  const productsModule = await importFresh('./../../../frontend/js/modules/products.js');

  productsModule.renderProducts([
    {
      _id: '507f1f77bcf86cd799439011',
      name: 'Tapado',
      price: 250000,
      image: 'img/tapado.jpg',
      category: 'Abrigos',
      stock: 4,
    },
  ]);

  const listHtml = elementsById.get('products-container').innerHTML;
  assert.match(listHtml, /producto\.html\?id=507f1f77bcf86cd799439011/);
  assert.match(listHtml, /Agregar/);

  productsModule.renderProductDetail({
    _id: '507f1f77bcf86cd799439011',
    name: 'Tapado premium',
    description: 'Lana italiana',
    price: 250000,
    image: 'img/tapado.jpg',
    category: 'Abrigos',
    stock: 4,
  });

  const detailHtml = elementsById.get('product-detail-container').innerHTML;
  assert.match(detailHtml, /Tapado premium/);
  assert.match(detailHtml, /4 unidades/);
  assert.match(detailHtml, /Consultar por WhatsApp/);

  productsModule.renderProducts([]);
  const emptyHtml = elementsById.get('products-container').innerHTML;
  assert.match(emptyHtml, /No se encontraron productos/);
  assert.match(emptyHtml, /Probá con otra búsqueda/);
});
