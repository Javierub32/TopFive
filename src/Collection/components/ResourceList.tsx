import { RenderCollection } from "@/Collection/components/RenderCollection";
import { CollectionStructure } from "components/CollectionStructure";
import { LoadingIndicator } from "components/LoadingIndicator";
import { useCollection } from "context/CollectionContext";
import { ScrollView, View } from "react-native";

export default function ResourceList() {
	const {busqueda, loading, pendientes, enCurso, completados, navigateToGrid, handleItemPress, categoriaActual, totalPendientes, totalEnCurso, totalCompletados, data, handleSearchPagination } = useCollection();
    const hayBusqueda = busqueda.trim() !== '';
	
  
	return (
		loading && data.length === 0 ? (
		<LoadingIndicator />
	) : hayBusqueda ? (
			<View className="flex-1 mt-4">
			  <CollectionStructure
				data={data}
				categoriaActual={categoriaActual}
				handleItemPress={handleItemPress}
				handleSearchPagination={handleSearchPagination}
				showStatus={true}
				loading={loading}
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
			  onPressTitle={() => navigateToGrid('En curso', 'enCurso', categoriaActual)}
			/>
			<RenderCollection 
			  title="Completados"
			  data={completados}
			  total={totalCompletados}
			  category={categoriaActual}
			  onPressItem={handleItemPress}
			  onPressTitle={() => navigateToGrid('Completados', 'completados', categoriaActual)}
			/>
			<RenderCollection 
			  title="Pendientes"
			  data={pendientes}
			  total={totalPendientes}
			  category={categoriaActual}
			  onPressItem={handleItemPress}
			  onPressTitle={() => navigateToGrid('Pendientes', 'pendientes', categoriaActual )}
			/>
		  </ScrollView>
		)
	)
}