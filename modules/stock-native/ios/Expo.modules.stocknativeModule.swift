import ExpoModulesCore

public class StockNativeModuleModule: Module {
  public func definition() -> ModuleDefinition {
    Name("StockNativeModule")

    Function("isValidEan13") { (code: String) -> Bool in
      let digits = code.compactMap { $0.wholeNumberValue }
      guard code.count == 13, digits.count == 13 else {
        return false
      }
      var total = 0
      for i in 0..<12 {
        total += (i % 2 == 0) ? digits[i] : digits[i] * 3
      }
      let check = (10 - total % 10) % 10
      return check == digits[12]
    }

    AsyncFunction("getFreeDiskMb") { () throws -> Int in
      let attributes = try FileManager.default.attributesOfFileSystem(forPath: NSHomeDirectory())
      let freeBytes = (attributes[.systemFreeSize] as? NSNumber)?.int64Value ?? 0
      return Int(freeBytes / (1024 * 1024))
    }
  }
}
