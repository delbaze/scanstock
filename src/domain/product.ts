export type Product = {
  id: number;
  title: string;
  price: number;
  stock: number;
  thumbnailUrl: string;
  barcode: string | null;
};

export type StockLevel = "rupture" | "bas" | "ok";

export const DEFAULT_LOW_STOCK_THRESHOLD = 10;

export function computeStockLevel(
  stock: number,
  lowThreshold: number = DEFAULT_LOW_STOCK_THRESHOLD,
): StockLevel {
  if (stock <= 0) return "rupture";
  if (stock < lowThreshold) return "bas";
  return "ok";
}

export class StockRuleError extends Error {}

export function applyMovement(stock: number, delta: number): number {
  if (!Number.isInteger(delta)) {
    throw new StockRuleError(
      "Un mouvement de stock doit être un nombre entier",
    );
  }
  const next = stock + delta;
  if (next < 0) {
    throw new StockRuleError("Le stock ne peut pas devenir négatif");
  }
  return next;
}
