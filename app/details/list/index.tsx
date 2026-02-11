// app/details/list/index.tsx
import { Text, View } from "react-native";
import { useCollection } from "context/CollectionContext";
import { useLocalSearchParams } from "expo-router";
import { useListsDetails } from "@/Collection/hooks/useListsDetails";
import { Screen } from "components/Screen";
import { ReturnButton } from "components/ReturnButton";
import { LoadingIndicator } from "components/LoadingIndicator";
import { CollectionStructure } from "components/CollectionStructure";
import { useTheme } from "context/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ResourceType } from "hooks/useResource";

export default function ListDetails() {
  const { categoriaActual, handleItemPress } = useCollection();
  const { listData } = useLocalSearchParams<{ listData: any }>();
  const parsedListData = listData ? JSON.parse(listData) : null;
  const { loading, data, handleLoadMore, handleDeleteItem } = useListsDetails(categoriaActual, parsedListData?.id!);
  const { colors } = useTheme();

  if (loading && data.length === 0) {
	return (
	  <Screen>
		<ReturnButton 
			title={"Detalles de la lista"} 
			route="/Collection" 
			params={{ initialResource: categoriaActual as ResourceType }}
		/>
		<LoadingIndicator />
	  </Screen>
	);
  }

  return (
	<Screen>
	  <ReturnButton 
		title={"Detalles de la lista"} 
		route="/Collection"
		params={{ initialResource: categoriaActual as ResourceType }}
	  />
	  
      {/* CABECERA DE LA LISTA */}
      {parsedListData?.nombre && (
        <View 
            className="mx-2 mb-4 mt-2 flex-row items-start rounded-2xl border p-4 shadow-sm"
            style={{ 
                backgroundColor: colors.surfaceButton, 
                borderColor: colors.borderButton 
            }}
        >
            {/* Icono con fondo de color */}
            <View 
                className="h-16 w-16 items-center justify-center rounded-2xl shadow-sm mr-4"
                style={{ backgroundColor: parsedListData?.color || colors.primary }}
            >
                <MaterialCommunityIcons
                    name={parsedListData?.icono as any || 'folder'} 
                    size={32} 
                    color={colors.primaryText} 
                />
            </View>

            {/* Textos */}
            <View className="flex-1 justify-center">
                <Text 
                    className="text-2xl font-bold leading-tight mb-1" 
                    style={{ color: colors.primaryText }}
                >
                    {parsedListData?.nombre}
                </Text>
                {parsedListData?.descripcion ? (
                    <Text 
                        className="text-sm leading-5" 
                        style={{ color: colors.secondaryText }}
                    >
                        {parsedListData?.descripcion}
                    </Text>
                ) : (
                    <Text className="text-xs italic" style={{ color: colors.placeholderText }}>
                        Sin descripción
                    </Text>
                )}
            </View>
        </View>
      )}

	  
	  <View className="flex-1 mt-2 px-5 ">
		<CollectionStructure
		  data={data}
		  categoriaActual={categoriaActual}
		  handleItemPress={handleItemPress}
		  handleLongPress={handleDeleteItem}
		  handleSearchPagination={handleLoadMore} 
		  showStatus={true}
		  loading={loading}
		/>
	  </View>
	</Screen>
  );
}