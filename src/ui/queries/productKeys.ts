export const productKeys = {
  all: ["products"] as const, // ["products"]
  lists: () => [...productKeys.all, "list"] as const, // ["products", "list"]
  detail: (id: number) => [...productKeys.all, "detail", id] as const, //["products", "detail", 12]
  barcode: (code: string) => [...productKeys.all, "barcode", code] as const,
};

export const productMutationKeys = {
  all: ["products"] as const, // ["products"]
  updateStock: [...productKeys.all, "updateStock"] as const,
};

// si je veux invalider la liste des produits => productKeys.all
