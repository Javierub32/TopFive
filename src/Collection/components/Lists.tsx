import { FlatList } from 'react-native';
import { ListItem } from './ListItem';
import { useTheme } from 'context/ThemeContext';
import { AppText } from 'components/AppText';
import { useTranslation } from 'react-i18next';

export default function Lists({
  data,
  placeholder,
  deleteList,
}: {
  data: any[];
  placeholder: string;
  deleteList: any;
}) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <FlatList
      data={data}
      keyExtractor={(list) => list.id.toString()}
      renderItem={({ item: list }) => <ListItem list={list} onDelete={deleteList} />}
      showsVerticalScrollIndicator={false}
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
