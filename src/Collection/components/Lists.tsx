import { FlatList } from 'react-native';
import { ListItem } from './ListItem';
import { useTheme } from 'context/ThemeContext';
import { AppText } from 'components/AppText';
import { useTranslation } from 'react-i18next';
import { LoadingIndicator } from 'components/LoadingIndicator';

export default function Lists({
  data,
  placeholder,
  deleteList,
  onLoadMore,
  loading,
}: {
  data: any[];
  placeholder: string;
  deleteList: any;
  onLoadMore: () => void;
  loading: boolean;
}) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <FlatList
      data={data}
      keyExtractor={(list) => list.id.toString()}
      renderItem={({ item: list }) => <ListItem list={list} onDelete={deleteList} />}
      showsVerticalScrollIndicator={false}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={() => loading ? <LoadingIndicator /> : null}
      contentContainerStyle={
        data.length === 0
          ? { flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }
          : { paddingBottom: 100, paddingHorizontal: 0 }
      }
      ListEmptyComponent={
        <AppText className="italic" style={{ color: colors.secondaryText, fontSize: 14 }}>
          {t('list.noLists', { category: placeholder })}
        </AppText>
      }
    />
  );
}
