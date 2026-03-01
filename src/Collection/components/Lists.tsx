import { FlatList, Text } from 'react-native';
import { ListItem } from './ListItem';
import { useTheme } from 'context/ThemeContext';


export default function Lists({ data, placeholder, deleteList }: { data: any[], placeholder: string, deleteList: any }) {
	const { colors } = useTheme();

  return (
	  <FlatList
		data={data}
		keyExtractor={(list) => list.id.toString()}
		renderItem={({ item: list }) => (
		  <ListItem list={list} onDelete={deleteList} />
		)}
		showsVerticalScrollIndicator={false}
		contentContainerStyle={
			data.length === 0
				? { flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }
				: { paddingBottom: 100, paddingHorizontal: 0 }}
		ListEmptyComponent={
			<Text className="italic" style={{ color: colors.secondaryText }}>
			  No tienes listas de {placeholder}.
			</Text>
		}
	  />
	);
}