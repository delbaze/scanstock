import { NativeModule, registerWebModule } from "expo";

class StockNativeModuleModule extends NativeModule<{}> {
  hello() {
    return "Hello world! 👋";
  }
}

export default registerWebModule(
  StockNativeModuleModule,
  "StockNativeModuleModule",
);
