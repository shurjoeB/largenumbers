import {
  formatCrore,
  ratioDisplay,
  selectBestReference,
  generateComparison,
  buildVisualData
} from './compare.js';

// ─── State ───────────────────────────────────────────────────────────────────
const state = {
  categories: [],
  references: [],
  categoryId: null,
  itemId: null,
  referenceId: null, // null = auto
};

// ─── Data Loading ─────────────────────────────────────────────────────────────
async function loadData() {
  const [refs, scams, govt, corp] = await Promise.all([
    fetch('data/references.json').then(r => r.json()),
    fetch('data/scams.json').then(r => r.json()),
    fetch('data/government.json').then(r => r.json()),
    fetch('data/corporate.json').then(r => r.json()),
  ]);
  state.references = refs;
  state.categories = [scams, govt, corp];
}

// ─── URL State ────────────────────────────────────────────────────────────────
function readURL() {
  const p = new URLSearchParams(window.location.search);
  state.categoryId = p.get('cat') || 'scams';
  state.itemId = p.get('item') || null;
  state.referenceId = p.get('ref') || null;
}

function writeURL() {
  const p = new URLSearchParams();
  if (state.categoryId) p.set('cat', state.categoryId);
  if (state.itemId) p.set('item', state.itemId);
  if (state.referenceId) p.set('ref', state.referenceId);
  const url = `${window.location.pathname}?${p.toString()}`;
  window.history.replaceState({}, '', url);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function currentCategory() {
  return state.categories.find(c => c.id === state.categoryId) || state.categories[0];
}

function currentItem() {
  const cat = currentCategory();
  return cat ? cat.items.find(i => i.id === state.itemId) : null;
}

function currentReference(item) {
  if (state.referenceId) {
    return state.references.find(r => r.id === state.referenceId) || null;
  }
  return item ? selectBestReference(item.value, state.references) : null;
}

// ─── Rendering ────────────────────────────────────────────────────────────────
function renderCategoryTabs() {
  const container = document.getElementById('category-tabs');
  container.innerHTML = state.categories
    .map(cat => `
      <button
        class="tab-btn${cat.id === state.categoryId ? ' active' : ''}"
        data-cat="${cat.id}"
        aria-pressed="${cat.id === state.categoryId}"
      >
        <span class="tab-emoji">${cat.emoji}</span>
        <span>${cat.label}</span>
      </button>
    `)
    .join('');

  container.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.categoryId = btn.dataset.cat;
      state.itemId = null;
      state.referenceId = null;
      writeURL();
      render();
    });
  });

  // Scroll active tab into view within the container (after layout)
  const active = container.querySelector('.tab-btn.active');
  if (active) {
    requestAnimationFrame(() => {
      const btnLeft = active.offsetLeft;
      const btnW = active.offsetWidth;
      const containerW = container.clientWidth;
      container.scrollLeft = Math.max(0, btnLeft - containerW / 2 + btnW / 2);
    });
  }
}

