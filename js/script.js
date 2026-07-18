/* =============================================
   Velmisu — Products & Order Logic
   Edit the products array below to manage menu
   ============================================= */

const WHATSAPP_NUMBER = '212650527938';

const products = [
  {
    id: 'classic',
    name: 'Tiramisu Classique',
    description: 'Mascarpone crémeux, café espresso, cacao pur. L\'original intemporel.',
    price: 65,
    currency: 'DH',
    image: 'images/tiramisu-classic.jpg',
    tag: 'Best-seller',
  },
  {
    id: 'pistache',
    name: 'Tiramisu Pistache',
    description: 'Pistache de Sicile, crème onctueuse, touche de miel. Un délice oriental.',
    price: 75,
    currency: 'DH',
    image: 'images/tiramisu-pistache.jpg',
    tag: 'Nouveau',
  },
  {
    id: 'framboise',
    name: 'Tiramisu Framboise',
    description: 'Framboises fraîches, mascarpone vanillé, coulis fruité. Fraîcheur garantie.',
    price: 70,
    currency: 'DH',
    image: 'images/tiramisu-framboise.jpg',
    tag: 'Frais',
  },
  {
    id: 'speculoos',
    name: 'Tiramisu Speculoos',
    description: 'Biscuits speculoos caramélisés, crème mascarpone, caramel beurre salé.',
    price: 72,
    currency: 'DH',
    image: 'images/tiramisu-speculoos.jpg',
    tag: 'Gourmand',
  },
  {
    id: 'nutella',
    name: 'Tiramisu Nutella',
    description: 'Nutella fondante, noisettes grillées, mascarpone velouté. Pour les chocovores.',
    price: 68,
    currency: 'DH',
    image: 'images/tiramisu-nutella.jpg',
    tag: 'Populaire',
  },
  {
    id: 'matcha',
    name: 'Tiramisu Matcha',
    description: 'Thé matcha premium du Japon, crème légère, notes végétales raffinées.',
    price: 78,
    currency: 'DH',
    image: 'images/tiramisu-matcha.jpg',
    tag: 'Premium',
  },
];

/* ---- DOM Elements ---- */
const productsGrid = document.getElementById('productsGrid');
const orderModal = document.getElementById('orderModal');
const modalClose = document.getElementById('modalClose');
const orderForm = document.getElementById('orderForm');
const modalProductName = document.getElementById('modalProductName');
const modalProductPrice = document.getElementById('modalProductPrice');
const orderProductId = document.getElementById('orderProductId');
const orderQty = document.getElementById('orderQty');
const qtyMinus = document.getElementById('qtyMinus');
const qtyPlus = document.getElementById('qtyPlus');
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
const header = document.getElementById('header');
const ctaBtn = document.getElementById('ctaBtn');

let selectedProduct = null;

/* ---- Render Products ---- */
function renderProducts() {
  productsGrid.innerHTML = products
    .map(
      (product) => `
    <article class="product-card" data-id="${product.id}">
      <div class="product-image-wrap">
        <img
          class="product-image"
          src="${product.image}"
          alt="${product.name}"
          loading="lazy"
          onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
        >
        <div class="product-image-fallback" style="display:none;">
          ${product.name.split(' ').pop()}
        </div>
      </div>
      <div class="product-body">
        <span class="product-tag">${product.tag}</span>
        <h3 class="product-name">${product.name}</h3>
        <p class="product-desc">${product.description}</p>
        <div class="product-footer">
          <p class="product-price">${product.price} <span>${product.currency}</span></p>
          <button class="btn btn-primary btn-order" data-order="${product.id}">
            Order
          </button>
        </div>
      </div>
    </article>
  `
    )
    .join('');

  productsGrid.querySelectorAll('[data-order]').forEach((btn) => {
    btn.addEventListener('click', () => openOrderModal(btn.dataset.order));
  });
}

/* ---- Order Modal ---- */
function openOrderModal(productId) {
  selectedProduct = products.find((p) => p.id === productId);
  if (!selectedProduct) return;

  orderProductId.value = selectedProduct.id;
  modalProductName.textContent = selectedProduct.name;
  modalProductPrice.textContent = `${selectedProduct.price} ${selectedProduct.currency}`;
  orderQty.value = 1;

  orderModal.classList.add('active');
  orderModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeOrderModal() {
  orderModal.classList.remove('active');
  orderModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  orderForm.reset();
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

/* ---- Quantity Controls ---- */
qtyMinus.addEventListener('click', () => {
  const val = parseInt(orderQty.value, 10);
  if (val > 1) orderQty.value = val - 1;
});

qtyPlus.addEventListener('click', () => {
  const val = parseInt(orderQty.value, 10);
  if (val < 20) orderQty.value = val + 1;
});

/* ---- WhatsApp Order ---- */
function formatWhatsAppMessage(product, quantity, name, address, phone) {
  const total = product.price * quantity;

  return (
    `🍰 *NOUVELLE COMMANDE — VELMISU*\n` +
    `━━━━━━━━━━━━━━━━━━━━\n\n` +
    `📦 *Produit:* ${product.name}\n` +
    `🔢 *Quantité:* ${quantity}\n` +
    `💰 *Prix unitaire:* ${product.price} ${product.currency}\n` +
    `💵 *Total:* ${total} ${product.currency}\n\n` +
    `👤 *Smiya:* ${name}\n` +
    `📍 *L-inwan:* ${address}\n` +
    `📱 *Ra9m l-hatif:* ${phone}\n\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `_Commande via velmisu.com_`
  );
}

orderForm.addEventListener('submit', (e) => {
  e.preventDefault();

  if (!selectedProduct) return;

  const name = document.getElementById('orderName').value.trim();
  const address = document.getElementById('orderAddress').value.trim();
  const phone = document.getElementById('orderPhone').value.trim();
  const quantity = parseInt(orderQty.value, 10);

  const message = formatWhatsAppMessage(selectedProduct, quantity, name, address, phone);
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  window.open(whatsappUrl, '_blank');
  closeOrderModal();
});

/* ---- Mobile Navigation ---- */
menuBtn.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuBtn.classList.toggle('active');
  menuBtn.setAttribute('aria-expanded', isOpen);
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuBtn.classList.remove('active');
    menuBtn.setAttribute('aria-expanded', 'false');
  });
});

/* ---- Header Scroll Effect ---- */
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
});

/* ---- Smooth Scroll CTA ---- */
ctaBtn.addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
});

/* ---- Init ---- */
renderProducts();
