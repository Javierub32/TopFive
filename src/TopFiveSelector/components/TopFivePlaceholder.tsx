import { BookIcon, FilmIcon, GameIcon, MusicIcon, ShowIcon, WrenchIcon } from "components/Icons";
import { useTheme } from "context/ThemeContext";
import { router } from "expo-router";
import { ResourceType } from "hooks/useResource";
import { Text, TouchableOpacity, View } from "react-native"

interface Props  {
    category : ResourceType
    loading : boolean
}

export const TopFivePlaceholder = ({category, loading} : Props) => {
    
    const CATEGORY_LABELS: Record<ResourceType, string> = {
      libro: 'Libros',
      pelicula: 'Películas',
      serie: 'Series',
      videojuego: 'Videojuegos',
      cancion: 'Álbumes',
    };

    const categoryLabel = CATEGORY_LABELS[category] || 'contenido';
    const {colors} = useTheme();

    return (
        <View className={`absolute top-0 right-0 bottom-0 left-0 flex-1 items-center justify-center px-2 ${loading ? 'hidden' : ''}`}>
    
            {/* Texto Principal (Nombre de la categoría) */}
            <Text className="mb-3 text-center text-3xl font-bold" style={{color: colors.primaryText}}>
            No hay {categoryLabel.toLowerCase()}
            </Text>
    
            {/* Texto Secundario (Instrucciones) */}
            <Text className="mb-3 px-4 text-center" style={{color: colors.secondaryText}}>
                Primero añade a tu colección para que formen parte de tu TopFive.
            </Text>
            <TouchableOpacity
                onPress={() => router.push({pathname: '/Add', params: {initialCategory: category}})}
                className="px-6 py-3 rounded-3xl"
                style={{backgroundColor: `${colors.primary}CC`}}
            >
                <Text className="text-base font-bold" style={{color: colors.primaryText}}>Buscar</Text>
                
            </TouchableOpacity>
        </View>
    )
}