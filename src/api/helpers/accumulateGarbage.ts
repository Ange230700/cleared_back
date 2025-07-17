// src\api\helpers\accumulateGarbage.ts

export function accumulateGarbage(
  garbages: { garbage_type: string; quantity_kg: number }[],
) {
  const grouped: Record<string, number> = {};
  for (const g of garbages) {
    grouped[g.garbage_type] = (grouped[g.garbage_type] ?? 0) + g.quantity_kg;
  }
  // Convert back to array for DTO
  return Object.entries(grouped).map(([type, quantity_kg]) => ({
    garbage_type: type,
    quantity_kg: Math.round(quantity_kg * 10) / 10,
  }));
}
