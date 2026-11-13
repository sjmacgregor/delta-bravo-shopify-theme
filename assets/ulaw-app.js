/* ==========================================================================
   DELTA BRAVO — ULAW HOLSTER CONTROLLER (MINIMAL SHOPIFY-PORTABLE JS)
   ========================================================================== */

(function () {
  const {
    TOOLS,
    BRANDS,
    ULAW_WIDTH_OPTIONS,
    MAG_POUCH_OPTIONS,
    STREAM_ITEMS,
    PRODUCT_GALLERY,
    getRecommendedChannelId,
    computeUlawConfiguration,
    searchTools
  } = window.ULAW_CATALOG;

  const WIDTH_OPTIONS = ULAW_WIDTH_OPTIONS || [
    { widthMm: 30, name: '30 mm (1.18") — Pistol Mag Pouch Width' },
    { widthMm: 60, name: '60 mm (2.36") — Rifle Mag Pouch Width' }
  ];

  function getDefaultPouchId(tool) {
    if (typeof getRecommendedChannelId === 'function') {
      return getRecommendedChannelId(tool);
    }
    if (!tool) return 'single_30_125';
    const hRaw = parseInt(tool.defaultChannelHeight, 10) || 125;
    const h = hRaw <= 100 ? 100 : (hRaw >= 150 ? 150 : 125);
    let prefix = tool.defaultChannelWidth >= 60 ? 'single_60' : 'single_30';
    if (tool.recommendedPouch && tool.recommendedPouch.startsWith('div_60')) {
      prefix = 'div_60_30_30';
    } else if (tool.recommendedPouch === 'single_60') {
      prefix = 'single_60';
    } else if (tool.recommendedPouch === 'single_30') {
      prefix = 'single_30';
    }
    const id = `${prefix}_${h}`;
    return MAG_POUCH_OPTIONS.some(p => p.id === id) ? id : MAG_POUCH_OPTIONS[0].id;
  }

  const state = {
    view: 'home',
    query: '',
    results: [],
    activeIndex: -1,
    brand: TOOLS[0].brand,
    toolId: TOOLS[0].id,
    pouchId: getDefaultPouchId(TOOLS[0]),
    customImage: null,
    cart: []
  };

  try {
    const saved = localStorage.getItem('db_ulaw_cart');
    if (saved) state.cart = JSON.parse(saved);
  } catch (e) {}

  function saveCart() {
    try {
      localStorage.setItem('db_ulaw_cart', JSON.stringify(state.cart));
    } catch (e) {}
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatPrice(val) {
    const num = Number(val);
    if (isNaN(num)) return '$0';
    return num % 1 === 0 ? `$${num.toFixed(0)}` : `$${num.toFixed(2)}`;
  }

  function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function highlightMatch(text, query) {
    if (!query || !query.trim()) return escapeHtml(text);
    const tokens = query.trim().split(/\s+/).filter(t => t.length >= 2);
    if (!tokens.length) return escapeHtml(text);
    const rx = new RegExp(`(${tokens.map(escapeRegExp).join('|')})`, 'gi');
    return escapeHtml(text).replace(rx, '<mark>$1</mark>');
  }

  function getSelectedTool() {
    return TOOLS.find(t => t.id === state.toolId) || TOOLS[0];
  }

  function getActiveConfig() {
    return computeUlawConfiguration(getSelectedTool(), state.pouchId, 'auto', 'inlay');
  }

  // ==========================================================================
  // VIEW NAVIGATION
  // ==========================================================================
  function showView(viewName) {
    state.view = viewName;
    document.getElementById('view-home')?.classList.toggle('is-visible', viewName === 'home');
    document.getElementById('view-product')?.classList.toggle('is-visible', viewName === 'product');

    if (viewName === 'product') {
      renderProductPage();
    } else {
      closeAutocomplete();
      setTimeout(() => document.getElementById('db-search-input')?.focus(), 40);
    }
  }

  // ==========================================================================
  // SEARCH & AUTOCOMPLETE
  // ==========================================================================
  function updateAutocomplete(query) {
    state.query = query || '';
    const hasText = state.query.trim().length > 0;

    const clearBtn = document.getElementById('db-search-clear');
    if (clearBtn) clearBtn.classList.toggle('is-visible', hasText);

    const submitBtn = document.getElementById('db-search-submit');
    if (submitBtn) submitBtn.disabled = !hasText;

    const wrap = document.getElementById('db-search-wrap');
    const listEl = document.getElementById('db-autocomplete');
    if (!wrap || !listEl) return;

    if (!hasText) {
      wrap.classList.remove('is-open');
      state.results = [];
      state.activeIndex = -1;
      return;
    }

    const matches = searchTools(state.query).slice(0, 6);
    state.results = matches;
    state.activeIndex = matches.length ? 0 : -1;

    if (!matches.length) {
      wrap.classList.remove('is-open');
      return;
    }

    listEl.innerHTML = matches.map((tool, idx) => `
      <div class="db-ac-item ${idx === state.activeIndex ? 'is-active' : ''}" data-tool-id="${tool.id}" data-idx="${idx}">
        <div class="db-ac-item__main">
          <img class="db-ac-item__thumb" src="${tool.image}" alt="" />
          <span class="db-ac-item__name">${highlightMatch(tool.brand + ' ' + tool.model, state.query)}</span>
        </div>
        <span class="db-ac-item__mpn">#${highlightMatch(tool.mpn, state.query)}</span>
      </div>
    `).join('');

    wrap.classList.add('is-open');

    listEl.querySelectorAll('.db-ac-item').forEach(el => {
      el.addEventListener('mousedown', (e) => {
        e.preventDefault();
        selectToolAndGo(el.getAttribute('data-tool-id'));
      });
      el.addEventListener('mouseenter', () => {
        state.activeIndex = parseInt(el.getAttribute('data-idx'), 10);
        refreshActiveItem();
      });
    });
  }

  function refreshActiveItem() {
    document.querySelectorAll('#db-autocomplete .db-ac-item').forEach((el, idx) => {
      el.classList.toggle('is-active', idx === state.activeIndex);
    });
  }

  function closeAutocomplete() {
    document.getElementById('db-search-wrap')?.classList.remove('is-open');
  }

  function selectToolAndGo(explicitToolId) {
    // Cannot do anything unless an explicit item is chosen or text was typed
    if (!explicitToolId && (!state.query || !state.query.trim())) {
      return;
    }

    let matched = null;
    if (explicitToolId) {
      matched = TOOLS.find(t => t.id === explicitToolId);
    } else if (state.activeIndex >= 0 && state.results[state.activeIndex]) {
      matched = state.results[state.activeIndex];
    } else if (state.query && state.query.trim()) {
      const found = searchTools(state.query);
      if (found.length) matched = found[0];
    }

    if (!matched) {
      return;
    }

    // Auto-populate brand, model, and combined channel+height on the ULAW product page
    state.brand = matched.brand;
    state.toolId = matched.id;
    state.pouchId = getDefaultPouchId(matched);
    state.customImage = null;

    closeAutocomplete();
    showView('product');
  }

  // ==========================================================================
  // ULAW PRODUCT PAGE
  // ==========================================================================
  function renderProductPage() {
    const cfg = getActiveConfig();
    const { tool } = cfg;
    const activeImgSrc = state.customImage || tool.image;

    // Image
    const imgEl = document.getElementById('db-product-img');
    if (imgEl) {
      imgEl.src = activeImgSrc;
      imgEl.alt = `${tool.brand} ${tool.model} in ULAW Holster`;
    }

    // 5 Real Photo Thumbnails
    const thumbsEl = document.getElementById('db-thumbs');
    if (thumbsEl && PRODUCT_GALLERY) {
      thumbsEl.innerHTML = PRODUCT_GALLERY.map(photo => `
        <button type="button" class="db-thumb ${photo.src === activeImgSrc ? 'is-active' : ''}" data-photo-src="${photo.src}" aria-label="${escapeHtml(photo.alt)}">
          <img src="${photo.src}" alt="${escapeHtml(photo.alt)}" />
        </button>
      `).join('');

      thumbsEl.querySelectorAll('.db-thumb').forEach(btn => {
        btn.addEventListener('click', () => {
          state.customImage = btn.getAttribute('data-photo-src');
          renderProductPage();
        });
      });
    }

    // Price
    const priceEl = document.getElementById('db-product-price');
    if (priceEl) {
      priceEl.textContent = formatPrice(cfg.unitPrice);
    }

    // Brand Selector (Auto-populated)
    const brandSelect = document.getElementById('db-select-brand');
    if (brandSelect) {
      brandSelect.innerHTML = BRANDS.map(b => `
        <option value="${escapeHtml(b)}" ${b === state.brand ? 'selected' : ''}>${escapeHtml(b)}</option>
      `).join('');
    }

    // Model Selector (Auto-populated & filtered by Brand)
    const modelSelect = document.getElementById('db-select-model');
    if (modelSelect) {
      const brandTools = TOOLS.filter(t => t.brand === state.brand);
      modelSelect.innerHTML = brandTools.map(t => `
        <option value="${t.id}" ${t.id === state.toolId ? 'selected' : ''}>
          ${escapeHtml(t.model)} (${escapeHtml(t.mpn)})
        </option>
      `).join('');
    }

    // ULAW Width Selector (Pistol & Rifle Mag Pouch widths, with Recommended tag)
    const recId = getDefaultPouchId(tool);
    const recOpt = MAG_POUCH_OPTIONS.find(p => p.id === recId) || MAG_POUCH_OPTIONS[0];
    const recWidth = recOpt.nominalWidth || 30;
    const activeWidth = cfg.channelWidth <= 30 ? 30 : 60;
    const widthSelect = document.getElementById('db-select-width');
    if (widthSelect) {
      widthSelect.innerHTML = WIDTH_OPTIONS.map(w => {
        const label = w.widthMm === recWidth
          ? `${w.name} (Recommended)`
          : w.name;
        return `<option value="${w.widthMm}" ${w.widthMm === activeWidth ? 'selected' : ''}>${escapeHtml(label)}</option>`;
      }).join('');
    }

    // Combined Channel & Height Selector (9 options: 3 channel types × 3 heights, with Recommended tag)
    const pouchSelect = document.getElementById('db-select-pouch');
    if (pouchSelect) {
      pouchSelect.innerHTML = MAG_POUCH_OPTIONS.map(p => {
        const label = p.id === recId
          ? `${p.name} (Recommended)`
          : p.name;
        return `<option value="${p.id}" ${p.id === state.pouchId ? 'selected' : ''}>${escapeHtml(label)}</option>`;
      }).join('');
    }
  }

  // ==========================================================================
  // CART
  // ==========================================================================
  function addToCart() {
    const cfg = getActiveConfig();
    const { tool } = cfg;
    const key = `${cfg.sku}-${state.pouchId}`;
    const existing = state.cart.find(i => i.key === key);

    if (existing) {
      existing.qty += 1;
    } else {
      state.cart.push({
        key,
        title: 'ULAW Holster',
        brand: tool.brand,
        model: tool.model,
        mpn: tool.mpn,
        pouch: cfg.pouch.name,
        stamp: `ULAW ${cfg.clampMark} · ${cfg.channelMark}`,
        price: cfg.unitPrice,
        qty: 1,
        image: tool.image
      });
    }

    saveCart();
    renderCart();
    openCart();

    // Live Shopify Cart API Integration (POST /cart/add.js)
    const variantId = window.SHOPIFY_VARIANT_ID || document.querySelector('[data-shopify-variant-id]')?.getAttribute('data-shopify-variant-id');
    if (variantId && parseInt(variantId, 10) > 0) {
      fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{
            id: parseInt(variantId, 10),
            quantity: 1,
            properties: {
              'Tool Brand': tool.brand,
              'Tool Model': tool.model,
              'Part Number': tool.mpn,
              'Channel': cfg.pouch.name,
              'Holster Spec': `ULAW ${cfg.clampMark} · ${cfg.channelMark}`
            }
          }]
        })
      }).catch(err => console.log('Shopify Cart Notice:', err));
    }
  }

  function renderCart() {
    const count = state.cart.reduce((s, i) => s + i.qty, 0);
    const total = state.cart.reduce((s, i) => s + i.price * i.qty, 0);

    const cartBtn = document.getElementById('db-cart-btn');
    const countEl = document.getElementById('db-cart-count');
    if (cartBtn) cartBtn.classList.toggle('has-items', count > 0);
    if (countEl) countEl.textContent = count;

    const totalEl = document.getElementById('db-cart-total');
    if (totalEl) totalEl.textContent = formatPrice(total);

    const listEl = document.getElementById('db-cart-list');
    if (!listEl) return;

    if (!state.cart.length) {
      listEl.innerHTML = `<div style="color:var(--db-muted);font-size:0.9rem;text-align:center;padding:32px 0;">Cart is empty</div>`;
      return;
    }

    listEl.innerHTML = state.cart.map((item, idx) => `
      <div class="db-cart-row">
        <img class="db-cart-row__img" src="${item.image}" alt="${escapeHtml(item.model)}">
        <div class="db-cart-row__info">
          <div class="db-cart-row__title">${escapeHtml(item.title)} — ${formatPrice(item.price * item.qty)}</div>
          <div class="db-cart-row__meta">${escapeHtml(item.brand)} ${escapeHtml(item.model)} (#${escapeHtml(item.mpn)})</div>
          <div class="db-cart-row__meta">${escapeHtml(item.pouch)} · Qty ${item.qty}</div>
        </div>
        <button type="button" class="db-cart-row__remove" data-remove="${idx}" aria-label="Remove">✕</button>
      </div>
    `).join('');

    listEl.querySelectorAll('[data-remove]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-remove'), 10);
        state.cart.splice(idx, 1);
        saveCart();
        renderCart();
      });
    });
  }

  function openCart() {
    document.getElementById('db-backdrop')?.classList.add('is-open');
    document.getElementById('db-drawer')?.classList.add('is-open');
  }

  function closeCart() {
    document.getElementById('db-backdrop')?.classList.remove('is-open');
    document.getElementById('db-drawer')?.classList.remove('is-open');
  }

  // ==========================================================================
  // HOME PAGE MOVING STREAM (ONLY THE TWO FLOATING TOOLS, NO BACKGROUND)
  // ==========================================================================
  function renderHomeStream() {
    const trackEl = document.getElementById('db-stream-track');
    const items = STREAM_ITEMS || [];
    if (!trackEl || !items.length) return;

    // Build seamless looping stream using ONLY the two floating tools
    const repeatCount = 6;
    const halfSet = [];
    for (let i = 0; i < repeatCount; i++) {
      halfSet.push(...items);
    }
    const fullLoop = [...halfSet, ...halfSet];

    trackEl.innerHTML = fullLoop.map(item => `
      <div class="db-stream__item" data-tool-id="${item.toolId}" data-photo-src="${item.src}" title="${escapeHtml(item.name)}">
        <img class="db-stream__img" src="${item.src}" alt="${escapeHtml(item.alt)}" />
      </div>
    `).join('');

    trackEl.querySelectorAll('.db-stream__item').forEach(card => {
      card.addEventListener('click', () => {
        const tid = card.getAttribute('data-tool-id');
        const photoSrc = card.getAttribute('data-photo-src');
        selectToolAndGo(tid);
        if (photoSrc) {
          state.customImage = photoSrc;
          renderProductPage();
        }
      });
    });
  }

  // ==========================================================================
  // INIT
  // ==========================================================================
  function init() {
    renderHomeStream();
    renderCart();

    document.getElementById('db-logo')?.addEventListener('click', (e) => {
      e.preventDefault();
      showView('home');
    });

    document.getElementById('db-back-btn')?.addEventListener('click', () => {
      showView('home');
    });

    const searchInput = document.getElementById('db-search-input');
    const searchForm = document.getElementById('db-search-form');
    const clearBtn = document.getElementById('db-search-clear');

    function checkHashRoute() {
      const hash = window.location.hash || '';
      if (hash.startsWith('#product')) {
        const queryIdx = hash.indexOf('?');
        if (queryIdx !== -1) {
          const params = new URLSearchParams(hash.slice(queryIdx + 1));
          const id = params.get('id');
          if (id) {
            const match = TOOLS.find(t => t.id === id);
            if (match) {
              state.brand = match.brand;
              state.toolId = match.id;
              state.pouchId = getDefaultPouchId(match);
            }
          }
        }
        showView('product');
      } else if (hash === '#home' || hash === '') {
        showView('home');
      }
    }
    window.addEventListener('hashchange', checkHashRoute);
    checkHashRoute();

    const submitBtn = document.getElementById('db-search-submit');
    if (submitBtn) submitBtn.disabled = true;

    if (searchInput) {
      searchInput.addEventListener('input', (e) => updateAutocomplete(e.target.value));
      searchInput.addEventListener('focus', (e) => {
        if (e.target.value && e.target.value.trim()) {
          updateAutocomplete(e.target.value);
        }
      });
      searchInput.addEventListener('keydown', (e) => {
        const len = state.results.length;
        if (e.key === 'Enter') {
          if (!searchInput.value || !searchInput.value.trim()) {
            e.preventDefault();
            return;
          }
        } else if (e.key === 'ArrowDown' && len) {
          e.preventDefault();
          state.activeIndex = (state.activeIndex + 1) % len;
          refreshActiveItem();
        } else if (e.key === 'ArrowUp' && len) {
          e.preventDefault();
          state.activeIndex = (state.activeIndex - 1 + len) % len;
          refreshActiveItem();
        } else if (e.key === 'Escape') {
          closeAutocomplete();
        }
      });
    }

    if (searchForm) {
      searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!state.query || !state.query.trim()) {
          return;
        }
        selectToolAndGo(null);
      });
    }

    if (clearBtn && searchInput) {
      clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        updateAutocomplete('');
        searchInput.focus();
      });
    }

    document.addEventListener('click', (e) => {
      const wrap = document.getElementById('db-search-wrap');
      if (wrap && !wrap.contains(e.target)) closeAutocomplete();
    });

    document.getElementById('db-select-brand')?.addEventListener('change', (e) => {
      state.brand = e.target.value;
      const firstMatch = TOOLS.find(t => t.brand === state.brand);
      if (firstMatch) {
        state.toolId = firstMatch.id;
        state.pouchId = getDefaultPouchId(firstMatch);
      }
      state.customImage = null;
      renderProductPage();
    });

    document.getElementById('db-select-model')?.addEventListener('change', (e) => {
      state.toolId = e.target.value;
      const match = TOOLS.find(t => t.id === state.toolId);
      if (match) {
        state.pouchId = getDefaultPouchId(match);
      }
      state.customImage = null;
      renderProductPage();
    });

    document.getElementById('db-select-width')?.addEventListener('change', (e) => {
      const targetWidth = parseInt(e.target.value, 10) || 30;
      const currentOpt = MAG_POUCH_OPTIONS.find(p => p.id === state.pouchId) || MAG_POUCH_OPTIONS[0];
      const h = currentOpt.nominalHeight || 125;
      if (targetWidth <= 30) {
        state.pouchId = `single_30_${h}`;
      } else {
        const recId = getDefaultPouchId(getSelectedTool());
        const prefix = recId.startsWith('div_60_30_30') ? 'div_60_30_30' : 'single_60';
        state.pouchId = `${prefix}_${h}`;
      }
      renderProductPage();
    });

    document.getElementById('db-select-pouch')?.addEventListener('change', (e) => {
      state.pouchId = e.target.value;
      renderProductPage();
    });

    document.getElementById('db-add-btn')?.addEventListener('click', addToCart);
    document.getElementById('db-cart-btn')?.addEventListener('click', openCart);
    document.getElementById('db-drawer-close')?.addEventListener('click', closeCart);
    document.getElementById('db-backdrop')?.addEventListener('click', closeCart);

    document.querySelector('.db-checkout-btn')?.addEventListener('click', () => {
      if (window.Shopify || window.SHOPIFY_VARIANT_ID || window.location.pathname.includes('/pages/')) {
        window.location.href = '/checkout';
      } else {
        alert('Cart Total: ' + (document.getElementById('db-cart-total')?.textContent || '$0') + '\n\nWhen connected to Shopify, this redirects straight to Shopify Checkout (/checkout).');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
