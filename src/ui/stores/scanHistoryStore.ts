import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type ScanEntry = { code: string; scannedAt: number };

type ScanHistoryState = {
  entries: ScanEntry[];
  add: (code: string) => void;
  clear: () => void;
};

const MAX_ENTRIES = 10;

export const useScanHistoryStore = create<ScanHistoryState>()(
  persist(
    (set) => ({
      entries: [],
      add: (code) =>
        set((state) => ({
          entries: [
            { code, scannedAt: Date.now() },
            ...state.entries.filter((entry) => entry.code !== code),
          ].slice(0, MAX_ENTRIES),
        })),
      clear: () => set({ entries: [] }),
    }),
    {
      name: "scan-history",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ entries: state.entries }), // je ne veux stocker que les entries, pas add et clear
    },
  ),
);
