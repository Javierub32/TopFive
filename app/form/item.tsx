import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Screen } from "components/Screen";
import { ReturnButton } from "components/ReturnButton";
import { CollectionStructure } from "components/CollectionStructure";
import { LoadingIndicator } from "components/LoadingIndicator";
import { useItemSelector } from "@/Collection/hooks/useItemSelector";

export default function ItemSelector() {
  const { listId, category, listName } = useLocalSearchParams<{ listId: string, category: string, listName: string }>();

  const { data, loading, addItem, resourceType } = useItemSelector(category, listId);

  return (
    <Screen>
      <ReturnButton 
        title={`Añadir a ${listName || "lista"}`} 
        route="back" 
      />
      
      <View className="flex-1 mt-2 px-5">
        {loading ? (
          <LoadingIndicator />
        ) : (
          <CollectionStructure
            data={data}
            categoriaActual={resourceType}
            handleItemPress={(item: any) => addItem(item.id)}
            showStatus={true}
            loading={loading}
          />
        )}
      </View>
    </Screen>
  );
}