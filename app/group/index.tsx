import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Screen } from 'components/Screen';
import { useCollection } from 'context/CollectionContext';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { CollectionStructure } from 'components/CollectionStructure';
import { useGroupData } from 'src/Collection/hooks/useGroupData';
import { ReturnButton } from 'components/ReturnButton';
import { useEffect } from 'react';
import { ResourceType, StateType, useResource } from 'hooks/useResource';
import { DeleteResourceButton } from '@/Details/components/DeleteResourceButton';
import { AddToListButton } from 'components/AddToListButton';
import { CollectionType, listServices } from '@/Collection/services/listServices';
import { useNotification } from 'context/NotificationContext';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'context/AuthContext';
const stateMap: Record<string, StateType> = {
  enCurso: 'EN_CURSO',
  pendientes: 'PENDIENTE',
  completados: 'COMPLETADO',
};

export default function GroupScreen() {
  const params = useLocalSearchParams();
  const title = params.title as string;
  const state = params.state as string;
  const category = params.category as string;
  const from = params.from as string;
  const targetUserId = params.targetUserId as string;

  const { user } = useAuth();
  const { borrarRecurso } = useResource();
  const { addItemToList } = listServices;
  const {
    handleItemPress,
    setIsSearchVisible,
    handleLongPress,
    selectedItems,
    clearSelectedItems,
    refreshData,
  } = useCollection();

  const { loading, data, handleLoadMore } = useGroupData(
    category as ResourceType,
    stateMap[state],
    targetUserId
  );

  useEffect(() => {
    setIsSearchVisible(false);
    return () => {
      clearSelectedItems();
    };
  }, []);

  const returnRoute = targetUserId ? 'back' : from === 'Profile' ? '/Profile' : '/Collection';
  const returnParams =
    from === 'Profile' || targetUserId ? {} : { initialResource: category as ResourceType };

  const hasSelection = selectedItems && selectedItems.length > 0;
  const isOwner = targetUserId ? targetUserId === user?.id : true;

  const handleDelete = async () => {
    await Promise.all(
      selectedItems.map((item: any) =>
        borrarRecurso(item.id, category as ResourceType, item.estado)
      )
    );
    clearSelectedItems();
    refreshData(category as ResourceType);
  };

  return (
    <Screen>
      <View className="flex-1 px-4 pt-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <ReturnButton
              route={returnRoute}
              title={hasSelection ? `${selectedItems.length} seleccionados` : title}
              style=" "
              params={returnParams}
              selection={hasSelection}
            />
          </View>

          {hasSelection && (
            <>
            <DeleteResourceButton
              resources={selectedItems}
              type={category as ResourceType}
              onCustomDelete={handleDelete}
            />
            <AddToListButton
              resourceCategory={category as ResourceType}
              resourceId={selectedItems.map((item: any) => item.id)}
            />
           </> 
          )}
        </View>

        {loading && data.length === 0 ? (
          <LoadingIndicator />
        ) : (
          <CollectionStructure
            data={data}
            categoriaActual={category}
            handleItemPress={(item: any) =>
              handleItemPress(item, category as ResourceType, 'group')
            }
            showStatus={false}
            handleLongPress={isOwner ?(item: any) =>
              handleLongPress(item, category as ResourceType, 'group') : undefined
            }
            handleSearchPagination={handleLoadMore}
            loading={loading}
            selectedItems={selectedItems}
          />
        )}
      </View>
    </Screen>
  );
}