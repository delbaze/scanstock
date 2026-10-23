import type { Product } from "@/domain/product";
import type { ProductPage } from "@/domain/productRepository";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { UpdateStockVariables } from "../queryClient";
import { productKeys, productMutationKeys } from "./productKeys";

type Snapshot = {
  previousDetail?: Product;
  previousLists?: InfiniteData<ProductPage>;
};

function withStock(
  lists: InfiniteData<ProductPage>,
  id: number,
  stock: number,
): InfiniteData<ProductPage> {
  return {
    ...lists,
    pages: lists.pages.map((page) => ({
      ...page,
      items: page.items.map((item) =>
        item.id === id ? { ...item, stock } : item,
      ),
    })),
  };
}

export function useUpdateStock() {
  const queryClient = useQueryClient();

  return useMutation<Product, Error, UpdateStockVariables, Snapshot>({
    mutationKey: productMutationKeys.updateStock,
    scope: { id: "update-stock" },

    onMutate: async ({ id, stock }) => {
      debugger;
      await queryClient.cancelQueries({ queryKey: productKeys.detail(id) });
      await queryClient.cancelQueries({ queryKey: productKeys.lists() });

      const previousDetail = queryClient.getQueryData<Product>(
        productKeys.detail(id),
      );
      const previousLists = queryClient.getQueryData<InfiniteData<ProductPage>>(
        productKeys.lists(),
      );

      if (previousDetail) {
        queryClient.setQueryData(productKeys.detail(id), {
          ...previousDetail,
          stock,
        });
      }
      if (previousLists) {
        queryClient.setQueryData(
          productKeys.lists(),
          withStock(previousLists, id, stock),
        );
      }
      return { previousDetail, previousLists };
    },

    onError: (_error, { id }, snapshot) => {
      if (snapshot?.previousDetail) {
        queryClient.setQueryData(
          productKeys.detail(id),
          snapshot.previousDetail,
        );
      }
      if (snapshot?.previousLists) {
        queryClient.setQueryData(productKeys.lists(), snapshot.previousLists);
      }
    },

    onSuccess: (product) => {
      queryClient.setQueryData(productKeys.detail(product.id), product);
      const lists = queryClient.getQueryData<InfiniteData<ProductPage>>(
        productKeys.lists(),
      );
      if (lists) {
        queryClient.setQueryData(
          productKeys.lists(),
          withStock(lists, product.id, product.stock),
        );
      }
    },
  });
}
