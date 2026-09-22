import { useDiary } from "@/Diary/hooks/useDiary";
import { LoadingIndicator } from "components/LoadingIndicator";
import { ReturnButton } from "components/ReturnButton";
import { Screen } from "components/Screen";
import { useAuth } from "context/AuthContext";
import { useTheme } from "context/ThemeContext";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Image, SectionList, Text, View } from "react-native";



export default function DiaryScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { user } = useAuth();

  const { items, loadMore, loading, loadingMore, hasNextPage, refresh } = useDiary(user?.id);
  
const sections = useMemo(() => {
  const groups = new Map<
    string,
    {
      title: string;
      data: any[];
    }
  >();

  items.forEach((item) => {
    const [year, month, day] = item.fecha_fin!
      .split("-")
      .map(Number);

    const date = new Date(year, month - 1, day);

    const key = `${year}-${String(month).padStart(2, "0")}`;

    const title = new Intl.DateTimeFormat("es-ES", {
      month: "long",
      year: "numeric",
    })
      .format(date)
      .toUpperCase();

    if (!groups.has(key)) {
      groups.set(key, {
        title,
        data: [],
      });
    }

    groups.get(key)!.data.push(item);
  });

  return Array.from(groups.values());
}, [items]);

  if (loading) {
	return (
	  <Screen>
		<LoadingIndicator />
	  </Screen>
	);
  }

  return (
	<Screen>
		<ReturnButton route="back" title="Diario" />

		<SectionList
  sections={sections}
  keyExtractor={(item) => item.recurso_id.toString()}

  renderSectionHeader={renderHeader}

  renderItem={renderItem}

  onEndReached={loadMore}
  onEndReachedThreshold={0.5}
  ListFooterComponent={loadingMore ? <LoadingIndicator /> : null}
  refreshing={loading}
  onRefresh={refresh}
  ListEmptyComponent={
    <View className="flex-1 items-center justify-center">
      <Text className="text-gray-500">
        No hay elementos
      </Text>
    </View>
  }
/>
	</Screen>
  )

}



const renderHeader = ({
  section,
}: {
  section: { title: string };
}) => {
  return (
    <View
      className="px-5 py-4"
      style={{ backgroundColor: "#303a41" }}
    >
      <Text
        className="text-3xl font-light tracking-widest"
        style={{ color: "#ffffff" }}
      >
        {section.title.toUpperCase()}
      </Text>
    </View>
  );
};

const renderItem = ({ item }: { item: any }) => {
  const day = new Date(`${item.fecha_fin}T00:00:00`).getDate();
  const year = new Date(`${item.anio_lanzamiento}T00:00:00`).getFullYear();

  const posterUrl = item.imagen_url;

  const rating = Number(item.calificacion ?? 0);
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;

  const stars =
    "★".repeat(fullStars) +
    (hasHalfStar ? "½" : "");

  return (
    <View
      className="flex-row border-b px-5 py-5"
      style={{
        backgroundColor: "#171b1f",
        borderBottomColor: "#34383b",
      }}
    >
      {/* Día */}
      <View
        className="mr-5 h-28 w-24 items-center justify-center rounded-xl border"
        style={{ borderColor: "#3d454c" }}
      >
        <Text
          className="text-4xl font-light"
          style={{ color: "#9aaabd" }}
        >
          {day}
        </Text>
      </View>

      {/* Póster */}
      <View className="mr-5 h-28 w-20 overflow-hidden border border-gray-600">
        {posterUrl ? (
          <Image
            source={{ uri: posterUrl }}
            className="h-full w-full"
            resizeMode="cover"
          />
        ) : (
          <View className="h-full w-full items-center justify-center">
            <Text className="text-center text-xs text-gray-500">
              Sin imagen
            </Text>
          </View>
        )}
      </View>

      {/* Información */}
      <View className="flex-1 justify-center">
        <Text
          className="text-2xl font-bold"
          style={{ color: "#ffffff" }}
          numberOfLines={2}
        >
          {item.titulo}{" "}
          <Text
            className="text-lg font-normal"
            style={{ color: "#91a0b0" }}
          >
            {year}
          </Text>
        </Text>

        <View className="mt-2 flex-row items-center">
          {stars !== "" && (
            <Text
              className="text-2xl"
              style={{ color: "#00e676" }}
            >
              {stars}
            </Text>
          )}

          {item.favorito && (
            <Text
              className="ml-4 text-2xl"
              style={{ color: "#ff8c00" }}
            >
              ♥
            </Text>
          )}

          <Text
            className="ml-4 text-2xl"
            style={{ color: "#73808d" }}
          >
            ☰
          </Text>
        </View>
      </View>
    </View>
  );
};