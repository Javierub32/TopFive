import { View, FlatList, TouchableOpacity } from 'react-native';
import { CollectionGroup } from './CollectionGroup';
import { MaterialCommunityIcons } from 'components/Icons';
import { useTheme } from 'context/ThemeContext';
import { AppText } from 'components/AppText';
import { useTranslation } from 'react-i18next';
export const RenderCollection = ({
  title,
  data,
  total,
  category,
  onPressItem,
  onPressTitle,
}: any) => {
  const safeData = data || [];
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View className="mb-4">
      <TouchableOpacity activeOpacity={0.7} onPress={onPressTitle} className="mb-3 px-1">
        <View className="mb-1 px-0">
          <AppText className="font-bold text-primaryText" style={{ fontSize: 16 }}>
            {title} <AppText className=" font-normal text-secondaryText" style={{ fontSize: 12 }}>
              ({total})
            </AppText>
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
          <CollectionGroup item={item} category={category} onPress={() => onPressItem(item)} />
        )}
        ListEmptyComponent={
          <AppText className="ml-2 italic text-secondaryText" style={{ fontSize: 14}}>
            {t('collection.noContent')}
          </AppText>
        }
      />
      <View className="mx-0 mt-3 h-[1px] " style={{ backgroundColor: colors.placeholderText }} />
    </View>
  );
};
