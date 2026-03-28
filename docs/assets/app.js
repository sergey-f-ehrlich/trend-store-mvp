(function () {
  const data = window.TrendStoreData;
  const cartKey = 'northstar-cart';

  function el(id) { return document.getElementById(id); }
  function currency(value) { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value); }

  function productImage(product, large = false) {
    return `<div class="product-image ${large ? 'large' : ''}">${product.photo ? `<img src="${product.photo}" alt="${product.name}" />` : `<div class="product-image-fallback" style="background:${product.imageStyle}"><span>${product.image}</span></div>`}</div>`;
  }

  function getCart() { try { return JSON.parse(localStorage.getItem(cartKey) || '[]'); } catch { return []; } }
  function saveCart(cart) { localStorage.setItem(cartKey, JSON.stringify(cart)); }

  function setCartQty(productId, qty) {
    let cart = getCart();
    const existing = cart.find((item) => item.id === productId);
    if (qty <= 0) cart = cart.filter((item) => item.id !== productId);
    else if (existing) existing.qty = qty;
    else cart.push({ id: productId, qty });
    saveCart(cart);
    updateCartUi();
    renderCheckout();
  }

  function addToCart(productId) {
    const cart = getCart();
    const existing = cart.find((item) => item.id === productId);
    setCartQty(productId, existing ? existing.qty + 1 : 1);
    openCart();
  }

  function cartSummary() {
    const items = getCart().map((entry) => {
      const product = data.getProduct(entry.id);
      return product ? { ...product, qty: entry.qty } : null;
    }).filter(Boolean);
    const count = items.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = items.reduce((sum, item) => sum + item.qty * item.price, 0);
    return { items, count, subtotal };
  }

  function productCard(product) {
    const category = data.getCategory(product.category);
    return `
      <article class="card product-card">
        ${productImage(product)}
        <div class="badge">${product.badge}</div>
        <h3>${product.name}</h3>
        <p class="muted">${product.shortDescription}</p>
        <div class="price-row">
          <span class="price">${currency(product.price)}</span>
          <span class="compare">${currency(product.compareAt)}</span>
        </div>
        <div class="product-meta">
          <span>${category.name}</span>
          <span>★ ${product.rating}</span>
          <span>${product.reviews} reviews</span>
        </div>
        <div class="button-row" style="justify-content: space-between; align-items: center; margin-top: 18px;">
          <span class="score">Top pick ${product.opportunityScore}</span>
          <div class="button-row compact-row">
            <a class="button secondary" href="product.html?id=${product.id}">Details</a>
            <button class="button primary" data-add-cart="${product.id}">Add to cart</button>
          </div>
        </div>
      </article>
    `;
  }

  function renderFeatured() {
    const target = el('featured-products');
    if (target) target.innerHTML = data.getTopProducts(4).map(productCard).join('');
  }

  function renderCategories() {
    const target = el('category-grid');
    if (!target) return;
    target.innerHTML = data.categories.map((category) => {
      const count = data.products.filter((product) => product.category === category.id).length;
      return `<article class="card section-card"><div class="pill">${count} products</div><h3 style="margin-top: 14px;">${category.name}</h3><p class="muted">${category.blurb}</p><a class="button secondary" href="catalog.html?category=${category.id}">Browse category</a></article>`;
    }).join('');
  }

  function renderCatalog() {
    const grid = el('catalog-grid');
    const search = el('search-input');
    const categorySelect = el('category-select');
    const sortSelect = el('sort-select');
    if (!grid || !search || !categorySelect || !sortSelect) return;
    categorySelect.innerHTML = ['<option value="">All categories</option>'].concat(data.categories.map((category) => `<option value="${category.id}">${category.name}</option>`)).join('');
    const params = new URLSearchParams(window.location.search);
    if (params.get('category')) categorySelect.value = params.get('category');

    function applyFilters() {
      let items = [...data.products];
      const query = search.value.trim().toLowerCase();
      const category = categorySelect.value;
      const sort = sortSelect.value;
      if (query) items = items.filter((product) => [product.name, product.shortDescription, product.audience].join(' ').toLowerCase().includes(query));
      if (category) items = items.filter((product) => product.category === category);
      items.sort((a, b) => sort === 'price-low' ? a.price - b.price : sort === 'price-high' ? b.price - a.price : sort === 'rating' ? b.rating - a.rating : b.opportunityScore - a.opportunityScore);
      grid.innerHTML = items.length ? items.map(productCard).join('') : '<div class="card empty-state">No products matched those filters.</div>';
      bindCartButtons();
    }

    [search, categorySelect, sortSelect].forEach((node) => node.addEventListener('input', applyFilters));
    sortSelect.addEventListener('change', applyFilters);
    categorySelect.addEventListener('change', applyFilters);
    applyFilters();
  }

  function renderProductDetail() {
    const target = el('product-detail');
    if (!target) return;
    const params = new URLSearchParams(window.location.search);
    const product = data.getProduct(params.get('id')) || data.getTopProducts(1)[0];
    const category = data.getCategory(product.category);
    const metricEntries = [['Demand momentum', product.metrics.demand], ['Margin potential', product.metrics.margin], ['Competition ease', product.metrics.competition], ['Inventory resilience', product.metrics.risk], ['Repeat purchase', product.metrics.repeat], ['Social proof', product.metrics.social]];

    target.innerHTML = `
      <section class="detail-grid detail-grid-store">
        <article class="card detail-hero">
          ${productImage(product, true)}
          <div class="inline-meta"><span class="badge">${product.badge}</span><span>${category.name}</span><span>★ ${product.rating}</span><span>${product.reviews} reviews</span></div>
          <h1 style="font-size: clamp(2rem, 4vw, 3.4rem); margin-top: 16px;">${product.name}</h1>
          <p class="lead">${product.description}</p>
          <div class="price-row"><span class="price">${currency(product.price)}</span><span class="compare">${currency(product.compareAt)}</span><span class="score">Best seller score ${product.opportunityScore}</span></div>
          <div class="purchase-box"><div><strong>In stock</strong><div class="muted">Ships in 1–2 business days</div></div><div class="button-row compact-row"><button class="button primary" data-add-cart="${product.id}">Add to cart</button><a class="button secondary" href="checkout.html">Buy now</a></div></div>
          <div class="button-row"><a class="button secondary" href="catalog.html">Back to shop</a><a class="button secondary" href="faq.html">Questions?</a></div>
        </article>
        <div style="display: grid; gap: 18px;">
          <article class="card section-card"><h3>Why customers like it</h3><ul class="list">${product.highlights.map((item) => `<li>${item}</li>`).join('')}</ul></article>
          <article class="card section-card"><h3>Store snapshot</h3><div class="metrics-grid" style="grid-template-columns: repeat(2, 1fr);"><div class="metric-card"><strong>${currency(product.monthlyRevenue)}</strong><span class="muted">Modeled revenue</span></div><div class="metric-card"><strong>${product.grossMargin}%</strong><span class="muted">Gross margin</span></div><div class="metric-card"><strong>${product.conversionLift}%</strong><span class="muted">Conv. lift</span></div><div class="metric-card"><strong>${product.reviews}</strong><span class="muted">Reviews</span></div></div></article>
          <article class="card section-card"><h3>Shipping & returns</h3><p class="muted">${product.shippingProfile} Free shipping available over $50. 30-day returns on unused items.</p></article>
        </div>
      </section>
      <section class="section"><div class="section-header"><div><h2>Feature breakdown</h2><p class="muted">A more storefront-style explanation of what makes this product compelling.</p></div></div><div class="grid-3">${metricEntries.map(([label, value]) => `<article class="card section-card"><div class="inline-meta" style="justify-content: space-between; margin-bottom: 10px;"><span>${label}</span><strong>${value}</strong></div><div class="progress"><span style="width:${value}%"></span></div></article>`).join('')}</div></section>
      <section class="section"><div class="grid-3"><article class="card section-card"><h3>Best for</h3><p class="muted">${product.audience}</p></article><article class="card section-card"><h3>Shipping profile</h3><p class="muted">${product.shippingProfile}</p></article><article class="card section-card"><h3>Why it converts</h3><p class="muted">Clear utility, visual demo potential, and simple everyday positioning make this feel easy to buy.</p></article></div></section>`;
    bindCartButtons();
  }

  function renderDashboard() {
    const metricsTarget = el('dashboard-metrics');
    const tableTarget = el('ranking-table');
    const categoryTarget = el('category-breakdown');
    if (!metricsTarget || !tableTarget || !categoryTarget) return;
    const products = [...data.products].sort((a, b) => b.opportunityScore - a.opportunityScore);
    const avgScore = Math.round(products.reduce((sum, product) => sum + product.opportunityScore, 0) / products.length);
    const totalRevenue = products.reduce((sum, product) => sum + product.monthlyRevenue, 0);
    const bestMargin = Math.max(...products.map((product) => product.grossMargin));
    const avgRating = (products.reduce((sum, product) => sum + product.rating, 0) / products.length).toFixed(1);
    metricsTarget.innerHTML = `<article class="card metric-card"><strong>${avgScore}</strong><span class="muted">Average score</span></article><article class="card metric-card"><strong>${currency(totalRevenue)}</strong><span class="muted">Modeled revenue</span></article><article class="card metric-card"><strong>${bestMargin}%</strong><span class="muted">Best margin</span></article><article class="card metric-card"><strong>${avgRating}</strong><span class="muted">Average rating</span></article>`;
    tableTarget.innerHTML = products.map((product, index) => `<tr><td>#${index + 1}</td><td><a href="product.html?id=${product.id}">${product.name}</a></td><td>${data.getCategory(product.category).name}</td><td>${product.opportunityScore}</td><td>${currency(product.monthlyRevenue)}</td><td>${product.grossMargin}%</td></tr>`).join('');
    categoryTarget.innerHTML = data.categories.map((category) => {
      const items = products.filter((product) => product.category === category.id);
      const avg = Math.round(items.reduce((sum, product) => sum + product.opportunityScore, 0) / items.length);
      return `<article class="card section-card"><div class="inline-meta" style="justify-content: space-between; margin-bottom: 8px;"><strong>${category.name}</strong><span class="score">${avg}</span></div><p class="muted">${category.blurb}</p><div class="progress" style="margin-top: 12px;"><span style="width:${avg}%"></span></div></article>`;
    }).join('');
  }

  function renderCheckout() {
    const summaryNode = el('checkout-summary');
    const totalNode = el('checkout-total');
    if (!summaryNode || !totalNode) return;
    const summary = cartSummary();
    summaryNode.innerHTML = summary.items.length ? summary.items.map((item) => `<div class="cart-item"><div class="cart-item-media">${item.photo ? `<img src="${item.photo}" alt="${item.name}" />` : item.image}</div><div><strong>${item.name}</strong><div class="muted">Qty ${item.qty}</div></div><strong>${currency(item.qty * item.price)}</strong></div>`).join('') : '<div class="faq-item"><p class="muted">Your cart is empty. Add a few products first.</p></div>';
    totalNode.textContent = currency(summary.subtotal + (summary.items.length ? 6 : 0));
  }

  function updateBranding() { document.querySelectorAll('[data-brand-name]').forEach((node) => node.textContent = data.brand.name); document.querySelectorAll('[data-brand-mark]').forEach((node) => node.textContent = data.brand.mark); }
  function openCart() { document.body.classList.add('cart-open'); }
  function closeCart() { document.body.classList.remove('cart-open'); }

  function updateCartUi() {
    const badge = el('cart-count');
    const drawerItems = el('cart-items');
    const subtotalNode = el('cart-subtotal');
    const summary = cartSummary();
    if (badge) badge.textContent = summary.count;
    if (subtotalNode) subtotalNode.textContent = currency(summary.subtotal);
    if (drawerItems) {
      drawerItems.innerHTML = summary.items.length ? summary.items.map((item) => `
        <div class="cart-item">
          <div class="cart-item-media">${item.photo ? `<img src="${item.photo}" alt="${item.name}" />` : item.image}</div>
          <div>
            <strong>${item.name}</strong>
            <div class="muted">${currency(item.price)}</div>
            <div class="qty-controls">
              <button class="qty-btn" data-cart-dec="${item.id}">−</button>
              <span>${item.qty}</span>
              <button class="qty-btn" data-cart-inc="${item.id}">+</button>
            </div>
          </div>
          <strong>${currency(item.qty * item.price)}</strong>
        </div>`).join('') : '<div class="muted">Your cart is empty.</div>';
      drawerItems.querySelectorAll('[data-cart-dec]').forEach((button) => button.addEventListener('click', () => {
        const id = button.getAttribute('data-cart-dec');
        const current = getCart().find((item) => item.id === id);
        setCartQty(id, (current?.qty || 1) - 1);
      }));
      drawerItems.querySelectorAll('[data-cart-inc]').forEach((button) => button.addEventListener('click', () => {
        const id = button.getAttribute('data-cart-inc');
        const current = getCart().find((item) => item.id === id);
        setCartQty(id, (current?.qty || 0) + 1);
      }));
    }
  }

  function bindCartButtons() { document.querySelectorAll('[data-add-cart]').forEach((button) => button.onclick = () => addToCart(button.getAttribute('data-add-cart'))); }
  function bindShell() {
    document.querySelectorAll('[data-open-cart]').forEach((node) => node.addEventListener('click', openCart));
    if (el('cart-close')) el('cart-close').addEventListener('click', closeCart);
    if (el('cart-overlay')) el('cart-overlay').addEventListener('click', closeCart);
  }
  function markActiveNav() {
    const path = window.location.pathname;
    document.querySelectorAll('[data-nav]').forEach((link) => {
      const href = link.getAttribute('href');
      const normalizedPath = path.endsWith('/') ? `${path}index.html` : path;
      if (href === path || href === normalizedPath || (path === '/' && href === 'index.html')) link.classList.add('active');
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    updateBranding();
    bindShell();
    markActiveNav();
    renderFeatured();
    renderCategories();
    renderCatalog();
    renderProductDetail();
    renderDashboard();
    bindCartButtons();
    updateCartUi();
    renderCheckout();
  });
})();