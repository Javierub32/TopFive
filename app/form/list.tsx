import { View, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen';
import { FontAwesome5, MaterialCommunityIcons } from 'components/Icons';
import { useEffect, useState } from 'react';
import { useTheme } from 'context/ThemeContext';
import { useCollection } from 'context/CollectionContext';
import { useLists } from '@/Collection/hooks/useLists';
import { ReturnButton } from 'components/ReturnButton';
import { router, useLocalSearchParams } from 'expo-router';
import { ResourceType } from 'hooks/useResource';
import { useNotification } from 'context/NotificationContext';
import { AppText } from 'components/AppText';
import { AppTextInput } from 'components/AppTextInput';
import { useTranslation } from 'react-i18next';
export default function ListForm() {
  const { colors } = useTheme();
  const { categoriaActual, setIsSearchVisible } = useCollection();
  const { createList, updateList } = useLists(categoriaActual);
  const [loading, setLoading] = useState(false);
  const { listData } = useLocalSearchParams();
  const editando = !!listData;
  const listToEdit = editando ? JSON.parse(listData as string) : null;
  const { t } = useTranslation();

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

  //Inicializamos el estado del formulario
  const [formData, setFormData] = useState({
    name: listToEdit?.nombre || '',
    description: listToEdit?.descripcion || '',
    icon: listToEdit?.icono || 'cloud',
    color: listToEdit?.color || iconoColors.map((c) => c.value)[0],
    category: '',
  });

  const { showNotification } = useNotification();

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      //Alert.alert('Error', 'El nombre de la lista no puede estar vacío.');
      showNotification({
        title: t('common.error'),
        description: t('forms.lists.listNameCantBeEmpty'),
        isChoice: false,
        delete: false,
        success: false,
      });
      return;
    }

    setLoading(true);
    try {
      if (editando) {
        await updateList(
          listToEdit.id,
          formData.name,
          formData.description,
          formData.icon,
          formData.color
        );
        //Alert.alert('Lista actualizada', `La lista "${formData.name}" ha sido actualizada exitosamente.`);
        router.replace({
          pathname: '/(tabs)/Lists',
          params: {
            item: JSON.stringify(formData),
          },
        });
        setTimeout(() => {
          showNotification({
            title: t('common.success'),
            description: t('forms.lists.listHasBeenUpdated', { listName: formData.name }),
            isChoice: false,
            delete: false,
            success: true,
          });
        }, 100);
      } else {
        await createList(
          formData.name,
          formData.description,
          formData.icon,
          formData.color,
          categoriaActual as ResourceType
        );
      }
    } catch (error) {
      console.error('Error fetching list details:', error);
      //Alert.alert('Error', 'No se pudieron cargar los detalles de la lista. Por favor, inténtalo de nuevo.');
      showNotification({
        title: t('common.error'),
        description: t('forms.lists.listLoadingError'),
        isChoice: false,
        delete: false,
        success: false,
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    setIsSearchVisible(false);
  }, []);

  return (
    <Screen>
      <StatusBar style="light" />
      <ScrollView className="flex-1 px-4 pt-2">
        <View className="flex-1 flex-row items-center">
          <ReturnButton
            route="/(tabs)/Lists"
            title={editando ? t('forms.lists.updateList') : t('forms.lists.createList')}
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
          <AppText className="mb-2 ml-1 font-bold" style={{ color: colors.primaryText, fontSize: 18 }}>
            {t('forms.lists.listName')}
          </AppText>
          <AppTextInput
            placeholder={t('forms.lists.listNamePlaceholder')}
            placeholderTextColor={colors.secondaryText}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            className="rounded-xl px-4 py-4"
            style={{ color: colors.secondaryText, backgroundColor: colors.tabBarBackgroundColor, fontSize: 16 }} />
        </View>

        <View className="mb-5">
          <AppText className="mb-2 ml-1 font-bold" style={{ color: colors.primaryText, fontSize: 18 }}>
            {t('forms.lists.description')}
          </AppText>
          <AppTextInput
            placeholder={t('forms.lists.descriptionPlaceholder')}
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
              fontSize: 16,
            }}
            multiline
            numberOfLines={6}
          />
        </View>

        <View className="mb-5">
          <AppText className="mb-2 ml-1 font-bold" style={{ color: colors.primaryText, fontSize: 18 }}>
            {t('common.icon')}
          </AppText>
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
          <AppText className="mb-2 ml-1 font-bold" style={{ color: colors.primaryText, fontSize: 18 }}>
            {t('common.colour')}
          </AppText>
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
            handleSubmit();
          }}
          className="flex-1 flex-row items-center justify-center rounded-xl py-4"
          style={{ backgroundColor: colors.primary }}>
          <FontAwesome5
            name="cloud-upload-alt"
            size={16}
            color={colors.primaryText}
            style={{ marginRight: 8 }}
          />
          <AppText className=" font-bold" style={{ color: colors.primaryText }}>
            {editando ? t('forms.lists.updateList') : t('forms.lists.createList')}
          </AppText>
        </TouchableOpacity>
      </ScrollView>
    </Screen>
  );
}
