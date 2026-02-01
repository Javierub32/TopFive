import { filterCollectionData } from "@/Collection/adapters/filterCollectionData";
import { RenderCollection } from "@/Collection/components/RenderCollection";
import { CategoryType } from "@/Collection/hooks/useCollection";
import { CollectionStructure } from "components/CollectionStructure";
import { LoadingIndicator } from "components/LoadingIndicator";
import { ReturnButton } from "components/ReturnButton";
import { Screen } from "components/Screen";
import { ScrollView, View } from "react-native";

interface ResourceListProps {
  categoriaActual: CategoryType;
  navigateToGrid: (title: string, status: string, category: CategoryType) => void;
  handleItemPress: (item: any) => void;
  pendientes: any[];
  enCurso: any[];
  completados: any[];
  loading: boolean;
  busqueda: string;
  data: any[];
}

export default function ResourceList({
  categoriaActual,
  navigateToGrid,
  handleItemPress,
  pendientes,
  enCurso,
  completados,
  loading,
  busqueda,
  data,
}: ResourceListProps) {
    const hayBusqueda = busqueda.trim() !== '';
	const dataFiltrada = hayBusqueda ? filterCollectionData(data, categoriaActual) : data;
	
  
	return (
		loading ? (
		<LoadingIndicator />
	) :
		hayBusqueda ? (
			<View className="flex-1 mt-4">
			  <CollectionStructure
				data={dataFiltrada}
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
			  category={categoriaActual}
			  onPressItem={handleItemPress}
			  onPressTitle={() => navigateToGrid('En curso', 'WATCHING', categoriaActual)}
			/>
			<RenderCollection 
			  title="Completados"
			  data={completados}
			  category={categoriaActual}
			  onPressItem={handleItemPress}
			  onPressTitle={() => navigateToGrid('Completados', 'COMPLETED', categoriaActual)}
			/>
			<RenderCollection 
			  title="Pendientes"
			  data={pendientes}
			  category={categoriaActual}
			  onPressItem={handleItemPress}
			  onPressTitle={() => navigateToGrid('Pendientes', 'PENDING', categoriaActual )}
			/>
		  </ScrollView>
		)
	)
}