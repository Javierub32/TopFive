import { useAuth } from 'context/AuthContext';
import { useCollection } from 'context/CollectionContext';
import { useNotification } from 'context/NotificationContext';
import { useResource } from 'hooks/useResource';
import { supabase } from 'lib/supabase';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const useAddToCollection = () => {
  const { user } = useAuth();
  const { checkIfResourceExists } = useResource();
  const { refreshData } = useCollection();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const watchLaterBook = async (idapi: string | number | null) => {
    if (idapi == null || !user) return;

    setLoading(true);
    try {
      const { data: book, error: contentError } = await supabase
        .from('contenidolibro')
        .select('id, titulo, imagenUrl')
        .eq('idApi', idapi)
        .single();

      if (contentError) throw contentError;
      if (!book) throw new Error('No se encontró el contenido del libro');

      const reviewed = await checkIfResourceExists(idapi, 'libro');

      if (reviewed) {
        showNotification({
          title: t('common.error'),
          description: t('home.contentAlreadyInCollection'),
          isChoice: false,
          delete: false,
          success: false,
        });
        setLoading(false);
        return;
      } else {
        const { error: inventoryError } = await supabase.from('recursolibro').insert({
          usuarioId: user.id,
          idContenido: book.id,
          estado: 'PENDIENTE',
          reseña: '',
          calificacion: 0,
          favorito: false,
          tiporecurso: 'LIBRO',
          paginasLeidas: 0,
          fechaInicio: null,
          fechaFin: null,
        });

        if (inventoryError) {
          showNotification({
            title: t('forms.savingError'),
            description: t('forms.book.savingErrorDescription'),
            isChoice: false,
            delete: false,
            success: false,
          });
          console.error('Error al insertar:', inventoryError);
        } else {
          refreshData('libro');

          // Mostrar modal después de navegar
          setTimeout(() => {
            showNotification({
              title: t('common.success'),
              description: t('forms.savingSuccessDescription', {
                titulo: book.titulo || t('forms.book.theBook'),
              }),
              isChoice: false,
              delete: false,
              success: true,
            });
          }, 100);
        }
      }
    } catch (error) {
      console.error('Error saving book data:', error);
      showNotification({
        title: t('forms.savingError'),
        description: t('forms.book.savingErrorDescription'),
        isChoice: false,
        delete: false,
        success: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const watchLaterFilm = async (idapi: string | number | null) => {
    if (idapi == null || !user) return;

    setLoading(true);
    try {
      const { data : film, error: contentError } = await supabase
        .from('contenidopelicula')
        .select('id, titulo, imagenUrl')
        .eq('idApi', idapi)
        .single();

      if (contentError) throw contentError;
      if (!film) throw new Error('No se encontró el contenido de la película');

      const reviewed = await checkIfResourceExists(idapi, 'pelicula');

      if(reviewed) {
        showNotification({
          title: t('common.error'),
          description: t('home.contentAlreadyInCollection'),
          isChoice: false,
          delete: false,
          success: false,
        });
        setLoading(false);
        return;
      } else {
        const { error: inventoryError} = await supabase.from('recursopelicula').insert({
          usuarioId: user.id,
          idContenido: film.id,
          calificacion: 0,
          reseña: '',
          estado: 'PENDIENTE',
          favorito: false,
          tiporecurso: 'AUDIOVISUAL',
          fechaVisionado: null,
          numVisionados: 0,
        })

        if (inventoryError) {
          showNotification({
            title: t('forms.savingError'),
            description: t('forms.film.savingErrorDescription'),
            isChoice: false,
            delete: false,
            success: false,
          });
          console.error('Error al insertar:', inventoryError);
        } else {
          refreshData('pelicula')

          setTimeout(() => {
            showNotification({
              title: t('common.success'),
              description: t('forms.savingSuccessDescription', {
                titulo: film.titulo || t('forms.film.theFilm'),
              }),
              isChoice: false,
              delete: false,
              success: true,
            });
          }, 100);
        }
      }
    } catch (error) {
      console.error('Error saving film data:', error);
      showNotification({
        title: t('forms.savingError'),
        description: t('forms.film.savingErrorDescription'),
        isChoice: false,
        delete: false,
        success: false,
      });
    } finally {
      setLoading(false);
    }
  }

  const watchLaterSerie = async (idapi: string | number | null) => {
    if (idapi == null || !user) return;

    setLoading(true);
    try {
      const { data : serie, error: contentError } = await supabase
        .from('contenidoserie')
        .select('id, titulo, imagenUrl')
        .eq('idApi', idapi)
        .single();

      if (contentError) throw contentError;
      if (!serie) throw new Error('No se encontró el contenido de la serie');

      const reviewed = await checkIfResourceExists(idapi, 'serie');

      if(reviewed) {
        showNotification({
          title: t('common.error'),
          description: t('home.contentAlreadyInCollection'),
          isChoice: false,
          delete: false,
          success: false,
        });
        setLoading(false);
        return;
      } else {
        const { error: inventoryError} = await supabase.from('recursoserie').insert({
          usuarioId: user.id,
          idContenido: serie.id,
          calificacion: 0,
          reseña: '',
          estado: 'PENDIENTE',
          favorito: false,
          tiporecurso: 'AUDIOVISUAL',
          temporadaActual: 1,
          episodioActual: 1,
          numVisualizaciones: 0,
          fechaInicio: null,
          fechaFin: null,
        })

        if (inventoryError) {
          showNotification({
            title: t('forms.savingError'),
            description: t('forms.serie.savingErrorDescription'),
            isChoice: false,
            delete: false,
            success: false,
          });
          console.error('Error al insertar:', inventoryError);
        } else {
          refreshData('serie')

          setTimeout(() => {
            showNotification({
              title: t('common.success'),
              description: t('forms.savingSuccessDescription', {
                titulo: serie.titulo || t('forms.serie.theSerie'),
              }),
              isChoice: false,
              delete: false,
              success: true,
            });
          }, 100);
        }
      }
    } catch (error) {
      console.error('Error saving serie data:', error);
      showNotification({
        title: t('forms.savingError'),
        description: t('forms.serie.savingErrorDescription'),
        isChoice: false,
        delete: false,
        success: false,
      });
    } finally {
      setLoading(false);
    }
  }

  const watchLaterGame = async (idapi: string | number | null) => {
    if (idapi == null || !user) return;

    setLoading(true);
    try {
      const { data : videogame, error: contentError } = await supabase
        .from('contenidovideojuego')
        .select('id, titulo, imagenUrl')
        .eq('idApi', idapi)
        .single();

      if (contentError) throw contentError;
      if (!videogame) throw new Error('No se encontró el contenido del videojuego');

      const reviewed = await checkIfResourceExists(idapi, 'videojuego');

      if(reviewed) {
        showNotification({
          title: t('common.error'),
          description: t('home.contentAlreadyInCollection'),
          isChoice: false,
          delete: false,
          success: false,
        });
        setLoading(false);
        return;
      } else {
        const { error: inventoryError} = await supabase.from('recursovideojuego').insert({
          usuarioId: user.id,
          idContenido: videogame.id,
          calificacion: 0,
          reseña: '',
          estado: 'PENDIENTE',
          favorito: false,
          tiporecurso: 'VIDEOJUEGO',
          horasJugadas: 0,
          dificultad: 'Normal',
          fechaInicio: null,
          fechaFin: null,
        })

        if (inventoryError) {
          showNotification({
            title: t('forms.savingError'),
            description: t('forms.game.savingErrorDescription'),
            isChoice: false,
            delete: false,
            success: false,
          });
          console.error('Error al insertar:', inventoryError);
        } else {
          refreshData('videojuego')

          setTimeout(() => {
            showNotification({
              title: t('common.success'),
              description: t('forms.savingSuccessDescription', {
                titulo: videogame.titulo || t('forms.game.theGame'),
              }),
              isChoice: false,
              delete: false,
              success: true,
            });
          }, 100);
        }
      }
    } catch (error) {
      console.error('Error saving videogame data:', error);
      showNotification({
        title: t('forms.savingError'),
        description: t('forms.game.savingErrorDescription'),
        isChoice: false,
        delete: false,
        success: false,
      });
    } finally {
      setLoading(false);
    }
  }

  const watchLaterAlbum = async (idapi: string | number | null) => {
    if (idapi == null || !user) return;

    setLoading(true);
    try {
      const { data : album, error: contentError } = await supabase
        .from('contenidocancion')
        .select('id, titulo, imagenUrl')
        .eq('idApi', idapi)
        .single();

      if (contentError) throw contentError;
      if (!album) throw new Error('No se encontró el contenido del álbum');

      const reviewed = await checkIfResourceExists(idapi, 'cancion');

      if(reviewed) {
        showNotification({
          title: t('common.error'),
          description: t('home.contentAlreadyInCollection'),
          isChoice: false,
          delete: false,
          success: false,
        });
        setLoading(false);
        return;
      } else {
        const { error: inventoryError} = await supabase.from('recursocancion').insert({
          usuarioId: user.id,
          idContenido: album.id,
          calificacion: 0,
          reseña: '',
          estado: 'PENDIENTE',
          favorito: false,
          tiporecurso: 'MUSICA',
          fechaEscucha: null,
          albumId: null,
        })

        if (inventoryError) {
          showNotification({
            title: t('forms.savingError'),
            description: t('forms.albums.savingErrorDescription'),
            isChoice: false,
            delete: false,
            success: false,
          });
          console.error('Error al insertar:', inventoryError);
        } else {
          refreshData('cancion')

          setTimeout(() => {
            showNotification({
              title: t('common.success'),
              description: t('forms.savingSuccessDescription', {
                titulo: album.titulo || t('forms.albums.theAlbum'),
              }),
              isChoice: false,
              delete: false,
              success: true,
            });
          }, 100);
        }
      }
    } catch (error) {
      console.error('Error saving album data:', error);
      showNotification({
        title: t('forms.savingError'),
        description: t('forms.albums.savingErrorDescription'),
        isChoice: false,
        delete: false,
        success: false,
      });
    } finally {
      setLoading(false);
    }
  }

  return {
    watchLaterBook,
    watchLaterFilm,
    watchLaterSerie,
    watchLaterGame,
    watchLaterAlbum,
    loading,
  };
};