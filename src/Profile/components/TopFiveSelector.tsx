import { useAuth } from 'context/AuthContext';
import { useTheme } from 'context/ThemeContext';
import { View, Text, Pressable, Image } from 'react-native';
import { useTopFive } from '../hooks/useTopFive';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { useCollection } from 'context/CollectionContext';

export const TopFiveSelector = () => {
  const slots = Array.from({ length: 5 });
  const { colors } = useTheme();
  const { user } = useAuth();
  const { topFiveItems, loading } = useTopFive(user?.id || '');
  const { handleItemPress } = useCollection();
  console.log('Top Five Items:', topFiveItems);

  const handlePress = (position: number, item: any) => {
    if (item) {
      // Lógica si ya hay item: ir al detalle, o abrir menú para reemplazar/borrar
      console.log('Item presionado:', item);
      handleItemPress(item.resourceData, item.type);
    } else {
      console.log('Añadir item en posición:', position);
    }
  };

  if (loading) {
    return (
      <View className="flex items-center justify-center">
        <LoadingIndicator />
      </View>
    );
  }

  return (
    <View className="mb-4">
      <Text className="mb-2 text-lg font-bold" style={{ color: colors.primaryText }}>
        Mi Top 5
      </Text>
      <View className="flex-row gap-2">
        {slots.map((_, index) => {
          const position = index + 1;
          // Buscamos si existe un item para esta posición (1 al 5)
          const item = topFiveItems?.find((i: any) => i.posicion === position);
          const imageUrl = item?.resourceData?.contenido?.imagenUrl;

          if (!item) {
            return (
              <View
                key={index}
                className="flex-1 rounded-lg"
                style={{ backgroundColor: colors.surfaceButton }}>
                <Pressable
                  onPress={() => handlePress(position, item)}
                  style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
                  <View
                    className="aspect-[2/3] w-full items-center justify-center overflow-hidden rounded-lg border"
                    style={{
                      backgroundColor: colors.surfaceButton,
                      borderColor: colors.borderButton,
                    }}>
                    <Text className="text-xl" style={{ color: colors.secondaryText }}>
                      +
                    </Text>
                  </View>
                </Pressable>
              </View>
            );
          }

          return (
            <View
              key={index}
              className="flex-1 rounded-lg"
              style={{ backgroundColor: colors.surfaceButton }}>
              <Pressable
                onPress={() => handlePress(position, item)}
                style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
                <View
                  className="aspect-[2/3] w-full items-center justify-center overflow-hidden rounded-lg border"
                  style={{
                    backgroundColor: colors.surfaceButton,
                    borderColor: colors.borderButton,
                  }}>
                  <Image source={{ uri: imageUrl }} className="h-full w-full" resizeMode="cover" />
                </View>
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
};
