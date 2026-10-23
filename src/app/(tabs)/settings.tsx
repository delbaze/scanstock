import { getFreeDiskMb } from "@/modules/stock-native";
import { TooltipAnchor } from "@/ui/components/TooltipAnchor";
import { getRuntimeInfo } from "@/ui/diagnostics/getRuntimeInfo";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 0,
      }}
    >
      <Text style={{ fontWeight: "600" }}>{label}</Text>
      <Text>{value}</Text>
    </View>
  );
}
const yesNo = (value: boolean) => (value ? "oui" : "non");
export default function SettingsScreen() {
  const [freeDisk, setFreeDisk] = useState<string>("chargement...");
  useEffect(() => {
    let cancelled = false;
    getFreeDiskMb()
      .then((mb) => {
        if (!cancelled) setFreeDisk(`${mb} Mo`);
      })
      .catch(() => {
        if (!cancelled) setFreeDisk("indisponible");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const info = getRuntimeInfo();
  return (
    <>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 12 }}>
          Diagnostic
        </Text>
        <Row label="Moteur JavaScript" value={info.engine} />
        <Row
          label="Version d'Hermes"
          value={info.hermesVersion ?? "inconnue"}
        />
        <Row label="Fabric" value={yesNo(info.fabric)} />
        <Row label="Bridgeless" value={yesNo(info.bridgeless)} />
        <Row label="Turbo Modules" value={yesNo(info.turboModules)} />
        <Row label="Mode" value={info.mode} />
        <Row label="AppVersion" value={info.appVersion ?? "N/A"} />
        <Row label="Build Number" value={info.buildNumber ?? "N/A"} />
        <Row label="Espace libre" value={freeDisk} />
        <TooltipAnchor text="Le stock est inférieur au seuil de réapprovisionenemnt">
          <Text style={{ marginTop: 24 }}>Niveau de stock : bas</Text>
        </TooltipAnchor>
      </ScrollView>
    </>
  );
}
