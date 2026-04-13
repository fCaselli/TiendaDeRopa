import test from 'node:test';
import assert from 'node:assert/strict';
import { importFresh, setupDom } from './test-helpers.js';

test('renderMessage dibuja acción y ejecuta el handler', async () => {
  const { FakeElement } = setupDom();
  const uiModule = await importFresh('./../../../frontend/js/modules/ui.js');

  const button = new FakeElement('button');
  const container = new FakeElement('div');
  container.querySelector = (selector) => {
    if (selector === '.state-card') return new FakeElement('div');
    if (selector === '.state-retry-btn') return button;
    return null;
  };

  let executed = false;
  uiModule.renderMessage(container, {
    title: 'Error',
    text: 'Falló la carga',
    actionText: 'Reintentar',
    actionHandler: () => {
      executed = true;
    },
  });

  assert.match(container.innerHTML, /Reintentar/);
  button.listeners.click();
  assert.equal(executed, true);
});

test('setFieldError marca el campo con aria-invalid y relación descriptiva', async () => {
  const { FakeElement } = setupDom();
  const uiModule = await importFresh('./../../../frontend/js/modules/ui.js');

  const input = new FakeElement('input', 'email');
  uiModule.setFieldError(input, 'Email inválido');

  assert.equal(input.attributes['aria-invalid'], 'true');
  assert.equal(input.attributes['aria-describedby'], 'email-error');
  assert.equal(input.children[0].id, 'email-error');
});
