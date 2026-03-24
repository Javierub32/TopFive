import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams, useRouter } from 'expo-router';
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
import { useContent } from '@/Details/hooks/useContent';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { ModernContentHeader } from "@/Details/components/ContentHeader";
import { ContentRating } from "@/Details/components/ContentRating";
import { AdBanner } from 'components/AdBanner';

export default function BookDetail() {
  const { id, from } = useLocalSearchParams();
  const { content, loading } = useContent(id as string | number, 'libro');
  const book: Book = content as Book;
  const { colors } = useTheme();

  const path = from === 'search' ? '/Add?initialCategory=libro' : '/(tabs)/Home';

  if (loading) {
	return (
	  <Screen>
		<LoadingIndicator />
	  </Screen>
	);
  }

  if (!content && !loading) {
    return (
      <Screen>
        <ThemedStatusBar/>
		<ReturnButton route={path} title="Detalle del libro" />
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
        <ModernContentHeader 
          imageUrl={book.imageFull || book.image} 
          returnRoute={path}
          content={book}
          type='libro'
          autor={book.autor}
        />

        <View className="mb-14 px-4 pb-6">        
          <View className="flex-col justify-between gap-3 mt-1">
            <DescriptionCard description={book.description}/>
          </View>
          	<AddToCollectionButton content={book} type='libro'/>
        </View>
		<AdBanner/>
      </ScrollView>
    </Screen>
  );
}
