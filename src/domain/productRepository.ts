import type { Product } from "./product";

export type ProductPage = {
  items: Product[];
  nextOffset: number | null;
  total: number;
};

export interface ProductRepository {
  getPage(offset: number, limit: number): Promise<ProductPage>;
  getById(id: number): Promise<Product>;
  updateStock(id: number, stock: number): Promise<Product>;
  findByBarcode(barcode: string): Promise<Product | null>;
}
