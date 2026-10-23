import StockNativeModule from "./src/Expo.modules.stocknativeModule";
export function isValidEan13(code: string): boolean {
  return StockNativeModule.isValidEan13(code);
}
export function getFreeDiskMb(): Promise<number> {
  return StockNativeModule.getFreeDiskMb();
}
