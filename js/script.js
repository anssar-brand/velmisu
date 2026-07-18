/* =============================================
   Velmisu — Products, Orders & WhatsApp
   Edit the products array below to manage menu
   ============================================= */

const WHATSAPP_NUMBER = '212650527938';

// ── Product List ──────────────────────────────
// Add, remove, or edit items here easily
const products = [
  {
    id: 1,
    name: 'Tiramisu Classique',
    description: 'La recette originale italienne — mascarpone crémeux, espresso intense et cacao amer.',
    price: 45,
    image: 'images/tiramisu-classique.jpg',
    tag: 'Best-seller',
  },
  {
    id: 2,
    name: 'Tiramisu Pistache',
    description: 'Pistaches de Sicile torréfiées, crème mascarpone veloutée et touche de cardamome.',
    price: 55,
    image: 'images/tiramisu-pistache.jpg',
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
const modalProductName = document.getElementById('modalProductName');
const modalProductPrice = document.getElementById('modalProductPrice');
const orderProductId = document.getElementById('orderProductId');
const orderQty = document.getElementById('orderQty');
const qtyMinus = document.getElementById('qtyMinus');
const qtyPlus = document.getElementById('qtyPlus');
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
const ctaBtn = document.getElementById('ctaBtn');
const header = document.getElementById('header');

let selectedProduct = null;

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
          <button class="btn btn-primary btn-order" data-order="${product.id}">Order</button>
        </div>
      </div>
    </article>
  `).join('');

  productsGrid.querySelectorAll('[data-order]').forEach((btn) => {
    btn.addEventListener('click', () => openOrderModal(Number(btn.dataset.order)));
  });
}

// ── Order Modal ───────────────────────────────
function openOrderModal(productId) {
  selectedProduct = products.find((p) => p.id === productId);
  if (!selectedProduct) return;

  orderProductId.value = selectedProduct.id;
  modalProductName.textContent = selectedProduct.name;
  modalProductPrice.textContent = `${selectedProduct.price} DH / unité`;
  orderQty.value = 1;
  orderForm.reset();
  orderProductId.value = selectedProduct.id;
  orderQty.value = 1;

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
  if (e.key === 'Escape' && orderModal.classList.contains('active')) {
    closeOrderModal();
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
    `*Prix unitaire:* ${product.price} DH`,
    `*Total:* ${total} DH`,
    '',
    '━━━━━━━━━━━━━━━━',
    '*Informations client*',
    '',
    `*Smiya:* ${name}`,
    `*L-inwan:* ${address}`,
    `*Ra9m l-hatif:* ${phone}`,
    '',
    '━━━━━━━━━━━━━━━━',
    'Merci pour votre commande! 🙏',
  ].join('\n');
}

orderForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const product = products.find((p) => p.id === Number(orderProductId.value));
  if (!product) return;

  const name = document.getElementById('orderName').value.trim();
  const address = document.getElementById('orderAddress').value.trim();
  const phone = document.getElementById('orderPhone').value.trim();
  const quantity = Number(orderQty.value);

  const message = buildWhatsAppMessage(product, quantity, name, address, phone);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  window.open(url, '_blank');
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
