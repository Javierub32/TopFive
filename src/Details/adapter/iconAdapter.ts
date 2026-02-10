import { GameModeIcon, AlbumIcon } from 'components/Icons';

export const iconAdapter = {
    getIcon : (category: string) => {
        const map: Record<string, any> = {
            'cancion': AlbumIcon,
            'videojuego': GameModeIcon,
        };
        return map[category];
    }
}