import { StateType } from "hooks/useResource";

export interface FilmResource {
  id: number;
  usuarioId: string;
  idContenido: number;
  estado: StateType;
  reseña: string;
  calificacion: number;
  favorito: boolean;
  tiporecurso: string;
  fechaVisionado: string;
  numVisionados: number;
  fechacreacion: string;
  contenido: {
	apiId: number;
    titulo: string;
    imagenUrl: string;
    fechaLanzamiento: string;
  };
}

export interface BookResource {
  id: number;
  usuarioId: string;
  idContenido: number;
  estado: StateType;
  reseña: string;
  calificacion: number;
  favorito: boolean;
  tiporecurso: string;
  paginasLeidas: number;
  fechaInicio: string | null;
  fechaFin: string | null;
  fechacreacion: string;
  contenido: {
	apiId: string;
    titulo: string;
    imagenUrl: string;
    fechaLanzamiento: string;
  };
}

export interface GameResource {
  id: number;
  usuarioId: string;
  idContenido: number;
  estado: StateType;
  reseña: string;
  calificacion: number;
  favorito: boolean;
  tiporecurso: string;
  horasJugadas: number;
  dificultad: string;
  fechaInicio: string | null;
  fechaFin: string | null;
  fechacreacion: string;
  contenido: {
	apiId: string;
    titulo: string;
    imagenUrl: string;
    fechaLanzamiento: string;
  };
}

export interface SongResource {
  id: number;
  usuarioId: string;
  idContenido: number;
  estado: StateType;
  reseña: string;
  calificacion: number;
  favorito: boolean;
  tiporecurso: string;
  fechaEscucha: string | null;
  albumId: number | null;
  fechacreacion: string;
  contenido: {
	apiId: number;
    titulo: string;
    imagenUrl: string;
    fechaLanzamiento: string;
  };
}

export interface SeriesResource {
  id: number;
  usuarioId: string;
  idContenido: number;
  estado: StateType;
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
  contenido: {
	apiId: string;
    titulo: string;
    imagenUrl: string;
    fechaLanzamiento: string;
  };
}