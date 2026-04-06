export const frameAdapter = {
	getFrame: (frame: string) => {
		const map: Record<string, any> = {
			'cancion': require('../../../assets/frames/musicFramee.png'),
			'videojuego': require('../../../assets/frames/gameFrame.png'),
			'pelicula': require('../../../assets/frames/filmFrame.png'),
			'peliculaDark': require('../../../assets/frames/filmFrameDark.png'),
			'libro': require('../../../assets/frames/bookFrame.png'),
			'love': require('../../../assets/frames/loveFrame.png'),
		};
		return map[frame];
	},

	getPositionAndSize: (frame: string) => {
		const map: Record<string, any> = {
			'cancion':  { width: 160,  rotate: '0deg' },
			'videojuego': { top: 18, left: 90, width: 70, rotate: '45deg' },
			'pelicula': { width: 160,  rotate: '0deg' },
			'peliculaDark': { width: 160,  rotate: '0deg' },
			'libro': { width: 230,  rotate: '0deg' },
			'love': { top: 18, left: 90, width: 70, rotate: '20deg' },
		};
		return map[frame];
	}
}