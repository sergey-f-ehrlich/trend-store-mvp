(function () {
  const data = window.TrendStoreData;

  function el(id) {
    return document.getElementById(id);
  }

  function currency(value) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
  }

  function productCard(product) {
    const category = data.getCategory(product.category);
    return `
      <article class="card product-card">
        <div class="product-emoji">${product.image}</div>
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
          <span class="score">Score ${product.opportunityScore}</span>
          <a class="button secondary" href="/product?id=${product.id}">View details</a>
        </div>
      </article>
    `;
  }

  function renderFeatured() {
    const target = el('featured-products');
    if (!target) return;
    target.innerHTML = data.getTopProducts(4).map(productCard).join('');
  }

  function renderCategories() {
    const target = el('category-grid');
    if (!target) return;
    target.innerHTML = data.categories.map((category) => {
      const count = data.products.filter((product) => product.category === category.id).length;
      return `
        <article class="card section-card">
          <div class="pill">${count} opportunities</div>
          <h3 style="margin-top: 14px;">${category.name}</h3>
          <p class="muted">${category.blurb}</p>
          <a class="button secondary" href="/catalog?category=${category.id}">Browse category</a>
        </article>
      `;
    }).join('');
  }

  function renderCatalog() {
    const grid = el('catalog-grid');
    const search = el('search-input');
    const categorySelect = el('category-select');
    const sortSelect = el('sort-select');
    if (!grid || !search || !categorySelect || !sortSelect) return;

    categorySelect.innerHTML = ['<option value="">All categories</option>']
      .concat(data.categories.map((category) => `<option value="${category.id}">${category.name}</option>`))
      .join('');

    const params = new URLSearchParams(window.location.search);
    if (params.get('category')) categorySelect.value = params.get('category');

    function applyFilters() {
      let items = [...data.products];
      const query = search.value.trim().toLowerCase();
      const category = categorySelect.value;
      const sort = sortSelect.value;

      if (query) {
        items = items.filter((product) =>
          [product.name, product.shortDescription, product.audience].join(' ').toLowerCase().includes(query)
        );
      }
      if (category) items = items.filter((product) => product.category === category);

      items.sort((a, b) => {
        if (sort === 'price-low') return a.price - b.price;
        if (sort === 'price-high') return b.price - a.price;
        if (sort === 'rating') return b.rating - a.rating;
        return b.opportunityScore - a.opportunityScore;
      });

      grid.innerHTML = items.length ? items.map(productCard).join('') : '<div class="card empty-state">No products matched those filters.</div>';
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

    const metricEntries = [
      ['Demand momentum', product.metrics.demand],
      ['Margin potential', product.metrics.margin],
      ['Competition ease', product.metrics.competition],
      ['Inventory resilience', product.metrics.risk],
      ['Repeat purchase', product.metrics.repeat],
      ['Social proof', product.metrics.social]
    ];

    target.innerHTML = `
      <section class="detail-grid">
        <article class="card detail-hero">
          <div class="product-emoji">${product.image}</div>
          <div class="inline-meta"><span class="badge">${product.badge}</span><span>${category.name}</span><span>★ ${product.rating}</span></div>
          <h1 style="font-size: clamp(2rem, 4vw, 3.4rem); margin-top: 16px;">${product.name}</h1>
          <p class="lead">${product.description}</p>
          <div class="price-row">
            <span class="price">${currency(product.price)}</span>
            <span class="compare">${currency(product.compareAt)}</span>
            <span class="score">Opportunity ${product.opportunityScore}</span>
          </div>
          <div class="button-row">
            <a class="button primary" href="/catalog">Back to catalog</a>
            <a class="button secondary" href="/dashboard">View dashboard</a>
          </div>
        </article>

        <div style="display: grid; gap: 18px;">
          <article class="card section-card">
            <h3>Why it works</h3>
            <ul class="list">${product.highlights.map((item) => `<li>${item}</li>`).join('')}</ul>
          </article>
          <article class="card section-card">
            <h3>Commercial snapshot</h3>
            <div class="metrics-grid" style="grid-template-columns: repeat(2, 1fr);">
              <div class="metric-card"><strong>${currency(product.monthlyRevenue)}</strong><span class="muted">Est. monthly revenue</span></div>
              <div class="metric-card"><strong>${product.grossMargin}%</strong><span class="muted">Gross margin</span></div>
              <div class="metric-card"><strong>${product.conversionLift}%</strong><span class="muted">Conv. lift potential</span></div>
              <div class="metric-card"><strong>${product.reviews}</strong><span class="muted">Seed social proof</span></div>
            </div>
          </article>
        </div>
      </section>

      <section class="section">
        <div class="section-header">
          <div>
            <h2>Opportunity score breakdown</h2>
            <p class="muted">Seed logic combines demand, margin, ease, operational risk, repeat purchase, and social momentum.</p>
          </div>
        </div>
        <div class="grid-3">
          ${metricEntries.map(([label, value]) => `
            <article class="card section-card">
              <div class="inline-meta" style="justify-content: space-between; margin-bottom: 10px;"><span>${label}</span><strong>${value}</strong></div>
              <div class="progress"><span style="width:${value}%"></span></div>
            </article>
          `).join('')}
        </div>
      </section>

      <section class="section">
        <div class="grid-3">
          <article class="card section-card"><h3>Audience</h3><p class="muted">${product.audience}</p></article>
          <article class="card section-card"><h3>Shipping profile</h3><p class="muted">${product.shippingProfile}</p></article>
          <article class="card section-card"><h3>Merchandising angle</h3><p class="muted">Lead with a clear before/after transformation, daily utility, and a tight value proposition around convenience.</p></article>
        </div>
      </section>
    `;
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

    metricsTarget.innerHTML = `
      <article class="card metric-card"><strong>${avgScore}</strong><span class="muted">Average opportunity score</span></article>
      <article class="card metric-card"><strong>${currency(totalRevenue)}</strong><span class="muted">Projected portfolio revenue</span></article>
      <article class="card metric-card"><strong>${bestMargin}%</strong><span class="muted">Best gross margin</span></article>
      <article class="card metric-card"><strong>${avgRating}</strong><span class="muted">Average customer rating</span></article>
    `;

    tableTarget.innerHTML = products.map((product, index) => `
      <tr>
        <td>#${index + 1}</td>
        <td><a href="/product?id=${product.id}">${product.name}</a></td>
        <td>${data.getCategory(product.category).name}</td>
        <td>${product.opportunityScore}</td>
        <td>${currency(product.monthlyRevenue)}</td>
        <td>${product.grossMargin}%</td>
      </tr>
    `).join('');

    categoryTarget.innerHTML = data.categories.map((category) => {
      const items = products.filter((product) => product.category === category.id);
      const avg = Math.round(items.reduce((sum, product) => sum + product.opportunityScore, 0) / items.length);
      return `
        <article class="card section-card">
          <div class="inline-meta" style="justify-content: space-between; margin-bottom: 8px;">
            <strong>${category.name}</strong>
            <span class="score">${avg}</span>
          </div>
          <p class="muted">${category.blurb}</p>
          <div class="progress" style="margin-top: 12px;"><span style="width:${avg}%"></span></div>
        </article>
      `;
    }).join('');
  }

  function markActiveNav() {
    const path = window.location.pathname;
    document.querySelectorAll('[data-nav]').forEach((link) => {
      if (link.getAttribute('href') === path || (path === '/' && link.getAttribute('href') === '/index.html')) {
        link.classList.add('active');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    markActiveNav();
    renderFeatured();
    renderCategories();
    renderCatalog();
    renderProductDetail();
    renderDashboard();
  });
})();
