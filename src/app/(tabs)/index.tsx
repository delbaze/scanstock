import { computeStockLevel } from "@/domain/product";
import { useProducts } from "@/ui/queries/useProducts";
import { Link } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  Text,
  View,
} from "react-native";

export default function CatalogueScreen() {
  const {
    data,
    isPending,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useProducts();
  if (isPending) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  if (isError) {
    return (
      <Pressable
        onPress={() => refetch()}
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 24,
        }}
      >
        <Text style={{ textAlign: "center" }}>
          Impossible de charger le catalogue, touchez pour réessayer
        </Text>
      </Pressable>
    );
  }

  return (
    <FlatList
      style={{ flex: 1 }}
      data={data}
      keyExtractor={(item) => String(item.id)}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isFetchingNextPage ? (
          <ActivityIndicator style={{ margin: 16 }} />
        ) : (
          <></>
        )
      }
      renderItem={({ item }) => (
        <Link href={`/product/${item.id}`} asChild>
          <Pressable
            testID={`product-item-${item.id}`}
            style={{ flexDirection: "row", padding: 12, gap: 12 }}
          >
            <Image
              source={{ uri: item.thumbnailUrl }}
              style={{ width: 56, height: 56, borderRadius: 8 }}
            />
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: "600" }}>{item.title}</Text>
              <Text>{item.price.toFixed(2)}</Text>
              <Text>
                Stock {item.stock} ({computeStockLevel(item.stock)})
              </Text>
            </View>
          </Pressable>
        </Link>
      )}
    />
  );
}
