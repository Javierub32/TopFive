import { ScalableBookIcon, ScalableFilmIcon, ScalableShowIcon, ScalableMusicIcon, ScalableGameIcon } from 'components/Icons';
import { ResourceType } from 'hooks/useResource';

export const iconAdapter = {
    getIcon : (category: ResourceType) => {
        const map: Record<ResourceType, any> = {
            'libro': ScalableBookIcon,
            'pelicula': ScalableFilmIcon,
            'serie': ScalableShowIcon,
            'cancion': ScalableMusicIcon,
            'videojuego': ScalableGameIcon,
        };
        return map[category];
    }
}