function renderItemList() {
  const cat = currentCategory();
  if (!cat) return;

  const container = document.getElementById('item-list');
  container.innerHTML = cat.items
    .map(item => `
      <button
        class="item-card${item.id === state.itemId ? ' active' : ''}"
        data-item="${item.id}"
        aria-pressed="${item.id === state.itemId}"
      >
        <span class="item-label">${item.label}</span>
        <span class="item-value">${formatCrore(item.value)}</span>
        <span class="item-year">${item.year}</span>
      </button>
    `)
    .join('');

  container.querySelectorAll('.item-card').forEach(btn => {
    btn.addEventListener('click', () => {
      state.itemId = btn.dataset.item;
      state.referenceId = null; // reset to auto
      writeURL();
      render();

      // On mobile: scroll to comparison
      const comp = document.getElementById('comparison-panel');
      if (comp && window.innerWidth < 768) {
        comp.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

function renderRefDropdown(item, selectedRef) {
  const container = document.getElementById('ref-dropdown-wrap');
  if (!container) return;

  // Only include references with sensible ratios
  const sensible = state.references.filter(r => {
    const ratio = item.value / r.value;
    return ratio >= 0.005 && ratio <= 200000;
  });

  const opts = sensible
    .map(r => `<option value="${r.id}"${r.id === selectedRef.id ? ' selected' : ''}>${r.emoji} ${r.shortLabel || r.label}</option>`)
    .join('');

  container.innerHTML = `
    <label for="ref-select" class="ref-label">Compare to</label>
    <select id="ref-select" class="ref-select">
      ${opts}
    </select>
  `;

  document.getElementById('ref-select').addEventListener('change', e => {
    state.referenceId = e.target.value;
    writeURL();
    renderComparison();
  });
}

function renderComparison() {
  const panel = document.getElementById('comparison-panel');
  const item = currentItem();

  if (!item) {
    panel.innerHTML = `
      <div class="empty-state">
        <p>← Pick a number from the list to see it in context.</p>
      </div>
    `;
    return;
  }

  const ref = currentReference(item);
  if (!ref) return;

  const { ratio, headline, subline } = generateComparison(item, ref);
  const { cells, overflowCount, groupSize, groupLabel } = buildVisualData(ratio);

  const shareURL = `${window.location.origin}${window.location.pathname}?cat=${state.categoryId}&item=${item.id}&ref=${ref.id}`;

  // Build dot grid
  const dots = cells.map(cell => {
    if (cell.type === 'partial') {
      return `<div class="dot dot-partial" style="--fill:${(cell.fill * 100).toFixed(0)}%" title="${(cell.fill * 100).toFixed(0)}% of one ${ref.shortLabel || ref.label}"></div>`;
    }
    return `<div class="dot dot-full" title="1${groupSize > 1 ? `×${groupSize}` : ''}× ${ref.shortLabel || ref.label}"></div>`;
  }).join('');

  const overflowNote = overflowCount > 0
    ? `<p class="overflow-note">+ ${overflowCount.toLocaleString('en-IN')} more squares not shown</p>`
    : '';

  panel.innerHTML = `
    <div class="comparison-card">
      <div class="comparison-header">
        <h2 class="item-name-display">${item.label}</h2>
        <span class="item-value-display">${formatCrore(item.value)} · ${item.year}</span>
      </div>

      <div class="ratio-hero">
        <span class="ratio-number">${headline}</span>
        <span class="ratio-ref">the ${ref.shortLabel || ref.label}</span>
      </div>

      <p class="comparison-sentence">${subline}</p>

      <div class="dot-grid" aria-label="Visual representation of the ratio">
        ${dots}
      </div>
      ${overflowNote}
      ${cells.length > 0 && groupSize > 1 ? `<p class="group-label">${groupLabel} · ${ref.emoji} ${ref.shortLabel || ref.label}</p>` : ''}
      ${cells.length > 0 && groupSize === 1 ? `<p class="group-label">${ref.emoji} each square = ${ref.shortLabel || ref.label}</p>` : ''}

      <div id="ref-dropdown-wrap" class="ref-dropdown-wrap"></div>

      <div class="item-context">
        <p class="context-text">${item.context}</p>
      </div>

      <div class="sources-row">
        <span class="sources-label">Sources:</span>
        <a href="${item.source}" target="_blank" rel="noopener" class="source-link">${item.sourceLabel} ↗</a>
        <a href="${ref.source}" target="_blank" rel="noopener" class="source-link">${ref.sourceLabel} ↗</a>
      </div>

      <div class="share-row">
        <button class="share-btn" data-url="${shareURL}" aria-label="Copy shareable link">
          🔗 Copy link
        </button>
      </div>
    </div>
  `;

  renderRefDropdown(item, ref);

  // Share button
  panel.querySelector('.share-btn').addEventListener('click', async (e) => {
    const url = e.currentTarget.dataset.url;
    try {
      await navigator.clipboard.writeText(url);
      e.currentTarget.textContent = '✓ Copied!';
      setTimeout(() => { e.currentTarget.textContent = '🔗 Copy link'; }, 2000);
    } catch {
      prompt('Copy this link:', url);
    }
  });
}

function renderWelcomeState() {
  const panel = document.getElementById('comparison-panel');
  panel.innerHTML = `
    <div class="empty-state">
      <div class="welcome-icon">🔢</div>
      <h2 class="welcome-title">Pick a number</h2>
      <p class="welcome-sub">Select any item on the left to see it in context — compared to something you already understand.</p>
    </div>
  `;
}

function render() {
  renderCategoryTabs();
  renderItemList();
  if (state.itemId) {
    renderComparison();
  } else {
    renderWelcomeState();
  }
}

// ─── Init ─────────────────────────────────────────────────────────────────────
async function init() {
  readURL();
  await loadData();
  render();
}

init();
