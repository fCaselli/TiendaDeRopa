export function setupDom({ url = 'http://localhost:5500/', ids = [] } = {}) {
  class FakeElement {
    constructor(tagName = 'div', id = null) {
      this.tagName = tagName.toUpperCase();
      this.id = id;
      this.children = [];
      this.attributes = {};
      this.dataset = {};
      this.className = '';
      this.textContent = '';
      this.innerHTML = '';
      this.value = '';
      this.disabled = false;
      this.listeners = {};
    }

    appendChild(child) {
      this.children.push(child);
      return child;
    }

    setAttribute(name, value) {
      this.attributes[name] = String(value);
    }

    getAttribute(name) {
      return this.attributes[name];
    }

    addEventListener(type, handler) {
      this.listeners[type] = handler;
    }

    querySelector() {
      return null;
    }

    querySelectorAll() {
      return [];
    }

    insertAdjacentElement(_position, element) {
      this.children.push(element);
      return element;
    }

    remove() {
      this.removed = true;
    }

    reset() {
      this.value = '';
    }

    classList = {
      add: () => {},
      remove: () => {},
      toggle: () => {},
    };
  }

  const elementsById = new Map();
  ids.forEach((id) => elementsById.set(id, new FakeElement('div', id)));

  const body = new FakeElement('body', 'body');

  const document = {
    body,
    getElementById(id) {
      return elementsById.get(id) || null;
    },
    querySelector(selector) {
      if (selector === '.toast') {
        return body.children.find((child) => child.className === 'toast') || null;
      }
      return null;
    },
    querySelectorAll(selector) {
      if (selector === '#cart-count') {
        return Array.from(elementsById.values()).filter((el) => el.id === 'cart-count');
      }
      return [];
    },
    createElement(tagName) {
      return new FakeElement(tagName);
    },
  };

  const storage = new Map();
  const localStorage = {
    getItem(key) {
      return storage.has(key) ? storage.get(key) : null;
    },
    setItem(key, value) {
      storage.set(key, String(value));
    },
    removeItem(key) {
      storage.delete(key);
    },
    clear() {
      storage.clear();
    },
  };

  const window = {
    location: new URL(url),
    openCalls: [],
    open(...args) {
      this.openCalls.push(args);
    },
  };

  global.document = document;
  global.window = window;
  global.localStorage = localStorage;
  global.clearTimeout = () => {};
  global.setTimeout = (fn) => {
    fn.__fakeTimeout = true;
    return fn;
  };
  global.IntersectionObserver = class {
    observe() {}
    unobserve() {}
  };

  return { document, window, localStorage, elementsById, FakeElement };
}

export async function importFresh(relativePath) {
  const url = new URL(relativePath, import.meta.url);
  return import(`${url.href}?t=${Date.now()}-${Math.random()}`);
}
