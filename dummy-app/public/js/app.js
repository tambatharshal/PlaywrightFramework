const STORAGE_KEY = 'dummy_cart';
const SESSION_KEY = 'dummy_session';

const PRODUCTS = [
  { id: 1, name: 'Sauce Labs Backpack', price: 29.99, desc: 'Carry all your samples' },
  { id: 2, name: 'Sauce Labs Bike Light', price: 9.99, desc: 'A red light for night rides' },
  { id: 3, name: 'Sauce Labs Bolt T-Shirt', price: 15.99, desc: 'Get your testing superhero on' },
  { id: 4, name: 'Sauce Labs Fleece Jacket', price: 49.99, desc: 'Fleece for cool evenings' },
  { id: 5, name: 'Sauce Labs Onesie', price: 7.99, desc: 'Infant onesie for tiny testers' },
  { id: 6, name: 'Test.allTheThings() T-Shirt', price: 15.99, desc: 'Classic QA tee' },
];

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function setCart(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  updateCartBadge();
}

function requireAuth() {
  if (!sessionStorage.getItem(SESSION_KEY)) {
    window.location.href = '/';
  }
}

function updateCartBadge() {
  const badge = document.querySelector('.shopping_cart_badge');
  if (!badge) return;
  const count = getCart().length;
  if (count === 0) {
    badge.style.display = 'none';
    badge.textContent = '';
  } else {
    badge.style.display = 'inline-block';
    badge.textContent = String(count);
  }
}

function showError(message) {
  let el = document.querySelector('[data-test="error"]');
  if (!el) {
    el = document.createElement('div');
    el.setAttribute('data-test', 'error');
    el.className = 'error';
    const form = document.querySelector('form') || document.body;
    form.appendChild(el);
  }
  el.textContent = message;
  el.style.display = 'block';
}

function initLogin() {
  const form = document.querySelector('#login-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.querySelector('#user-name').value.trim();
    const password = document.querySelector('#password').value;

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const body = await res.json();
    if (!res.ok) {
      showError(body.error || 'Login failed');
      return;
    }
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(body));
    window.location.href = '/inventory.html';
  });
}

function initInventory() {
  const list = document.querySelector('.inventory_list');
  if (!list) return;
  requireAuth();

  const sortSelect = document.querySelector('[data-test="product-sort-container"]');
  let products = [...PRODUCTS];

  function render() {
    list.innerHTML = products
      .map(
        (p) => `
      <div class="inventory_item">
        <div class="inventory_item_name">${p.name}</div>
        <div class="inventory_item_desc">${p.desc}</div>
        <div class="inventory_item_price">$${p.price.toFixed(2)}</div>
        <button data-test="add-to-cart-${p.id}" data-id="${p.id}">Add to cart</button>
      </div>`,
      )
      .join('');

    list.querySelectorAll('button').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = Number(btn.getAttribute('data-id'));
        const product = PRODUCTS.find((x) => x.id === id);
        const cart = getCart();
        cart.push(product);
        setCart(cart);
        btn.textContent = 'Remove';
      });
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      const value = sortSelect.value;
      products = [...PRODUCTS];
      if (value === 'az') products.sort((a, b) => a.name.localeCompare(b.name));
      if (value === 'za') products.sort((a, b) => b.name.localeCompare(a.name));
      if (value === 'lohi') products.sort((a, b) => a.price - b.price);
      if (value === 'hilo') products.sort((a, b) => b.price - a.price);
      render();
    });
  }

  render();
  updateCartBadge();
  initMenu();
}

function initCart() {
  const container = document.querySelector('.cart_list');
  if (!container) return;
  requireAuth();

  const cart = getCart();
  container.innerHTML = cart
    .map(
      (item, index) => `
    <div class="cart_item">
      <div class="inventory_item_name">${item.name}</div>
      <div class="inventory_item_price">$${item.price.toFixed(2)}</div>
      <button data-index="${index}">Remove</button>
    </div>`,
    )
    .join('');

  container.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const next = getCart();
      next.splice(Number(btn.getAttribute('data-index')), 1);
      setCart(next);
      window.location.reload();
    });
  });

  const checkout = document.querySelector('[data-test="checkout"]');
  if (checkout) {
    checkout.addEventListener('click', () => {
      window.location.href = '/checkout-step-one.html';
    });
  }

  updateCartBadge();
  initMenu();
}

function initCheckoutInfo() {
  const form = document.querySelector('#checkout-info-form');
  if (!form) return;
  requireAuth();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const firstName = document.querySelector('[data-test="firstName"]').value.trim();
    const lastName = document.querySelector('[data-test="lastName"]').value.trim();
    const postalCode = document.querySelector('[data-test="postalCode"]').value.trim();

    if (!firstName) return showError('Error: First Name is required');
    if (!lastName) return showError('Error: Last Name is required');
    if (!postalCode) return showError('Error: Postal Code is required');

    sessionStorage.setItem(
      'dummy_checkout',
      JSON.stringify({ firstName, lastName, postalCode }),
    );
    window.location.href = '/checkout-step-two.html';
  });

  updateCartBadge();
}

function initCheckoutOverview() {
  const list = document.querySelector('.cart_list');
  if (!list || !document.querySelector('[data-test="finish"]')) return;
  requireAuth();

  const cart = getCart();
  list.innerHTML = cart
    .map(
      (item) => `
    <div class="cart_item">
      <div class="inventory_item_name">${item.name}</div>
      <div class="inventory_item_price">$${item.price.toFixed(2)}</div>
    </div>`,
    )
    .join('');

  const subtotal = cart.reduce((sum, i) => sum + i.price, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const subEl = document.querySelector('.summary_subtotal_label');
  const taxEl = document.querySelector('.summary_tax_label');
  const totalEl = document.querySelector('.summary_total_label');
  if (subEl) subEl.textContent = `Item total: $${subtotal.toFixed(2)}`;
  if (taxEl) taxEl.textContent = `Tax: $${tax.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `Total: $${total.toFixed(2)}`;

  document.querySelector('[data-test="finish"]').addEventListener('click', async () => {
    const customer = JSON.parse(sessionStorage.getItem('dummy_checkout') || '{}');
    await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cart, customer }),
    });
    setCart([]);
    window.location.href = '/checkout-complete.html';
  });

  updateCartBadge();
}

function initCheckoutComplete() {
  if (!document.querySelector('.complete-header')) return;
  requireAuth();
  const back = document.querySelector('[data-test="back-to-products"]');
  if (back) {
    back.addEventListener('click', () => {
      window.location.href = '/inventory.html';
    });
  }
}

function initMenu() {
  const btn = document.querySelector('#react-burger-menu-btn');
  const menu = document.querySelector('.bm-menu-wrap');
  const logout = document.querySelector('#logout_sidebar_link');
  if (btn && menu) {
    btn.addEventListener('click', () => menu.classList.toggle('open'));
  }
  if (logout) {
    logout.addEventListener('click', (e) => {
      e.preventDefault();
      sessionStorage.removeItem(SESSION_KEY);
      setCart([]);
      window.location.href = '/';
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initLogin();
  initInventory();
  initCart();
  initCheckoutInfo();
  initCheckoutOverview();
  initCheckoutComplete();
  updateCartBadge();
});
