/* =============================================
   Velmisu — Products, Cart, Orders & WhatsApp
   Edit the products array below to manage menu
   ============================================= */

const WHATSAPP_NUMBER = '212650527938';
const CART_STORAGE_KEY = 'velmisu_cart';

// ── Product List ──────────────────────────────
const products = [
  {
    id: 1,
    name: 'Tiramisu Classique',
    description: 'La recette originale italienne — mascarpone crémeux, espresso intense et cacao amer.',
    price: 30,
    image: 'IMG_6004.JPG',
    tag: 'Best-seller',
  },
  {
    id: 2,
    name: 'Tiramisu Pistache',
    description: 'Pistaches de Sicile torréfiées, crème mascarpone veloutée et touche de cardamome.',
    price: 30,
    image: 'IMG_6003.JPG',
    tag: 'Premium',
  },
  {
    id: 3,
    name: 'Tiramisu Fraise',
    description: 'Fraises fraîches de saison, coulis maison et biscuits imbibés de liqueur de fraise.',
    price: 50,
    image: 'images/tiramisu-fraise.jpg',
    tag: 'Saison',
  },
  {
    id: 4,
    name: 'Tiramisu Chocolat',
    description: 'Chocolat noir 70%, ganache onctueuse et double dose de cacao pour les amateurs.',
    price: 50,
    image: 'images/tiramisu-chocolat.jpg',
    tag: 'Intense',
  },
  {
    id: 5,
    name: 'Tiramisu Speculoos',
    description: 'Biscuits speculoos caramélisés, crème vanillée et caramel beurre salé maison.',
    price: 48,
    image: 'images/tiramisu-speculoos.jpg',
    tag: 'Gourmand',
  },
  {
    id: 6,
    name: 'Tiramisu Matcha',
    description: 'Matcha japonais premium, mascarpone léger et biscuit au thé vert.',
    price: 52,
    image: 'images/tiramisu-matcha.jpg',
    tag: 'Exotique',
  },
];

// ── DOM Elements ──────────────────────────────
const productsGrid = document.getElementById('productsGrid');
const orderModal = document.getElementById('orderModal');
const orderForm = document.getElementById('orderForm');
const modalClose = document.getElementById('modalClose');
const modalProductPrice = document.getElementById('modalProductPrice');
const modalCartSummary = document.getElementById('modalCartSummary');
const orderProductId = document.getElementById('orderProductId');
const orderMode = document.getElementById('orderMode');
const orderQty = document.getElementById('orderQty');
const qtyMinus = document.getElementById('qtyMinus');
const qtyPlus = document.getElementById('qtyPlus');
const qtyFormGroup = orderQty.closest('.form-group');
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
const ctaBtn = document.getElementById('ctaBtn');
const header = document.getElementById('header');
const cartBtn = document.getElementById('cartBtn');
const cartBadge = document.getElementById('cartBadge');
const cartOverlay = document.getElementById('cartOverlay');
const cartClose = document.getElementById('cartClose');
const cartItems = document.getElementById('cartItems');
const cartEmpty = document.getElementById('cartEmpty');
const cartFooter = document.getElementById('cartFooter');
const cartTotal = document.getElementById('cartTotal');
const cartCheckoutBtn = document.getElementById('cartCheckoutBtn');
const cartBrowseBtn = document.getElementById('cartBrowseBtn');

let selectedProduct = null;
let cart = loadCart();

