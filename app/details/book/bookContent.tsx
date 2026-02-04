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

  const releaseYear = book.releaseDate ? new Date(book.releaseDate).getFullYear() : 'N/A';

  return (
    <Screen>
      <ThemedStatusBar/>
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <ReturnButton route="/Add?initialCategory=Libros" title="Detalle del libro" />

        <View className="px-4 mb-4">
          <Image 
            source={{ uri: book.imageFull || book.image || 'https://via.placeholder.com/500x750' }}
            className="w-full h-[500px] rounded-2xl"
            style={{ backgroundColor: colors.surfaceButton }}
            resizeMode="cover"
          />
        </View>

        <View className="px-4 mb-14">
          <Text className="text-3xl font-bold mb-3" style={{ color: colors.primaryText }}>
            {book.title || 'Sin título'}
          </Text>

          <View className="flex-row items-center mb-4 flex-wrap">
            <View className="px-3 py-1.5 rounded-lg mr-2 mb-2 border"
            style={{backgroundColor: colors.surfaceButton, borderColor: colors.borderButton}}>
              <Text className="text-sm font-semibold" style={{color: colors.secondaryText}}>
                {releaseYear}
              </Text>
            </View>

            {book.rating && (
              <View className="px-3 py-1.5 rounded-lg mr-2 mb-2 border flex-row items-center" style={{backgroundColor: colors.surfaceButton, borderColor: colors.primary}}>
                <MaterialCommunityIcons name="star" size={16} color={colors.rating} />
                <Text className="text-sm font-bold ml-1" style={{color: colors.markerText}}>
                  {book.rating.toFixed(1)}
                </Text>
              </View>
            )}

            {book.genre && book.genre.length > 0 && (
              <View className="px-3 py-1.5 rounded-lg mb-2 border" style={{backgroundColor: colors.surfaceButton, borderColor: colors.borderButton}}>
                <Text className="text-sm" style={{color: colors.secondaryText}}>
                  {book.genre.join(', ')}
                </Text>
              </View>
            )}
          </View>

          {book.autor && (
            <View className="mb-6">
              <Text className="text-lg font-bold mb-2" style={{ color: colors.title }}>
                Autor
              </Text>
              <View className="p-4 rounded-xl border flex-row items-center" style={{backgroundColor: colors.surfaceButton, borderColor: colors.borderButton}}>
                <MaterialCommunityIcons name="account" size={24} color={colors.primary} />
                <Text className="text-base ml-3" style={{ color: colors.secondaryText }}>
                  {book.autor}
                </Text>
              </View>
            </View>
          )}

          {book.releaseDate && (
            <View className="mb-6">
              <Text className="text-lg font-bold mb-2" style={{ color: colors.title }}>
                Fecha de Publicación
              </Text>
              <View className="p-4 rounded-xl border flex-row items-center" style={{backgroundColor: colors.surfaceButton, borderColor: colors.borderButton}}>
                <MaterialCommunityIcons name="calendar" size={24} color={colors.primary} />
                <Text className="text-base ml-3" style={{ color: colors.secondaryText }}>
                  {new Date(book.releaseDate).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Text>
              </View>
            </View>
          )}

          {book.description && (
            <View className="mb-6">
              <Text className="text-lg font-bold mb-2" style={{ color: colors.title }}>
                Descripción
              </Text>
              <View className="p-4 rounded-xl border" style={{backgroundColor: colors.surfaceButton, borderColor: colors.borderButton}}>
                <Text className="text-base leading-6" style={{ color: colors.secondaryText }}>
                  {book.description}
                </Text>
              </View>
            </View>
          )}

          <TouchableOpacity 
            onPress={() => {openForm(book)}} 
            className="flex-1 py-4 rounded-xl items-center flex-row justify-center"
            style={{backgroundColor: colors.primary}}
          >
            <FontAwesome5 name="cloud-upload-alt" size={16} color={colors.background} style={{marginRight: 8}} />
            <Text className="font-bold" style={{ color: colors.background }}>Añadir a colección</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Screen>
  );
}
