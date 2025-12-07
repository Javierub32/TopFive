import { View, Text, TextInput, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
interface Book {
  trackId: number;
  trackName: string;
  artistName: string;
  artworkUrl100: string;
  averageUserRating?: number;
  releaseDate: string;
  description?: string;
}

export default function Books() {
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [recentBooks, setRecentBooks] = useState<Book[]>([]);
  const [topRatedBooks, setTopRatedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'search' | 'recent' | 'topRated'>('recent');

  // Cargar unos 20 libros recientes al iniciar
  useEffect(() => {
    fetchRecentBooks();
    fetchPopularBooks();
  }, []);

// Method to fetch popular books
  const fetchPopularBooks
   = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        'https://corsproxy.io/?' + encodeURIComponent('https://rss.applemarketingtools.com/api/v2/us/books/top-paid/10/books.json')
      );
      const data = await response.json();
      setTopRatedBooks(data.feed?.results || []);
    } catch (error) {
      console.error('Error cargando libros mejor valorados:', error);
    } finally {
      setLoading(false);
    }
  };
// Method to fetch recent books
  const fetchRecentBooks = async () => {
    setLoading(true);
    try {
      const currentYear = new Date().getFullYear(); // 2025
      const response = await fetch( 
        `https://itunes.apple.com/search?term=${currentYear}&media=ebook&limit=8` //Don´t know why, but it place 2 more books than expected
      );
      const data = await response.json();
      setRecentBooks(data.results || []);
    } catch (error) {
      console.error('Error cargando libros recientes:', error);
    } finally {
      setLoading(false);
    }
  };

//To see the book details in the list
  const renderBook = (book: Book) => (
    <View key={book.trackId} className="bg-gray-800 rounded-xl p-4 mx-0 my-2 border-2 border-purple-500/30">
      <View className="flex-row">
        <Image 
          source={{ uri: book.artworkUrl100 }} 
          className="w-20 h-28 rounded-lg"
        />
        <View className="flex-1 ml-4">
          <Text className="text-white font-bold text-base" numberOfLines={2}>
            {book.trackName}
          </Text>
          <Text className="text-purple-300 text-sm mt-1" numberOfLines={1}>
            {book.artistName}
          </Text>
          {book.averageUserRating && (
            <View className="flex-row items-center mt-2">
              <MaterialCommunityIcons name="star" size={16} color="#fbbf24" />
              <Text className="text-yellow-400 ml-1 text-sm">
                {book.averageUserRating.toFixed(1)}
              </Text>
            </View>
          )}
          <Text className="text-gray-400 text-xs mt-1">
            {new Date(book.releaseDate).getFullYear()}
          </Text>
        </View>
      </View>
    </View>
  );
  // This is the main return of the Books component
  return (
    <View className="flex-1">
      {/* Sections */}
      <View className="flex-row mx-0 my-2">
        <TouchableOpacity
          onPress={() => setActiveTab('recent')}
          className="flex-1 py-3 rounded-l-xl border-2 border-purple-500/30"
          style={{ backgroundColor: activeTab === 'recent' ? '#8b5cf6' : '#1f2937' }}
        >
          <Text className="text-center font-semibold" style={{ color: activeTab === 'recent' ? '#fff' : '#a78bfa' }}>
            Recientes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('topRated')}
          className="flex-1 py-3 rounded-r-xl border-2 border-l-0 border-purple-500/30"
          style={{ backgroundColor: activeTab === 'topRated' ? '#8b5cf6' : '#1f2937' }}
        >
          <Text className="text-center font-semibold" style={{ color: activeTab === 'topRated' ? '#fff' : '#a78bfa' }}>
            Populares
          </Text>
        </TouchableOpacity>
      </View>      {/* Content */}
      <ScrollView className="flex-1">
        {loading ? (
          <View className="flex-1 items-center justify-center py-10">
            <ActivityIndicator size="large" color="#8b5cf6" />
          </View>
        ) : (
          <>
            {activeTab === 'search' && books.map(renderBook)}
            {activeTab === 'recent' && recentBooks.map(renderBook)}
            {activeTab === 'topRated' && topRatedBooks.map(renderBook)}
          </>
        )}
      </ScrollView>
    </View>
  );
}