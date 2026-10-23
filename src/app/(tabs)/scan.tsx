import { useProductByBarcode } from "@/ui/queries/useProductByBarCode";
import { useScanHistoryStore } from "@/ui/stores/scanHistoryStore";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useFrameOutput,
} from "react-native-vision-camera";
import { useBarcodeScannerOutput } from "react-native-vision-camera-barcode-scanner";
import { scheduleOnRN } from "react-native-worklets";

const ANALYSES_INTERVAL_MS = 500;
const DARK_THRESHOLD = 40;

export default function ScanScreen() {
  const device = useCameraDevice("back");
  const router = useRouter();

  const entries = useScanHistoryStore((state) => state.entries);
  const addHistory = useScanHistoryStore((state) => state.add); // si on fait ça comme ça, on a les défaut d'un contexte, le composant sera rerendu à chaque fois qu'un autre composant modifiera le store
  // const {add} = useScanHistoryStore(); // si on fait ça comme ça, on a les défaut d'un contexte, le composant sera rerendu à chaque fois qu'un autre composant modifiera le store
  const clearHistory = useScanHistoryStore((state) => state.clear);

  const { hasPermission, requestPermission } = useCameraPermission();
  const [isFocused, setIsFocused] = useState(false);
  const [lastCode, setLastCode] = useState<string | null>(null);
  const [tooDark, setTooDark] = useState(false);
  const lastAnalysis = useSharedValue(0);
  const navigatedForRef = useRef<string | null>(null);

  const { data: product, isFetching } = useProductByBarcode(lastCode);

  useFocusEffect(
    useCallback(() => {
      setIsFocused(true);
      setLastCode(null);
      navigatedForRef.current = null;
      return () => setIsFocused(false);
    }, []),
  );
  useEffect(() => {
    if (product && lastCode && navigatedForRef.current !== lastCode) {
      navigatedForRef.current = lastCode;
      addHistory(lastCode);
      router.push(`/product/${product.id}`);
    }
  }, [product, lastCode, router]);

  const barcodeOutput = useBarcodeScannerOutput({
    barcodeFormats: ["ean-13", "qr-code"],
    onBarcodeScanned(codes) {
      const value = codes[0]?.rawValue;
      if (value) {
        // if (value && isValidEan13(value)) {
        setLastCode((previous) => (previous === value ? previous : value));
      }
    },
    onError(error) {
      console.error("Erreur du scanner", error);
    },
  });

  const reportLuminance = useCallback((luminance: number) => {
    setTooDark(luminance < DARK_THRESHOLD);
  }, []);

  // const onLuminance = useEffectEvent((val: number) => {
  //   setTooDark(val < DARK_THRESHOLD);
  // });
  const frameOutput = useFrameOutput({
    dropFramesWhileBusy: true, // évite un retard d'affichage (frame lag)
    pixelFormat: "yuv",
    onFrame(frame) {
      "worklet"; // tourne sur le thread caméra, pas JS
      try {
        const now = Date.now();
        if (now - lastAnalysis.get() < ANALYSES_INTERVAL_MS) {
          return; // throttling : on a déjà analysé il y a < 500ms, on skip
        }
        lastAnalysis.set(now);
        const lumaPlane = frame.getPlanes()[0];
        if (!lumaPlane) {
          return;
        }

        const pixels = new Uint8Array(lumaPlane.getPixelBuffer());
        const { width, height, bytesPerRow } = lumaPlane;
        let sum = 0;
        let count = 0;
        for (let y = 0; y < height; y += 16) {
          const rowStart = y * bytesPerRow;
          for (let x = 0; x < width; x += 16) {
            sum += pixels[rowStart + x];
            count++;
          }
        }
        if (count > 0) {
          // scheduleOnRN(onLuminance, sum / count);
          scheduleOnRN(reportLuminance, sum / count);
        }
      } finally {
        frame.dispose();
      }
    },
  });

  if (!hasPermission) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>
          ScanStock a besoin de la caméra pour lire les codes.
        </Text>
        <Button title="Autoriser la caméra" onPress={requestPermission} />
      </View>
    );
  }

  if (device == null) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>
          Aucune caméra disponible sur cet appareil.
        </Text>
      </View>
    );
  }

  const label =
    lastCode === null
      ? "Visez un code-barres"
      : isFetching
        ? "Recherche..."
        : product
          ? product.title
          : "Produit inconnu";

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isFocused}
        outputs={[barcodeOutput, frameOutput]}
      />
      {tooDark && (
        <View style={styles.warning}>
          <Text style={styles.resultText}>
            Lumière insuffisante pour scanner
          </Text>
        </View>
      )}
      {entries.length > 0 && (
        <View style={styles.history}>
          {entries.map((entry) => (
            <Text key={entry.code} style={styles.historyText}>
              {entry.code} ({new Date(entry.scannedAt).toLocaleTimeString()})
            </Text>
          ))}
          <Button title="Vider l'historique" onPress={clearHistory} />
        </View>
      )}
      <View style={styles.result}>
        <Text style={styles.resultText}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 16,
  },
  warning: {
    backgroundColor: "red",
  },
  message: { textAlign: "center" },
  result: {
    position: "absolute",
    bottom: 32,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  resultText: { color: "white", fontSize: 16 },
  history: {
    position: "absolute",
    bottom: 96,
    left: 16,
    right: 16,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 8,
    padding: 8,
    gap: 2,
  },
  historyText: { color: "white", fontSize: 13 },
});
