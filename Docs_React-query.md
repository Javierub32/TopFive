# Guia de React Query en TopFive

Este documento explica como usamos `@tanstack/react-query` en la app, que problema resuelve y como leer/modificar la implementacion sin tener que buscar fuera.

React Query no reemplaza a Supabase. Supabase sigue siendo quien lee y escribe en la base de datos. React Query se encarga de:

- cachear datos ya pedidos;
- evitar peticiones repetidas;
- saber cuando un dato esta fresco o viejo;
- refetchear cuando se invalida una cache;
- manejar estados de carga, error, refresh y paginacion;
- persistir la cache en `AsyncStorage` para reducir egress entre sesiones.

## Configuracion global

La configuracion principal vive en `src/query/queryClient.ts`.

```ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 60 * 24,
      retry: 1,
      refetchOnMount: false,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
    },
  },
});
```

La app se envuelve en `PersistQueryClientProvider` en `app/_layout.tsx`. Eso hace que React Query este disponible para todos los providers y pantallas, y que parte de la cache se guarde en `AsyncStorage`.

```tsx
<PersistQueryClientProvider
  client={queryClient}
  persistOptions={{
    persister: asyncStoragePersister,
    maxAge: 1000 * 60 * 60 * 24,
  }}>
  <AuthProvider>{/* resto de providers */}</AuthProvider>
</PersistQueryClientProvider>
```

## Query keys

Una `queryKey` es el identificador unico de una cache.

En vez de escribir arrays a mano por toda la app, usamos `src/query/queryKeys.ts`.

Ejemplo:

```ts
queryKeys.collectionOverview(user?.id, categoriaActual)
```

Eso genera una key parecida a:

```ts
['collection', 'overview', userId, categoriaActual]
```

Si cambia `userId`, es otra cache. Si cambia `categoriaActual`, tambien es otra cache. Por eso al cambiar de pelicula a libro no hay que invalidar manualmente, React Query lee otra key. Si volvemos a la categoria anterior, React Query puede usar cache sin pedir otra vez a Supabase.

Ejemplos usados en la app:

```ts
queryKeys.profile(userId)
queryKeys.resources(userId, type, filters)
queryKeys.topFive(userId)
queryKeys.notifications(userId)
queryKeys.collectionOverview(userId, type)
queryKeys.collectionGroup(userId, type, state)
queryKeys.lists(userId, collectionType)
queryKeys.listDetails(listId, collectionType)
```

Importante: las invalidaciones pueden ser exactas o por prefijo.

```ts
queryClient.invalidateQueries({ queryKey: ['lists'] });
```

Invalida todas las queries que empiezan por `['lists']`, por ejemplo:

```ts
['lists', userId, 'PELICULA']
['lists', 'details', listId, 'PELICULA']
```

Esto es util cuando una mutacion afecta a varias pantallas de listas.

## staleTime y gcTime

`staleTime` significa: durante cuanto tiempo considero fresco este dato.

Ejemplo:

```ts
staleTime: 1000 * 60 * 5
```

Eso son 5 minutos. Durante esos 5 minutos, si vuelves a entrar a una pantalla que usa esa misma `queryKey`, React Query puede usar cache sin pedir otra vez a Supabase.

`gcTime` significa: cuanto tiempo puede quedarse en memoria/cache una query inactiva antes de ser eliminada por garbage collection.

Ejemplo:

```ts
gcTime: 1000 * 60 * 30
```

Eso son 30 minutos. Aunque una query ya no este montada en pantalla, React Query puede conservarla para reutilizarla si vuelves pronto.

Diferencia rapida:

- `staleTime`: frescura del dato.
- `gcTime`: vida de la cache inactiva.

## Que significa 1000 * 60 * 5

Los tiempos se escriben en milisegundos.

```ts
1000 * 60 * 5
```

Significa:

- `1000` milisegundos = 1 segundo;
- `1000 * 60` = 1 minuto;
- `1000 * 60 * 5` = 5 minutos.

Es mas legible que escribir:

```ts
300000
```

## Que significa !!user?.id

`!!` convierte un valor en booleano.

```ts
enabled: !!user?.id
```

Significa: esta query solo debe ejecutarse si existe `user.id`.

Si `user?.id` es `undefined`, `null` o cadena vacia, `!!user?.id` es `false`. Si hay un id real, es `true`.

Esto evita peticiones a Supabase antes de que haya usuario autenticado.


# Como usar React Query en la app

## Peticiones normales -> useQuery

`useQuery` se usa para pedir datos normales: perfil, Top Five, listas, version de app, etc.

Ejemplo simplificado:

