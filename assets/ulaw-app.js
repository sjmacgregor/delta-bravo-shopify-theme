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

  // Simple Tool Names for Home & Product Search Autofill (e.g. "Screwdriver")
  const TOOL_TYPES = [
    {
      name: 'Screwdriver',
      category: 'Screwdrivers',
      keywords: ['screwdriver', 'screwdrivers', 'driver', 'phillips', 'flathead', 'slotted', 'kraftform', 'picofinish', 'stubby', 'ratcheting']
    },
    {
      name: 'Pliers',
      category: 'Pliers & Wrenches',
      keywords: ['pliers', 'plier', 'cobra', 'twingrip', 'linesman', 'lineman', 'needle nose', 'diagonal', 'cutters', 'dykes', 'channellock', 'wire stripper', 'stripper']
    },
    {
      name: 'Wrench',
      category: 'Pliers & Wrenches',
      keywords: ['wrench', 'wrenches', 'crescent', 'adjustable wrench', 'spud']
    },
    {
      name: 'Utility Knife',
      category: 'Utility & Folding Knives',
      keywords: ['utility knife', 'knife', 'knives', 'fastback', 'box cutter', 'blade', '99e', 'folding knife']
    },
    {
      name: 'Scissors & Shears',
      category: 'Utility & Folding Knives',
      keywords: ['scissors', 'shears', 'snips', 'offset scissors']
    },
    {
      name: 'Multi-Tool',
      category: 'Multi-Tools',
      keywords: ['multi-tool', 'multitool', 'leatherman', 'wave', 'arc', 'skeletool', 'swisstool', 'victorinox']
    },
    {
      name: 'Marker',
      category: 'Markers & Pencils',
      keywords: ['marker', 'markers', 'sharpie', 'ink', 'pica big', 'permanent marker']
    },
    {
      name: 'Carpenter Pencil',
      category: 'Markers & Pencils',
      keywords: ['pencil', 'pencils', 'carpenter pencil', 'pica-dry', 'pica dry']
    },
    {
      name: 'Tape Measure',
      category: 'Tape Measures & Levels',
      keywords: ['tape measure', 'tape', 'fatmax', 'powerlock', 'stud', 'bm 300']
    },
    {
      name: 'Torpedo Level',
      category: 'Tape Measures & Levels',
      keywords: ['level', 'torpedo', 'torpedo level', 'spirit level', 'stabila', 'empire']
    },
    {
      name: 'Wood Chisel',
      category: 'Woodworking & Chisels',
      keywords: ['chisel', 'chisels', 'wood chisel', 'bevel-edge', 'buck bros', 'narex']
    }
  ];

  function getToolTypeForTool(tool) {
    if (!tool) return TOOL_TYPES[0];
    const m = (tool.model || '').toLowerCase();
    if (m.includes('wrench')) return TOOL_TYPES.find(t => t.name === 'Wrench') || TOOL_TYPES[1];
    if (m.includes('scissor') || m.includes('shear')) return TOOL_TYPES.find(t => t.name === 'Scissors & Shears') || TOOL_TYPES[3];
    if (m.includes('pencil') || m.includes('pica-dry')) return TOOL_TYPES.find(t => t.name === 'Carpenter Pencil') || TOOL_TYPES[6];
    if (m.includes('level')) return TOOL_TYPES.find(t => t.name === 'Torpedo Level') || TOOL_TYPES[8];
    return TOOL_TYPES.find(t => t.category === tool.category) || TOOL_TYPES[0];
  }

  function getToolsForType(typeObj) {
    if (!typeObj) return TOOLS;
    if (typeObj.name === 'Wrench') {
      const m = TOOLS.filter(t => t.category === 'Pliers & Wrenches' && t.model.toLowerCase().includes('wrench'));
      if (m.length) return m;
    } else if (typeObj.name === 'Pliers') {
      const m = TOOLS.filter(t => t.category === 'Pliers & Wrenches' && !t.model.toLowerCase().includes('wrench'));
      if (m.length) return m;
    } else if (typeObj.name === 'Scissors & Shears') {
      const m = TOOLS.filter(t => t.category === 'Utility & Folding Knives' && (t.model.toLowerCase().includes('scissor') || t.model.toLowerCase().includes('shear')));
      if (m.length) return m;
    } else if (typeObj.name === 'Utility Knife') {
      const m = TOOLS.filter(t => t.category === 'Utility & Folding Knives' && !t.model.toLowerCase().includes('scissor'));
      if (m.length) return m;
    } else if (typeObj.name === 'Carpenter Pencil') {
      const m = TOOLS.filter(t => t.category === 'Markers & Pencils' && t.model.toLowerCase().includes('pencil'));
      if (m.length) return m;
    } else if (typeObj.name === 'Marker') {
      const m = TOOLS.filter(t => t.category === 'Markers & Pencils' && !t.model.toLowerCase().includes('pencil'));
      if (m.length) return m;
    } else if (typeObj.name === 'Torpedo Level') {
      const m = TOOLS.filter(t => t.category === 'Tape Measures & Levels' && t.model.toLowerCase().includes('level'));
      if (m.length) return m;
    } else if (typeObj.name === 'Tape Measure') {
      const m = TOOLS.filter(t => t.category === 'Tape Measures & Levels' && !t.model.toLowerCase().includes('level'));
      if (m.length) return m;
    }
    const byCat = TOOLS.filter(t => t.category === typeObj.category);
    return byCat.length ? byCat : TOOLS;
  }

  function matchToolTypes(query) {
    const q = (query || '').trim().toLowerCase();
    if (!q) return TOOL_TYPES;

    const scored = TOOL_TYPES.map(typeObj => {
      const nameLower = typeObj.name.toLowerCase();
      let score = 0;
      if (nameLower === q) score += 120;
      else if (nameLower.startsWith(q)) score += 90;
      else if (nameLower.includes(q)) score += 70;

      for (const kw of typeObj.keywords) {
        if (kw === q) score += 80;
        else if (kw.startsWith(q)) score += 50;
        else if (kw.includes(q) || q.includes(kw)) score += 30;
      }

      // Also check if a user typed a brand or model belonging to this tool type
      const matchingTools = getToolsForType(typeObj);
      for (const t of matchingTools) {
        if (t.brand.toLowerCase().includes(q) || t.model.toLowerCase().includes(q) || t.mpn.toLowerCase().includes(q)) {
          score += 25;
          break;
        }
      }
      return { typeObj, score };
    })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score);

    return scored.map(s => s.typeObj);
  }

  function getDefaultPouchId(tool) {
    if (typeof getRecommendedChannelId === 'function') {
      return getRecommendedChannelId(tool);
    }
    if (!tool) return 'single_30_125';
    if (tool.defaultClampDepth > 24 || tool.defaultChannelWidth > 60) {
      return 'custom';
    }
    const hRaw = parseInt(tool.defaultChannelHeight, 10) || 125;
    const h = hRaw <= 100 ? 100 : (hRaw >= 150 ? 150 : 125);
    const prefix = tool.defaultChannelWidth >= 60 ? 'single_60' : 'single_30';
    const id = `${prefix}_${h}`;
    return MAG_POUCH_OPTIONS.some(p => p.id === id) ? id : MAG_POUCH_OPTIONS[0].id;
  }

  const state = {
    view: 'home',
    query: '',
    results: [],
    activeIndex: -1,
    productQuery: '',
    productResults: [],
    productActiveIndex: -1,
    toolTypeName: getToolTypeForTool(TOOLS[0]).name,
    brand: TOOLS[0].brand,
    toolId: TOOLS[0].id,
    pouchId: getDefaultPouchId(TOOLS[0]),
    heightOverride: 'auto',
    customWidthMm: TOOLS[0].defaultChannelWidth || 45,
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
    const tokens = query.trim().split(/\s+/).filter(t => t.length >= 1);
    if (!tokens.length) return escapeHtml(text);
    const rx = new RegExp(`(${tokens.map(escapeRegExp).join('|')})`, 'gi');
    return escapeHtml(text).replace(rx, '<mark>$1</mark>');
  }

  function getSelectedTool() {
    return TOOLS.find(t => t.id === state.toolId) || TOOLS[0];
  }

  function getActiveConfig() {
    return computeUlawConfiguration(getSelectedTool(), state.pouchId, state.heightOverride, 'inlay', state.customWidthMm);
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
  // HOME SEARCH & AUTOCOMPLETE (JUST THE TOOL NAME, E.G. "SCREWDRIVER")
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

    const matches = matchToolTypes(state.query).slice(0, 6);
    state.results = matches;
    state.activeIndex = matches.length ? 0 : -1;

    if (!matches.length) {
      wrap.classList.remove('is-open');
      return;
    }

    // Autofill list showing ONLY the tool name (e.g. "Screwdriver")
    listEl.innerHTML = matches.map((typeObj, idx) => `
      <div class="db-ac-item ${idx === state.activeIndex ? 'is-active' : ''}" data-type-name="${escapeHtml(typeObj.name)}" data-idx="${idx}">
        <div class="db-ac-item__main">
          <span class="db-ac-item__name">${highlightMatch(typeObj.name, state.query)}</span>
        </div>
      </div>
    `).join('');

    wrap.classList.add('is-open');

    listEl.querySelectorAll('.db-ac-item').forEach(el => {
      el.addEventListener('mousedown', (e) => {
        e.preventDefault();
        selectToolTypeAndGo(el.getAttribute('data-type-name'));
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

  // ==========================================================================
  // PRODUCT PAGE TOOL SEARCH & AUTOFILL
  // ==========================================================================
  function updateProductAutocomplete(query) {
    state.productQuery = query || '';
    const hasText = state.productQuery.trim().length > 0;

    const clearBtn = document.getElementById('db-product-search-clear');
    if (clearBtn) clearBtn.classList.toggle('is-visible', hasText);

    const wrap = document.getElementById('db-product-search-wrap');
    const listEl = document.getElementById('db-product-autocomplete');
    if (!wrap || !listEl) return;

    const matches = matchToolTypes(state.productQuery).slice(0, 8);
    state.productResults = matches;
    state.productActiveIndex = matches.length ? 0 : -1;

    if (!matches.length) {
      wrap.classList.remove('is-open');
      return;
    }

    listEl.innerHTML = matches.map((typeObj, idx) => `
      <div class="db-ac-item ${idx === state.productActiveIndex ? 'is-active' : ''}" data-type-name="${escapeHtml(typeObj.name)}" data-idx="${idx}">
        <div class="db-ac-item__main">
          <span class="db-ac-item__name">${highlightMatch(typeObj.name, state.productQuery)}</span>
        </div>
      </div>
    `).join('');

    wrap.classList.add('is-open');

    listEl.querySelectorAll('.db-ac-item').forEach(el => {
      el.addEventListener('mousedown', (e) => {
        e.preventDefault();
        applyToolTypeOnProductPage(el.getAttribute('data-type-name'));
      });
      el.addEventListener('mouseenter', () => {
        state.productActiveIndex = parseInt(el.getAttribute('data-idx'), 10);
        refreshProductActiveItem();
      });
    });
  }

  function refreshProductActiveItem() {
    document.querySelectorAll('#db-product-autocomplete .db-ac-item').forEach((el, idx) => {
      el.classList.toggle('is-active', idx === state.productActiveIndex);
    });
  }

  function closeProductAutocomplete() {
    document.getElementById('db-product-search-wrap')?.classList.remove('is-open');
  }

  function applyToolTypeOnProductPage(typeName) {
    const typeObj = TOOL_TYPES.find(t => t.name.toLowerCase() === String(typeName || '').toLowerCase())
      || matchToolTypes(typeName)[0]
      || TOOL_TYPES[0];

    state.toolTypeName = typeObj.name;
    state.productQuery = typeObj.name;
    const toolsInType = getToolsForType(typeObj);
    const firstTool = toolsInType[0] || TOOLS[0];

    state.brand = firstTool.brand;
    state.toolId = firstTool.id;
    state.pouchId = getDefaultPouchId(firstTool);
    state.heightOverride = 'auto';
    state.customWidthMm = firstTool.defaultChannelWidth || 45;
    state.customImage = null;

    const homeInput = document.getElementById('db-search-input');
    if (homeInput) homeInput.value = typeObj.name;

    closeProductAutocomplete();
    renderProductPage();
  }

  function selectToolTypeAndGo(explicitTypeName) {
    let typeObj = null;
    if (explicitTypeName) {
      typeObj = TOOL_TYPES.find(t => t.name.toLowerCase() === explicitTypeName.toLowerCase());
    }
    if (!typeObj && state.activeIndex >= 0 && state.results[state.activeIndex]) {
      typeObj = state.results[state.activeIndex];
    }
    if (!typeObj && state.query && state.query.trim()) {
      const matchedTypes = matchToolTypes(state.query);
      if (matchedTypes.length) typeObj = matchedTypes[0];
    }
    if (!typeObj) return;

    const homeInput = document.getElementById('db-search-input');
    if (homeInput) homeInput.value = typeObj.name;

    applyToolTypeOnProductPage(typeObj.name);
    closeAutocomplete();
    showView('product');
  }

  function selectToolAndGo(explicitToolId) {
    if (!explicitToolId && (!state.query || !state.query.trim())) {
      return;
    }

    if (!explicitToolId) {
      selectToolTypeAndGo(null);
      return;
    }

    const matched = TOOLS.find(t => t.id === explicitToolId);
    if (!matched) return;

    const typeObj = getToolTypeForTool(matched);
    state.toolTypeName = typeObj.name;
    state.productQuery = typeObj.name;
    state.brand = matched.brand;
    state.toolId = matched.id;
    state.pouchId = getDefaultPouchId(matched);
    state.heightOverride = 'auto';
    state.customWidthMm = matched.defaultChannelWidth || 45;
    state.customImage = null;

    closeAutocomplete();
    showView('product');
  }

  // ==========================================================================
  // ULAW PRODUCT PAGE (TOOL SEARCH + BRAND POP-DOWN + MODEL POP-DOWN ONLY)
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

    // Tool Pop-Down
    const typeObj = TOOL_TYPES.find(t => t.name === state.toolTypeName) || getToolTypeForTool(tool);
    state.toolTypeName = typeObj.name;
    const toolSelect = document.getElementById('db-select-tool');
    if (toolSelect) {
      toolSelect.innerHTML = TOOL_TYPES.map(t => `
        <option value="${escapeHtml(t.name)}" ${t.name === state.toolTypeName ? 'selected' : ''}>${escapeHtml(t.name)}</option>
      `).join('');
    }

    // Filter Brands and Models to the selected Tool Type
    const toolsInType = getToolsForType(typeObj);
    const availableBrands = Array.from(new Set(toolsInType.map(t => t.brand)));
    if (!availableBrands.includes(state.brand)) {
      state.brand = availableBrands[0] || tool.brand;
    }

    // Brand Pop-Down
    const brandSelect = document.getElementById('db-select-brand');
    if (brandSelect) {
      brandSelect.innerHTML = availableBrands.map(b => `
        <option value="${escapeHtml(b)}" ${b === state.brand ? 'selected' : ''}>${escapeHtml(b)}</option>
      `).join('');
    }

    // Model Pop-Down (filtered by Tool Type + Brand)
    const modelSelect = document.getElementById('db-select-model');
    if (modelSelect) {
      let brandTools = toolsInType.filter(t => t.brand === state.brand);
      if (!brandTools.length) {
        brandTools = TOOLS.filter(t => t.brand === state.brand);
      }
      modelSelect.innerHTML = brandTools.map(t => `
        <option value="${t.id}" ${t.id === state.toolId ? 'selected' : ''}>
          ${escapeHtml(t.model)}
        </option>
      `).join('');
    }
  }

  // ==========================================================================
  // CART & FIRST ORDER BOGO DEAL (BUY 1 GET 1 FREE — MAX 1 FREE ULAW PER ORDER)
  // ==========================================================================
  const BOGO_MAX_FREE_ULAWS = 1; // Limit 1 free ULAW on the first order (buying 8 ULAWs = 1 free, 7 paid)

  function computeCartBogo(cart) {
    let unitIndex = 0;
    let subtotal = 0;
    let discount = 0;
    let freeCount = 0;
    let paidCount = 0;

    const rowBreakdown = cart.map(item => {
      let rowPaidQty = 0;
      let rowFreeQty = 0;
      const qty = Math.max(0, parseInt(item.qty, 10) || 0);
      for (let u = 0; u < qty; u++) {
        unitIndex += 1;
        subtotal += item.price;
        // Buy 1 Get 1 Free on first order, capped at 1 free ULAW total (the 2nd unit is FREE)
        if (unitIndex === 2 && freeCount < BOGO_MAX_FREE_ULAWS) {
          rowFreeQty += 1;
          freeCount += 1;
          discount += item.price;
        } else {
          rowPaidQty += 1;
          paidCount += 1;
        }
      }
      const rowSubtotal = item.price * qty;
      const rowDiscount = item.price * rowFreeQty;
      return {
        rowSubtotal,
        rowDiscount,
        rowTotal: Math.max(0, rowSubtotal - rowDiscount),
        rowPaidQty,
        rowFreeQty
      };
    });

    const totalQty = unitIndex;
    const canClaimFreeSecond = totalQty === 1 && freeCount === 0;

    return {
      totalQty,
      paidCount,
      freeCount,
      canClaimFreeSecond,
      subtotal,
      discount,
      total: Math.max(0, subtotal - discount),
      rowBreakdown
    };
  }

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

    const promo = computeCartBogo(state.cart);

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
              'Holster Spec': `ULAW ${cfg.clampMark} · ${cfg.channelMark}`,
              'Promo Deal': `First Order Buy 1 Get 1 Free (${promo.freeCount}/1 Free ULAW Applied)`
            }
          }]
        })
      }).catch(err => console.log('Shopify Cart Notice:', err));
    }
  }

  function renderCart() {
    const promo = computeCartBogo(state.cart);
    const count = promo.totalQty;

    const cartBtn = document.getElementById('db-cart-btn');
    const countEl = document.getElementById('db-cart-count');
    if (cartBtn) cartBtn.classList.toggle('has-items', count > 0);
    if (countEl) countEl.textContent = count;

    const subtotalRowEl = document.getElementById('db-cart-subtotal-row');
    const subtotalEl = document.getElementById('db-cart-subtotal');
    const discountRowEl = document.getElementById('db-cart-discount-row');
    const discountLabelEl = document.getElementById('db-cart-discount-label');
    const discountEl = document.getElementById('db-cart-discount');
    const totalEl = document.getElementById('db-cart-total');

    if (subtotalRowEl && subtotalEl) {
      subtotalRowEl.style.display = promo.discount > 0 ? 'flex' : 'none';
      subtotalEl.textContent = formatPrice(promo.subtotal);
    }
    if (discountRowEl && discountEl) {
      discountRowEl.style.display = promo.discount > 0 ? 'flex' : 'none';
      if (discountLabelEl) {
        discountLabelEl.textContent = 'First Order BOGO (1 Free)';
      }
      discountEl.textContent = `-${formatPrice(promo.discount)}`;
    }
    if (totalEl) {
      totalEl.textContent = formatPrice(promo.total);
    }

    const bannerEl = document.getElementById('db-cart-bogo-banner');
    if (bannerEl) {
      if (count === 0) {
        bannerEl.innerHTML = `
          <div class="db-bogo-note">
            <span class="db-bogo-note__badge">FIRST ORDER</span>
            <span><strong>Buy One Get One Free</strong> on your first order (limit 1 free ULAW)!</span>
          </div>
        `;
      } else if (promo.canClaimFreeSecond) {
        bannerEl.innerHTML = `
          <div class="db-bogo-note db-bogo-note--action">
            <div class="db-bogo-note__top">
              <span class="db-bogo-note__badge">1 FREE UNLOCKED</span>
              <span>First Order Deal: Your 2nd ULAW is <strong>FREE</strong>!</span>
            </div>
            <button type="button" class="db-bogo-claim-btn" id="db-bogo-claim-btn">
              + Add 1 Free ULAW ($0)
            </button>
          </div>
        `;
        bannerEl.querySelector('#db-bogo-claim-btn')?.addEventListener('click', () => {
          if (state.cart.length > 0) {
            state.cart[state.cart.length - 1].qty += 1;
            saveCart();
            renderCart();
          }
        });
      } else {
        bannerEl.innerHTML = `
          <div class="db-bogo-note db-bogo-note--applied">
            <span class="db-bogo-note__badge">BOGO APPLIED</span>
            <span><strong>1 FREE ULAW</strong> applied (-${formatPrice(promo.discount)}) · Limit 1 free on first order</span>
          </div>
        `;
      }
    }

    const listEl = document.getElementById('db-cart-list');
    if (!listEl) return;

    if (!state.cart.length) {
      listEl.innerHTML = `<div style="color:var(--db-muted);font-size:0.9rem;text-align:center;padding:32px 0;">Cart is empty</div>`;
      return;
    }

    listEl.innerHTML = state.cart.map((item, idx) => {
      const rb = promo.rowBreakdown[idx];
      const priceHtml = rb.rowFreeQty > 0
        ? `<span class="db-cart-row__strike">${formatPrice(rb.rowSubtotal)}</span> <span class="db-cart-row__final">${rb.rowTotal === 0 ? 'FREE' : formatPrice(rb.rowTotal)}</span>`
        : `${formatPrice(rb.rowSubtotal)}`;
      const discountBadgeHtml = rb.rowFreeQty > 0
        ? `<span class="db-cart-row__bogo-tag">1 FREE (BOGO)</span>`
        : '';

      return `
        <div class="db-cart-row">
          <img class="db-cart-row__img" src="${item.image}" alt="${escapeHtml(item.model)}">
          <div class="db-cart-row__info">
            <div class="db-cart-row__title">
              <span>${escapeHtml(item.title)} — ${priceHtml}</span>
              ${discountBadgeHtml}
            </div>
            <div class="db-cart-row__meta">${escapeHtml(item.brand)} ${escapeHtml(item.model)} (#${escapeHtml(item.mpn)})</div>
            <div class="db-cart-row__controls">
              <span class="db-cart-row__meta">${escapeHtml(item.pouch)}</span>
              <div class="db-cart-qty">
                <button type="button" class="db-cart-qty__btn" data-qty-dec="${idx}" aria-label="Decrease quantity">&minus;</button>
                <span class="db-cart-qty__val">${item.qty}</span>
                <button type="button" class="db-cart-qty__btn" data-qty-inc="${idx}" aria-label="Increase quantity">+</button>
              </div>
            </div>
          </div>
          <button type="button" class="db-cart-row__remove" data-remove="${idx}" aria-label="Remove">✕</button>
        </div>
      `;
    }).join('');

    listEl.querySelectorAll('[data-qty-dec]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-qty-dec'), 10);
        if (!state.cart[idx]) return;
        if (state.cart[idx].qty > 1) {
          state.cart[idx].qty -= 1;
        } else {
          state.cart.splice(idx, 1);
        }
        saveCart();
        renderCart();
      });
    });

    listEl.querySelectorAll('[data-qty-inc]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-qty-inc'), 10);
        if (!state.cart[idx]) return;
        state.cart[idx].qty += 1;
        saveCart();
        renderCart();
      });
    });

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

    document.getElementById('db-select-tool')?.addEventListener('change', (e) => {
      applyToolTypeOnProductPage(e.target.value);
    });

    document.getElementById('db-select-brand')?.addEventListener('change', (e) => {
      state.brand = e.target.value;
      const typeObj = TOOL_TYPES.find(t => t.name === state.toolTypeName);
      const toolsInType = getToolsForType(typeObj);
      const firstMatch = toolsInType.find(t => t.brand === state.brand) || TOOLS.find(t => t.brand === state.brand);
      if (firstMatch) {
        state.toolId = firstMatch.id;
        state.pouchId = getDefaultPouchId(firstMatch);
        state.heightOverride = 'auto';
        state.customWidthMm = firstMatch.defaultChannelWidth || 45;
      }
      state.customImage = null;
      renderProductPage();
    });

    document.getElementById('db-select-model')?.addEventListener('change', (e) => {
      state.toolId = e.target.value;
      const match = TOOLS.find(t => t.id === state.toolId);
      if (match) {
        state.pouchId = getDefaultPouchId(match);
        state.heightOverride = 'auto';
        state.customWidthMm = match.defaultChannelWidth || 45;
      }
      state.customImage = null;
      renderProductPage();
    });

    document.getElementById('db-select-pouch')?.addEventListener('change', (e) => {
      state.pouchId = e.target.value || 'single_30_125';
      state.heightOverride = 'auto';
      renderProductPage();
      if (state.pouchId === 'custom') {
        document.getElementById('db-custom-width-input')?.focus();
      }
    });

    document.getElementById('db-custom-width-input')?.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      if (!isNaN(val)) {
        state.customWidthMm = Math.max(15, Math.min(120, val));
        const cfg = getActiveConfig();
        const priceEl = document.getElementById('db-product-price');
        if (priceEl) {
          priceEl.textContent = formatPrice(cfg.unitPrice);
        }
      }
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
