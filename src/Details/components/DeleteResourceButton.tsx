import { BookResource, FilmResource, GameResource, SeriesResource, SongResource } from "app/types/Resources";
import { useTheme } from "context/ThemeContext";
import { router } from "expo-router";
import { Alert, TouchableOpacity } from "react-native";
import { ResourceType, useResource } from "hooks/useResource";
import { useCollection } from "context/CollectionContext";
import { DeleteIcon } from "components/Icons";

interface Props {
    resource : BookResource | FilmResource | SeriesResource | SongResource | GameResource | null
    type : ResourceType
}


export const DeleteResourceButton = ({resource, type}: Props) => {

    const { colors } = useTheme();
    const { borrarRecurso } = useResource();
    const { refreshData } = useCollection();


    const handleDelete = () => {
        if (resource) {
            Alert.alert('Recurso eliminado', 'Estás seguro de que quieres eliminar este libro de tu colección?', [
        { text: 'Cancelar', style: 'cancel'},
                { text: 'Confirmar', onPress: async () => {
                    await borrarRecurso(resource.id, type);
                    refreshData();
                    router.replace({ pathname: '/Collection', params: { initialResource: type as ResourceType } })} }
            ]);
        }
    };
    
    return (
        <TouchableOpacity 
        onPress={handleDelete}
        className="h-10 w-10 items-center justify-center rounded-full mr-2 border-2"
        style={{backgroundColor: `${colors.error}99`, borderColor: colors.error}}
        activeOpacity={0.7}
        >
            <DeleteIcon />
        </TouchableOpacity>
    )
}