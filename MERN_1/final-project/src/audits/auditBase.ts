export type AuditRow = { label: string; value: string };

export abstract class AuditBase<T> {
  abstract name: string;
  abstract run(items: T[]): AuditRow[];
}