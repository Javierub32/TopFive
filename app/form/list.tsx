import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { useTheme } from 'context/ThemeContext';
import { useCollection } from 'context/CollectionContext';
import { useLists } from '@/Collection/hooks/useLists';
import { ReturnButton } from 'components/ReturnButton';
import { router } from 'expo-router';
import { ResourceType } from 'hooks/useResource';

export default function ListForm() {
  const { colors } = useTheme();
  const { categoriaActual, setIsSearchVisible } = useCollection();
  const { createList } = useLists(categoriaActual);
  //Iconos que se pueden elegir para las listas
  const icons = [
    'cloud',
    'star',
    'heart',
    'all-inclusive',
    'bookmark',
    'music',
    'filmstrip',
    'book',
    'gamepad-square',
    'airplane-takeoff',
    'car',
    'camera',
  ];
  //Colores que se pueden elegir para las listas
  const iconoColors = [
    { name: 'Verde', value: '#4ADE80' },
    { name: 'Azul', value: '#60A5FA' },
    { name: 'Rojo', value: '#F87171' },
    { name: 'Amarillo', value: '#FACC15' },
    { name: 'Morado', value: '#A78BFA' },
    { name: 'Rosa', value: '#F472B6' },
    { name: 'Naranja', value: '#FB923C' },
    { name: 'Cian', value: '#22D3EE' },
  ];

  //Inicializamos el estado del formulario
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'cloud',
    color: iconoColors.map((c) => c.value)[0],
    category: '',
  });

  useEffect(() => {
	setIsSearchVisible(false);
  }, []);

  const handleCreateList = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'El nombre de la lista no puede estar vacío.');
      return;
    }
    await createList(
      formData.name,
      formData.description,
      formData.icon,
      formData.color,
      categoriaActual as ResourceType
    );
  };

  return (
    <Screen>
      <StatusBar style="light" />
      <ScrollView className="flex-1 px-4 pt-2">
        <View className="flex-1 flex-row items-center">
          <ReturnButton
            route="/Collection"
            title={'Crea tu lista'}
            style={' '}
            params={{ initialResource: categoriaActual as ResourceType }}
          />
        </View>
        <View className="mb-4 items-center justify-center py-4">
          <View
            className="h-24 w-24 items-center justify-center rounded-3xl shadow-md"
            style={{ backgroundColor: formData.color }}>
            <MaterialCommunityIcons
              name={formData.icon as any}
              size={32}
              color={colors.primaryText}
            />
          </View>
        </View>

        <View className="mb-5">
          <Text className="mb-2 ml-1 text-lg font-bold" style={{ color: colors.primaryText }}>
            Nombre de la lista
          </Text>
          <TextInput
            placeholder="Ej: Películas favoritas"
            placeholderTextColor={colors.secondaryText}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            className="rounded-xl px-4 py-4"
            style={{ color: colors.secondaryText, backgroundColor: colors.tabBarBackgroundColor }}
          />
        </View>

        <View className="mb-5">
          <Text className="mb-2 ml-1 text-lg font-bold" style={{ color: colors.primaryText }}>
            Descripción
          </Text>
          <TextInput
            placeholder="Describe el contenido de esta lista..."
            placeholderTextColor={colors.secondaryText}
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            className="rounded-xl px-4 py-4"
            style={{
              color: colors.secondaryText,
              backgroundColor: colors.tabBarBackgroundColor,
              textAlignVertical: 'top',
              paddingTop: 12,
              paddingBottom: 12,
              paddingHorizontal: 12,
              minHeight: 120,
            }}
            multiline
            numberOfLines={6}
          />
        </View>

        <View className="mb-5">
          <Text className="mb-2 ml-1 text-lg font-bold" style={{ color: colors.primaryText }}>
            Icono
          </Text>
          <View className="flex-row flex-wrap justify-between">
            {icons.map((iconName) => (
              <TouchableOpacity
                key={iconName}
                onPress={() => setFormData({ ...formData, icon: iconName })}
                className="mb-3 items-center justify-center rounded-xl"
                style={{
                  width: '15%',
                  height: 50,
                  backgroundColor:
                    formData.icon === iconName ? colors.primary : colors.tabBarBackgroundColor,
                }}>
                <MaterialCommunityIcons
                  name={iconName as any}
                  size={20}
                  color={formData.icon === iconName ? colors.primaryText : colors.secondaryText}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="mb-6">
          <Text className="mb-2 ml-1 text-lg font-bold" style={{ color: colors.primaryText }}>
            Color
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {iconoColors.map(({ name, value }) => (
              <TouchableOpacity
                key={value}
                onPress={() => setFormData({ ...formData, color: value })}
                className={`h-10 w-10 items-center justify-center rounded-full ${
                  formData.color === value
                }`}
                // Si el color es el seleccionado, mostramos un borde, si no, solo el círculo de color
                style={{
                  backgroundColor: value,
                  borderWidth: formData.color === value ? 2 : 0,
                  borderColor: colors.primaryText,
                }}>
                {formData.color === value}
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            handleCreateList();
          }}
          className="flex-1 flex-row items-center justify-center rounded-xl py-4"
          style={{ backgroundColor: colors.primary }}>
          <FontAwesome5
            name="cloud-upload-alt"
            size={16}
            color={colors.primaryText}
            style={{ marginRight: 8 }}
          />
          <Text className=" font-bold" style={{ color: colors.primaryText }}>
            Añadir lista
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </Screen>
  );
}
