import { Book, Film, Series, Song, Game } from 'app/types/Content';
import { AuthorIcon } from "components/Icons";
import { useTheme } from 'context/ThemeContext';
import { View, Text } from "react-native";
import {AppText} from 'components/AppText';
interface Props {
  autor: string | null;
}

export const AuthorCard = ({ autor }: Props) => {
  const { colors } = useTheme();


  return (
    
    <View
    className="flex-1 justify-between rounded-2xl p-4 gap-2"
    style={{ backgroundColor: colors.surfaceButton }}>
        <View className="flex-row items-center gap-2">
            <AuthorIcon/>
            <AppText
            className="text-sm font-bold uppercase tracking-widest"
            style={{ color: colors.markerText }}>
            Autor
            </AppText>
        </View>
        <View className="flex-1 justify-center items-center">
            <AppText className="text-base font-semibold" style={{ color: colors.secondaryText }}>
                {autor}
            </AppText>
        </View>
    </View>
    
  );
};
