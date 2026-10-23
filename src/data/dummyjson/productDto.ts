import type { Product } from "@/domain/product";

export type ProductDto = {
  id: number;
  title: string;
  price: number;
  stock: number;
  thumbnail: string;
  meta?: { barcode?: string };
};

export type ProductListDto = {
  products: ProductDto[];
  total: number;
  skip: number;
  limit: number;
};

export function toProduct(dto: ProductDto): Product {
  return {
    id: dto.id,
    title: dto.title,
    price: dto.price,
    stock: dto.stock,
    thumbnailUrl: dto.thumbnail,
    barcode: dto.meta?.barcode ?? null,
  };
}
