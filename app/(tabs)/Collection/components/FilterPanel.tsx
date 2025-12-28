import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SortType, StatusType } from '../hooks/useCollection';

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
  setSoloFavoritos
}: Props) => {
  return (
    <View className="mb-4 rounded-xl border border-slate-700 bg-slate-800/80 p-4">
      {/* Sección Orden */}
      <View className="mb-4">
        <Text className="text-gray-400 text-xs font-bold uppercase mb-2">Ordenar por</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
          {[
            { id: 'FECHA_DESC', label: 'Más recientes' },
            { id: 'FECHA_ASC', label: 'Más antiguos' },
          ].map((opt) => (
            <TouchableOpacity
              key={opt.id}
              onPress={() => setOrden(opt.id as SortType)}
              className={`mr-2 rounded-full border px-3 py-1.5 ${orden === opt.id ? 'bg-purple-600 border-purple-600' : 'border-slate-600 bg-transparent'}`}
            >
              <Text className={`text-xs ${orden === opt.id ? 'text-white font-bold' : 'text-gray-400'}`}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Sección Estado */}
      <View className="mb-4">
        <Text className="text-gray-400 text-xs font-bold uppercase mb-2">Estado</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
          {[
            { id: 'TODOS', label: 'Todos' },
            { id: 'PENDIENTE', label: 'Pendiente' },
            { id: 'EN_CURSO', label: 'En curso' },
            { id: 'COMPLETADO', label: 'Completado' },
          ].map((opt) => (
            <TouchableOpacity
              key={opt.id}
              onPress={() => setFiltroEstado(opt.id as StatusType)}
              className={`mr-2 rounded-full border px-3 py-1.5 ${filtroEstado === opt.id ? 'bg-slate-200 border-white' : 'border-slate-600 bg-transparent'}`}
            >
              <Text className={`text-xs ${filtroEstado === opt.id ? 'text-slate-900 font-bold' : 'text-gray-400'}`}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Switch Favoritos */}
      <View className="flex-row items-center justify-between pt-2 border-t border-slate-700">
        <Text className="text-gray-300 text-sm">Solo Favoritos</Text>
        <TouchableOpacity 
          onPress={() => setSoloFavoritos(!soloFavoritos)}
          activeOpacity={0.8}
          className={`w-12 h-7 rounded-full justify-center px-1 ${soloFavoritos ? 'bg-purple-600' : 'bg-slate-600'}`}
        >
          <View 
            className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${soloFavoritos ? 'translate-x-5' : 'translate-x-0'}`} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};