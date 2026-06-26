import { RenderCollection } from '@/Collection/components/RenderCollection';
import { CollectionStructure } from 'components/CollectionStructure';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { useCollection } from 'context/CollectionContext';
import { ScrollView, View } from 'react-native';
import { useTranslation } from 'react-i18next';

export default function ResourceList() {
  const {
    busqueda,
    loading,
    pendientes,
    enCurso,
    completados,
    navigateToGrid,
    handleItemPress,
    categoriaActual,
    totalPendientes,
    totalEnCurso,
    totalCompletados,
    data,
    handleSearchPagination,
  } = useCollection();
  const hayBusqueda = busqueda.trim() !== '';
  const { t } = useTranslation();

  return loading && data.length === 0 ? (
    <LoadingIndicator />
  ) : hayBusqueda ? (
    <View className="mt-4 flex-1">
      <CollectionStructure
        data={data}
        categoriaActual={categoriaActual}
        handleItemPress={handleItemPress}
        handleSearchPagination={handleSearchPagination}
        showStatus={true}
        loading={loading}
      />
    </View>
  ) : (
    <ScrollView
      className="mt-4 flex-1"
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}>
      <RenderCollection
        title={t('status.inProgress')}
        data={enCurso}
        total={totalEnCurso}
        category={categoriaActual}
        onPressItem={handleItemPress}
        onPressTitle={() => navigateToGrid(t('status.inProgress'), 'enCurso', categoriaActual)}
      />
      <RenderCollection
        title={t('status.completed')}
        data={completados}
        total={totalCompletados}
        category={categoriaActual}
        onPressItem={handleItemPress}
        onPressTitle={() => navigateToGrid(t('status.completed'), 'completados', categoriaActual)}
      />
      <RenderCollection
        title={t('status.pending')}
        data={pendientes}
        total={totalPendientes}
        category={categoriaActual}
        onPressItem={handleItemPress}
        onPressTitle={() => navigateToGrid(t('status.pending'), 'pendientes', categoriaActual)}
      />
    </ScrollView>
  );
}
