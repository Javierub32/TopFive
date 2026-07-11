import { ScalableGameModeIcon, ScalableAlbumIcon } from 'components/Icons';
export const extraAdapter = {
    getIcon : (category: string) => {
        const map: Record<string, any> = {
            'cancion': ScalableAlbumIcon,
            'videojuego': ScalableGameModeIcon,
        };
        return map[category];
    },

    getTitle : (category: string) => {
        const map: Record<string, string> = {
            'cancion': "Álbum",
            'videojuego': 'details.gameModes',
        };
        return map[category]
    }
}