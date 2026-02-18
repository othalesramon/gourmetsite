const catalog = [
  {
    id: 'qj-brie',
    name: 'Queijo Brie Artesanal',
    category: 'Queijos',
    description: 'Maturado, textura cremosa, 250g.',
    basePrice: 38.9,
  },
  {
    id: 'qj-grana',
    name: 'Queijo Grana Curado',
    category: 'Queijos',
    description: 'Curado por 12 meses, 300g.',
    basePrice: 46.5,
  },
  {
    id: 'vinho-malbec',
    name: 'Vinho Malbec Reserva',
    category: 'Vinhos',
    description: 'Safra premium, garrafa 750ml.',
    basePrice: 95,
  },
  {
    id: 'vinho-branco',
    name: 'Vinho Branco Chardonnay',
    category: 'Vinhos',
    description: 'Notas cítricas e final equilibrado.',
    basePrice: 82,
  },
  {
    id: 'az-italiano',
    name: 'Azeite Extra Virgem Siciliano',
    category: 'Azeites',
    description: 'Acidez 0,2%, garrafa 500ml.',
    basePrice: 42.9,
  },
  {
    id: 'licor-limoncello',
    name: 'Limoncello Artesanal',
    category: 'Bebidas',
    description: 'Produção artesanal, garrafa 700ml.',
    basePrice: 69.9,
  },
];

const stores = {
  'loja-centro': {
    password: 'gourmet123',
    name: 'Revenda Centro',
    description: 'Portfólio completo com foco em vinhos e queijos.',
    whatsapp: '5511999991001',
    allowedProducts: ['qj-brie', 'qj-grana', 'vinho-malbec', 'vinho-branco', 'az-italiano'],
    pricing: {
      'qj-brie': 35.9,
      'qj-grana': 43,
      'vinho-malbec': 89.9,
      'vinho-branco': 77.5,
      'az-italiano': 39.9,
    },
  },
  'loja-zona-sul': {
    password: 'premium456',
    name: 'Revenda Zona Sul',
    description: 'Mix premium de bebidas e itens importados.',
    whatsapp: '5511988882002',
    allowedProducts: ['vinho-malbec', 'vinho-branco', 'az-italiano', 'licor-limoncello'],
    pricing: {
      'vinho-malbec': 86,
      'vinho-branco': 75,
      'az-italiano': 38.5,
      'licor-limoncello': 63.9,
    },
  },
  'loja-bairro-norte': {
    password: 'sabor789',
    name: 'Revenda Bairro Norte',
    description: 'Linha gourmet para presentes e cestas.',
    whatsapp: '5511977773003',
    allowedProducts: ['qj-brie', 'qj-grana', 'az-italiano', 'licor-limoncello'],
    pricing: {
      'qj-brie': 34.5,
      'qj-grana': 42.2,
      'az-italiano': 37.9,
      'licor-limoncello': 61,
    },
  },
};

const state = {
  currentStoreCode: null,
  cart: {},
};

const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');
const loginSection = document.getElementById('loginSection');
const storeSection = document.getElementById('storeSection');
const storeName = document.getElementById('storeName');
const storeDescription = document.getElementById('storeDescription');
const whatsTarget = document.getElementById('whatsTarget');
const productsGrid = document.getElementById('productsGrid');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const sendWhatsAppBtn = document.getElementById('sendWhatsAppBtn');
const logoutBtn = document.getElementById('logoutBtn');

const money = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

function getCurrentStore() {
  return stores[state.currentStoreCode];
}

function getVisibleProducts() {
  const store = getCurrentStore();
  return catalog
    .filter((product) => store.allowedProducts.includes(product.id))
    .map((product) => ({
      ...product,
      storePrice: store.pricing[product.id] ?? product.basePrice,
    }));
}

function renderProducts() {
  const products = getVisibleProducts();

  productsGrid.innerHTML = products
    .map(
      (product) => `
        <article class="product-card">
          <p class="tag">${product.category}</p>
          <h4>${product.name}</h4>
          <p>${product.description}</p>
          <p class="price">${money.format(product.storePrice)}</p>
          <button class="btn" type="button" data-add="${product.id}">
            Adicionar ao carrinho
          </button>
        </article>
      `
    )
    .join('');
}

