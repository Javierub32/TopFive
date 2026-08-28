import { FormInput } from '@/Settings/components/DescriptionInput';
import { useSettings } from '@/Settings/hooks/useSettings';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { ReturnButton } from 'components/ReturnButton';
import { Screen } from 'components/Screen';
import { ProfileAvatar } from 'src/Profile/components/ProfileAvatar';
import { useProfile } from 'src/Profile/hooks/useProfile';
import { useTheme } from 'context/ThemeContext';
import { TouchableOpacity as RNTouchableOpacity, View, Animated, Image } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppText } from 'components/AppText';
import { useState, useRef, useEffect } from 'react';
import { useNotification } from 'context/NotificationContext';

import { TouchableOpacity, GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import DraggableFlatList, { ScaleDecorator, RenderItemParams } from 'react-native-draggable-flatlist';
import { ScalableMaterialCommunityIcons } from 'components/Icons';
import { useTopFive } from 'src/Profile/hooks/useTopFive';
import { CategorySelectorModal } from 'components/CategorySelectorModal';


export default function EditProfileScreen() {
  const { pickImage, userData } = useProfile();
  const {
    uname,
    udesc,
    uprivate, 
    setPrivate, 
    handleUsernameChange,
    setDescription,
    usernameAlreadyExists,
    handleSubmit,
    loading,
  } = useSettings(userData);
  
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { showNotification } = useNotification();

  // TopFive 
  const { 
    topFiveItems, 
    loading: topFiveLoading, 
    removeItem, 
    /* updateOrder,  */
    saveCompleteTopFive,
    handlePress,
    modalVisible,
    setModalVisible,
    handleCategorySelect 
  } = useTopFive(userData?.id || '');  

  const [localSlots, setLocalSlots] = useState<any[]>([]);
  const isInitialized = useRef(false);
  const params = useLocalSearchParams<{ addedItem?: string; targetPosition?: string; addedItemType?: string }>();

  useEffect(() => {
    // Solo entramos si tenemos datos Y el candado está abierto
    if (topFiveItems && !isInitialized.current) {
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
  }, [topFiveItems]);

  useEffect(() => {
    if (params.addedItem && params.targetPosition) {
      try {
        const parsedResource = JSON.parse(params.addedItem);
        const targetPos = Number(params.targetPosition);
        const itemType = params.addedItemType || parsedResource.type || parsedResource.tipo_recurso;

        setLocalSlots((prevSlots) => {
          const isDuplicate = prevSlots.some(
            (slot) =>
              slot.position !== targetPos && // Ignoramos el hueco actual donde lo vamos a meter
              slot.item !== null &&          // Solo si el slot tiene algo dentro
              slot.item.resourceData?.id === parsedResource.id && // Mismo ID
              slot.item.type === itemType    // Mismo tipo          
            );
          
          if (isDuplicate) {
            // Si ya está, avisamos al usuario y bloqueamos la inserción
            setTimeout(() => {
              showNotification({
                title: t('common.error') || 'Error',
                description: t('topFiveSelector.duplicateResource') || 'Este elemento ya está en tu Top 5',
                isChoice: false,
                delete: false,
                success: false,
              });
            }, 0);            
            return prevSlots; // Devolvemos la lista intacta sin el duplicado
          }

          // Si no está, lo añadimos al hueco correspondiente
          return prevSlots.map((slot) =>
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

        // Limpiamos los parámetros para que no se vuelva a ejecutar
        router.setParams({ addedItem: '', targetPosition: '', addedItemType: '' });

      } catch (e) {
        console.error("Error al parsear el ítem añadido:", e);
      }
    }
  }, [params.addedItem, params.targetPosition, params.addedItemType]);

  // Usar datos actualizados de userData (que se refrescan al volver del focus)
  const avatarUrlString = userData?.avatar_url;
  const frameString = userData?.frame || 'none';

  const slideAnim = useRef(new Animated.Value(uprivate ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: uprivate ? 1 : 0,
      duration: 200,
      useNativeDriver: false, 
    }).start();
  }, [uprivate]);

  const position = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '50%'],
  });

  const handleLocalRemove = (position: number) => {
    setLocalSlots((prevSlots) =>
      prevSlots.map((slot) =>
        slot.position === position ? { ...slot, item: null } : slot
      )
    );
  };

  const renderTopFiveItem = ({ item, drag, isActive }: RenderItemParams<any>) => {
    const hasContent = !!item.item;
    const imageUrl = item.item?.resourceData?.contenido?.imagenUrl;

    return (
      <ScaleDecorator>
        <View className="relative mr-3 aspect-[2/3] w-[70px] mt-2">
          <TouchableOpacity
            activeOpacity={0.9}
            onLongPress={drag}
            delayLongPress={100} // pequeño delay para arrastrar
            onPress={() => handlePress(item.position, item.item, true)}
          >
            <View
              className="h-full w-full items-center justify-center overflow-hidden rounded-lg"
              style={{
                backgroundColor: colors.surfaceButton,
                borderWidth: hasContent ? 0 : 2,
                borderColor: colors.borderButton,
              }}>
              {hasContent && imageUrl ? (
                <Image source={{ uri: imageUrl }} className="h-full w-full" resizeMode="cover" />
              ) : hasContent && !imageUrl ? (
                <AppText style={{ color: colors.secondaryText, fontSize: 12 }}>Sin img</AppText>
              ) : (
                <AppText style={{ color: colors.secondaryText, fontSize: 16 }}>+</AppText>
              )}
            </View>
          </TouchableOpacity>

          {/* Botón X para borrar ( visible si hay contenido) */}
          {hasContent && (
            <RNTouchableOpacity
              className="absolute -right-2 -top-2 z-50 items-center justify-center rounded-full p-1 shadow-md"
              style={{ backgroundColor: colors.error }}
              onPress={() => handleLocalRemove(item.position)}>
              <ScalableMaterialCommunityIcons name="close" size={14} color="#FFF" />
            </RNTouchableOpacity>
          )}
        </View>
      </ScaleDecorator>
    );
  };

  if (loading) {
    return (
      <Screen>
        <LoadingIndicator />
      </Screen>
    );
  }

  return (
    // Envuelto el Screen con GestureHandlerRootView para gestos
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Screen>
        <ReturnButton
          route={'/Profile'}
          title={t('profile.editProfile.title')}
        />

        <ScrollView 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 80 }} 
        >
          <View className="flex-col gap-2 px-6 py-4">
            <ProfileAvatar
              avatarUrl={avatarUrlString || null}
              onPickImage={pickImage}
              frame={frameString}
            />

            <RNTouchableOpacity
              activeOpacity={0.4}
              onPress={() => {
                router.push({
                  pathname: '/frameSelector',
                  params: { avatarUrl: avatarUrlString || '', currentFrame: frameString || 'none' },
                });
              }}>
              <AppText
                className="mb-3 mt-3 text-base font-bold"
                style={{ color: colors.primaryText, textAlign: 'center', fontSize: 18 }}>
                {t('settings.personalization.editPhoto')}
              </AppText>
            </RNTouchableOpacity>

            <FormInput
              description={uname}
              onChange={handleUsernameChange}
              title={t('profile.editProfile.username')}
              placeholder={t('profile.editProfile.usernamePlaceholder')}
              maxLength={20}
              numberOfLines={1}
              hasError={usernameAlreadyExists}
            />
            <FormInput
              description={udesc}
              onChange={setDescription}
              title={t('profile.editProfile.description')}
              placeholder={t('profile.editProfile.descriptionPlaceholder')}
              maxLength={110}
              numberOfLines={4}
            />
            
            <View className="flex-row items-center justify-between">
              <AppText
                className="font-semibold"
                style={{ fontSize: 16, color: colors.primaryText }}
              >
                {t('profile.editProfile.profileType')}
              </AppText>
            </View>

            <View
              className="relative mb-2 mt-2 flex-row rounded-full"
              style={{ backgroundColor: colors.surfaceButton, padding: 4 }}
            >
              <View className="absolute bottom-1 left-1 right-1 top-1">
                <Animated.View
                  className="h-full rounded-full shadow-sm"
                  style={{
                    width: '50%',
                    left: position,
                    backgroundColor: colors.background,
                  }}
                />
              </View>

              <RNTouchableOpacity
                className="z-10 flex-1 items-center justify-center py-2"
                activeOpacity={0.7}
                onPress={() => setPrivate(false)}
              >
                <AppText
                  className="font-semibold"
                  style={{ 
                    fontSize: 14, 
                    color: !uprivate ? colors.primaryText : colors.secondaryText 
                  }}
                >
                  {t('profile.editProfile.profilePublic')}
                </AppText>
              </RNTouchableOpacity>

              <RNTouchableOpacity
                className="z-10 flex-1 items-center justify-center py-2"
                activeOpacity={0.7}
                onPress={() => setPrivate(true)}
              >
                <AppText
                  className="font-semibold"
                  style={{ 
                    fontSize: 14, 
                    color: uprivate ? colors.primaryText : colors.secondaryText 
                  }}
                >
                  {t('profile.editProfile.profilePrivate')}
                </AppText>
              </RNTouchableOpacity>
            </View>

            <View className="mb-1 mt-2 ">
              <AppText className="font-semibold" style={{ fontSize: 16, color: colors.primaryText }}>
                { 'Editar Mi TopFive'} {/* TRADUCIR -------- */}
              </AppText>
              <AppText className="mb-3 mt-1" style={{ fontSize: 12, color: colors.secondaryText }}> {/* TRADUCIR ------> */}
                Mantén pulsado para ordenar. Pulsa la X para eliminar. 
              </AppText>

              <View style={{ height: 112, justifyContent: 'center' }}>
                {topFiveLoading ? (
                  <LoadingIndicator />
                ) : (
                  <DraggableFlatList
                    horizontal
                    data={localSlots}
                    keyExtractor={(item) => item.key}
                    renderItem={renderTopFiveItem}
                    showsHorizontalScrollIndicator={false}
                    activationDistance={15} 
                    onDragEnd={({ data }) => {
                      const reordered = data.map((slot, index) => ({
                        ...slot,
                        position: index + 1,
                      }));
                      setLocalSlots(reordered);
                      
                    }}
                  />
                )}
              </View>
            </View>

            <RNTouchableOpacity
              className="mt-5 w-full items-center rounded-xl py-3"
              style={{ backgroundColor: colors.primary }}
              onPress={() => handleSubmit(uname.trim(), udesc.trim(), uprivate, async () => {await saveCompleteTopFive(localSlots); })}>

              <AppText className="font-bold" style={{ color: colors.background, fontSize: 18 }}>
                {t('common.saveChanges')}
              </AppText>
            </RNTouchableOpacity>
          </View>
        </ScrollView>
      </Screen>

      {modalVisible && (
      <CategorySelectorModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelectCategory={(category) => handleCategorySelect(category, true)}
      />
      )}

    </GestureHandlerRootView>
  );
}