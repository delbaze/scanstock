import * as Application from "expo-application";

export type RuntimeInfo = {
  engine: "hermes" | "autre";
  hermesVersion: string | null;
  fabric: boolean;
  bridgeless: boolean;
  turboModules: boolean;
  mode: "développement" | "production";
  appVersion: string | null;
  buildNumber: string | null;
};

export function getRuntimeInfo(): RuntimeInfo {
  const g = globalThis as any;
  const hermes = g.HermesInternal;
  const properties = hermes?.getRuntimeProperties?.() ?? {};
  const bridgeless = g.RN$Bridgeless === true;

  return {
    engine: hermes ? "hermes" : "autre",
    hermesVersion: properties["OSS Release Version"] ?? null,
    fabric: g.nativeFabricUIManager != null,
    bridgeless,
    turboModules: g.__turboModuleProxy != null || bridgeless,
    mode: __DEV__ ? "développement" : "production",
    appVersion: Application.nativeApplicationVersion,
    buildNumber: Application.nativeBuildVersion,
  };
}
