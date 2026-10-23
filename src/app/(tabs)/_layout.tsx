import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Catalogue" }} />
      <Tabs.Screen name="scan" options={{ title: "Scanner" }} />
      <Tabs.Screen name="settings" options={{ title: "Réglages" }} />
    </Tabs>
  );
}
