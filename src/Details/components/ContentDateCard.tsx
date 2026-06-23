import { Book, Song, Series, Game, Film} from 'app/types/Content';
import { CalendarIcon } from "components/Icons";
import { useTheme } from 'context/ThemeContext';
import { Text, View } from "react-native";
import {AppText} from 'components/AppText';

interface Props {
    releaseDate: string | null;
}

export const ContentDateCard = ({releaseDate}: Props) => {
    const { colors } = useTheme();

    const formateDate = () => {
      if(!releaseDate) return (null)
      
        return (
          new Date(releaseDate).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        )
    }
  
    const newDate = formateDate();

    return(
      <View className="flex-1 p-4 rounded-2xl justify-between" style={{backgroundColor: `${colors.primary}1A`}}>
        <View className="flex-row items-center gap-2">
          <CalendarIcon/>
          <AppText className="text-sm font-bold uppercase tracking-widest" style={{ color: colors.markerText }}>
            Publicado
          </AppText>
        </View>
        <View className="flex-1 justify-center items-center">
          <AppText className="text-base text-semibold" style={{ color: colors.secondaryText }}>
            {newDate}
          </AppText>
        </View>
      </View>
    )

}