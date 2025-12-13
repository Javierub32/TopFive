CREATE TABLE public.contenidoalbum (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  titulo text NOT NULL,
  descripcion text,
  imagenurl text,
  enlacereferencia text,
  apifuente text DEFAULT 'ITUNES'::text,
  apiidexterno text,
  fechalanzamiento date,
  creador text,
  genero ARRAY,
  promediocalificacionapi numeric,
  numeropistas integer,
  copyright text,
  CONSTRAINT contenidoalbum_pkey PRIMARY KEY (id)
);
CREATE TABLE public.contenidocancion (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  titulo text NOT NULL,
  imagenUrl text,
  referencia text,
  apifuente text DEFAULT 'ITUNES'::text,
  idApi bigint,
  fechaLanzamiento text,
  autor text,
  genero text,
  albumId bigint,
  albumTitulo text,
  autorId bigint,
  CONSTRAINT contenidocancion_pkey PRIMARY KEY (id),
  CONSTRAINT contenidocancion_album_id_fkey FOREIGN KEY (albumId) REFERENCES public.contenidoalbum(id)
);
CREATE TABLE public.contenidolibro (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  titulo text NOT NULL,
  descripcion text,
  imagenUrl text,
  referencia text,
  apifuente text DEFAULT '''ITUNES''::text'::text,
  idApi bigint,
  fechaLanzamiento date,
  autor text,
  genero ARRAY,
  calificacion numeric,
  idAutor bigint,
  CONSTRAINT contenidolibro_pkey PRIMARY KEY (id)
);
CREATE TABLE public.contenidopelicula (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  titulo text NOT NULL,
  descripcion text,
  imagenUrl text,
  referencia text,
  idApi bigint,
  fechaLanzamiento date,
  creador text,
  genero ARRAY,
  calificacion numeric,
  CONSTRAINT contenidopelicula_pkey PRIMARY KEY (id)
);
CREATE TABLE public.contenidoserie (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  titulo text NOT NULL,
  descripcion text,
  imagenUrl text,
  idApi text,
  fechaLanzamiento date,
  genero ARRAY,
  calificacion numeric,
  fechaFin date,
  CONSTRAINT contenidoserie_pkey PRIMARY KEY (id)
);
CREATE TABLE public.contenidovideojuego (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  titulo text NOT NULL,
  descripcion text,
  imagenUrl text,
  idApi text,
  fechaLanzamiento date,
  autor text,
  genero ARRAY,
  calificacion numeric,
  plataformas ARRAY,
  modosJuego ARRAY,
  CONSTRAINT contenidovideojuego_pkey PRIMARY KEY (id)
);
CREATE TABLE public.itemcoleccion (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  coleccionid bigint NOT NULL,
  fechaagregado timestamp with time zone DEFAULT now(),
  recursolibroid bigint,
  recursovideojuegoid bigint,
  recursopeliculaid bigint,
  recursoserieid bigint,
  recursoalbumid bigint,
  recursocancionid bigint,
  CONSTRAINT itemcoleccion_pkey PRIMARY KEY (id),
  CONSTRAINT itemcoleccion_coleccionid_fkey FOREIGN KEY (coleccionid) REFERENCES public.recursocoleccion(id),
  CONSTRAINT itemcoleccion_recursolibroid_fkey FOREIGN KEY (recursolibroid) REFERENCES public.recursolibro(id),
  CONSTRAINT itemcoleccion_recursovideojuegoid_fkey FOREIGN KEY (recursovideojuegoid) REFERENCES public.recursovideojuego(id),
  CONSTRAINT itemcoleccion_recursopeliculaid_fkey FOREIGN KEY (recursopeliculaid) REFERENCES public.recursopelicula(id),
  CONSTRAINT itemcoleccion_recursoserieid_fkey FOREIGN KEY (recursoserieid) REFERENCES public.recursoserie(id),
  CONSTRAINT itemcoleccion_recursoalbumid_fkey FOREIGN KEY (recursoalbumid) REFERENCES public.recursoalbum(id),
  CONSTRAINT itemcoleccion_recursocancionid_fkey FOREIGN KEY (recursocancionid) REFERENCES public.recursocancion(id)
);
CREATE TABLE public.recursoalbum (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  usuarioid uuid,
  contenidoid bigint,
  calificacion integer CHECK (calificacion >= 0 AND calificacion <= 10),
  resena text,
  estado USER-DEFINED,
  favorito boolean DEFAULT false,
  fechacreacion timestamp with time zone DEFAULT now(),
  tiporecurso USER-DEFINED DEFAULT 'MUSICA'::"TipoRecurso",
  fechaescucha date,
  CONSTRAINT recursoalbum_pkey PRIMARY KEY (id),
  CONSTRAINT recursoalbum_usuarioid_fkey FOREIGN KEY (usuarioid) REFERENCES public.usuario(id),
  CONSTRAINT recursoalbum_contenidoid_fkey FOREIGN KEY (contenidoid) REFERENCES public.contenidoalbum(id)
);
CREATE TABLE public.recursocancion (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  usuarioId uuid,
  idContenido bigint,
  calificacion integer CHECK (calificacion >= 0 AND calificacion <= 10),
  reseña text,
  estado USER-DEFINED,
  favorito boolean DEFAULT false,
  fechacreacion timestamp with time zone DEFAULT now(),
  tiporecurso USER-DEFINED DEFAULT 'MUSICA'::"TipoRecurso",
  fechaEscucha date,
  albumId bigint,
  CONSTRAINT recursocancion_pkey PRIMARY KEY (id),
  CONSTRAINT recursocancion_usuarioid_fkey FOREIGN KEY (usuarioId) REFERENCES public.usuario(id),
  CONSTRAINT recursocancion_contenidoid_fkey FOREIGN KEY (idContenido) REFERENCES public.contenidocancion(id),
  CONSTRAINT recursocancion_albumid_fkey FOREIGN KEY (albumId) REFERENCES public.recursoalbum(id)
);
CREATE TABLE public.recursocoleccion (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  usuarioid uuid,
  nombrecoleccion text NOT NULL,
  resena text,
  calificacion integer CHECK (calificacion >= 0 AND calificacion <= 10),
  favorito boolean DEFAULT false,
  fechacreacion timestamp with time zone DEFAULT now(),
  tiporecurso USER-DEFINED DEFAULT 'COLECCION'::"TipoRecurso",
  CONSTRAINT recursocoleccion_pkey PRIMARY KEY (id),
  CONSTRAINT recursocoleccion_usuarioid_fkey FOREIGN KEY (usuarioid) REFERENCES public.usuario(id)
);
CREATE TABLE public.recursolibro (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  usuarioId uuid,
  idContenido bigint,
  calificacion integer CHECK (calificacion >= 0 AND calificacion <= 10),
  reseña text,
  estado USER-DEFINED,
  favorito boolean DEFAULT false,
  fechacreacion timestamp with time zone DEFAULT now(),
  tiporecurso USER-DEFINED DEFAULT 'LIBRO'::"TipoRecurso",
  paginasLeidas integer,
  fechaInicio date,
  fechaFin date,
  CONSTRAINT recursolibro_pkey PRIMARY KEY (id),
  CONSTRAINT recursolibro_usuarioid_fkey FOREIGN KEY (usuarioId) REFERENCES public.usuario(id),
  CONSTRAINT recursolibro_contenidoid_fkey FOREIGN KEY (idContenido) REFERENCES public.contenidolibro(id)
);
CREATE TABLE public.recursopelicula (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  usuarioId uuid,
  idContenido bigint,
  calificacion integer CHECK (calificacion >= 0 AND calificacion <= 10),
  reseña text,
  estado USER-DEFINED,
  favorito boolean DEFAULT false,
  fechacreacion timestamp with time zone DEFAULT now(),
  tiporecurso USER-DEFINED DEFAULT 'AUDIOVISUAL'::"TipoRecurso",
  fechaVisionado date,
  numVisionados integer,
  CONSTRAINT recursopelicula_pkey PRIMARY KEY (id),
  CONSTRAINT recursopelicula_usuarioid_fkey FOREIGN KEY (usuarioId) REFERENCES public.usuario(id),
  CONSTRAINT recursopelicula_contenidoid_fkey FOREIGN KEY (idContenido) REFERENCES public.contenidopelicula(id)
);
CREATE TABLE public.recursoserie (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  usuarioId uuid,
  idContenido bigint,
  calificacion integer CHECK (calificacion >= 0 AND calificacion <= 10),
  reseña text,
  estado USER-DEFINED,
  favorito boolean DEFAULT false,
  fechacreacion timestamp with time zone DEFAULT now(),
  tiporecurso USER-DEFINED DEFAULT 'AUDIOVISUAL'::"TipoRecurso",
  temporadaActual integer,
  episodioActual integer,
  numVisualizaciones integer,
  fechaInicio date,
  fechaFin date,
  CONSTRAINT recursoserie_pkey PRIMARY KEY (id),
  CONSTRAINT recursoserie_usuarioid_fkey FOREIGN KEY (usuarioId) REFERENCES public.usuario(id),
  CONSTRAINT recursoserie_contenidoid_fkey FOREIGN KEY (idContenido) REFERENCES public.contenidoserie(id)
);
CREATE TABLE public.recursovideojuego (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  usuarioId uuid,
  idContenido bigint,
  calificacion integer CHECK (calificacion >= 0 AND calificacion <= 10),
  reseña text,
  estado USER-DEFINED,
  favorito boolean DEFAULT false,
  fechacreacion timestamp with time zone DEFAULT now(),
  tiporecurso USER-DEFINED DEFAULT 'VIDEOJUEGO'::"TipoRecurso",
  horasJugadas integer,
  dificultad text,
  fechaInicio date,
  fechaFin date,
  CONSTRAINT recursovideojuego_pkey PRIMARY KEY (id),
  CONSTRAINT recursovideojuego_usuarioid_fkey FOREIGN KEY (usuarioId) REFERENCES public.usuario(id),
  CONSTRAINT recursovideojuego_contenidoid_fkey FOREIGN KEY (idContenido) REFERENCES public.contenidovideojuego(id)
);
CREATE TABLE public.usuario (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  username text NOT NULL UNIQUE,
  email text NOT NULL UNIQUE,
  fecharegistro timestamp with time zone DEFAULT now(),
  avatar_url text,
  CONSTRAINT usuario_pkey PRIMARY KEY (id)
);