// ── Cart Storage ──────────────────────────────
function loadCart() {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveCart() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

function getProductById(id) {
  return products.find((p) => p.id === id);
}

function getCartItemCount() {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function getCartSubtotal() {
  return cart.reduce((sum, item) => {
    const product = getProductById(item.id);
    return product ? sum + product.price * item.quantity : sum;
  }, 0);
}

function addToCart(productId) {
  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.quantity = Math.min(20, existing.quantity + 1);
  } else {
    cart.push({ id: productId, quantity: 1 });
  }
  saveCart();
  updateCartUI();
  bumpCartBadge();
}

function updateCartQuantity(productId, delta) {
  const item = cart.find((i) => i.id === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    cart = cart.filter((i) => i.id !== productId);
  } else {
    item.quantity = Math.min(20, item.quantity);
  }
  saveCart();
  updateCartUI();
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  saveCart();
  updateCartUI();
}

function clearCart() {
  cart = [];
  saveCart();
  updateCartUI();
}

// ── Cart UI ───────────────────────────────────
function bumpCartBadge() {
  cartBadge.classList.add('bump');
  setTimeout(() => cartBadge.classList.remove('bump'), 200);
}

function updateCartBadge() {
  const count = getCartItemCount();
  cartBadge.textContent = count;
  cartBadge.dataset.count = count;
}

function renderCartItems() {
  if (cart.length === 0) {
    cartEmpty.style.display = 'flex';
    cartItems.innerHTML = '';
    cartFooter.classList.remove('visible');
    return;
  }

  cartEmpty.style.display = 'none';
  cartFooter.classList.add('visible');

  cartItems.innerHTML = cart.map((item) => {
    const product = getProductById(item.id);
    if (!product) return '';

    const lineTotal = product.price * item.quantity;
    return `
      <li class="cart-item" data-cart-id="${product.id}">
        <img
          src="${product.image}"
          alt="${product.name}"
          class="cart-item-image"
          loading="lazy"
          onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
        >
        <div class="cart-item-image-fallback" style="display:none;">V</div>
        <div class="cart-item-details">
          <h3 class="cart-item-name">${product.name}</h3>
          <p class="cart-item-price">${product.price} DH × ${item.quantity} = ${lineTotal} DH</p>
          <div class="cart-item-controls">
            <div class="cart-qty-control">
              <button type="button" class="cart-qty-btn" data-action="decrease" data-id="${product.id}" aria-label="Diminuer">−</button>
              <span class="cart-qty-value">${item.quantity}</span>
              <button type="button" class="cart-qty-btn" data-action="increase" data-id="${product.id}" aria-label="Augmenter">+</button>
            </div>
            <button type="button" class="cart-item-remove" data-action="remove" data-id="${product.id}">Supprimer</button>
          </div>
        </div>
      </li>
    `;
  }).join('');

  cartTotal.textContent = `${getCartSubtotal()} DH`;
}

function updateCartUI() {
  updateCartBadge();
  renderCartItems();
}

function openCart() {
  cartOverlay.classList.add('active');
  cartOverlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  cartOverlay.classList.remove('active');
  cartOverlay.setAttribute('aria-hidden', 'true');
  if (!orderModal.classList.contains('active')) {
    document.body.style.overflow = '';
  }
}

cartBtn.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', (e) => {
  if (e.target === cartOverlay) closeCart();
});

cartBrowseBtn.addEventListener('click', () => {
  closeCart();
  document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
});

cartItems.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;

  const productId = Number(btn.dataset.id);
  const action = btn.dataset.action;

  if (action === 'increase') updateCartQuantity(productId, 1);
  else if (action === 'decrease') updateCartQuantity(productId, -1);
  else if (action === 'remove') removeFromCart(productId);
});

cartCheckoutBtn.addEventListener('click', () => {
  if (cart.length === 0) return;
  closeCart();
  openCartOrderModal();
});

// ── Render Products ───────────────────────────
function renderProducts() {
  productsGrid.innerHTML = products.map((product) => `
    <article class="product-card" data-id="${product.id}">
      <div class="product-image-wrap">
        <img
          src="${product.image}"
          alt="${product.name}"
          class="product-image"
          loading="lazy"
          onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
        >
        <div class="product-image-fallback" style="display:none;">V</div>
      </div>
      <div class="product-body">
        ${product.tag ? `<span class="product-tag">${product.tag}</span>` : ''}
        <h3 class="product-name">${product.name}</h3>
        <p class="product-desc">${product.description}</p>
        <div class="product-footer">
          <p class="product-price">${product.price} <span>DH</span></p>
          <div class="product-actions">
            <button class="btn btn-primary btn-cart" data-add-cart="${product.id}">Ajouter au panier</button>
            <button class="btn btn-outline btn-order" data-order="${product.id}">Commander</button>
          </div>
        </div>
      </div>
    </article>
  `).join('');

  productsGrid.querySelectorAll('[data-order]').forEach((btn) => {
    btn.addEventListener('click', () => openOrderModal(Number(btn.dataset.order)));
  });

  productsGrid.querySelectorAll('[data-add-cart]').forEach((btn) => {
    btn.addEventListener('click', () => addToCart(Number(btn.dataset.addCart)));
  });
}

// ── Order Modal ───────────────────────────────
function setModalMode(mode) {
  orderMode.value = mode;
  const isCart = mode === 'cart';
  const modalTitle = document.getElementById('modalTitle');

  if (isCart) {
    modalTitle.textContent = 'Valider votre commande';
    modalProductPrice.style.display = 'none';
  } else {
    modalTitle.innerHTML = 'Tlab <span id="modalProductName"></span>';
    modalProductPrice.style.display = '';
  }

  modalCartSummary.hidden = !isCart;
  qtyFormGroup.classList.toggle('hidden', isCart);
}

