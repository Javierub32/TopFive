export const frameAdapter = {
	getFrame: (frame: string) => {
		const map: Record<string, any> = {
			'cancion': require('../../../assets/frames/musicFramee.png'),
			'videojuego': require('../../../assets/frames/gameFrame.png'),
			'pelicula': require('../../../assets/frames/filmFrame.png'),
			'peliculaDark': require('../../../assets/frames/filmFrameDark.png'),
			'libro': require('../../../assets/frames/bookFrame.png'),
			'love': require('../../../assets/frames/loveFrame.png'),
			'lazoRosa': require('../../../assets/frames/lazoRosa.png'),
			'coronaDorada': require('../../../assets/frames/coronaDorada.png'),
			'cowboy': require('../../../assets/frames/cowboy.png'),
			'mugiwara': require('../../../assets/frames/mugiwara.png'),
			'lgtb' : require('../../../assets/frames/lgtb2.png'),
			'spain' : require('../../../assets/frames/spain.png'),

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
			'lazoRosa': {top: 25, left: 80, width: 95, rotate: '20deg'},
			'coronaDorada': {top: 10, left: 85 , width: 70, rotate: '40deg'},
			'cowboy': {top: 10, left: 80 , width: 70, rotate: '40deg'},
			'mugiwara': {top: 14, left: 85 , width: 70, rotate: '40deg'},
			'lgtb' : {top: 50, left: 50 , width: 100, rotate: '0deg'},
			'spain' : {top: 50, left: 50 , width: 110, rotate: '0deg'}
		};
		return map[frame];
	}
}