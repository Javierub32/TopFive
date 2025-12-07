import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

interface Book {
  id: number | null;
  title: string | null;
  autor: string | null;
  image: string | null;
  releaseDate: string | null;
  genre: string[] | null;
  reference: string | null;
  autorId: number | null;
  imageFull: string | null;
  description: string | null;
  rating: number | null;
}

export default function BookDetail() {
  const { bookData } = useLocalSearchParams();
  const router = useRouter();
  const book: Book = JSON.parse(bookData as string);

  const openForm = (book: Book) => {
	router.push({
	  pathname: '/form/book',
	  params: { bookData: JSON.stringify(book) },
	});
  };

  if (!book) {
    return (
      <Screen>
        <StatusBar style="light" />
        <View className="flex-1 items-center justify-center px-4">
          <MaterialCommunityIcons name="alert-circle" size={64} color="#ef4444" />
          <Text className="text-white text-xl font-bold mt-4">Error al cargar</Text>
          <Text className="text-gray-400 text-center mt-2">No se pudo cargar la información del libro</Text>
        </View>
      </Screen>
    );
  }

  const releaseYear = book.releaseDate ? new Date(book.releaseDate).getFullYear() : 'N/A';

  return (
    <Screen>
      <StatusBar style="light" />
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center px-4 pt-2 pb-4">
          <TouchableOpacity 
            onPress={() => router.push("/search")}
            className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-slate-800 border border-slate-700"
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold flex-1" numberOfLines={1}>
            Detalle del libro
          </Text>
        </View>

        <View className="px-4 mb-4">
          <Image 
            source={{ uri: book.imageFull || book.image || 'https://via.placeholder.com/500x750' }}
            className="w-full h-[500px] rounded-2xl bg-slate-900"
            resizeMode="cover"
          />
        </View>

        <View className="px-4 mb-14">
          <Text className="text-white text-3xl font-bold mb-3">
            {book.title || 'Sin título'}
          </Text>

          <View className="flex-row items-center mb-4 flex-wrap">
            <View className="bg-slate-800 px-3 py-1.5 rounded-lg mr-2 mb-2 border border-slate-700">
              <Text className="text-gray-300 text-sm font-semibold">
                {releaseYear}
              </Text>
            </View>

            {book.rating && (
              <View className="bg-purple-900/60 px-3 py-1.5 rounded-lg mr-2 mb-2 border border-purple-500/30 flex-row items-center">
                <MaterialCommunityIcons name="star" size={16} color="#fbbf24" />
                <Text className="text-purple-300 text-sm font-bold ml-1">
                  {book.rating.toFixed(1)}
                </Text>
              </View>
            )}

            {book.genre && book.genre.length > 0 && (
              <View className="bg-slate-800 px-3 py-1.5 rounded-lg mb-2 border border-slate-700">
                <Text className="text-gray-300 text-sm">
                  {book.genre.join(', ')}
                </Text>
              </View>
            )}
          </View>

          {book.autor && (
            <View className="mb-6">
              <Text className="text-purple-400 text-lg font-bold mb-2">
                Autor
              </Text>
              <View className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex-row items-center">
                <MaterialCommunityIcons name="account" size={24} color="#8b5cf6" />
                <Text className="text-gray-300 text-base ml-3">
                  {book.autor}
                </Text>
              </View>
            </View>
          )}

          {book.releaseDate && (
            <View className="mb-6">
              <Text className="text-purple-400 text-lg font-bold mb-2">
                Fecha de Publicación
              </Text>
              <View className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex-row items-center">
                <MaterialCommunityIcons name="calendar" size={24} color="#8b5cf6" />
                <Text className="text-gray-300 text-base ml-3">
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
              <Text className="text-purple-400 text-lg font-bold mb-2">
                Descripción
              </Text>
              <View className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                <Text className="text-gray-300 text-base leading-6">
                  {book.description}
                </Text>
              </View>
            </View>
          )}

          <TouchableOpacity 
            onPress={() => {openForm(book)}} 
            className="flex-1 bg-[#8B2DF0] py-4 rounded-xl items-center flex-row justify-center"
          >
            <FontAwesome5 name="cloud-upload-alt" size={16} color="white" style={{marginRight: 8}} />
            <Text className="text-white font-bold">Añadir a colección</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Screen>
  );
}
