import { BookResource, FilmResource, GameResource, SeriesResource, SongResource } from "app/types/Resources";
import { useTheme } from "context/ThemeContext";
import { router } from "expo-router";
import { Alert, TouchableOpacity } from "react-native";
import { ResourceType, useResource } from "hooks/useResource";
import { useCollection } from "context/CollectionContext";
import { DeleteIcon } from "components/Icons";
import { useState } from "react";
import { NotificationModal } from "components/NotificationModal";
import { useNotification } from "context/NotificationContext";
import BookDetail from "app/details/book/bookResource";
interface Props {
    resource : BookResource | FilmResource | SeriesResource | SongResource | GameResource | null
    type : ResourceType
}


export const DeleteResourceButton = ({resource, type}: Props) => {

    const { colors } = useTheme();
    const { borrarRecurso } = useResource();
    const { refreshData } = useCollection();
    const [modalConfig, setModalConfig] = useState({
        title: '',
        description: '',
        isChoice: false
      });
      const [modalVisible, setModalVisible] = useState(false);
    const {showNotification} = useNotification();

    


    const handleDelete = () => {
        if (resource) {
            setModalConfig({
                title: 'Confirmar eliminación',
                description: `¿Estás seguro de que quieres eliminar ${resource.contenido.titulo || 'este recurso'} de tu colección?`,
                isChoice: true
            });
            setModalVisible(true);
            /*Alert.alert('Recurso eliminado', 'Estás seguro de que quieres eliminar este libro de tu colección?', [
                        { text: 'Cancelar', style: 'cancel'},
                     { text: 'Confirmar', onPress: async () => {
                         await borrarRecurso(resource.id, type);
                    } }
            ]);*/
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
            <NotificationModal
        visible={modalVisible}
        title={modalConfig.title}
        description={modalConfig.description}
        isChoice={modalConfig.isChoice}
        leftButtonText="Cancelar"
        rightButtonText="Eliminar"
        onLeftPress={() => setModalVisible(false)}
        onRightPress={async () => {
            if (resource) {
                await borrarRecurso(resource.id, type);
                router.replace({ pathname: '/Collection', params: { initialResource: type as ResourceType } })
                refreshData();
                setModalVisible(false);
                setTimeout(()=>{
                    showNotification({
                        title: 'Recurso eliminado',
                         description: `Has eliminado ${resource.contenido.titulo || 'el recurso'} de tu colección.`,
                         isChoice: false
                     });
                }, 100);
            }
        }}
        onClose={() => setModalVisible(false)}
        />
        </TouchableOpacity>
        
    )
}