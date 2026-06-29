import { View, Image, TouchableOpacity } from 'react-native';
import { useTheme } from 'context/ThemeContext';
import { ListInfo } from '../services/listServices';
import { router } from 'expo-router';
import { useState } from 'react';
import { useNotification } from 'context/NotificationContext';
import { PlusIcon, EditIcon, TrashIcon, MaterialCommunityIcons } from 'components/Icons';
import { AppText } from 'components/AppText';
import { useTranslation } from 'react-i18next';
interface ListItemProps {
  list: ListInfo;
  onDelete: (listId: string) => void;
}

export const ListItem = ({ list, onDelete }: ListItemProps) => {
  const { showNotification, hideNotification } = useNotification();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [menuListasAbierto, setMenuListasAbierto] = useState(false);
  const handleDelete = () => {
    if (list) {
      showNotification({
        title: t('list.deleteListNotification.title'),
        description: t('list.deleteListNotification.description'),
        leftButtonText: t('common.cancel'),
        rightButtonText: t('common.confirm'),
        isChoice: true,
        delete: true,
        success: false,
        onLeftPress: () => hideNotification(),
        onRightPress: async () => {
          hideNotification();
          await onDelete(list.id);
          setMenuListasAbierto(false);
          showNotification({
            title: t('list.deleteListNotification.confirmationTitle'),
            description: t('list.deleteListNotification.confirmationDescription', {
              listName: list.nombre,
            }),
            isChoice: false,
            delete: false,
            success: true,
          });
        },
      });
    }
  };

  const handleEdit = () => {
    if (list) {
      router.push({
        pathname: '/form/list',
        params: { listData: JSON.stringify(list) },
      });
    }
  };

  const handleAdd = () => {
    if (list) {
      router.push({
        pathname: '/form/item',
        params: { listId: list.id, category: list.tipo, listName: list.nombre },
      });
    }
  };

  return (
    <TouchableOpacity
      key={list.id}
      className="mb-4 rounded-2xl p-4 shadow-sm"
      onPress={() =>
        router.push({ pathname: '/details/list', params: { listData: JSON.stringify(list) } })
      }
      style={{
        backgroundColor: colors.surfaceButton,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3.84,
        elevation: 5,
      }}>
      {/* Cabecera de la tarjeta */}
      <View className="mb-4 flex-row items-start">
        {/* Icono de la lista */}
        <View
          className="mr-3 h-12 w-12 items-center justify-center rounded-full"
          style={{ backgroundColor: list.color || colors.placeholderText }}>
          <MaterialCommunityIcons name={list.icono as any} size={24} color={colors.primaryText} />
        </View>

        {/* Título y contador */}
        <View className="flex-1">
          <AppText
            className=" font-bold leading-tight"
            style={{ color: colors.primaryText, fontSize: 14 }}
            numberOfLines={1}>
            {list.nombre}
          </AppText>
          <AppText style={{ color: colors.secondaryText, fontSize: 12 }}>
            {list.totalElementos} {t('list.elements')}
          </AppText>
        </View>

        {/* Botón de menú (3 puntos) */}
        <TouchableOpacity
          className="p-1"
          onPress={(e) => {
            e.stopPropagation(); // Evita que pase a la tarjeta y abra los detalles
            setMenuListasAbierto(!menuListasAbierto);
          }}>
          <MaterialCommunityIcons
            name={menuListasAbierto ? 'close' : 'dots-horizontal'}
            size={24}
            color={colors.secondaryText}
          />
        </TouchableOpacity>
      </View>

      {/* Desplegable de listas */}
      {menuListasAbierto && (
        <View
          className="w-30 absolute right-4 top-14 z-50 overflow-hidden rounded-lg border-l-2 shadow-xl"
          style={{ borderColor: colors.borderButton, backgroundColor: colors.surfaceButton }}>
          <TouchableOpacity
            className="flex-row items-center border-b px-4 py-2"
            style={{ borderColor: `${colors.secondaryText}4D` }}
            onPress={() => {
              handleEdit();
              setMenuListasAbierto(false);
            }}>
            <EditIcon style={{ marginRight: 8 }} color={colors.primaryText} />
            <AppText style={{ color: colors.primaryText, fontSize: 14 }}>
              {t('list.editList')}
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center border-b px-4 py-2"
            style={{ borderColor: `${colors.secondaryText}4D` }}
            onPress={() => {
              setMenuListasAbierto(false);
              handleAdd();
            }}>
            <PlusIcon style={{ marginRight: 8 }} color={colors.primaryText} />
            <AppText style={{ color: colors.primaryText, fontSize: 14 }}>
              {t('list.addToList')}
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center px-4 py-2"
            style={{ borderColor: `${colors.secondaryText}4D` }}
            onPress={() => {
              setMenuListasAbierto(false);
              handleDelete();
            }}>
            <TrashIcon style={{ marginRight: 8 }} color={colors.error} />
            <AppText style={{ color: colors.error, fontSize: 14 }}>
              {t('list.deleteList')}
            </AppText>
          </TouchableOpacity>
        </View>
      )}

      {/* Fila de imágenes (Thumbnails) */}
      <View className="flex-row gap-2">
        {/* Mostramos hasta 4 imágenes */}
        {list.previewImagenes.slice(0, 4).map((imgUrl: any, index: any) => (
          <Image
            key={index}
            source={{ uri: imgUrl }}
            className="aspect-[2/3] w-[18%] rounded-lg bg-gray-300"
            resizeMode="cover"
          />
        ))}

        {/* Si hay más de 4 imágenes, mostramos el indicador de "+X" */}
        {list.totalElementos > 4 && (
          <View
            className="aspect-[2/3] w-[18%] items-center justify-center rounded-lg"
            style={{ backgroundColor: `${colors.placeholderText}20` }}>
            <AppText className="font-bold" style={{ color: colors.secondaryText, fontSize: 12 }}>
              +{list.totalElementos - 4}
            </AppText>
          </View>
        )}

        {/* Relleno visual si hay pocas imágenes para mantener el espaciado (opcional) */}
        {list.previewImagenes.length < 4 &&
          Array.from({ length: 4 - list.previewImagenes.length }).map((_, i) => (
            <View
              key={`empty-${i}`}
              className="aspect-[2/3] w-[18%] rounded-lg border border-dashed"
              style={{ borderColor: colors.borderButton }}
            />
          ))}
      </View>
    </TouchableOpacity>
  );
};
