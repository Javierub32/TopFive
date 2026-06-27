import { View, ScrollView, TouchableOpacity } from 'react-native';
import { AppText } from 'components/AppText';
import { useTranslation } from 'react-i18next';
type SortType = 'FECHA_DESC' | 'FECHA_ASC';
type StatusType = 'TODOS' | 'PENDIENTE' | 'EN_CURSO' | 'COMPLETADO';

interface Props {
  orden: SortType;
  setOrden: (val: SortType) => void;
  filtroEstado: StatusType;
  setFiltroEstado: (val: StatusType) => void;
  soloFavoritos: boolean;
  setSoloFavoritos: (val: boolean) => void;
}

export const FilterPanel = ({
  orden,
  setOrden,
  filtroEstado,
  setFiltroEstado,
  soloFavoritos,
  setSoloFavoritos,
}: Props) => {
  const { t } = useTranslation();
  return (
    <View className="bg-surfaceButton/80 mb-4 rounded-xl border border-borderButton p-4">
      {/* Sección Orden */}
      <View className="mb-4">
        <AppText className="mb-2 font-bold uppercase text-secondaryText" style={{ fontSize: 12 }}>
          {t('collection.orderBy')}
        </AppText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
          {[
            { id: 'FECHA_DESC', label: t('collection.recentsFirst') },
            { id: 'FECHA_ASC', label: t('collection.oldestFirst') },
          ].map((opt) => (
            <TouchableOpacity
              key={opt.id}
              onPress={() => setOrden(opt.id as SortType)}
              className={`mr-2 rounded-full border px-3 py-1.5 ${orden === opt.id ? 'border-primary bg-primary' : 'border-borderButton bg-transparent'}`}>
              <AppText
                className={` ${orden === opt.id ? 'font-bold text-primaryText' : 'text-secondaryText'}`} style={{ fontSize: 12 }}>
                {opt.label}
              </AppText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Sección Estado */}
      <View className="mb-4">
        <AppText className="mb-2 font-bold uppercase text-secondaryText" style={{ fontSize: 12 }}>
          {t('status.title')}
        </AppText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
          {[
            { id: 'TODOS', label: t('common.all') },
            { id: 'PENDIENTE', label: t('status.pending') },
            { id: 'EN_CURSO', label: t('status.inProgress') },
            { id: 'COMPLETADO', label: t('status.completed') },
          ].map((opt) => (
            <TouchableOpacity
              key={opt.id}
              onPress={() => setFiltroEstado(opt.id as StatusType)}
              className={`mr-2 rounded-full border px-3 py-1.5 ${filtroEstado === opt.id ? 'border-white bg-surfaceButton' : 'border-borderButton bg-transparent'}`}>
              <AppText
                className={` ${filtroEstado === opt.id ? 'font-bold text-background' : 'text-secondaryText'}`} style={{ fontSize: 12 }}>
                {opt.label}
              </AppText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Switch Favoritos */}
      <View className="flex-row items-center justify-between border-t border-borderButton pt-2">
        <AppText className="text-sm text-primaryText" style={{ fontSize: 14 }}>
          {t('collection.onlyFavorites')}
        </AppText>
        <TouchableOpacity
          onPress={() => setSoloFavoritos(!soloFavoritos)}
          activeOpacity={0.8}
          className={`h-7 w-12 justify-center rounded-full px-1 ${soloFavoritos ? 'bg-primary' : 'bg-borderButton'}`}>
          <View
            className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${soloFavoritos ? 'translate-x-5' : 'translate-x-0'}`}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