function calcTotal() {
  const products = getVisibleProducts();
  return Object.entries(state.cart).reduce((total, [id, qty]) => {
    const product = products.find((item) => item.id === id);
    if (!product) return total;
    return total + product.storePrice * qty;
  }, 0);
}

function renderCart() {
  const products = getVisibleProducts();
  const items = Object.entries(state.cart)
    .map(([id, qty]) => {
      const product = products.find((item) => item.id === id);
      if (!product) return '';
      return `
        <div class="cart-item">
          <div class="cart-row">
            <strong>${product.name}</strong>
            <span>${money.format(product.storePrice * qty)}</span>
          </div>
          <div class="cart-row">
            <small>${money.format(product.storePrice)} por unidade</small>
            <div class="qty-controls">
              <button type="button" data-dec="${id}">-</button>
              <span>${qty}</span>
              <button type="button" data-inc="${id}">+</button>
            </div>
          </div>
        </div>
      `;
    })
    .join('');

  cartItems.innerHTML =
    items || '<p class="tag">Nenhum produto selecionado ainda.</p>';

  const total = calcTotal();
  cartTotal.textContent = money.format(total);
  sendWhatsAppBtn.disabled = total <= 0;
}

function addToCart(productId) {
  state.cart[productId] = (state.cart[productId] || 0) + 1;
  renderCart();
}

function updateQty(productId, change) {
  const next = (state.cart[productId] || 0) + change;
  if (next <= 0) {
    delete state.cart[productId];
  } else {
    state.cart[productId] = next;
  }
  renderCart();
}

function sendToWhatsApp() {
  const store = getCurrentStore();
  const products = getVisibleProducts();
  const lines = [
    `Olá! Pedido da loja ${store.name}:`,
    '',
    ...Object.entries(state.cart).map(([id, qty]) => {
      const product = products.find((item) => item.id === id);
      if (!product) return '';
      return `- ${product.name} | Qtd: ${qty} | Unit: ${money.format(product.storePrice)}`;
    }),
    '',
    `Total do pedido: ${money.format(calcTotal())}`,
  ].filter(Boolean);

  const message = encodeURIComponent(lines.join('\n'));
  const url = `https://wa.me/${store.whatsapp}?text=${message}`;
  window.open(url, '_blank');
}

function setupStoreSession(storeCode) {
  state.currentStoreCode = storeCode;
  state.cart = {};

  const store = getCurrentStore();
  storeName.textContent = store.name;
  storeDescription.textContent = store.description;
  whatsTarget.textContent = `+${store.whatsapp}`;

  loginSection.classList.add('hidden');
  storeSection.classList.remove('hidden');
  logoutBtn.classList.remove('hidden');

  renderProducts();
  renderCart();
}

function logout() {
  state.currentStoreCode = null;
  state.cart = {};
  storeSection.classList.add('hidden');
  loginSection.classList.remove('hidden');
  logoutBtn.classList.add('hidden');
  loginForm.reset();
  loginMessage.textContent = '';
}

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(loginForm);
  const storeCode = String(formData.get('storeCode') || '').trim().toLowerCase();
  const password = String(formData.get('password') || '').trim();

  const store = stores[storeCode];
  if (!store || store.password !== password) {
    loginMessage.textContent = 'Código da loja ou senha inválidos.';
    return;
  }

  loginMessage.textContent = '';
  setupStoreSession(storeCode);
});

productsGrid.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const productId = target.dataset.add;
  if (!productId) return;
  addToCart(productId);
});

cartItems.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const incId = target.dataset.inc;
  const decId = target.dataset.dec;

  if (incId) {
    updateQty(incId, 1);
  }

  if (decId) {
    updateQty(decId, -1);
  }
});

sendWhatsAppBtn.addEventListener('click', sendToWhatsApp);
logoutBtn.addEventListener('click', logout);
