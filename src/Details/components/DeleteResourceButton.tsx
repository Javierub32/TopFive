import { BookResource, FilmResource, GameResource, SeriesResource, SongResource } from "app/types/Resources";
import { useTheme } from "context/ThemeContext";
import { router } from "expo-router";
import { Alert, TouchableOpacity } from "react-native";
import { ResourceType, useResource } from "hooks/useResource";
import { useCollection } from "context/CollectionContext";
import { DeleteIcon } from "components/Icons";
import { useNotification } from "context/NotificationContext";

interface Props {
    resource : BookResource | FilmResource | SeriesResource | SongResource | GameResource | null
    type : ResourceType
}


export const DeleteResourceButton = ({resource, type}: Props) => {

    const { colors } = useTheme();
    const { borrarRecurso } = useResource();
    const { refreshData } = useCollection();
    const { showNotification, hideNotification } = useNotification();

    const handleDelete = () => {
        if (resource) {
            showNotification({
                title: 'Confirmar eliminación',
                description: `¿Estás seguro de que quieres eliminar ${resource.contenido.titulo || 'este recurso'} de tu colección?`,
                isChoice: true,
                delete: true,
                leftButtonText: 'Cancelar',
                rightButtonText: 'Eliminar',
                highlightRight: true,
                onLeftPress: () => hideNotification(),
                onRightPress: async () => {
                    hideNotification();
                    await borrarRecurso(resource.id, type);
                    router.replace({ pathname: '/Collection', params: { initialResource: type as ResourceType } });
                    refreshData();
                    setTimeout(() => {
                        showNotification({
                            title: 'Recurso eliminado',
                            description: `Has eliminado ${resource.contenido.titulo || 'el recurso'} de tu colección.`,
                            isChoice: false,
                            delete: false
                        });
                    }, 100);
                }
            });
        } else {
            showNotification({
                title: 'Error',
                description: 'No se pudo eliminar el recurso. Inténtalo de nuevo más tarde.',
                isChoice: false,
                delete: false
            });
        }
    };
    
    return (
        <TouchableOpacity 
        onPress={handleDelete}
        className="h-10 w-10 items-center justify-center rounded-full mr-2"
        style={{backgroundColor: `${colors.error}99`}}
        activeOpacity={0.7}
        >

            <DeleteIcon />
        </TouchableOpacity>
        
    )
}