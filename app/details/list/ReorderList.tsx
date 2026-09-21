import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { Screen } from 'components/Screen';
import { ReturnButton } from 'components/ReturnButton';
import { useTheme } from 'context/ThemeContext';
import { AppText } from 'components/AppText';
import { useTranslation } from 'react-i18next';
import { ScalableMaterialCommunityIcons } from 'components/Icons';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useLocalSearchParams, router } from 'expo-router';
import { listServices, CollectionType } from '@/Collection/services/listServices';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { useNotification } from 'context/NotificationContext';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/query/queryKeys';

export default function ReorderListScreen() {
  const { listId, listType, listName } = useLocalSearchParams<{ listId: string, listType: CollectionType, listName: string }>();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { showNotification } = useNotification();
  const queryClient = useQueryClient();

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await listServices.fetchListDetails(listId, listType, 0, 500);
        setItems(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [listId, listType]);

  const handleSaveOrder = async () => {
    setSaving(true);
    try {
      const newOrderPayload = items.map((item, index) => ({
        listItemId: item.listItemId,
        orden: index + 1
      }));

      await listServices.updateListOrder(listType, newOrderPayload);
      // Con esto, actualizamos el orden en la cache para que se muestre el nuevo tras guardar
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.listDetails(listId, listType) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.listsPrefix() }),
      ]);

      showNotification({
        title: t('common.success'),
        description: t('list.reorderList.reorderNotification.success'),
        isChoice: false, delete: false, success: true,
      });
      router.back();
    } catch (error) {
      showNotification({
        title: t('common.error'),
        description: t('list.reorderList.reorderNotification.error'),
        isChoice: false, delete: false, success: false,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Screen>
        <ReturnButton route="back" title={t('list.reorderList.Title') + ` ${listName}`} />
        <LoadingIndicator />
      </Screen>
    );
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Screen>
        <ReturnButton route="back" title={ t('list.reorderList.Title') + ` ${listName}` } />

        <View className="flex-1 px-4 pt-4">
          <AppText className="mb-4 text-center text-sm" style={{ color: colors.secondaryText }}>
            {t('list.reorderList.Description')}
          </AppText>

          <DraggableFlatList
            data={items}
            keyExtractor={(item) => item.listItemId.toString()}
            onDragEnd={({ data }) => setItems(data)}
            renderItem={({ item, drag, isActive, getIndex }) => {
              const currentIndex = getIndex() !== undefined ? getIndex()! + 1 : 0;
              return (
                <ScaleDecorator
                activeScale={0.95}>
                  <TouchableOpacity
                    onLongPress={drag}
                    disabled={isActive}
                    activeOpacity={0.9}
                    className="mb-3 flex-row items-center overflow-hidden rounded-xl p-3 shadow-sm"
                    style={{
                      backgroundColor: isActive ? colors.accent : colors.primaryBackground,
                      elevation: isActive ? 5 : 0,
                    }}>
                    <View className="w-8 items-center justify-center">
                      <AppText className="text-lg font-bold" style={{ color: colors.primaryText }}>{currentIndex}</AppText>
                    </View>
                    <View className="mx-3 h-16 w-12 overflow-hidden rounded-md bg-black">
                      <Image source={{ uri: item.contenido?.imagenUrl }} style={{ flex: 1 }} resizeMode="cover" />
                    </View>
                    <View className="flex-1 justify-center">
                      <AppText className="font-bold leading-tight" style={{ color: colors.primaryText, fontSize: 16 }} numberOfLines={2}>
                        {item.contenido?.titulo}
                      </AppText>
                    </View>
                    <View className="px-2">
                      <ScalableMaterialCommunityIcons name="drag-horizontal-variant" size={24} color={isActive ? colors.primaryText : colors.secondaryText} />
                    </View>
                  </TouchableOpacity>
                </ScaleDecorator>
              );
            }}
          />
        </View>

        <View className="px-4 pb-6 pt-2">
          <TouchableOpacity
            onPress={handleSaveOrder}
            disabled={saving}
            className="items-center rounded-xl py-4 shadow-lg"
            style={{ backgroundColor: colors.primary, opacity: saving ? 0.7 : 1 }}>
            <AppText className="text-lg font-bold" style={{ color: colors.background }}>
              {saving ? t('common.loading') : t('common.saveChanges')}
            </AppText>
          </TouchableOpacity>
        </View>
      </Screen>
    </GestureHandlerRootView>
  );
}