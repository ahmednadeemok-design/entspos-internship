import type { ProductItem } from '../models/productProto';

export function renderGrid(grid: HTMLElement, items: ProductItem[], selected: Set<number>) {
  grid.innerHTML = '';

  for (const p of items) {
    const card = document.createElement('div');
    card.className = 'card';
    card.setAttribute('data-id', String(p.id));

    card.innerHTML = `
      <div class="actions">
        <label>
          <input type="checkbox" data-action="select" ${selected.has(p.id) ? 'checked' : ''}/>
          Select
        </label>
        <span class="badge">${p.category}</span>
      </div>
      <h3>${p.title}</h3>
      <div>Price: ${p.price} | Stock: ${p.stock}</div>
      <div class="actions">
        <button data-action="edit">Edit</button>
        <button data-action="minusStock">-Stock</button>
      </div>
    `;

    grid.appendChild(card);
  }
}