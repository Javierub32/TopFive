import {
  BookResource,
  FilmResource,
  SeriesResource,
  SongResource,
  GameResource,
} from 'app/types/Resources';
import { ScalableDificultyIcon, ScalableFavoriteIcon, ScalableTimesWatchedIcon } from 'components/Icons';
import { useTheme } from 'context/ThemeContext';
import { TouchableOpacity, View } from 'react-native';
import { AddToListButton } from 'components/AddToListButton';
import { router, useLocalSearchParams } from 'expo-router';
import { AppText } from 'components/AppText';
import { useTranslation } from 'react-i18next';
import { ResourceType } from 'hooks/useResource';

interface Props {
  resource: BookResource | FilmResource | SeriesResource | SongResource | GameResource;
  isOwner?: boolean;
}

const typeMap: Record<ResourceType, string> = {
  libro: 'book',
  pelicula: 'film',
  serie: 'series',
  videojuego: 'game',
  cancion: 'song',
};

export const ResourceAttributes = ({ resource, isOwner }: Props) => {
  const { colors } = useTheme();
  const { item } = useLocalSearchParams();
  const { contenido } = resource;
  const releaseYear = contenido.fechaLanzamiento
    ? new Date(contenido.fechaLanzamiento).getFullYear()
    : 'N/A';
  const { t } = useTranslation();

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDIENTE':
        return t('status.pending');
      case 'EN_CURSO':
        return t('status.inProgress');
      case 'COMPLETADO':
        return t('status.completed');
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

  const getDificultyText = (dificultad: string) => {
    switch (dificultad) {
      case 'Fácil':
        return t('details.dificulty.easy');
      case 'Normal':
        return t('details.dificulty.medium');
      case 'Difícil':
        return t('details.dificulty.hard');
      case 'Extremo':
        return t('details.dificulty.extreme');
    }
  };

  const getResourceType = (resource: any): ResourceType => {
    const rawType = (resource.tiporecurso || '').toLowerCase();
    if (rawType === 'audiovisual') {
      return 'temporadaActual' in resource ? 'serie' : 'pelicula';
    }
    if (rawType === 'musica') {
      return 'cancion';
    }
    return rawType as ResourceType;
  };

  const handleTitlePress = () => {
    const rawType = (resource.tiporecurso || '').toLowerCase();
    let type: string | undefined;

    if (rawType === 'audiovisual') {
      type = 'temporadaActual' in resource ? 'series' : 'film';
    }
    else if (rawType === "musica") {
      type = 'song';
    } else {
      type = typeMap[rawType as ResourceType];
    }

    const targetId = resource.contenido?.apiId ?? (resource.contenido as any)?.idApi;

    router.push({
      pathname: `/details/${type}/${type}Content`,
      params: { from: 'details', id: targetId },
    });
  };
  return (
    <View className="mb-4">
      <View className="flex-1 flex-row items-center justify-between">

        <TouchableOpacity
          className='flex-1 mr-2'
          activeOpacity={0.7}
          onPress={handleTitlePress}
        >
          <AppText className="flex-1 font-bold" style={{ color: colors.primaryText, fontSize: 24 }}>
            {contenido.titulo || t('common.noTitle')}
          </AppText>
        </TouchableOpacity>

        {isOwner && (
          <AddToListButton resourceCategory={getResourceType(resource)} resourceId={resource.id} />
        )}
      </View>

      <View className="flex-row flex-wrap items-stretch gap-2 pt-1">
        {/* Año de publicación */}
        <View
          className="justify-center rounded-lg px-3 py-1.5"
          style={{ backgroundColor: colors.surfaceButton }}>
          <AppText className="font-semibold" style={{ color: colors.markerText, fontSize: 14 }}>
            {releaseYear}
          </AppText>
        </View>

        {/* Estado */}
        <View
          className="justify-center rounded-lg px-3 py-1.5"
          style={{ backgroundColor: `${getStatusColor(resource.estado)}33` }}>
          <AppText
            className="font-semibold uppercase"
            style={{ color: getStatusColor(resource.estado), fontSize: 14 }}>
            {getStatusText(resource.estado)}
          </AppText>
        </View>

        {!!getConsumptionCount(resource) && (
          <View
            className="flex-row items-center rounded-lg px-3 py-1.5"
            style={{ backgroundColor: `${colors.accent}33` }}>
            <ScalableTimesWatchedIcon />
            <AppText className="ml-1 font-bold" style={{ color: colors.markerText, fontSize: 14 }}>
              {getConsumptionCount(resource)}x
            </AppText>
          </View>
        )}

        {!!getDificulty(resource) && (
          <View
            className="flex-row items-center justify-between rounded-lg px-3 py-1.5"
            style={{ backgroundColor: `${getDificultyColor(getDificulty(resource))}33` }}>
            <ScalableDificultyIcon color={getDificultyColor(getDificulty(resource))} />
            <AppText
              className="text-semibold ml-1"
              style={{ color: getDificultyColor(getDificulty(resource)), fontSize: 14 }}>
              {getDificultyText(getDificulty(resource))}
            </AppText>
          </View>
        )}

        {/* Favorito */}
        {resource.favorito && (
          <View
            className="justify-center rounded-lg px-3 py-1.5"
            style={{ backgroundColor: `${colors.favorite}33` }}>
            <ScalableFavoriteIcon />
          </View>
        )}
      </View>
    </View>
  );
};
