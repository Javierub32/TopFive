import { useTheme } from 'context/ThemeContext';
import { StateType } from 'hooks/useResource';
import { View, TouchableOpacity } from 'react-native';
import { AppText } from 'components/AppText';
import { useTranslation } from 'react-i18next';
interface Props {
  state: any;
  setState: any;
  inProgressLabel?: string;
}

export const StateSetter = ({ state, setState, inProgressLabel }: Props) => {
  const { colors } = useTheme();
  const options: StateType[] = ['PENDIENTE'];
  const { t } = useTranslation();

  if (inProgressLabel) {
    options.push('EN_CURSO');
  }

  options.push('COMPLETADO');

  const getLabel = (estado: StateType) => {
    switch (estado) {
      case 'PENDIENTE':
        return t('status.pending');
      case 'COMPLETADO':
        return t('status.completed');
      case 'EN_CURSO':
        return inProgressLabel;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDIENTE':
        return colors.warning;
      case 'EN_CURSO':
        return colors.accent;
      case 'COMPLETADO':
        return colors.success;
      default:
        return colors.surfaceButton;
    }
  };

  return (
    <View className="flex-row rounded-lg px-4 pt-2">
      {options.map((est) => {
        const isSelected = state === est;
        return (
          <TouchableOpacity
            key={est}
            onPress={() => setState(est)}
            className={`flex-1 py-3 ${est === options[0] ? 'rounded-l-lg' : ''} ${est === options[options.length - 1] ? 'rounded-r-lg' : ''}`}
            style={
              isSelected
                ? { backgroundColor: `${getStatusColor(est)}1A` }
                : { backgroundColor: colors.surfaceButton }
            }
            activeOpacity={0.7}>
            <AppText
              className="text-center text-sm font-semibold"
              style={isSelected ? { color: getStatusColor(est) } : { color: colors.secondaryText }}>
              {getLabel(est)}
            </AppText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
