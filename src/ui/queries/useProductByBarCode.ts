import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRepositories } from "../providers/RepositoriesProvider";
import { productKeys } from "./productKeys";

export function useProductByBarcode(barcode: string | null) {
  const { products } = useRepositories();
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: productKeys.barcode(barcode ?? ""),
    queryFn: async () => {
      const product = await products.findByBarcode(barcode as string);
      if (product) {
        queryClient.setQueryData(productKeys.detail(product.id), product);
      }
      return product;
    },
    enabled: barcode !== null,
    staleTime: 5 * 60 * 1000,
  });
}
