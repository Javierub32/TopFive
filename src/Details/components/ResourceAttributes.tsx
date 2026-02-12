import {
  BookResource,
  FilmResource,
  SeriesResource,
  SongResource,
  GameResource,
} from 'app/types/Resources';
import { DificultyIcon, FavoriteIcon, TimesWatchedIcon } from 'components/Icons';
import { useTheme } from 'context/ThemeContext';
import { View, Text } from 'react-native';
import { AddToListButton } from 'components/AddToListButton';
import { useLocalSearchParams } from 'expo-router';

interface Props {
  resource: BookResource | FilmResource | SeriesResource | SongResource | GameResource;
  isOwner?: boolean;
}

export const ResourceAttributes = ({ resource, isOwner }: Props) => {
  const { colors } = useTheme();
  const { item } = useLocalSearchParams();
  const { contenido } = resource;
  const releaseYear = contenido.fechaLanzamiento
    ? new Date(contenido.fechaLanzamiento).getFullYear()
    : 'N/A';

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDIENTE':
        return 'Pendiente';
      case 'EN_CURSO':
        return 'En curso';
      case 'COMPLETADO':
        return 'Completado';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDIENTE':
        return colors.warning;
      case 'EN_CURSO':
        return colors.accent;
      case 'COMPLETADO':
        return colors.success;
      default:
        return colors.surfaceButton;
    }
  };

  try {
    resource = item ? JSON.parse(item as string) : null;
  } catch (error) {
    console.error('Error parsing item:', error);
  }

  const getConsumptionCount = (res: any) => {
    if ('numVisionados' in res) {
      return res.numVisionados > 1 ? res.numVisionados : null;
    } else if ('numVisualizaciones' in res) {
      return res.numVisualizaciones > 1 ? res.numVisualizaciones : null;
    }

    return null;
  };

  const getDificultyColor = (dificultad: string) => {
    switch (dificultad) {
      case 'Fácil':
        return colors.success;
      case 'Normal':
        return colors.accent;
      case 'Difícil':
        return colors.warning;
      case 'Extremo':
        return colors.error;
    }
  };

  const getDificulty = (res: any) => {
    if ('dificultad' in res) {
      return res.dificultad;
    }

    return null;
  };

  return (
    <View className="mb-4">
      <View className="flex-1 flex-row items-center justify-between">
        <Text className="flex-1 text-3xl font-bold" style={{ color: colors.primaryText }}>
          {contenido.titulo || 'Sin título'}
        </Text>
        {isOwner && <AddToListButton resourceCategory="Libros" resourceId={resource.id} />}
      </View>

      <View className="flex-row flex-wrap items-stretch gap-2 pt-1">
        {/* Año de publicación */}
        <View
          className="justify-center rounded-lg px-3 py-1.5"
          style={{ backgroundColor: colors.surfaceButton }}>
          <Text className="text-sm font-semibold" style={{ color: colors.markerText }}>
            {releaseYear}
          </Text>
        </View>

        {/* Estado */}
        <View
          className="justify-center rounded-lg px-3 py-1.5"
          style={{ backgroundColor: `${getStatusColor(resource.estado)}33` }}>
          <Text
            className="text-sm font-semibold uppercase"
            style={{ color: getStatusColor(resource.estado) }}>
            {getStatusText(resource.estado)}
          </Text>
        </View>

        {!!getConsumptionCount(resource) && (
          <View
            className="flex-row items-center rounded-lg px-3 py-1.5"
            style={{ backgroundColor: `${colors.accent}33` }}>
            <TimesWatchedIcon />
            <Text className="ml-1 text-xs font-bold" style={{ color: colors.markerText }}>
              {getConsumptionCount(resource)}x
            </Text>
          </View>
        )}

        {!!getDificulty(resource) && (
          <View
            className="flex-row items-center justify-between rounded-lg px-3 py-1.5"
            style={{ backgroundColor: `${getDificultyColor(getDificulty(resource))}33` }}>
            <DificultyIcon color={getDificultyColor(getDificulty(resource))} />
            <Text
              className="text-semibold ml-1 text-xs"
              style={{ color: getDificultyColor(getDificulty(resource)) }}>
              {getDificulty(resource)}
            </Text>
          </View>
        )}

        {/* Favorito */}
        {resource.favorito && (
          <View
            className="justify-center rounded-lg px-3 py-1.5"
            style={{ backgroundColor: `${colors.favorite}33` }}>
            <FavoriteIcon />
          </View>
        )}
      </View>
    </View>
  );
};
