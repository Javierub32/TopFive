import { BookResource, FilmResource, SeriesResource, SongResource, GameResource } from "app/types/Resources";
import { TimerIcon } from "components/Icons";
import { useTheme } from "context/ThemeContext";
import { View, Text } from "react-native"; 


interface Props {
    resource: BookResource | SeriesResource | GameResource
}

export const TimeCard = ({resource} : Props) => {
    const { colors } = useTheme();

    const getReadingDuration = () => {
        if (!resource?.fechaInicio) return null;

        const start = new Date(resource.fechaInicio);
        let end = new Date(); // Por defecto: hoy (para EN_CURSO)

        // Si está completado y tiene fecha fin, usamos esa
        if (resource.estado === 'COMPLETADO' && resource.fechaFin) {
        end = new Date(resource.fechaFin);
        } 
        // Si está pendiente, no mostramos nada (o podrías retornar "0 días")
        else if (resource.estado === 'PENDIENTE') {
            return null;
        }

        // Normalizamos las horas para contar días naturales completos
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);

        const diffTime = end.getTime() - start.getTime();
        // Convertimos milisegundos a días
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return '0 días'; // Por si las fechas están al revés
        if (diffDays === 0) return '1 día'; // Mismo día cuenta como 1
        return `${diffDays} días`;
    };

    const readingTime = getReadingDuration();

    if(readingTime) return (
        <View className="mt-4">
            <View 
            className="rounded-2xl p-6 flex-row items-center justify-between shadow-lg" 
            style={{ backgroundColor: `${colors.accent}BF` }}
            >
                <View>
                    <Text className="text-sm font-medium uppercase tracking-widest mb-1" style={{ color: colors.primaryText }}>
                    Tiempo de lectura total
                    </Text>
                    <Text className="text-2xl font-bold" style={{ color: colors.primaryText }}>
                    {readingTime}
                    </Text>
                </View>
                <View className="w-12 h-12 rounded-2xl items-center justify-center" style={{ backgroundColor: `${colors.primaryText}33` }}>
                    <TimerIcon/>
                </View>
            </View>
        </View>
    )
          
    
}