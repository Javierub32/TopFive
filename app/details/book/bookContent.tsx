import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { Book } from 'app/types/Content';
import { ReturnButton } from 'components/ReturnButton';
import { useTheme } from 'context/ThemeContext';
import { ThemedStatusBar } from 'components/ThemedStatusBar';
import { useState } from 'react';
import { cleanHtmlDescription } from '@/Details/utils/descriptionUtils';
import { ContentTags } from "@/Details/components/ContentTags";

export default function BookDetail() {
  const { bookData } = useLocalSearchParams();
  const router = useRouter();
  const book: Book = JSON.parse(bookData as string);
  const { colors } = useTheme();

  const openForm = (book: Book) => {
	router.push({
	  pathname: '/form/book',
	  params: { bookData: JSON.stringify(book) },
	});
  };

  const [ isExpanded, setIsExpanded ] = useState(false);
  const MAX_LENGTH = 200;
  const shouldTruncate = book.description && book.description.length > MAX_LENGTH;
  const rawDescription = book.description || 'Sin descripción disponible.';
  const descriptionText = cleanHtmlDescription(rawDescription);
  
  const displayedDescription = shouldTruncate && !isExpanded
    ? descriptionText.slice(0, MAX_LENGTH) + '...'
    : descriptionText;

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
        <ReturnButton route="/Add?initialCategory=libro" title="Detalle del libro" />

        <View className="px-4 mb-4">
          <Image 
            source={{ uri: book.imageFull || book.image || 'https://via.placeholder.com/500x750' }}
            className="w-full h-[600px] rounded-2xl"
            style={{ backgroundColor: colors.surfaceButton }}
            resizeMode="cover"
          />
        </View>

        <View className="px-4 pb-6">
          
            
          <ContentTags content={book}/>

          <View className="flex-col justify-between gap-3">
            <View className="flex-row gap-2">
              {book.autor && (
              <View className="flex-1 p-4 rounded-2xl flex justify-between gap-2" style={{ backgroundColor: colors.surfaceButton}}>
                <View className="flex-row items-center gap-2">
                  <MaterialCommunityIcons name="account" size={20} color={colors.primary} />
                  <Text className="text-sm font-bold uppercase tracking-widest" style={{color:colors.title}}>Autor</Text>                
                </View>
                <Text className="text-base ml-3 font-semibold" style={{ color: colors.secondaryText }}>
                  {book.autor}
                </Text>
              </View>
              )}
            

              {book.releaseDate && (
                <View className="flex-1 p-4 rounded-2xl flex justify-between gap-2" style={{backgroundColor: colors.surfaceButton}}>
                  <View className="flex-row items-center gap-2">
                    <MaterialCommunityIcons name="calendar" size={20} color={colors.primary} />
                    <Text className="text-sm font-bold uppercase tracking-widest" style={{ color: colors.title }}>
                      Publicado
                    </Text>
                  </View>
                  <Text className="text-base ml-3" style={{ color: colors.secondaryText }}>
                    {new Date(book.releaseDate).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Text>
                </View>
              )}
            </View>

            {descriptionText && (
              <View className="flex-1 p-5 rounded-2xl space-y-3 border-l-4" style={{ backgroundColor: colors.surfaceButton, borderColor: colors.borderButton }}>
                <View className="flex-row items-center gap-2">
                  <MaterialCommunityIcons name="book-open-page-variant" size={20} color={colors.primary} />
                  <Text className="text-sm font-bold uppercase tracking-widest" style={{ color: colors.title }}>Sinopsis</Text>
                </View>
                <Text  style={{ color: colors.secondaryText }}>
                  <Text className="leading-relaxed italic">
                    {displayedDescription}
                  </Text>
                  {shouldTruncate && (
                    <Text 
                      className="font-bold" style={{color: colors.primary}} onPress={() => setIsExpanded(!isExpanded)}>
                      {isExpanded ? ' Leer menos' : 'Leer más'}
                    </Text>
                  )}
                </Text>
              </View>
            )}
          </View>

          <TouchableOpacity 
            onPress={() => {openForm(book)}} 
            className="flex-1 py-4 rounded-xl items-center flex-row justify-center mt-4"
            style={{backgroundColor: colors.primary}}
          >
            <FontAwesome5 name="cloud-upload-alt" size={20} color={colors.background} style={{marginRight: 8}} />
            <Text className="font-bold" style={{ color: colors.background }}>Añadir a colección</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Screen>
  );
}
