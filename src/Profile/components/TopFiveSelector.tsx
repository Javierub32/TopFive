import { useTheme } from 'context/ThemeContext';
import { View, TouchableOpacity, Image, Modal, Pressable } from 'react-native';
import { useTopFive } from '../hooks/useTopFive';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { CategorySelectorModal } from 'components/CategorySelectorModal';
import { useAuth } from 'context/AuthContext';
import { AppText } from 'components/AppText';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from 'react';
import { ScalableMaterialCommunityIcons, ScalableEditIcon } from 'components/Icons';
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useLocalSearchParams, useRouter } from 'expo-router';


export const TopFiveSelector = ({ userId }: { userId: string }) => {
  const slots = Array.from({ length: 5 });
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { user } = useAuth();
  const {
    topFiveItems,
    loading,
    handlePress,
    handleCategorySelect,
    modalVisible,
    setModalVisible,
    saveCompleteTopFive,
  } = useTopFive(userId);

  const isOwnProfile = user?.id === userId;

  //modo editar
  const [isEditing, setIsEditing] = useState(false);
  const [localSlots, setLocalSlots] = useState<any[]>([]);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  const router = useRouter();
  const params = useLocalSearchParams<{ addedItem?: string; targetPosition?: string; addedItemType?: string }>();

  const isInitialized = useRef(false);

  // 1. Inicialización de los slots locales
  useEffect(() => {
    if (isEditing && topFiveItems && !isInitialized.current) {
      const formatted = Array.from({ length: 5 }).map((_, index) => {
        const position = index + 1;
        return {
          key: `slot-${position}`,
          position,
          item: topFiveItems?.find((i: any) => i.posicion === position) || null,
        };
      });
      setLocalSlots(formatted);
      isInitialized.current = true;
    }

    // Cuando sales de edición (guardas o cancelas), reseteas para la próxima vez
    if (!isEditing) {
      isInitialized.current = false;
    }
  }, [isEditing, topFiveItems]);

  // 2. Escucha del recurso que viene del buscador
  useEffect(() => {
    if (params.addedItem && params.targetPosition) {
      if (!isEditing) setIsEditing(true);

      try {
        const parsedResource = JSON.parse(params.addedItem);
        const targetPos = Number(params.targetPosition);
        const itemType = params.addedItemType || parsedResource.type || parsedResource.tipo_recurso;

        setLocalSlots((prevSlots) => {
          let currentSlots = prevSlots;

          // Si aún no se había inicializado prevSlots, lo creamos desde topFiveItems
          if (currentSlots.length === 0 && topFiveItems) {
            currentSlots = Array.from({ length: 5 }).map((_, index) => ({
              key: `slot-${index + 1}`,
              position: index + 1,
              item: topFiveItems.find((i: any) => i.posicion === index + 1) || null,
            }));
            isInitialized.current = true;
          }

          const isDuplicate = currentSlots.some(
            (slot) =>
              slot.position !== targetPos &&
              slot.item !== null &&
              slot.item.resourceData?.id === parsedResource.id &&
              slot.item.type === itemType
          );

          if (isDuplicate) {
            return currentSlots;
          }

          return currentSlots.map((slot) =>
            slot.position === targetPos
              ? {
                  ...slot,
                  item: {
                    id: parsedResource.id,
                    posicion: targetPos,
                    type: itemType,
                    resourceData: parsedResource,
                  },
                }
              : slot
          );
        });

        router.setParams({ addedItem: '', targetPosition: '', addedItemType: '' });
      } catch (e) {
        console.error('Error al parsear el ítem en TopFiveSelector:', e);
      }
    }
  }, [params.addedItem, params.targetPosition, params.addedItemType, topFiveItems]);

  const handleLocalRemove = (position: number) => {
    setLocalSlots((prev) =>
      prev.map((slot) => (slot.position === position ? { ...slot, item: null } : slot))
    );
  };

  const renderEditableItem = ({ item, drag }: RenderItemParams<any>) => {
    const hasContent = !!item.item;
    const imageUrl = item.item?.resourceData?.contenido?.imagenUrl;
    
    // Si es el último hueco (posición 5), no le ponemos margen derecho para que se vea mejor
    const isLast = item.position === 5; 

    return (
      <ScaleDecorator>
        <View className="relative aspect-[2/3]" style={{ width: 65, marginRight: isLast ? 0 : 8, marginTop: 6 }}>
          <TouchableOpacity
            activeOpacity={0.9}
            onLongPress={drag}
            delayLongPress={100}
            onPress={() => handlePress(item.position, item.item, true)}
            style={{ height: '100%', width: '100%' }}
          >
            <View
              className="h-full w-full items-center justify-center overflow-hidden rounded-lg"
              style={{
                backgroundColor: colors.surfaceButton,
                borderWidth: hasContent ? 0 : 0,
                borderColor: colors.borderButton,
              }}
            >
              {hasContent && imageUrl ? (
                <Image source={{ uri: imageUrl }} className="h-full w-full" resizeMode="cover" />
              ) : hasContent && !imageUrl ? (
                <AppText style={{ color: colors.secondaryText, fontSize: 10 }}>Sin img</AppText>
              ) : (
                <AppText style={{ color: colors.secondaryText, fontSize: 16 }}>+</AppText>
              )}
            </View>
          </TouchableOpacity>

          {hasContent && (
            <TouchableOpacity
              className="absolute -right-1.5 -top-1.5 z-50 items-center justify-center rounded-full p-1 shadow-md"
              style={{ backgroundColor: colors.error }}
              onPress={() => handleLocalRemove(item.position)}
            >
              <ScalableMaterialCommunityIcons name="close" size={12} color="#FFF" />
            </TouchableOpacity>
          )}
        </View>
      </ScaleDecorator>
    );
  };


  if (loading) {
    return (
      <View className="mb-4 flex items-center justify-center py-10">
        <LoadingIndicator />
      </View>
    );
  }

  return (
    <View className="mb-4 mt-4 z-50" style={{ zIndex: 50 }}>
      {/* Cabecera */}
      <View className="flex-row items-center justify-between mb-2 z-50" style={{ zIndex: 50 }}>
        <AppText className="font-bold" style={{ color: colors.primaryText, fontSize: 18 }}>
          {t('profile.myTopFive')}
        </AppText>

        {isOwnProfile && (
          <View className="relative z-50 flex-row items-center gap-x-2" style={{ zIndex: 50 }}>
            {isEditing ? (
              <>
                <TouchableOpacity
                  onPress={async () => {
                    await saveCompleteTopFive(localSlots);
                    setIsEditing(false);
                  }}
                  className="px-3  rounded-full"
                  style={{ backgroundColor: 'none' }}
                >
                  <ScalableMaterialCommunityIcons 
                    name="check" 
                    size={28} 
                    color={colors.primary} 
                  />
                </TouchableOpacity>

                {/* Botón X para cancelar el modo edición */}
                <TouchableOpacity 
                  onPress={() => setIsEditing(false)} 
                  className="p-1"
                  activeOpacity={0.7}
                >
                  <ScalableMaterialCommunityIcons name="close" size={24} color={colors.primaryText} />
                </TouchableOpacity>
              </>
            ) : (
              <>
                {/* Botón 3 puntos / X del menú */}
                <TouchableOpacity 
                  onPress={() => setShowOptionsMenu(!showOptionsMenu)} 
                  className="p-1"
                  activeOpacity={0.7}
                >
                  <ScalableMaterialCommunityIcons 
                    name={showOptionsMenu ? "close" : "dots-horizontal"} 
                    size={24} 
                    color={colors.secondaryText} 
                  />
                </TouchableOpacity>

                {/* Menu desplegable del botón */}
                {showOptionsMenu && (
                  <View 
                    className="absolute right-0 top-10 z-50 overflow-hidden rounded-lg shadow-xl" 
                    style={{ 
                      borderColor: colors.borderButton, 
                      backgroundColor: colors.surfaceButton,
                      minWidth: 190 
                    }}
                  >
                    <TouchableOpacity 
                      className="flex-row items-center border-b px-4 py-3" 
                      style={{ borderColor: `${colors.secondaryText}4D` }}
                      onPress={() => {
                        setShowOptionsMenu(false);
                        setIsEditing(true); //  modo edición
                      }}
                    >
                      <ScalableEditIcon style={{ marginRight: 8 }} color={colors.primaryText} />
                      <AppText style={{ color: colors.primaryText, fontSize: 14 }}>
                        {t('profile.editProfile.topfive', { defaultValue: 'Editar Mi TopFive' })}
                      </AppText>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      className="flex-row items-center px-4 py-3" 
                      onPress={() => {
                        setShowOptionsMenu(false);
                        // Lógica de compartir (MARINA <------)
                      }}
                    >
                      <ScalableMaterialCommunityIcons name="share-variant" size={20} color={colors.primaryText} style={{ marginRight: 8 }} />
                      <AppText style={{ color: colors.primaryText, fontSize: 14 }}>
                        {t('profile.shareTopFive', { defaultValue: 'Compartir Mi TopFive' })}
                      </AppText>
                    </TouchableOpacity>
                  </View>
                )}
              </>
            )}
          </View>
        )}
      </View>

      {/* Si editando, moestramos */}
      {isEditing ? (
        <GestureHandlerRootView>
          <View className="flex-row gap-2" style={{ height: 110 }}>
            <DraggableFlatList
              horizontal={true} 
              data={localSlots}
              keyExtractor={(item) => item.key}
              renderItem={renderEditableItem}
              activationDistance={10}
              scrollEnabled={false}
              nestedScrollEnabled={true}
              onDragEnd={({ data }) => {
                const reordered = data.map((slot, index) => ({
                  ...slot,
                  position: index + 1,
                }));
                setLocalSlots(reordered);
              }}
              containerStyle={{ flex: 1, flexDirection: 'row' }}
            />
          </View>
          <AppText className="mt-2 text-center" style={{ fontSize: 11, color: colors.secondaryText }}>
            {t('profile.editProfile.topfiveDescription', { defaultValue: 'Mantén pulsado para ordenar. Pulsa la X para eliminar.' })}
          </AppText>
        </GestureHandlerRootView>
      ) : (
        /* Vista Normal del Top 5 */
        <View className="flex-row gap-2">
          {slots.map((_, index) => {
            const position = index + 1;
            const item = topFiveItems?.find((i: any) => i.posicion === position);
            const imageUrl = item?.resourceData?.contenido?.imagenUrl;

            if (!item) {
              return (
                <View
                  key={`empty-slot-${position}`}
                  className="flex-1 rounded-lg"
                  style={{ backgroundColor: colors.surfaceButton }}>
                  <TouchableOpacity
                    disabled={!isOwnProfile}
                    onPress={() => isOwnProfile && handlePress(position, item)}
                    onLongPress={() => isOwnProfile && setIsEditing(true)}
                    activeOpacity={0.7}>
                    <View
                      className="aspect-[2/3] w-full items-center justify-center overflow-hidden rounded-lg"
                      style={{
                        backgroundColor: colors.surfaceButton,
                        borderColor: colors.borderButton,
                        borderWidth: 0,
                      }}>
                      <AppText style={{ color: colors.secondaryText, fontSize: 14 }}>
                        +
                      </AppText>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            }

            return (
              <View
                key={`slot-${position}-${item.id || index}`}
                className="flex-1 rounded-lg"
                style={{ backgroundColor: colors.surfaceButton }}>
                <TouchableOpacity
                  onPress={() => handlePress(position, item)}
                  onLongPress={() => isOwnProfile && setIsEditing(true)}
                  activeOpacity={0.7}>
                  <View
                    className="aspect-[2/3] w-full items-center justify-center overflow-hidden rounded-lg"
                    style={{
                      backgroundColor: colors.surfaceButton,
                    }}>
                    {imageUrl ? (
                      <Image
                        source={{ uri: imageUrl }}
                        className="h-full w-full"
                        resizeMode="cover"
                      />
                    ) : (
                      <AppText style={{ color: colors.secondaryText, fontSize: 12 }}>Sin imagen</AppText>
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      )}

      <CategorySelectorModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelectCategory={(category) => handleCategorySelect(category, isEditing ? '/(tabs)/Profile' : "")}
      />
    </View>
  );
};