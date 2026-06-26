import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Screen } from 'components/Screen';
import { ReturnButton } from 'components/ReturnButton';
import { CollectionStructure } from 'components/CollectionStructure';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { useItemSelector } from '@/Collection/hooks/useItemSelector';
import { useTranslation } from 'react-i18next';

export default function ItemSelector() {
  const { listId, category, listName } = useLocalSearchParams<{
    listId: string;
    category: string;
    listName: string;
  }>();
  const { data, loading, addItem, resourceType } = useItemSelector(category, listId);
  const { t } = useTranslation();
  return (
    <Screen>
      <ReturnButton
        title={t(`forms.addToList`, { listName: listName || t('forms.list') })}
        route="back"
      />

      <View className="mt-2 flex-1 px-5">
        {loading ? (
          <LoadingIndicator />
        ) : (
          <CollectionStructure
            data={data}
            categoriaActual={resourceType}
            handleItemPress={(item: any) => addItem(item.id)}
            showStatus={true}
            loading={loading}
          />
        )}
      </View>
    </Screen>
  );
}
