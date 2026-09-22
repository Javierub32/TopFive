import { useDiary } from "@/Diary/hooks/useDiary";
import { LoadingIndicator } from "components/LoadingIndicator";
import { Screen } from "components/Screen";
import { useAuth } from "context/AuthContext";
import { useTheme } from "context/ThemeContext";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";



export default function DiaryScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { user } = useAuth();

  const { items, loadMore, loading, loadingMore, hasNextPage, refresh } = useDiary(user?.id);
  console.log("DiaryScreen items:", items);

  if (loading) {
	return (
	  <Screen>
		<LoadingIndicator />
	  </Screen>
	);
  }

  return (
	<Screen>
		<View>
			{items.map((item) => (
				<View key={item.recurso_id} className="p-4 border-b border-gray-300 ">
					<Text className="font-bold color-white">{item.titulo}</Text>
					<Text>{item.anio_lanzamiento}</Text>
					<Text>{item.estado}</Text>
				
				</View>
			))}
		</View>
	</Screen>
  )

}