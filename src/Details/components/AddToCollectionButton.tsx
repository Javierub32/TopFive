import { Book, Film, Game, Series, Song } from 'app/types/Content';
import { UploadIcon } from "components/Icons";
import { useTheme } from 'context/ThemeContext';
import { router } from "expo-router";
import { ResourceType } from "hooks/useResource";
import { Text, TouchableOpacity } from "react-native";

interface Props {
  content: Book | Film | Series | Song | Game;
  type: ResourceType;
}

export const AddToCollectionButton = ({ content, type }: Props) => {
  const { colors } = useTheme();

  const ResourceMap : Record<ResourceType, {path: string, param: string}> = {
    pelicula: {path: 'film', param: 'filmData'},
    serie: {path: 'series', param: 'seriesData'},
    videojuego: {path: 'game', param: 'gameData'},
    libro: {path: 'book', param: 'bookData'},
    cancion: {path: 'song', param: 'songData'}
  }; 

  const openForm = (content: Book | Film | Series | Song | Game) => {
	router.push({
	  pathname: '/form/' + ResourceMap[type].path,
	  params: { [ResourceMap[type].param]: JSON.stringify(content) },
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
