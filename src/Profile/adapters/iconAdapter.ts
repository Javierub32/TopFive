import { BookIcon, FilmIcon, ShowIcon, MusicIcon, GameIcon } from 'components/Icons';
import { ResourceType } from 'hooks/useResource';

export const iconAdapter = {
    getIcon : (category: ResourceType) => {
        const map: Record<ResourceType, any> = {
            'libro': BookIcon,
            'pelicula': FilmIcon,
            'serie': ShowIcon,
            'cancion': MusicIcon,
            'videojuego': GameIcon,
        };
        return map[category];
    }
}

