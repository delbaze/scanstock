import {
  applyMovement,
  computeStockLevel,
  StockRuleError,
} from "@/domain/product";
import { useProduct } from "@/ui/queries/useProduct";
import { useUpdateStock } from "@/ui/queries/useUpdateStock";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Button,
  Image,
  ScrollView,
  Text,
  View,
} from "react-native";

export default function ProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    data: product,
    isPending,
    isError,
    isPlaceholderData,
  } = useProduct(Number(id));
  const [ruleError, setRuleError] = useState<string | null>(null);
  const updateStock = useUpdateStock();

  const move = (delta: number) => {
    try {
      if (product) {
        const next = applyMovement(product.stock, delta);
        setRuleError(null);
        updateStock.mutate({ id: product.id, stock: next });
      }
    } catch (error) {
      if (error instanceof StockRuleError) {
        setRuleError(error.message);
      } else {
        throw error;
      }
    }
  };

  if (isPending) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  if (isError || !product) {
    return <Text style={{ padding: 16 }}>Produit introuvable.</Text>;
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 8 }}>
      <Image
        source={{ uri: product.thumbnailUrl }}
        style={{ width: "100%", aspectRatio: 1, borderRadius: 12 }}
      />
      <Text
        testID="product-detail-title"
        style={{ fontSize: 22, fontWeight: "700" }}
      >
        {product.title}
      </Text>
      <Text>{product.price.toFixed(2)} €</Text>
      <Text testID="product-detail-stock">Stock : {product.stock}</Text>
      <Text>Niveau : {computeStockLevel(product.stock)}</Text>
      {isPlaceholderData && (
        <Text style={{ opacity: 0.6 }}>Mise à jour...</Text>
      )}
      <View style={{ flexDirection: "row", gap: 12 }}>
        <Button
          title="-1"
          onPress={() => move(-1)}
          disabled={isPlaceholderData}
        />
        <Button
          testID="stock-plus"
          title="+1"
          onPress={() => move(1)}
          disabled={isPlaceholderData}
        />
      </View>
    </ScrollView>
  );
}
