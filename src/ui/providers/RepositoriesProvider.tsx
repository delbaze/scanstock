import { DummyJsonProductRepository } from "@/data/dummyjson/DummyJsonProductRepository";
import type { ProductRepository } from "@/domain/productRepository";
import { createContext, ReactNode, useContext } from "react";

type Repositories = { products: ProductRepository };

export const defaultRepositories: Repositories = {
  products: new DummyJsonProductRepository(),
};

const RepositoriesContext = createContext<Repositories>(defaultRepositories);

export function RepositoriesProvider({
  children,
  value = defaultRepositories,
}: {
  children: ReactNode;
  value?: Repositories;
}) {
  return (
    <RepositoriesContext.Provider value={value}>
      {children}
    </RepositoriesContext.Provider>
  );
}

export function useRepositories(): Repositories {
  return useContext(RepositoriesContext);
}
