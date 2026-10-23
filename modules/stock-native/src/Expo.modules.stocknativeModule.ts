import { requireNativeModule } from "expo";

type StockNativeModuleType = {
  isValidEan13(code: string): boolean;
  getFreeDiskMb(): Promise<number>;
};

export default requireNativeModule<StockNativeModuleType>("StockNativeModule");
