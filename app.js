const defaultCatalog = [
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

const defaultStores = {
  'loja-centro': {
    password: 'gourmet123',
    name: 'Revenda Centro',
    description: 'Portfólio completo com foco em vinhos e queijos.',
    whatsapp: '5511999609242',
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

const adminCredentials = {
  username: 'admin',
  password: 'admin123',
};

const storageKeys = {
  stores: 'gourmetStores',
  catalog: 'gourmetCatalog',
};

let catalog = [];
let stores = {};

const state = {
  currentStoreCode: null,
  currentMode: null,
  cart: {},
  adminMainTab: 'company',
  adminCompanySubTab: 'data',
};

const loginForm = document.getElementById('loginForm');
const adminLoginForm = document.getElementById('adminLoginForm');
const loginMessage = document.getElementById('loginMessage');
const adminLoginMessage = document.getElementById('adminLoginMessage');
const adminMessage = document.getElementById('adminMessage');

const sellerTabBtn = document.getElementById('sellerTabBtn');
const adminTabBtn = document.getElementById('adminTabBtn');
const sellerLoginBox = document.getElementById('sellerLoginBox');
const adminLoginBox = document.getElementById('adminLoginBox');

const loginSection = document.getElementById('loginSection');
const storeSection = document.getElementById('storeSection');
const adminSection = document.getElementById('adminSection');

const storeName = document.getElementById('storeName');
const storeDescription = document.getElementById('storeDescription');
const whatsTarget = document.getElementById('whatsTarget');
const productsGrid = document.getElementById('productsGrid');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const sendWhatsAppBtn = document.getElementById('sendWhatsAppBtn');
const logoutBtn = document.getElementById('logoutBtn');

const companyMainTabBtn = document.getElementById('companyMainTabBtn');
const itemsMainTabBtn = document.getElementById('itemsMainTabBtn');
const companyMainTab = document.getElementById('companyMainTab');
const itemsMainTab = document.getElementById('itemsMainTab');

const companyDataSubTabBtn = document.getElementById('companyDataSubTabBtn');
const companyItemsSubTabBtn = document.getElementById('companyItemsSubTabBtn');
const companyDataSubTab = document.getElementById('companyDataSubTab');
const companyItemsSubTab = document.getElementById('companyItemsSubTab');

const createCompanyForm = document.getElementById('createCompanyForm');
const editCompanyForm = document.getElementById('editCompanyForm');
const createProductForm = document.getElementById('createProductForm');
const adminCompanySummaryList = document.getElementById('adminCompanySummaryList');
const adminCompanySelect = document.getElementById('adminCompanySelect');
const adminCompanyItemsList = document.getElementById('adminCompanyItemsList');
const adminItemsList = document.getElementById('adminItemsList');

const money = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

function loadData() {
  const savedStores = localStorage.getItem(storageKeys.stores);
  const savedCatalog = localStorage.getItem(storageKeys.catalog);

  stores = savedStores ? JSON.parse(savedStores) : structuredClone(defaultStores);
  catalog = savedCatalog ? JSON.parse(savedCatalog) : structuredClone(defaultCatalog);
}

function saveData() {
  localStorage.setItem(storageKeys.stores, JSON.stringify(stores));
  localStorage.setItem(storageKeys.catalog, JSON.stringify(catalog));
}

function slugify(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getCurrentStore() {
  return stores[state.currentStoreCode];
}

function getVisibleProducts() {
  const store = getCurrentStore();
  if (!store) return [];
  return catalog
    .filter((product) => store.allowedProducts.includes(product.id))
    .map((product) => ({
      ...product,
      storePrice: store.pricing[product.id] ?? product.basePrice,
    }));
}

function getSelectedCompanyCode() {
  return adminCompanySelect.value;
}

function getSelectedStore() {
  const code = getSelectedCompanyCode();
  return stores[code] || null;
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

  cartItems.innerHTML = items || '<p class="tag">Nenhum produto selecionado ainda.</p>';

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

function showLoginTab(tab) {
  const isSeller = tab === 'seller';
  sellerTabBtn.classList.toggle('active', isSeller);
  adminTabBtn.classList.toggle('active', !isSeller);
  sellerLoginBox.classList.toggle('hidden', !isSeller);
  adminLoginBox.classList.toggle('hidden', isSeller);
}

function showAdminMainTab(tab) {
  const isCompany = tab === 'company';
  state.adminMainTab = tab;
  companyMainTabBtn.classList.toggle('active', isCompany);
  itemsMainTabBtn.classList.toggle('active', !isCompany);
  companyMainTab.classList.toggle('hidden', !isCompany);
  itemsMainTab.classList.toggle('hidden', isCompany);
}

function showAdminCompanySubTab(tab) {
  const isData = tab === 'data';
  state.adminCompanySubTab = tab;
  companyDataSubTabBtn.classList.toggle('active', isData);
  companyItemsSubTabBtn.classList.toggle('active', !isData);
  companyDataSubTab.classList.toggle('hidden', !isData);
  companyItemsSubTab.classList.toggle('hidden', isData);
}

function setupStoreSession(storeCode) {
  state.currentStoreCode = storeCode;
  state.currentMode = 'store';
  state.cart = {};

  const store = getCurrentStore();
  storeName.textContent = store.name;
  storeDescription.textContent = store.description;
  whatsTarget.textContent = `+${store.whatsapp}`;

  loginSection.classList.add('hidden');
  adminSection.classList.add('hidden');
  storeSection.classList.remove('hidden');
  logoutBtn.classList.remove('hidden');

  renderProducts();
  renderCart();
}

function renderAdminCompanySelect() {
  const options = Object.entries(stores)
    .map(([code, store]) => `<option value="${code}">${store.name} (${code})</option>`)
    .join('');

  adminCompanySelect.innerHTML = options;
}

function renderAdminCompanySummaryList() {
  adminCompanySummaryList.innerHTML = Object.entries(stores)
    .map(
      ([code, store]) => `
      <div class="admin-list-row">
        <div>
          <strong>${store.name}</strong>
          <p class="tag">Código: ${code}</p>
          <small>${store.description}</small>
        </div>
        <div class="admin-list-meta">+${store.whatsapp}</div>
      </div>
    `
    )
    .join('');

  if (!adminCompanySummaryList.innerHTML.trim()) {
    adminCompanySummaryList.innerHTML = '<p class="tag">Nenhuma empresa cadastrada.</p>';
  }
}

function renderEditCompanyForm() {
  const code = getSelectedCompanyCode();
  const store = stores[code];

  if (!store) {
    editCompanyForm.reset();
    return;
  }

  editCompanyForm.elements.code.value = code;
  editCompanyForm.elements.name.value = store.name;
  editCompanyForm.elements.password.value = store.password;
  editCompanyForm.elements.whatsapp.value = store.whatsapp;
  editCompanyForm.elements.description.value = store.description;
}

function renderAdminCompanyItemsList() {
  const code = getSelectedCompanyCode();
  const store = stores[code];

  if (!store) {
    adminCompanyItemsList.innerHTML = '<p class="tag">Selecione uma empresa.</p>';
    return;
  }

  adminCompanyItemsList.innerHTML = catalog
    .map((product) => {
      const enabled = store.allowedProducts.includes(product.id);
      const price = store.pricing[product.id] ?? product.basePrice;

      return `
        <div class="admin-list-row product-list-row">
          <div>
            <strong>${product.name}</strong>
            <p class="tag">${product.category} • ID: ${product.id}</p>
          </div>
          <div class="row-inline-fields">
            <label class="inline-option">
              <input type="checkbox" data-company="${code}" data-product-enable="${product.id}" ${enabled ? 'checked' : ''} />
              Habilitado
            </label>
            <label class="inline-price">
              Preço
              <input
                type="number"
                min="0.01"
                step="0.01"
                value="${price}"
                data-company="${code}"
                data-product-price="${product.id}"
                ${enabled ? '' : 'disabled'}
              />
            </label>
          </div>
        </div>
      `;
    })
    .join('');

  if (!adminCompanyItemsList.innerHTML.trim()) {
    adminCompanyItemsList.innerHTML = '<p class="tag">Cadastre itens para habilitar nesta empresa.</p>';
  }
}

function renderAdminItemsList() {
  adminItemsList.innerHTML = catalog
    .map(
      (product) => `
      <form class="admin-list-row admin-item-edit-form" data-product-edit-form="${product.id}">
        <div class="admin-item-main-fields">
          <label>Nome<input name="name" value="${product.name}" required type="text" /></label>
          <label>Categoria<input name="category" value="${product.category}" required type="text" /></label>
          <label>Preço base<input name="basePrice" value="${product.basePrice}" required type="number" min="0.01" step="0.01" /></label>
        </div>
        <div class="admin-item-secondary-fields">
          <label>ID<input name="id" value="${product.id}" type="text" readonly /></label>
          <label>Descrição<textarea name="description" rows="2" required>${product.description}</textarea></label>
          <button class="btn" type="submit">Salvar item</button>
        </div>
      </form>
    `
    )
    .join('');

  if (!adminItemsList.innerHTML.trim()) {
    adminItemsList.innerHTML = '<p class="tag">Nenhum item cadastrado.</p>';
  }
}

function renderAdminPanel() {
  const currentCode = getSelectedCompanyCode();

  renderAdminCompanySelect();
  renderAdminCompanySummaryList();

  if (stores[currentCode]) {
    adminCompanySelect.value = currentCode;
  }

  if (!adminCompanySelect.value && adminCompanySelect.options.length > 0) {
    adminCompanySelect.value = adminCompanySelect.options[0].value;
  }

  renderEditCompanyForm();
  renderAdminCompanyItemsList();
  renderAdminItemsList();
}

function setupAdminSession() {
  state.currentMode = 'admin';
  state.currentStoreCode = null;
  state.cart = {};

  loginSection.classList.add('hidden');
  storeSection.classList.add('hidden');
  adminSection.classList.remove('hidden');
  logoutBtn.classList.remove('hidden');
  adminMessage.textContent = '';

  showAdminMainTab('company');
  showAdminCompanySubTab('data');
  renderAdminPanel();
}

function logout() {
  state.currentMode = null;
  state.currentStoreCode = null;
  state.cart = {};
  storeSection.classList.add('hidden');
  adminSection.classList.add('hidden');
  loginSection.classList.remove('hidden');
  logoutBtn.classList.add('hidden');

  loginForm.reset();
  adminLoginForm.reset();
  loginMessage.textContent = '';
  adminLoginMessage.textContent = '';
  adminMessage.textContent = '';
  showLoginTab('seller');
}

function createStoreFromForm(formData) {
  const code = slugify(String(formData.get('code') || '').trim());
  const name = String(formData.get('name') || '').trim();
  const password = String(formData.get('password') || '').trim();
  const whatsapp = String(formData.get('whatsapp') || '').replace(/\D/g, '');
  const description = String(formData.get('description') || '').trim();

  if (!code || !name || !password || !whatsapp || !description) {
    adminMessage.textContent = 'Preencha todos os campos da empresa.';
    return;
  }

  if (stores[code]) {
    adminMessage.textContent = 'Já existe uma empresa com este código.';
    return;
  }

  stores[code] = {
    password,
    name,
    description,
    whatsapp,
    allowedProducts: [],
    pricing: {},
  };

  saveData();
  renderAdminPanel();
  adminCompanySelect.value = code;
  renderEditCompanyForm();
  renderAdminCompanyItemsList();
  createCompanyForm.reset();
  adminMessage.textContent = `Empresa ${name} criada com sucesso.`;
}

function updateStoreFromForm(formData) {
  const code = String(formData.get('code') || '').trim();
  const store = stores[code];
  if (!store) {
    adminMessage.textContent = 'Empresa inválida para atualização.';
    return;
  }

  const name = String(formData.get('name') || '').trim();
  const password = String(formData.get('password') || '').trim();
  const whatsapp = String(formData.get('whatsapp') || '').replace(/\D/g, '');
  const description = String(formData.get('description') || '').trim();

  if (!name || !password || !whatsapp || !description) {
    adminMessage.textContent = 'Preencha todos os campos da empresa para atualizar.';
    return;
  }

  store.name = name;
  store.password = password;
  store.whatsapp = whatsapp;
  store.description = description;

  saveData();
  renderAdminPanel();
  adminCompanySelect.value = code;
  renderEditCompanyForm();
  adminMessage.textContent = `Empresa ${name} atualizada com sucesso.`;
}

function createMasterProduct(formData) {
  const id = slugify(String(formData.get('id') || '').trim());
  const name = String(formData.get('name') || '').trim();
  const category = String(formData.get('category') || '').trim();
  const description = String(formData.get('description') || '').trim();
  const basePrice = Number(formData.get('basePrice'));

  if (!id || !name || !category || !description || Number.isNaN(basePrice) || basePrice <= 0) {
    adminMessage.textContent = 'Dados do item inválidos.';
    return;
  }

  if (catalog.some((product) => product.id === id)) {
    adminMessage.textContent = 'Já existe um item com este ID.';
    return;
  }

  catalog.push({
    id,
    name,
    category,
    description,
    basePrice,
  });

  saveData();
  renderAdminPanel();
  createProductForm.reset();
  adminMessage.textContent = `Item ${name} criado com sucesso.`;
}

function updateMasterProduct(productId, formData) {
  const product = catalog.find((item) => item.id === productId);
  if (!product) {
    adminMessage.textContent = 'Item não encontrado para atualização.';
    return;
  }

  const name = String(formData.get('name') || '').trim();
  const category = String(formData.get('category') || '').trim();
  const description = String(formData.get('description') || '').trim();
  const basePrice = Number(formData.get('basePrice'));

  if (!name || !category || !description || Number.isNaN(basePrice) || basePrice <= 0) {
    adminMessage.textContent = 'Dados do item inválidos para atualização.';
    return;
  }

  product.name = name;
  product.category = category;
  product.description = description;
  product.basePrice = basePrice;

  Object.values(stores).forEach((store) => {
    if (!store.allowedProducts.includes(productId)) return;
    if (typeof store.pricing[productId] !== 'number' || store.pricing[productId] <= 0) {
      store.pricing[productId] = basePrice;
    }
  });

  saveData();
  renderAdminPanel();
  adminMessage.textContent = `Item ${name} atualizado com sucesso.`;
}

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(loginForm);
  const storeCode = slugify(String(formData.get('storeCode') || '').trim());
  const password = String(formData.get('password') || '').trim();

  const store = stores[storeCode];
  if (!store || store.password !== password) {
    loginMessage.textContent = 'Código da loja ou senha inválidos.';
    return;
  }

  loginMessage.textContent = '';
  setupStoreSession(storeCode);
});

adminLoginForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(adminLoginForm);
  const username = String(formData.get('username') || '').trim().toLowerCase();
  const password = String(formData.get('password') || '').trim();

  if (username !== adminCredentials.username || password !== adminCredentials.password) {
    adminLoginMessage.textContent = 'Usuário ou senha de administrador inválidos.';
    return;
  }

  adminLoginMessage.textContent = '';
  setupAdminSession();
});

sellerTabBtn.addEventListener('click', () => showLoginTab('seller'));
adminTabBtn.addEventListener('click', () => showLoginTab('admin'));
companyMainTabBtn.addEventListener('click', () => showAdminMainTab('company'));
itemsMainTabBtn.addEventListener('click', () => showAdminMainTab('items'));
companyDataSubTabBtn.addEventListener('click', () => showAdminCompanySubTab('data'));
companyItemsSubTabBtn.addEventListener('click', () => showAdminCompanySubTab('items'));

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

createCompanyForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(createCompanyForm);
  createStoreFromForm(formData);
});

editCompanyForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(editCompanyForm);
  updateStoreFromForm(formData);
});

createProductForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(createProductForm);
  createMasterProduct(formData);
});

adminItemsList.addEventListener('submit', (event) => {
  event.preventDefault();
  const target = event.target;
  if (!(target instanceof HTMLFormElement)) return;

  const productId = target.dataset.productEditForm;
  if (!productId) return;

  const formData = new FormData(target);
  updateMasterProduct(productId, formData);
});

adminCompanySelect.addEventListener('change', () => {
  renderEditCompanyForm();
  renderAdminCompanyItemsList();
});

adminCompanyItemsList.addEventListener('change', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) return;

  const companyCode = target.dataset.company;
  if (!companyCode || !stores[companyCode]) return;

  const store = stores[companyCode];

  if (target.dataset.productEnable) {
    const productId = target.dataset.productEnable;
    const priceInput = adminCompanyItemsList.querySelector(
      `input[data-company="${companyCode}"][data-product-price="${productId}"]`
    );

    if (target.checked) {
      if (!store.allowedProducts.includes(productId)) {
        store.allowedProducts.push(productId);
      }
      if (priceInput instanceof HTMLInputElement) {
        priceInput.disabled = false;
        const parsed = Number(priceInput.value);
        const fallback = catalog.find((item) => item.id === productId)?.basePrice || 0;
        store.pricing[productId] = parsed > 0 ? parsed : fallback;
      }
    } else {
      store.allowedProducts = store.allowedProducts.filter((id) => id !== productId);
      delete store.pricing[productId];
      if (priceInput instanceof HTMLInputElement) {
        priceInput.disabled = true;
      }
    }

    saveData();
    return;
  }

  if (target.dataset.productPrice) {
    const productId = target.dataset.productPrice;
    const parsed = Number(target.value);
    if (Number.isNaN(parsed) || parsed <= 0) return;

    if (!store.allowedProducts.includes(productId)) return;
    store.pricing[productId] = parsed;
    saveData();
  }
});

sendWhatsAppBtn.addEventListener('click', sendToWhatsApp);
logoutBtn.addEventListener('click', logout);

loadData();
showLoginTab('seller');
showAdminMainTab('company');
showAdminCompanySubTab('data');
