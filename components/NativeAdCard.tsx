import React, { useEffect, useState } from 'react';
import { View, Text, Image, ImageBackground, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from 'context/ThemeContext';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  NativeAd,
  NativeAdView,
  NativeAsset,
  NativeAssetType,
  NativeMediaView,
} from 'react-native-google-mobile-ads';

// Usamos el Test ID de Google para desarrollo y tu ID real para producción
const adUnitId = __DEV__ 
  ? 'ca-app-pub-3940256099942544/2247696110' // Test ID oficial de Anuncios Nativos
  : Platform.OS === 'android'
  ? 'ca-app-pub-2120812527357725/2640738331'
  : 'ca-app-pub-2120812527357725/2737766633';

export const NativeAdCard = () => {
  const { colors } = useTheme();
  const[nativeAd, setNativeAd] = useState<any>(null);

  useEffect(() => {
    if (Platform.OS === 'web') return;
    
    let isMounted = true;
    let adInstance: NativeAd | null = null;

    // Crea y solicita el anuncio
    NativeAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: true,
    }).then((ad) => {
        if (isMounted) {
          adInstance = ad;
          setNativeAd(ad);
        } else {
          ad.destroy();
        }
      })
      .catch((error) => console.log('Error al cargar anuncio nativo:', error));

    return () => {
      isMounted = false;
      if (adInstance) {
        adInstance.destroy();
      }
    };
  },[]);

  // Mientras carga o si falla, no mostramos nada para no dejar huecos feos
  if (!nativeAd) return null;

  const rating = nativeAd.starRating || 0;
  const descriptionText = nativeAd.body || '';
  const displayedDescription = descriptionText.length > 120
    ? descriptionText.slice(0, 120) + '...'
    : descriptionText;

  const bgImage = nativeAd.images?.[0]?.url || 'https://via.placeholder.com/150';

  return (
    <NativeAdView nativeAd={nativeAd}>
      {/* Contenedor idéntico a tu ActivityItem */}
      <View className="rounded-2xl shadow-xl mb-4 overflow-hidden" style={{ borderWidth: 0, borderColor: colors.borderButton }}>
        
        {/* Imagen de fondo (decorativa, usa la imagen principal del anuncio) */}
        <ImageBackground
          source={{ uri: bgImage }}
          style={{ width: '100%', backgroundColor: colors.surfaceButton }}
          imageStyle={{ opacity: 0.2 }}
        >
          <LinearGradient
            colors={['rgba(0,0,0,0)', colors.surfaceButton]}
            locations={[0, 0.6]}
            style={{ width: '100%' }}
          >
            <View className="p-4">
              
              {/* Etiqueta de "PATROCINADO" obligatoria por políticas de Google */}
              <View className="rounded-full" style={{ alignSelf: 'flex-start', backgroundColor: `${colors.primary}33`, paddingHorizontal: 12, padding: 4, marginBottom: 30 }}>
                <Text style={{ color: colors.primary, fontSize: 10, fontWeight: 'bold' }}>PATROCINADO</Text>
              </View>

              <View className="flex-row gap-4">
                
                {/* Poster del anuncio (MediaView obligatorio por Google para clics e impresiones) */}
                <View style={{ width: 96, height: 144, borderRadius: 12, overflow: 'hidden', backgroundColor: colors.borderButton }}>
                  <NativeMediaView style={{ width: '100%', height: '100%' }} />
                </View>

                <View className="flex-col flex-1">
                  <View className="flex-row justify-between items-start">
                    <View className='flex-1'>
                      
                      {/* Título del anuncio */}
                      <NativeAsset assetType={NativeAssetType.HEADLINE}>
                        <Text className="font-bold text-base leading-tight mr-2 mb-2" style={{ color: colors.primaryText }}>
                          {nativeAd.headline}
                        </Text>
                      </NativeAsset>
                      
                      {/* Estrellas de calificación */}
                      {rating > 0 && (
                        <NativeAsset assetType={NativeAssetType.STAR_RATING}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                            {[1, 2, 3, 4, 5].map((star) => {
                              let iconName = "star";
                              let isSolid = true;
                              if (rating >= star) {
                                iconName = "star";
                              } else if (rating >= star - 0.5) {
                                iconName = "star-half-alt";
                              } else {
                                isSolid = false;
                              }
                              return (
                                <FontAwesome5
                                  key={star}
                                  name={iconName}
                                  solid={isSolid}
                                  size={12}
                                  color={rating >= star - 0.5 ? colors.rating : colors.secondaryText}
                                />
                              );
                            })}
                          </View>
                        </NativeAsset>
                      )}
                    </View>
                  </View>

                  {/* Descripción del anuncio */}
                  <NativeAsset assetType={NativeAssetType.BODY}>
                    <Text style={{ color: colors.secondaryText, lineHeight: 20 }}>
                      {displayedDescription}
                    </Text>
                  </NativeAsset>

                  {/* Botón de llamada a la acción (ej: "Instalar", "Visitar web") */}
                  {nativeAd.callToAction && (
                    <View style={{ marginTop: 8, alignSelf: 'flex-start' }}>
                      <NativeAsset assetType={NativeAssetType.CALL_TO_ACTION}>
                        <View style={{ backgroundColor: colors.accent, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 }}>
                          <Text style={{ color: colors.primaryText, fontWeight: 'bold', fontSize: 12 }}>
                            {nativeAd.callToAction}
                          </Text>
                        </View>
                      </NativeAsset>
                    </View>
                  )}
                </View>
              </View>
            </View>
            <View className="mx-2 h-[1px]" style={{ backgroundColor: colors.placeholderText }} />
          </LinearGradient>

          {/* Footer del anuncio (Imitando a tu usuario + fecha) */}
          <View className="p-4" style={{ backgroundColor: colors.surfaceButton }}>
            <View className="flex-row items-center gap-3">
              <View className="h-10 w-10 items-center justify-center rounded-full overflow-hidden" style={{ backgroundColor: colors.primary }}>
                {nativeAd.icon ? (
                  <NativeAsset assetType={NativeAssetType.ICON}>
                    <Image source={{ uri: nativeAd.icon.url }} style={{ width: 40, height: 40 }} />
                  </NativeAsset>
                ) : (
                  <MaterialCommunityIcons name="bullhorn" size={20} color={colors.primaryText} />
                )}
              </View>

              <View className="flex-col flex-1">
                <NativeAsset assetType={NativeAssetType.ADVERTISER}>
                  <Text className="font-bold text-base" style={{ color: colors.primaryText }} numberOfLines={1}>
                    {nativeAd.advertiser || 'Anunciante Externo'}
                  </Text>
                </NativeAsset>
                <Text className="text-xs" style={{ color: colors.secondaryText }}>Recomendado para ti</Text>
              </View>
            </View>
          </View>

        </ImageBackground>
      </View>
    </NativeAdView>
  );
};