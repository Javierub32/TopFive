import { filterCollectionData } from "@/Collection/adapters/filterCollectionData";
import { RenderCollection } from "@/Collection/components/RenderCollection";
import { CategoryType } from "@/Collection/hooks/useCollection";
import { CollectionStructure } from "components/CollectionStructure";
import { LoadingIndicator } from "components/LoadingIndicator";
import { ReturnButton } from "components/ReturnButton";
import { Screen } from "components/Screen";
import { useCollection } from "context/CollectionContext";
import { ScrollView, View } from "react-native";

export default function ResourceList() {
	const {busqueda, loading, pendientes, enCurso, completados, navigateToGrid, handleItemPress, categoriaActual, totalPendientes, totalEnCurso, totalCompletados, data } = useCollection();
    const hayBusqueda = busqueda.trim() !== '';
	
  
	return (
		loading ? (
		<LoadingIndicator />
	) : hayBusqueda ? (
			<View className="flex-1 mt-4">
			  <CollectionStructure
				data={data}
				categoriaActual={categoriaActual}
				handleItemPress={handleItemPress}
				showStatus={true}
			  />
			</View>
		  ) : (
		<ScrollView 
			className="flex-1 mt-4" 
			contentContainerStyle={{ paddingBottom: 100 }}
			showsVerticalScrollIndicator={false}
		  >
			<RenderCollection 
			  title="En Curso"
			  data={enCurso}
			  total={totalEnCurso}
			  category={categoriaActual}
			  onPressItem={handleItemPress}
			  onPressTitle={() => navigateToGrid('En curso', 'WATCHING', categoriaActual)}
			/>
			<RenderCollection 
			  title="Completados"
			  data={completados}
			  total={totalCompletados}
			  category={categoriaActual}
			  onPressItem={handleItemPress}
			  onPressTitle={() => navigateToGrid('Completados', 'COMPLETED', categoriaActual)}
			/>
			<RenderCollection 
			  title="Pendientes"
			  data={pendientes}
			  total={totalPendientes}
			  category={categoriaActual}
			  onPressItem={handleItemPress}
			  onPressTitle={() => navigateToGrid('Pendientes', 'PENDING', categoriaActual )}
			/>
		  </ScrollView>
		)
	)
}