```ts
const { data, isLoading, isFetching, refetch } = useQuery({
  queryKey: queryKeys.profile(user?.id),
  queryFn: () => userService.fetchUserProfile(user!.id),
  enabled: !!user?.id,
  staleTime: 1000 * 60 * 10,
  gcTime: 1000 * 60 * 60,
});
```

Campos importantes:

- `data`: el resultado cacheado.
- `isLoading`: primera carga sin datos.
- `isFetching`: hay una peticion en curso, aunque ya hubiera datos.
- `refetch`: fuerza una nueva peticion manual.
- `enabled`: permite activar/desactivar la query.

## Peticiones paginadas -> useInfiniteQuery

`useInfiniteQuery` se usa para paginacion: feed de actividad, grupos de coleccion, detalle de listas, notificaciones, busqueda de usuarios.

Ejemplo conceptual:

```ts
const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
  queryKey: queryKeys.collectionGroup(user?.id, category, state),
  queryFn: async ({ pageParam = 0 }) => {
    const from = pageParam * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    const items = await fetchResources({ from, to });

    return {
      items,
      nextPage: items.length === PAGE_SIZE ? pageParam + 1 : undefined,
    };
  },
  initialPageParam: 0,
  getNextPageParam: (lastPage) => lastPage.nextPage,
  maxPages: 5,
});
```

Paso a paso:

1. Empieza con `pageParam = 0`.
2. Calcula `from` y `to`.
3. Pide a Supabase solo ese rango.
4. Si llegan tantos items como `PAGE_SIZE`, probablemente hay mas paginas.
5. `getNextPageParam` devuelve la siguiente pagina, si es undefined ya no se hacen más peticiones.
6. `fetchNextPage()` carga la siguiente.
7. `maxPages` limita cuantas paginas conserva React Query en cache.

Los datos vienen separados por paginas:

```ts
data = {
  pages: [
    {
      items: [
        actividad1,
        actividad2,
        actividad3,
      ],
      nextPage: 1,
    },
    {
      items: [
        actividad4,
        actividad5,
      ],
      nextPage: undefined,
    },
  ],
}
```

Para pintarlos en un `FlatList`, los convertimos en array plano:

```ts
const items = data?.pages.flatMap((page) => page.items) ?? [];
```

## Operaciones Read, Write, Delete -> useMutation

`useMutation` se usa para escribir datos: crear, editar, borrar, seguir usuario, aceptar notificacion, anadir item a lista, cambiar frame, etc.

Ejemplo:

```ts
const deleteItemMutation = useMutation({
  mutationFn: ({ itemId, type }) => listServices.removeItemFromList(listId, itemId, type),
  onSuccess: async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.listDetails(listId, collectionType) }),
      queryClient.invalidateQueries({ queryKey: ['lists'] }),
    ]);
  },
});
```

La idea es:

1. `mutationFn` hace la escritura real en Supabase.
2. Si sale bien, `onSuccess` invalida las caches afectadas.
3. Las pantallas que usan esas caches refetchean y muestran datos actualizados.

Si quieres que algo desaparezca instantaneamente, puedes usar `queryClient.setQueryData` en vez de actualizar los datos del `useState`.

Para llamar a esta función se haría:

```ts
await deleteItemMutation.mutate({ itemId, type });
```


## Actualizacion local antes de hacer petición -> QueryClient.setQueryData
Antes se hacia algo como:

```ts
setFollowers((prev) => prev.filter((follower) => follower.username !== usernameToRemove));
```

Eso quitaba el follower inmediatamente de un estado local.

Con React Query, el flujo normal es:

1. `useMutation` borra en Supabase.
2. `onSuccess` invalida `queryKeys.followers(username)`.
3. React Query refetchea.
4. La UI recibe la lista nueva.

No hace falta `setFollowers` local para que funcione.

Si se quiere respuesta visual instantanea, se puede hacer optimista:

```ts
queryClient.setQueryData(queryKeys.followers(username), (old = []) =>
  old.filter((follower) => follower.username !== usernameToRemove)
);
```

## Invalidar Caché -> InvalidateQueries

`invalidateQueries` marca una cache como vieja. Si esa query esta activa, React Query normalmente la vuelve a pedir.

Ejemplo:

```ts
queryClient.invalidateQueries({
  queryKey: queryKeys.collectionOverview(user.id, type),
});
```

En TopFive, `refreshData(type)` invalida:

```ts
queryKeys.collectionOverview(user.id, type)
['collection', 'group', user.id, type]
['resources', user.id, type]
['resources', 'exists', user.id, type]
queryKeys.profile(user.id)
['profile', 'stats', user.id]
queryKeys.topFive(user.id)
queryKeys.topFiveSelector(user.id, type)
```

Asi, al crear o editar un recurso, no se queda viejo:

- el overview de Collection;
- las pantallas de grupo;
- busquedas/listados de recursos;
- perfil y estadisticas;
- Top Five;
- selector de Top Five.


