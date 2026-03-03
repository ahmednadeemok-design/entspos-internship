import './style.css';

import { fetchProducts } from './data/api';
import { debounce } from './utils/debounce';
import { throttle } from './utils/throttle';
import { computeStats } from './utils/stats';
import { downloadJSON } from './utils/export';
import { dedupeById } from './utils/dedupe';

import { createAuditCounters } from './audits/counters';
import { LowStockAudit, TopValueAudit } from './audits/audits';
import { GenericTable } from './ui/table';
import { renderGrid } from './ui/dom';

import legacyLogger = require('./cjs/legacyLogger.cjs');

type ProductItem = import('./models/productProto').ProductItem;
type BulkUpdate = Partial<Pick<ProductItem, 'title' | 'price'>>;

const searchInput = document.querySelector('#searchInput') as HTMLInputElement;
const exportBtn = document.querySelector('#exportBtn') as HTMLButtonElement;
const refreshBtn = document.querySelector('#refreshBtn') as HTMLButtonElement;

const statsEl = document.querySelector('#stats') as HTMLElement;
const grid = document.querySelector('#grid') as HTMLElement;
const auditRoot = document.querySelector('#auditTable') as HTMLElement;
const loadHint = document.querySelector('#loadHint') as HTMLElement;

const bulkForm = document.querySelector('#bulkForm') as HTMLFormElement;
const bulkName = document.querySelector('#bulkName') as HTMLInputElement;
const bulkPrice = document.querySelector('#bulkPrice') as HTMLInputElement;

const selected = new Set<number>();
const counters = createAuditCounters();

let allItems: ProductItem[] = [];
let visibleCount = 20;
let q = '';

function filteredVisible() {
  const s = q.trim().toLowerCase();
  const base = s ? allItems.filter((p) => p.title.toLowerCase().includes(s)) : allItems;
  return base.slice(0, visibleCount);
}

function updateStatsUI() {
  const st = computeStats(allItems);
  statsEl.textContent = `Total=${st.total} | LowStock=${st.lowStock} | TopExpensive=${st.topExpensive}`;
}

function runAudits() {
  counters.incRuns();

  const audits = [new LowStockAudit(), new TopValueAudit()];
  const rows = audits.flatMap((a) => a.run(allItems).map((r) => ({ audit: a.name, ...r })));

  const table = new GenericTable<{ audit: string; label: string; value: string }>([
    { header: 'Audit', cell: (r) => r.audit },
    { header: 'Metric', cell: (r) => r.label },
    { header: 'Value', cell: (r) => r.value }
  ]);

  auditRoot.innerHTML = '';
  auditRoot.appendChild(table.render(rows));
}

function render() {
  renderGrid(grid, filteredVisible(), selected);
  loadHint.textContent = `Showing ${Math.min(visibleCount, allItems.length)} / ${allItems.length}`;
}

async function load() {
  legacyLogger.log('Loading products...');
  const items = await fetchProducts();

  allItems = dedupeById(items); // Set-based dedupe
  visibleCount = 20;
  selected.clear();

  updateStatsUI();
  runAudits();
  render();
}

const debouncedSearch = debounce(() => {
  q = searchInput.value;
  visibleCount = 20;
  render();
}, 300);

searchInput.addEventListener('input', debouncedSearch);

// Throttle scroll -> infinite load simulation
window.addEventListener(
  'scroll',
  throttle(() => {
    const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;
    if (!nearBottom) return;

    visibleCount = Math.min(visibleCount + 20, allItems.length);
    render();
  }, 250)
);

// Throttle resize -> just re-render
window.addEventListener(
  'resize',
  throttle(() => {
    render();
  }, 250)
);

// Event delegation on grid (click)
grid.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  const card = target.closest('.card') as HTMLElement | null;
  if (!card) return;

  const id = Number(card.getAttribute('data-id'));
  const action = target.getAttribute('data-action');

  if (action === 'edit') {
    const item = allItems.find((x) => x.id === id);
    if (!item) return;

    const newTitle = prompt('New title?', item.title) ?? item.title;
    const newPriceRaw = prompt('New price?', String(item.price)) ?? String(item.price);
    const newPrice = Number(newPriceRaw);

    const update: BulkUpdate = {};
    if (newTitle.trim()) update.title = newTitle.trim();
    if (!Number.isNaN(newPrice)) update.price = newPrice;

    item.applyUpdate({ title: update.title, price: update.price } as any);
    updateStatsUI();
    runAudits();
    render();
  }

  if (action === 'minusStock') {
    const item = allItems.find((x) => x.id === id);
    if (!item) return;

    item.applyUpdate({ stock: Math.max(0, item.stock - 1) } as any);
    updateStatsUI();
    runAudits();
    render();
  }
});

// Event delegation on grid (checkbox change)
grid.addEventListener('change', (e) => {
  const target = e.target as HTMLInputElement;
  if (target.getAttribute('data-action') !== 'select') return;

  const card = target.closest('.card') as HTMLElement | null;
  if (!card) return;
  const id = Number(card.getAttribute('data-id'));

  if (target.checked) selected.add(id);
  else selected.delete(id);
});

// Bulk edit form
bulkForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = bulkName.value.trim();
  const priceRaw = bulkPrice.value.trim();
  const price = priceRaw ? Number(priceRaw) : undefined;

  const update: BulkUpdate = {};
  if (name) update.title = name;
  if (price !== undefined && !Number.isNaN(price)) update.price = price;

  for (const id of selected) {
    const item = allItems.find((x) => x.id === id);
    if (!item) continue;
    item.applyUpdate({ title: update.title, price: update.price } as any);
  }

  bulkName.value = '';
  bulkPrice.value = '';
  updateStatsUI();
  runAudits();
  render();
});

exportBtn.addEventListener('click', () => {
  const payload = {
    exportedAt: new Date().toISOString(),
    counters: counters.get(),
    total: allItems.length,
    items: allItems.map((x) => ({
      id: x.id,
      title: x.title,
      price: x.price,
      stock: x.stock,
      category: x.category,
      brand: x.brand
    }))
  };

  downloadJSON('inventory-export.json', payload);
});

refreshBtn.addEventListener('click', () => load());

// start
load().catch((err) => {
  console.error(err);
  alert('Failed to load products. Check console.');
});