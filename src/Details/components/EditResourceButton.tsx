import { BookResource, FilmResource, GameResource, SeriesResource, SongResource } from "app/types/Resources";
import { TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { useTheme } from "context/ThemeContext";
import { AntDesign } from "@expo/vector-icons";
import { ResourceType } from "hooks/useResource";


interface Props {
    resource : BookResource | FilmResource | SeriesResource | SongResource | GameResource | null
    type : ResourceType
}


export const EditResourceButton = ({resource, type}: Props) => {

    const ResourceMap : Record<ResourceType, string> = {
        pelicula: 'film',
        serie: 'series',
        videojuego: 'games',
        libro: 'book',
        cancion: 'song'
    };    

    const handleEdit = () => {
        if (resource) {
            router.push({
            pathname: '/form/' + ResourceMap[type],
            params: { item: JSON.stringify(resource) }
            });
        }
    }

    const { colors } = useTheme();
    
    return (
        <TouchableOpacity 
            onPress={() => handleEdit()}
            className="h-10 w-10 items-center justify-center rounded-full mr-2"
            style={{backgroundColor: `${colors.primary}99`}}
            activeOpacity={0.7}
          >
            <AntDesign name="edit" size={20} color={colors.primaryText} />
        </TouchableOpacity>

    )
}