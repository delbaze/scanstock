package com.stackstock.app

import android.util.Log
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import android.os.Environment
import android.os.StatFs

private const val TAG = "StockNative"

class StockNativeModuleModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("StockNativeModule")

    Function("isValidEan13") { code: String ->
      Log.d(TAG, "isvValideEan13 appelé avec code=$code")
      if (code.length != 13 || !code.all { it.isDigit() }) {
        return@Function false
      }
      val digits = code.map { it - '0' }
      var total = 0
      for (i in 0 until 12) {
        total += if (i % 2 == 0) digits[i] else digits[i] * 3
      }
      val check = (10 - total % 10) % 10
      Log.d(TAG, "total=$total, controle calcule check=$check lu=${digits[12]}")
      check == digits[12]
    }
    AsyncFunction("getFreeDiskMb") {
      val stat = StatFs(Environment.getDataDirectory().path)
      (stat.availableBytes / (1024L * 1024L)).toInt()
    }
  }
}