# Posibles preguntas

## Por que no invalidamos al cambiar de categoria

No hace falta invalidar al cambiar el deslizable de categoria porque la categoria forma parte de la `queryKey`.

```ts
queryKeys.collectionOverview(user?.id, categoriaActual)
```

Pelicula:

```ts
['collection', 'overview', userId, 'pelicula']
```

Libro:

```ts
['collection', 'overview', userId, 'libro']
```

Son caches distintas. Cambiar de categoria no significa que los datos anteriores sean falsos; solo significa que ahora queremos otra cache.

## Cómo borramos un recurso

`borrarRecurso` vive en `hooks/useResource.ts`.

Al borrar, invalida:

- `collectionOverview`: el resumen de Collection.
- `collectionGroup`: pantallas de grupo por estado.
- `resources`: busquedas/listados cacheados.
- `lists`: listas y detalles de listas, porque un recurso borrado puede aparecer ahi.
- `profile`: contador de reviews.
- `profileStats`: graficas.
- `topFive`: si el recurso estaba en Top Five.
- `topFiveSelector`: selector de recursos para Top Five.


## refetch manual

`refetch` fuerza una peticion aunque la cache exista.

Se usa para casos como:

- pull to refresh;
- boton de comprobar version;
- repetir busqueda manual;
- refrescar notificaciones.

Ejemplo:

```ts
const { data, refetch, isFetching } = useAppVersion();

await refetch();
```

## isLoading vs isFetching vs isFetchingNextPage

- `isLoading`: primera carga, normalmente no hay datos todavia.
- `isFetching`: cualquier peticion en curso, incluso con datos previos.
- `isFetchingNextPage`: se esta cargando otra pagina en `useInfiniteQuery`.

Ejemplo de paginacion:

```ts
if (hasNextPage && !isFetchingNextPage && !isFetching) {
  fetchNextPage();
}
```

Eso evita lanzar dos paginas a la vez.

## Por que useMemo es interesante con React Query

React Query suele devolver objetos estables mientras sus datos no cambian. Pero si nosotros transformamos `data` en cada render, podemos crear arrays nuevos sin necesidad.

Ejemplo:

```ts
const activities = data?.pages.flatMap((page) => page.items) ?? [];
```

Cada render crea un array nuevo.

Con `useMemo`:

```ts
const activities = useMemo(
  () => data?.pages.flatMap((page) => page.items) ?? [],
  [data]
);
```

Solo se recalcula si cambia `data`.

Esto es util con:

- `FlatList`;
- listas paginadas;
- feeds;
- resultados con muchas paginas;
- componentes memoizados que dependen de la referencia del array.

No es obligatorio para que funcione. Es una optimizacion y una forma de evitar renders/trabajo innecesario.

Casos donde podria aplicarse igual que en `useActivity`:

```ts
useGroupData
useListsDetails
useNotification
useTopFiveSelector
useSearchUser
```

# Checklist para nuevas pantallas o hooks

Cuando añadas una consulta de datos, es decir, una pantalla/hook que pide datos al servidor para mostrarlos en la UI:

Ejemplos:

- una pantalla de perfil que pide el usuario;
- una lista que pide recursos;
- un selector que pide items;
- una busqueda que consulta contenido;
- una pantalla paginada como notificaciones o actividad.

1. Crea o reutiliza una `queryKey` estable en `queryKeys`.
2. Mete en la key todo lo que cambie el resultado: `userId`, tipo, filtros, pagina, termino de busqueda.
3. Usa `enabled` si falta usuario o parametro.
4. Elige `staleTime` segun volatilidad.
5. Si hay paginacion, usa `useInfiniteQuery`.

Cuando añadas una escritura o cambio de datos, es decir, una accion que modifica algo en Supabase:

Ejemplos:

- crear o editar un recurso;
- borrar un recurso;
- seguir o dejar de seguir a alguien;
- aceptar una notificacion;
- anadir o quitar un item de una lista;
- cambiar avatar o frame.

1. Usa `useMutation`.
2. Haz la escritura real en `mutationFn`.
3. En `onSuccess`, invalida todas las caches afectadas.
4. Si quieres respuesta instantanea, usa `setQueryData` con cuidado.
5. Si cambias contadores en Supabase con RPC, invalida despues del RPC.

# Tiempos recomendados de caché

- Perfil, Top Five, listas: 5-15 min.
- Version app: 24 h.
- Busquedas de contenido: 10-30 min.
- Datos propios mutables: 1-5 min.
- Notificaciones/feed: 2-5 min.

Los tiempos son orientativos, hay que ahorrar EgressCaché pero poner tiempos de caché muy altos podría hacer que salgan datos viejos. 