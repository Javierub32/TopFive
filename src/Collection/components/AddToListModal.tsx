import { View, Text, Modal, TouchableOpacity, Pressable, FlatList, StatusBar } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from 'context/ThemeContext';
import { useLists } from '../hooks/useLists';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { useCollection } from 'context/CollectionContext';
import { router } from 'expo-router';

const ModalListItem = ({ list, onSelect, colors }: any) => (
  <TouchableOpacity
    className="active:bg-surfaceButton/80 flex-row items-center justify-between rounded-lg p-3"
    onPress={() => onSelect(list.id, list.tipo)}>
    <View className="flex-1 flex-row items-center pr-4">
      <View
        className="mr-3 h-12 w-12 items-center justify-center rounded-lg"
        style={{ backgroundColor: list.color || colors.primary }}>
        <MaterialCommunityIcons
          name={(list.icono as any) || 'folder-outline'}
          size={24}
          color={colors.primaryText}
        />
      </View>
      <View className="flex-1">
        <Text
          className="text-base font-semibold"
          style={{ color: colors.primaryText }}
          numberOfLines={1}>
          {list.nombre}
        </Text>
        <Text className="text-xs" style={{ color: colors.secondaryText }} numberOfLines={1}>
          {list.descripcion || (list.tipo === 'PELICULA' ? 'Lista de películas' : 'Lista privada')}
        </Text>
      </View>
    </View>
    <MaterialCommunityIcons name="bookmark-outline" size={24} color={colors.secondaryText} />
  </TouchableOpacity>
);


export function AddToListModal({ visible, onClose, resourceCategory, onSelect }: any) {
  const { colors, isDark } = useTheme();
  const { categoriaActual } = useCollection();
  const { lists, loading } = useLists(categoriaActual);

  

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent={true}>

      <Pressable
        className="flex-1 justify-end"
        style={{ backgroundColor: `${colors.background}80` }}
        onPress={onClose}>
        <Pressable
          className="max-h-[60%] w-full rounded-t-3xl p-6 shadow-2xl"
          style={{ backgroundColor: colors.surfaceButton }}
          onPress={(e) => e.stopPropagation()}>
          <Text className="mb-4 text-2xl font-bold" style={{ color: colors.primaryText }}>
            Guardar en...
          </Text>

          {loading ? (
            <View className="h-20">
              <LoadingIndicator />
            </View>
          ) : (
            <FlatList
              data={lists}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <ModalListItem list={item} onSelect={onSelect} colors={colors} />
              )}
              contentContainerStyle={{ paddingBottom: 20 }}
              ListEmptyComponent={() => (
                <View className="items-center p-4">
                  <Text style={{ color: colors.secondaryText }}>
                    No tienes listas de {resourceCategory.toLowerCase()} creadas.
                  </Text>
                  <TouchableOpacity className="mt-2" onPress={() => {
					onClose();
					router.push("/form/list");
				  }}>
                    <Text style={{ color: colors.primary }}>Crear nueva lista</Text>
                  </TouchableOpacity>
                </View> 
              )}
            />
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
