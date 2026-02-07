import { View, Text, Image, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from 'context/ThemeContext';
import { ListInfo } from '../services/listServices';
import { router } from 'expo-router';

export const ListItem = ({ list }: { list: ListInfo }) => {

  const { colors } = useTheme();
  
  return (
		<TouchableOpacity 
			key={list.id} 
			className="mb-4 p-4 rounded-2xl border shadow-sm"
			onPress={() => router.push({ pathname: '/details/list', params: { listId: list.id, title: list.nombre, icon: list.icono, color: list.color, description: list.descripcion } })}
			style={{ 
			  backgroundColor: colors.surfaceButton,
			  borderColor: colors.borderButton,
			  shadowColor: "#000",
			  shadowOffset: { width: 0, height: 2 },
			  shadowOpacity: 0.2,
			  shadowRadius: 3.84,
			  elevation: 5,
			}}
		  >
			{/* Cabecera de la tarjeta */}
			<View className="flex-row items-start mb-4">
			  {/* Icono de la lista */}
			  <View 
				className="w-12 h-12 rounded-full items-center justify-center mr-3"
				style={{ backgroundColor: list.color || colors.placeholderText }}
			  >
				<MaterialCommunityIcons name={list.icono as any} size={24} color={colors.primaryText} />
			  </View>

			  {/* Título y contador */}
			  <View className="flex-1">
				<Text 
				  className="text-lg font-bold leading-tight" 
				  style={{ color: colors.primaryText }}
				  numberOfLines={1}
				>
				  {list.nombre}
				</Text>
				<Text className="text-sm" style={{ color: colors.secondaryText }}>
				  {list.totalElementos} elementos
				</Text>
			  </View>

			  {/* Botón de menú (3 puntos) */}
			  <TouchableOpacity className="p-1">
				<MaterialCommunityIcons name="dots-horizontal" size={24} color={colors.secondaryText} />
			  </TouchableOpacity>
			</View>

			{/* Fila de imágenes (Thumbnails) */}
			<View className="flex-row gap-2">
			  {/* Mostramos hasta 4 imágenes */}
			  {list.previewImagenes.slice(0, 4).map((imgUrl: any, index: any) => (
				<Image
				  key={index}
				  source={{ uri: imgUrl }}
				  className="w-[18%] aspect-[2/3] rounded-lg bg-gray-300"
				  resizeMode="cover"
				/>
			  ))}

			  {/* Si hay más de 4 imágenes, mostramos el indicador de "+X" */}
			  {list.totalElementos > 4 && (
				<View 
				  className="w-[18%] aspect-[2/3] rounded-lg items-center justify-center"
				  style={{ backgroundColor: `${colors.placeholderText}20` }}
				>
				  <Text className="font-bold text-sm" style={{ color: colors.secondaryText }}>
					+{list.totalElementos - 4}
				  </Text>
				</View>
			  )}
			  
			  {/* Relleno visual si hay pocas imágenes para mantener el espaciado (opcional) */}
			  {list.previewImagenes.length < 4 && Array.from({ length: 4 - list.previewImagenes.length }).map((_, i) => (
				 <View 
				 key={`empty-${i}`}
				 className="w-[18%] aspect-[2/3] rounded-lg border border-dashed"
				 style={{ borderColor: colors.borderButton }}
			   />
			  ))}
			</View>
		  </TouchableOpacity>

  );
};