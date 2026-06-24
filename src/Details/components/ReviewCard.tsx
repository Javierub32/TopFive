import { View, Text, useWindowDimensions} from "react-native"
import { useTheme } from "context/ThemeContext"
import { ReviewIcon } from "components/Icons";
import {AppText} from 'components/AppText';
import RenderHtml from 'react-native-render-html';

interface Props {
    review: string
}

export const ReviewCard = ({review} : Props) => {

    const { colors } = useTheme();
    const { width } = useWindowDimensions();

    const tagsStyles = {
        body: { 
            color: colors.primaryText, 
            fontStyle: 'italic',
            lineHeight: 24, 
            fontSize: 15,
        },
        p: { 
            margin: 0 
        },
        b: { fontWeight: 'bold' },
        i: { fontStyle: 'italic' },
        ul: { marginVertical: 4 },
        ol: { marginVertical: 4 },
    };

    return (
        <View className='flex-1 p-4 rounded-2xl flex justify-between gap-2 border-l-4' style={{backgroundColor: colors.surfaceButton, borderColor: colors.borderButton}}>
            <View className='flex-row items-center gap-2'>
                <ReviewIcon/>
                <AppText className='text-sm font-bold uppercase tracking-widest' style={{ color: colors.markerText}}>Reseña</AppText>
            </View>
            
            {/* Si hay texto, renderizamos el HTML. Si está vacío, mostramos el guion por defecto */}
            {review ? (
                <RenderHtml
                    // Calculamos el ancho: pantalla total menos el padding de la vista padre
                    contentWidth={width - 64} 
                    source={{ html: review }}
                    tagsStyles={tagsStyles as any} 
                />
            ) : (
                <AppText className='leading-relaxed italic' style={{color: colors.primaryText}}>
                    -
                </AppText>
            )}
        </View>
    )
}