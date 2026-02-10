import { GameModeIcon, AlbumIcon } from 'components/Icons';

export const extraAdapter = {
    getIcon : (category: string) => {
        const map: Record<string, any> = {
            'cancion': AlbumIcon,
            'videojuego': GameModeIcon,
        };
        return map[category];
    },

    getTitle : (category: string) => {
        const map: Record<string, string> = {
            'cancion': "Álbum",
            'videojuego': "Modos de Juego",
        };
        return map[category]
    }
}