import { useState, useEffect } from 'react';
import { useResource, ResourceType } from 'hooks/useResource';
import { listServices, CollectionType } from '../services/listServices';
import { useNotification } from 'context/NotificationContext';
import { router } from 'expo-router';

const typeMapping: Record<string, ResourceType> = {
    'LIBRO': 'libro',
    'PELICULA': 'pelicula',
    'SERIE': 'serie',
    'VIDEOJUEGO': 'videojuego',
    'ALBUM': 'cancion'
};

export const useItemSelector = (category: string | undefined, listId: string | undefined) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any[]>([]);
    const { fetchResources } = useResource();
    const { showNotification } = useNotification();

    const resourceType = category ? typeMapping[category] : 'pelicula';

    useEffect(() => {
        const loadItems = async () => {
            if (!category) return;
            setLoading(true);
            try {
                const items = await fetchResources(resourceType, null, null, null, null, true); //
                setData(items || []);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        loadItems();
    }, [category]);

    const addItem = async (itemId: number) => {
        try {
            // Este mensaje avisa si se ha guardado correctamente o si el contenido ya estaba en la lista
            const message = await listServices.addItemToList(listId!, itemId, category as CollectionType);
            const isSuccess = !message.includes('ya está'); // Viene del mensaje Este contenido ya está en la lista

            showNotification({
                title: isSuccess ? '¡Éxito!' : 'Atención',
                description: message,
                isChoice: false, 
                delete: false, 
                success: isSuccess
            });

            if (isSuccess) router.back();
        } catch (error: any) {
            console.error(error);
        }
    };

    return { data, loading, addItem, resourceType };
};