function openOrderModal(productId) {
  selectedProduct = products.find((p) => p.id === productId);
  if (!selectedProduct) return;

  setModalMode('single');
  const nameEl = document.getElementById('modalProductName');
  orderProductId.value = selectedProduct.id;
  if (nameEl) nameEl.textContent = selectedProduct.name;
  modalProductPrice.textContent = `${selectedProduct.price} DH / unité`;
  orderQty.value = 1;
  orderForm.reset();
  orderProductId.value = selectedProduct.id;
  orderQty.value = 1;

  orderModal.classList.add('active');
  orderModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function openCartOrderModal() {
  selectedProduct = null;
  setModalMode('cart');

  modalCartSummary.innerHTML = `
    ${cart.map((item) => {
      const product = getProductById(item.id);
      if (!product) return '';
      return `<div class="cart-line"><span>${product.name} × ${item.quantity}</span><span>${product.price * item.quantity} DH</span></div>`;
    }).join('')}
    <div class="cart-line cart-line-total"><span>Total</span><span>${getCartSubtotal()} DH</span></div>
  `;

  orderForm.reset();
  orderModal.classList.add('active');
  orderModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeOrderModal() {
  orderModal.classList.remove('active');
  orderModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  selectedProduct = null;
}

modalClose.addEventListener('click', closeOrderModal);

orderModal.addEventListener('click', (e) => {
  if (e.target === orderModal) closeOrderModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (orderModal.classList.contains('active')) closeOrderModal();
    else if (cartOverlay.classList.contains('active')) closeCart();
  }
});

// ── Quantity Controls ─────────────────────────
qtyMinus.addEventListener('click', () => {
  const val = Math.max(1, Number(orderQty.value) - 1);
  orderQty.value = val;
});

qtyPlus.addEventListener('click', () => {
  const val = Math.min(20, Number(orderQty.value) + 1);
  orderQty.value = val;
});

// ── WhatsApp Order ────────────────────────────
function buildWhatsAppMessage(product, quantity, name, address, phone) {
  const total = product.price * quantity;

  return [
    'Commande Velmisu',
    '━━━━━━━━━━━━━━━━',
    '',
    `Produit: ${product.name}`,
    `Quantité: ${quantity}`,
    `*Prix unitaire: ${product.price} DH`,
    `*Total:* ${total} DH`,
    '',
    '━━━━━━━━━━━━━━━━',
    'Informations client',
    '',
    `nom: ${name}`,
    `adresse: ${address}`,
    `num telephone: ${phone}`,
    '',
    '━━━━━━━━━━━━━━━━',
    'Merci pour votre commande! ',
  ].join('\n');
}

function buildCartWhatsAppMessage(name, address, phone) {
  const lines = cart.map((item) => {
    const product = getProductById(item.id);
    if (!product) return null;
    return `${product.name} × ${item.quantity} — ${product.price * item.quantity} DH`;
  }).filter(Boolean);

  return [
    'Commande Velmisu (Panier)',
    '━━━━━━━━━━━━━━━━',
    '',
    ...lines,
    '',
    `*Total:* ${getCartSubtotal()} DH`,
    '',
    '━━━━━━━━━━━━━━━━',
    'Informations client',
    '',
    `nom: ${name}`,
    `adresse: ${address}`,
    `num telephone: ${phone}`,
    '',
    '━━━━━━━━━━━━━━━━',
    'Merci pour votre commande! ',
  ].join('\n');
}

orderForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('orderName').value.trim();
  const address = document.getElementById('orderAddress').value.trim();
  const phone = document.getElementById('orderPhone').value.trim();

  let message;

  if (orderMode.value === 'cart') {
    if (cart.length === 0) return;
    message = buildCartWhatsAppMessage(name, address, phone);
  } else {
    const product = products.find((p) => p.id === Number(orderProductId.value));
    if (!product) return;
    const quantity = Number(orderQty.value);
    message = buildWhatsAppMessage(product, quantity, name, address, phone);
  }

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');

  if (orderMode.value === 'cart') clearCart();
  closeOrderModal();
});

// ── Navigation ────────────────────────────────
menuBtn.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuBtn.classList.toggle('active', isOpen);
  menuBtn.setAttribute('aria-expanded', isOpen);
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuBtn.classList.remove('active');
    menuBtn.setAttribute('aria-expanded', 'false');
  });
});

ctaBtn.addEventListener('click', () => {
  document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
});

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
});

// ── Init ──────────────────────────────────────
renderProducts();
updateCartUI();
