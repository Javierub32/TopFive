import { useAuth } from 'context/AuthContext';
import { useCollection } from 'context/CollectionContext';
import { useNotification } from 'context/NotificationContext';
import { useResource } from 'hooks/useResource';
import { supabase } from 'lib/supabase';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

/* Función para añadir como pendiente un libro */
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

  return {
    watchLaterBook,
    loading,
  };
};