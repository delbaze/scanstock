import { ProductRepository } from "@/domain/productRepository";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import {
  focusManager,
  onlineManager,
  QueryClient,
} from "@tanstack/react-query";
import { AppStateStatus, Platform } from "react-native";
import { productMutationKeys } from "./queries/productKeys";

const ONE_DAY = 1000 * 60 * 60 * 24;
export type UpdateStockVariables = { id: number; stock: number };

// TanStack Query saura si l'appareil est en ligne ou hors ligne, hors ligne => il met les requête de mutation en pause
onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener((state) => {
    setOnline(state.isConnected === true);
  });
});

export function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== "web") {
    focusManager.setFocused(status === "active");
  }
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1min
      gcTime: ONE_DAY,
      retry: 2,
    },
    // mutations: {}
  },
});

export const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
  throttleTime: 1000, // limite l'écriture sur le disque à une fois par seconde au plus
});

export function registerMutationDefaults(
  client: QueryClient,
  products: ProductRepository, // ici pour les tests vous mettrez un faux repository
) {
  client.setMutationDefaults(productMutationKeys.updateStock, {
    mutationFn: ({ id, stock }: UpdateStockVariables) =>
      products.updateStock(id, stock),
  });
}

export const PERSIST_MAX_AGE = ONE_DAY; // durée de validité de la sauvegarde
