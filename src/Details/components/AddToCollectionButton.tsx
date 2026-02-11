import { Book, Film, Game, Series, Song } from 'app/types/Content';
import { UploadIcon } from "components/Icons";
import { useTheme } from 'context/ThemeContext';
import { router } from "expo-router";
import { ResourceType } from "hooks/useResource";
import { Text, TouchableOpacity } from "react-native";

interface Props {
  content: Book | Film | Series | Song | Game;
  type: ResourceType;
  data: any
}

export const AddToCollectionButton = ({ content, type, data }: Props) => {
  const { colors } = useTheme();

  const ResourceMap : Record<ResourceType, string> = {
    pelicula: 'film',
    serie: 'series',
    videojuego: 'games',
    libro: 'book',
    cancion: 'song'
  }; 


  const openForm = (content: Book | Film | Series | Song | Game) => {
	router.push({
	  pathname: '/form/' + ResourceMap[type],
	  params: { data: JSON.stringify(content) },
	});
  };

  return (
    <TouchableOpacity
      onPress={() => {
        openForm(content);
      }}
      className="mt-4 flex-1 flex-row items-center justify-center rounded-xl py-4"
      style={{ backgroundColor: colors.primary }}>
      <UploadIcon className="mr-4"/>
      <Text className="font-bold" style={{ color: colors.background }}>
        Añadir a colección
      </Text>
    </TouchableOpacity>
  );
};
