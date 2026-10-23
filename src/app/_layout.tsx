import {
  defaultRepositories,
  RepositoriesProvider,
} from "@/ui/providers/RepositoriesProvider";
import {
  onAppStateChange,
  PERSIST_MAX_AGE,
  persister,
  queryClient,
  registerMutationDefaults,
} from "@/ui/queryClient";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { AppState } from "react-native";

registerMutationDefaults(queryClient, defaultRepositories.products);

useEffect(() => {
  const subscription = AppState.addEventListener("change", onAppStateChange);
  return () => subscription.remove();
}, []);

export default function RootLayout() {
  return (
    <RepositoriesProvider>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister, maxAge: PERSIST_MAX_AGE }}
        onSuccess={() => {
          queryClient.resumePausedMutations();
        }}
      >
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="product/[id]"
            options={{ title: "Fiche produit" }}
          />
        </Stack>
      </PersistQueryClientProvider>
    </RepositoriesProvider>
  );
}
