export function sumTotals(items: { total: number }[] = []) {
  return items.reduce((sum, item) => sum + Number(item.total || 0), 0);
}
