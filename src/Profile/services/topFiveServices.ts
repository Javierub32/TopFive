import { RESOURCE_CONFIG, ResourceMap, ResourceType } from "hooks/useResource";
import { supabase } from "lib/supabase";

export interface TopFiveItem {
  id: number;
  posicion: number;
  type: ResourceType;
  resourceData: ResourceMap[ResourceType];
}


export const topFiveService = {
 async insertToTopFive(userId: string, posicion: number, tipoRecurso: string, recursoId: number) {
    // Comprobar si el usuario ya tiene una lista TopFive, si no, crearla (Upsert)
    const { data: topFive, error: listError } = await supabase
      .from('estadistica_topfive')
      .upsert({ usuarioid: userId }, { onConflict: 'usuarioid', ignoreDuplicates: false })
      .select('id')
      .single();

    if (listError) throw listError;
    if (!topFive) throw new Error("No se pudo obtener la lista TopFive");

    // Insertamos o actualizamos el ítem en la posición especificada
    const { error: itemError } = await supabase
      .from('estadistica_topfive_item')
      .upsert({
        topfiveid: topFive.id,
        posicion: posicion,
        tipo_recurso: tipoRecurso,
        recurso_id: recursoId
      }, { onConflict: 'topfiveid, posicion' });

    if (itemError) throw itemError;
  },


    async fetchTopFive(userId: string): Promise<TopFiveItem[]> {
    // Obtenemos la lista del usuario
    const { data: list, error: listError } = await supabase
      .from('estadistica_topfive')
      .select('id')
      .eq('usuarioid', userId)
      .maybeSingle();

    if (listError) throw listError;
    if (!list) return [];

    // Obtenemos los ítems de esa lista
    const { data: rawItems, error: itemsError } = await supabase
      .from('estadistica_topfive_item')
      .select('*')
      .eq('topfiveid', list.id)
      .order('posicion', { ascending: true });

    if (itemsError) throw itemsError;
    if (!rawItems || rawItems.length === 0) return [];

    // Pedimos todos los recursos en paralelo y los normalizamos al formato esperado por el frontend
    const detailedItems = await Promise.all(
      rawItems.map(async (item) => {
        const type = item.tipo_recurso as ResourceType;
        const config = RESOURCE_CONFIG[type];

        if (!config) return null;

        // Pedimos el recurso + el contenido unido 
        const { data: resourceRaw, error: resourceError } = await supabase
          .from(config.table)
          .select(`
            *,
            ${config.contentJoin} (*)
          `)
          .eq('id', item.recurso_id)
          .maybeSingle();
		
        if (resourceError || !resourceRaw) return null;
	
        const rawData = resourceRaw as Record<string, any>;
        const contentData = rawData[config.contentJoin];
        const { [config.contentJoin]: _, ...restOfResource } = rawData;

        // Construimos el objeto final
        const normalizedResource = {
            ...restOfResource,
            contenido: contentData
        } as ResourceMap[typeof type]; 


        return {
          id: item.id,
          posicion: item.posicion,
          type: type,
          resourceData: normalizedResource
        };
      })
    );

    // Filtramos nulos (por si algún recurso fue borrado de la DB pero seguía en el top5)
    return detailedItems.filter((item): item is TopFiveItem => item !== null);
  }
};