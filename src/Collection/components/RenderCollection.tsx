import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { CollectionGroup } from './CollectionGroup'; 
import { MaterialCommunityIcons } from 'components/Icons';
import { useTheme } from 'context/ThemeContext';
import {AppText} from 'components/AppText';
export const RenderCollection = ({ title, data, total, category, onPressItem, onPressTitle }: any) => {
  const safeData = data || [];
  const { colors } = useTheme();

  return (
    <View className="mb-4">
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPressTitle}
        className="px-1 mb-3"
      >
        <View className="px-0 mb-1">
          <AppText className="text-xl font-bold text-primaryText">
            {title} <AppText className="text-sm font-normal text-secondaryText">({total})</AppText>
            <MaterialCommunityIcons name="chevron-right" size={14} color={colors.secondaryText} />
          </AppText>
        </View>
      </TouchableOpacity>

      <FlatList
        data={[...safeData]}
        horizontal={true} 
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 4 }} 
        
        renderItem={({ item }) => (
          <CollectionGroup 
            item={item} 
            category={category} 
            onPress={() => onPressItem(item)} 
          />
        )}
        ListEmptyComponent={
          <AppText className="text-secondaryText italic text-sm ml-2">
            No hay contenido disponible.
          </AppText>
        }
      />
      <View className="mt-3 mx-0 h-[1px] " style={{ backgroundColor: colors.placeholderText }} />
    </View>
  );
};