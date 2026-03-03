export type Column<T> = { header: string; cell: (row: T) => string };

export class GenericTable<T> {
  constructor(private columns: Column<T>[]) {}

  render(rows: T[]): HTMLTableElement {
    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';

    const thead = document.createElement('thead');
    const trh = document.createElement('tr');

    for (const c of this.columns) {
      const th = document.createElement('th');
      th.textContent = c.header;
      th.style.textAlign = 'left';
      th.style.padding = '8px';
      th.style.borderBottom = '1px solid #2a2f59';
      trh.appendChild(th);
    }
    thead.appendChild(trh);

    const tbody = document.createElement('tbody');
    for (const r of rows) {
      const tr = document.createElement('tr');
      for (const c of this.columns) {
        const td = document.createElement('td');
        td.textContent = c.cell(r);
        td.style.padding = '8px';
        td.style.borderBottom = '1px solid #1f2447';
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }

    table.appendChild(thead);
    table.appendChild(tbody);
    return table;
  }
}