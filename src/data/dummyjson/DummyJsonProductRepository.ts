import type { Product } from "@/domain/product";
import type {
  ProductPage,
  ProductRepository,
} from "@/domain/productRepository";
import { requestJson } from "../http";
import { ProductDto, ProductListDto, toProduct } from "./productDto";

const LIST_FIELDS = "title,price,stock,thumbnail,meta";

export class DummyJsonProductRepository implements ProductRepository {
  async getPage(offset: number, limit: number): Promise<ProductPage> {
    const dto = await requestJson<ProductListDto>(
      `/products?limit=${limit}&skip=${offset}&select=${LIST_FIELDS}`,
    );
    const nextOffset = dto.skip + dto.products.length;
    return {
      items: dto.products.map(toProduct),
      nextOffset: nextOffset < dto.total ? nextOffset : null,
      total: dto.total,
    };
  }

  async getById(id: number): Promise<Product> {
    const dto = await requestJson<ProductDto>(`/products/${id}`);
    return toProduct(dto);
  }

  async updateStock(id: number, stock: number): Promise<Product> {
    const dto = await requestJson<ProductDto>(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify({ stock }),
    });
    return toProduct(dto);
  }
  async findByBarcode(barcode: string): Promise<Product | null> {
    const dto = await requestJson<ProductListDto>(
      `/products?limit=0&select=${LIST_FIELDS}`,
    );
    const found = dto.products.find(
      (product) => product.meta?.barcode === barcode,
    );
    return found ? toProduct(found) : null;
  }
}
