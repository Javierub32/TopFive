// app/details/list/index.tsx
import { TouchableOpacity, View } from 'react-native';
import { useCollection } from 'context/CollectionContext';
import { router, useLocalSearchParams } from 'expo-router';
import { useListsDetails } from '@/Collection/hooks/useListsDetails';
import { Screen } from 'components/Screen';
import { ReturnButton } from 'components/ReturnButton';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { CollectionStructure } from 'components/CollectionStructure';
import { useTheme } from 'context/ThemeContext';
import { ScalableEditIcon, ScalableMaterialCommunityIcons, ScalablePlusIcon, ScalableReorderIcon, ScalableTrashIcon } from 'components/Icons';
import { ResourceType } from 'hooks/useResource';
import { AppText } from 'components/AppText';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { DeleteResourceButton } from '@/Details/components/DeleteResourceButton';
import { useLists } from '@/Collection/hooks/useLists';
import { useNotification } from 'context/NotificationContext';

export default function ListDetails() {
  const { handleItemPress, handleLongPress, selectedItems, clearSelectedItems } =
    useCollection();
  const { listData } = useLocalSearchParams<{ listData: any }>();
  const parsedListData = listData ? JSON.parse(listData) : null;
  const listaCategory: ResourceType = (parsedListData?.tipo?.toLowerCase() as ResourceType) || 'pelicula';
  const { loading, data, handleLoadMore, removeMultipleFromList } = useListsDetails(
    listaCategory,
    String(parsedListData?.id!)
  );
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [menuListasAbierto, setMenuListasAbierto] = useState(false);
  const { showNotification, hideNotification } = useNotification();
  const { deleteList } = useLists(parsedListData?.tipo);

  useEffect(() => {
    return () => {
      clearSelectedItems();
    };
  }, []);
  const handleEditList = () => {
    router.push({
      pathname: '/form/list',
      params: { listData: JSON.stringify(parsedListData) },
    });
  };
  const handleOrderList = () => {
    router.push({
      pathname: '/details/list/ReorderList',
      params: { listId: parsedListData?.id, listType: parsedListData?.tipo, listName: parsedListData?.nombre },
    });
  };
  const handleAddList = () => {
    router.push({
      pathname: '/form/item',
      params: { listId: parsedListData?.id, category: parsedListData?.tipo, listName: parsedListData?.nombre },
    });
  };
  const handleDeleteList = () => {
    if (parsedListData) {
      showNotification({
        title: t('list.deleteListNotification.title'),
        description: t('list.deleteListNotification.description'),
        leftButtonText: t('common.cancel'),
        rightButtonText: t('common.confirm'),
        isChoice: true,
        delete: true,
        success: false,
        onLeftPress: () => hideNotification(),
        onRightPress: async () => {
          hideNotification();
          await deleteList(parsedListData.id);
          setMenuListasAbierto(false);
          showNotification({
            title: t('list.deleteListNotification.confirmationTitle'),
            description: t('list.deleteListNotification.confirmationDescription', {
              listName: parsedListData.nombre,
            }),
            isChoice: false,
            delete: false,
            success: true,
          });
          router.back();
        },
      });
    }
  };
  const hasSelection = selectedItems && selectedItems.length > 0;

  const handleDelete = async () => {
    await removeMultipleFromList(selectedItems);
    clearSelectedItems();
  };

  if (loading && data.length === 0) {
    return (
      <Screen>
        <ReturnButton
          title={t('forms.lists.listDetails')}
          route="/(tabs)/Lists"
          params={{ initialResource: listaCategory }}
          selection={hasSelection}
        />
        <LoadingIndicator />
      </Screen>
    );
  }

  return (
    <Screen>
      <View className="flex-row items-center justify-between px-4 pt-4">
        <View className="flex-1">
          <ReturnButton
            title={t('forms.lists.listDetails')}
            route="/(tabs)/Lists"
            params={{ initialResource: listaCategory }}
            selection={hasSelection}
          />
        </View>
        <View className="flex-row items-center gap-2">
          {hasSelection && (
            <DeleteResourceButton
              resources={selectedItems}
              type={listaCategory}
              onCustomDelete={handleDelete}
              isList={true}
            />
          )}
          <TouchableOpacity
            className="p-1"
            onPress={(e) => {
              e.stopPropagation(); // Evita que pase a la tarjeta y abra los detalles
              setMenuListasAbierto(!menuListasAbierto);
            }}>
            <ScalableMaterialCommunityIcons
              name={menuListasAbierto ? 'close' : 'dots-horizontal'}
              size={24}
              color={colors.secondaryText}
            />
          </TouchableOpacity>
          {menuListasAbierto && (
            <View
              className="w-30 absolute right-0 top-10 z-50 overflow-hidden rounded-lg border-l-2 shadow-xl"
              style={{ borderColor: colors.borderButton, backgroundColor: colors.surfaceButton }}>
              <TouchableOpacity
                className="flex-row items-center border-b px-4 py-2"
                style={{ borderColor: `${colors.secondaryText}4D` }}
                onPress={() => {
                  handleEditList();
                  setMenuListasAbierto(false);
                }}>
                <ScalableEditIcon style={{ marginRight: 8 }} color={colors.primaryText} />
                <AppText style={{ color: colors.primaryText, fontSize: 14 }}>
                  {t('list.editList')}
                </AppText>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-row items-center border-b px-4 py-2"
                style={{ borderColor: `${colors.secondaryText}4D` }}
                onPress={() => {
                  setMenuListasAbierto(false);
                  handleAddList();
                }}>
                <ScalablePlusIcon style={{ marginRight: 8 }} color={colors.primaryText} />
                <AppText style={{ color: colors.primaryText, fontSize: 14 }}>
                  {t('list.addToList')}
                </AppText>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-row items-center border-b px-4 py-2"
                style={{ borderColor: `${colors.secondaryText}4D` }}
                onPress={() => {
                  setMenuListasAbierto(false);
                  handleOrderList();
                }}>
                <ScalableReorderIcon style={{ marginRight: 8 }} color={colors.primaryText} />
                <AppText style={{ color: colors.primaryText, fontSize: 14 }}>
                  {t('list.orderList')}
                </AppText>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-row items-center px-4 py-2"
                style={{ borderColor: `${colors.secondaryText}4D` }}
                onPress={() => {
                  setMenuListasAbierto(false);
                  handleDeleteList();
                }}>
                <ScalableTrashIcon style={{ marginRight: 8 }} color={colors.error} />
                <AppText style={{ color: colors.error, fontSize: 14 }}>
                  {t('list.deleteList')}
                </AppText>
              </TouchableOpacity>

            </View>
          )}
        </View>
      </View>

      {/* CABECERA DE LA LISTA */}
      {parsedListData?.nombre && (
        <View
          className="mx-2 mb-4 mt-2 flex-row items-start rounded-2xl border p-4 shadow-sm"
          style={{
            backgroundColor: colors.surfaceButton,
            borderColor: colors.accent,
          }}>
          {/* Icono con fondo de color */}
          <View
            className="mr-4 h-16 w-16 items-center justify-center rounded-2xl shadow-sm"
            style={{ backgroundColor: parsedListData?.color || colors.primary }}>
            <ScalableMaterialCommunityIcons
              name={(parsedListData?.icono as any) || 'folder'}
              size={32}
              color={colors.primaryText}
            />
          </View>

          {/* Textos */}
          <View className="flex-1 justify-center">
            <AppText
              className=" mb-1 font-bold leading-tight"
              style={{ color: colors.primaryText, fontSize: 24 }}>
              {parsedListData?.nombre}
            </AppText>
            {parsedListData?.descripcion ? (
              <AppText className="leading-5" style={{ color: colors.secondaryText, fontSize: 14 }}>
                {parsedListData?.descripcion}
              </AppText>
            ) : (
              <AppText className="italic" style={{ color: colors.placeholderText, fontSize: 14 }}>
                {t('common.noDescription')}
              </AppText>
            )}
          </View>
        </View>
      )}

      <View className="mt-2 flex-1 px-5 ">
        <CollectionStructure
          data={data}
          categoriaActual={listaCategory}
          handleItemPress={(item: any) => handleItemPress(item, listaCategory, 'list')}
          handleLongPress={(item: any) => handleLongPress(item, listaCategory, 'list')}
          handleSearchPagination={handleLoadMore}
          showStatus={true}
          loading={loading}
        />
      </View>
    </Screen>
  );
}
