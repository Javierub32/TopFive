import type { ResourceType, StateType } from 'hooks/useResource';

export default interface DiaryEntity {
  recurso_id: string | number;
  usuarioId: string;
  username: string;
  avatar_url: string | null;

  tipo_contenido: Uppercase<ResourceType>;

  fechacreacion: string;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  fecha_orden: string | null;

  calificacion: number | null;
  comentario: string | null;
  estado: StateType;

  titulo: string;
  imagen_url: string | null;
  idapi: string | null;

  anio_lanzamiento: number | null;
  favorito: boolean | null;
}