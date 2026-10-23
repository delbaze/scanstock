import { useInfiniteQuery } from "@tanstack/react-query";
import { useRepositories } from "../providers/RepositoriesProvider";
import { productKeys } from "./productKeys";

const PAGE_SIZE = 20;

export function useProducts() {
  const { products } = useRepositories();
  return useInfiniteQuery({
    queryKey: productKeys.lists(),
    queryFn: ({ pageParam }) => products.getPage(pageParam, PAGE_SIZE),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextOffset,
    select: (data) => data.pages.flatMap((page) => page.items),
  });
}
