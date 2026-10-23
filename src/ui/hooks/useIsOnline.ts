import { onlineManager } from "@tanstack/react-query";
import { useSyncExternalStore } from "react";

export function useIsOnLine(): boolean {
  return useSyncExternalStore(
    (onChange) => onlineManager.subscribe(onChange),
    () => onlineManager.isOnline(),
  );
}

// useEffect(() => StorageEvent.subscribe(setValue), [])
