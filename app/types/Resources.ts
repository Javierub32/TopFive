export interface FilmResource {
  id: number;
  usuarioId: string;
  idContenido: number;
  estado: 'PENDIENTE' | 'EN_CURSO' | 'COMPLETADO';
  reseña: string;
  calificacion: number;
  favorito: boolean;
  tiporecurso: string;
  fechaVisionado: string;
  numVisionados: number;
  fechacreacion: string;
  contenidopelicula: {
    titulo: string;
    imagenUrl: string;
    fechaLanzamiento: string;
    descripcion?: string;
    calificacion?: number;
  };
}

export interface BookResource {
  id: number;
  usuarioId: string;
  idContenido: number;
  estado: 'PENDIENTE' | 'EN_CURSO' | 'COMPLETADO';
  reseña: string;
  calificacion: number;
  favorito: boolean;
  tiporecurso: string;
  paginasLeidas: number;
  fechaInicio: string | null;
  fechaFin: string | null;
  fechacreacion: string;
  contenidolibro: {
    titulo: string;
    imagenUrl: string;
    fechaLanzamiento: string;
    descripcion?: string;
    calificacion?: number;
    autor?: string;
    genero?: string[];
  };
}

export interface GameResource {
  id: number;
  usuarioId: string;
  idContenido: number;
  estado: 'PENDIENTE' | 'EN_CURSO' | 'COMPLETADO' | 'ABANDONADO';
  reseña: string;
  calificacion: number;
  favorito: boolean;
  tiporecurso: string;
  horasJugadas: number;
  dificultad: string;
  fechaInicio: string | null;
  fechaFin: string | null;
  fechacreacion: string;
  contenidovideojuego: {
    titulo: string;
    imagenUrl: string;
    fechaLanzamiento: string;
    descripcion?: string;
    calificacion?: number;
    autor?: string;
    genero?: string[];
    plataformas?: string[];
    modosJuego?: string[];
  };
}

export interface SongResource {
  id: number;
  usuarioId: string;
  idContenido: number;
  estado: 'PENDIENTE' | 'COMPLETADO';
  reseña: string;
  calificacion: number;
  favorito: boolean;
  tiporecurso: string;
  fechaEscucha: string | null;
  albumId: number | null;
  fechacreacion: string;
  contenidocancion: {
    titulo: string;
    imagenUrl: string;
    fechaLanzamiento: string;
    autor?: string;
    genero?: string[];
    albumTitulo?: string;
    referencia?: string;
  };
}

export interface SeriesResource {
  id: number;
  usuarioId: string;
  idContenido: number;
  estado: 'PENDIENTE' | 'EN_CURSO' | 'COMPLETADO';
  reseña: string;
  calificacion: number;
  favorito: boolean;
  tiporecurso: string;
  temporadaActual: number;
  episodioActual: number;
  numVisualizaciones: number;
  fechaInicio: string | null;
  fechaFin: string | null;
  fechacreacion: string;
  contenidoserie: {
    titulo: string;
    imagenUrl: string;
    fechaLanzamiento: string;
    fechaFin?: string;
    descripcion?: string;
    calificacion?: number;
    genero?: string[];
  };
}