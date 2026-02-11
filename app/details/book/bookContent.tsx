import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from 'components/Screen';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { Book } from 'app/types/Content';
import { ReturnButton } from 'components/ReturnButton';
import { useTheme } from 'context/ThemeContext';
import { ThemedStatusBar } from 'components/ThemedStatusBar';
import { ContentTags } from "@/Details/components/ContentTags";
import { AuthorCard } from "@/Details/components/AuthorCard";
import { ContentDateCard } from "@/Details/components/ContentDateCard";
import { DescriptionCard } from "@/Details/components/DescriptionCard";
import { AddToCollectionButton } from "@/Details/components/AddToCollectionButton";

export default function BookDetail() {
  const { bookData } = useLocalSearchParams();
  const book: Book = JSON.parse(bookData as string);
  const { colors } = useTheme();

  if (!book) {
    return (
      <Screen>
        <ThemedStatusBar/>
        <View className="flex-1 items-center justify-center px-4">
          <MaterialCommunityIcons name="alert-circle" size={64} color={colors.error} />
          <Text className="text-xl font-bold mt-4" style={{ color: colors.primaryText }}>Error al cargar</Text>
          <Text className="text-center mt-2" style={{ color: colors.secondaryText }}>No se pudo cargar la información del libro</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <ThemedStatusBar/>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-2 pb-4">
          <ReturnButton route="/Add?initialCategory=libro" title="Detalle del libro" style={' '}/>
        </View>

        <View className="px-4 mb-4">
          <Image 
            source={{ uri: book.imageFull || book.image || 'https://via.placeholder.com/500x750' }}
            className="aspect-[2/3] rounded-2xl"
            style={{ backgroundColor: colors.surfaceButton }}
            resizeMode="cover"
          />
        </View>

        <View className="mb-14 px-4 pb-6">        
          <ContentTags content={book} type='libro'/>
          <View className="flex-col justify-between gap-3">
            <View className="flex-row gap-2">
              <AuthorCard autor={book.autor}/>
              <ContentDateCard releaseDate={book.releaseDate}/>
            </View>
            <DescriptionCard description={book.description}/>
          </View>
          <AddToCollectionButton content={book} type='libro' data={bookData}/>
        </View>
      </ScrollView>
    </Screen>
  );
}
