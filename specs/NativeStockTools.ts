// specs/NativeStockTools.ts
import type { TurboModule } from "react-native";
import { TurboModuleRegistry } from "react-native";

export interface Spec extends TurboModule {
  isValidEan13(code: string): boolean;
  getFreeDiskMb(): Promise<number>;
}

export default TurboModuleRegistry.getEnforcing<Spec>("NativeStockTools");
