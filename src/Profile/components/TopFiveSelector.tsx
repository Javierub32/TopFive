import { useAuth } from 'context/AuthContext';
import { useTheme } from 'context/ThemeContext';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useTopFive } from '../hooks/useTopFive';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { CategorySelectorModal } from 'components/CategorySelectorModal';

export const TopFiveSelector = () => {
  const slots = Array.from({ length: 5 });
  const { colors } = useTheme();
  const { user } = useAuth();
  const {
    topFiveItems,
    loading,
    handlePress,
    handleCategorySelect,
    modalVisible,
    setModalVisible,
	handleLongPress,
  } = useTopFive(user?.id || '');

  if (loading) {
    return (
      <View className="flex items-center justify-center">
        <LoadingIndicator />
      </View>
    );
  }

  return (
    <View className="z-50 mb-4">
      <Text className="mb-2 text-lg font-bold" style={{ color: colors.primaryText }}>
        Mi Top 5
      </Text>

      {/* Grid de Slots */}
      <View className="flex-row gap-2">
        {slots.map((_, index) => {
          const position = index + 1;
          const item = topFiveItems?.find((i: any) => i.posicion === position);
          const imageUrl = item?.resourceData?.contenido?.imagenUrl;

          if (!item) {
            return (
              <View
                key={index}
                className="flex-1 rounded-lg"
                style={{ backgroundColor: colors.surfaceButton }}>
                <TouchableOpacity
                  onPress={() => handlePress(position, item)}
				  onLongPress={() => handleLongPress(position, item)}
				 activeOpacity={0.7}>
				  
                  <View
                    className="aspect-[0.6] w-full items-center justify-center overflow-hidden rounded-lg border"
                    style={{
                      backgroundColor: colors.surfaceButton,
                      borderColor: colors.borderButton,
                    }}>
                    <Text className="text-xl" style={{ color: colors.secondaryText }}>
                      +
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            );
          }

          return (
            <View
              key={index}
              className="flex-1 rounded-lg"
              style={{ backgroundColor: colors.surfaceButton }}>
              <TouchableOpacity
                onPress={() => handlePress(position, item)}
                onLongPress={() => handleLongPress(position, item)}
				activeOpacity={0.7}>
                <View
                  className="aspect-[0.6] w-full items-center justify-center overflow-hidden rounded-lg "
                  style={{
                    backgroundColor: colors.surfaceButton,
                  }}>
                  <Image source={{ uri: imageUrl }} className="h-full w-full" resizeMode="cover" />
                </View>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>

      <CategorySelectorModal
	    title='Selecciona tu Top 5'
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelectCategory={(category) => handleCategorySelect(category)}
      />
    </View>
  );
};
