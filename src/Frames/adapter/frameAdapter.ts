export const frameAdapter = {
	getFrame: (frame: string) => {
		const map: Record<string, any> = {
			'cancion': require('../../../assets/frames/musicFrame.png'),
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
			'cancion':  { top: -70, left: -68, width: 250, height: 250, rotate: '0deg' },
			'videojuego': { top: -17, left: -25, width: 70, height: 70, rotate: '45deg' },
			'pelicula': { top: -38, left: -32, width: 180, height: 180, rotate: '0deg' },
			'peliculaDark': { top: -38, left: -32, width: 180, height: 180, rotate: '0deg' },
			'libro': { top: -68, left: -68, width: 250, height: 250, rotate: '0deg' },
			'love': { top: -20, left: -20, width: 70, height: 70, rotate: '20deg' },
		};
		return map[frame];
	}
}