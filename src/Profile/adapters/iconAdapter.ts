import { BookIcon, FilmIcon, ShowIcon, MusicIcon, GameIcon } from 'components/Icons';

export const iconAdapter = {
    getIcon : (category: any) => {
        const map: Record<string, any> = {
            'libros': BookIcon,
            'películas': FilmIcon,
            'series': ShowIcon,
            'canciones': MusicIcon,
            'videojuegos': GameIcon,
        };
        return map[category];
    }
}

