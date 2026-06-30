// app/details/list/index.tsx
import { View } from 'react-native';
import { useCollection } from 'context/CollectionContext';
import { useLocalSearchParams } from 'expo-router';
import { useListsDetails } from '@/Collection/hooks/useListsDetails';
import { Screen } from 'components/Screen';
import { ReturnButton } from 'components/ReturnButton';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { CollectionStructure } from 'components/CollectionStructure';
import { useTheme } from 'context/ThemeContext';
import { MaterialCommunityIcons } from 'components/Icons';
import { ResourceType } from 'hooks/useResource';
import { AppText } from 'components/AppText';
import { useTranslation } from 'react-i18next';

export default function ListDetails() {
  const { categoriaActual, handleItemPress } = useCollection();
  const { listData } = useLocalSearchParams<{ listData: any }>();
  const parsedListData = listData ? JSON.parse(listData) : null;
  const { loading, data, handleLoadMore, handleDeleteItem } = useListsDetails(
    categoriaActual,
    parsedListData?.id!
  );
  const { colors } = useTheme();
  const { t } = useTranslation();

  if (loading && data.length === 0) {
    return (
      <Screen>
        <ReturnButton
          title={t('forms.lists.listDetails')}
          route="/(tabs)/Lists"
          params={{ initialResource: categoriaActual as ResourceType }}
        />
        <LoadingIndicator />
      </Screen>
    );
  }

  return (
    <Screen>
      <ReturnButton
        title={t('forms.lists.listDetails')}
        route="/(tabs)/Lists"
        params={{ initialResource: categoriaActual as ResourceType }}
      />

      {/* CABECERA DE LA LISTA */}
      {parsedListData?.nombre && (
        <View
          className="mx-2 mb-4 mt-2 flex-row items-start rounded-2xl border p-4 shadow-sm"
          style={{
            backgroundColor: colors.surfaceButton,
            borderColor: colors.borderButton,
          }}>
          {/* Icono con fondo de color */}
          <View
            className="mr-4 h-16 w-16 items-center justify-center rounded-2xl shadow-sm"
            style={{ backgroundColor: parsedListData?.color || colors.primary }}>
            <MaterialCommunityIcons
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
          categoriaActual={categoriaActual}
          handleItemPress={(item: any) => handleItemPress(item, categoriaActual, 'list')}
          handleLongPress={handleDeleteItem}
          handleSearchPagination={handleLoadMore}
          showStatus={true}
          loading={loading}
        />
      </View>
    </Screen>
  );
}
