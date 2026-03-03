import type { ProductItem } from '../models/productProto';
import { AuditBase } from './auditBase';

export class LowStockAudit extends AuditBase<ProductItem> {
  name = 'Low Stock Audit';
  run(items: ProductItem[]) {
    const lows = items.filter((x) => x.isLowStock());
    return [
      { label: 'Low stock items', value: String(lows.length) },
      { label: 'Examples', value: lows.slice(0, 5).map((x) => x.title).join(', ') || '-' }
    ];
  }
}

export class TopValueAudit extends AuditBase<ProductItem> {
  name = 'Top Value Audit';
  run(items: ProductItem[]) {
    const top = [...items].sort((a, b) => b.price - a.price).slice(0, 5);
    return top.map((x, i) => ({ label: `#${i + 1}`, value: `${x.title} (${x.price})` }));
  }
}