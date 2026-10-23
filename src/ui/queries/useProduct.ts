import type { ProductPage } from "@/domain/productRepository";
import { InfiniteData, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRepositories } from "../providers/RepositoriesProvider";
import { productKeys } from "./productKeys";

export function useProduct(id: number) {
  const { products } = useRepositories();
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => products.getById(id),
    placeholderData: () => {
      const lists = queryClient.getQueryData<InfiniteData<ProductPage>>(
        productKeys.lists(),
      );
      return lists?.pages
        .flatMap((page) => page.items)
        .find((product) => product.id === id);
    },
  });
}
