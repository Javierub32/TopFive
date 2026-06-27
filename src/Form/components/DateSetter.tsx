import DateTimePicker from '@react-native-community/datetimepicker';
import { CalendarEndIcon, CalendarIcon, CalendarStartIcon } from 'components/Icons';
import { useTheme } from 'context/ThemeContext';
import { useState } from 'react';
import { Modal, Platform, TouchableOpacity, View } from 'react-native';
import { AppText } from 'components/AppText';
import { useTranslation } from 'react-i18next';
interface Props {
  startDate: Date | null;
  setStartDate: any;
  endDate?: Date | null;
  setEndDate?: any;
  isRange: boolean;
  style?: string;
}

const PlatformDatePicker = ({
  show,
  setShow,
  date,
  setDate,
}: {
  show: boolean;
  setShow: any;
  date: Date | null;
  setDate: any;
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  if (!show) return null;

  if (Platform.OS === 'android') {
    return (
      <DateTimePicker
        value={date || new Date()}
        mode="date"
        display="spinner"
        maximumDate={new Date()}
        onChange={(event: any, selectedDate?: Date) => {
          setShow(false);
          if (event.type === 'set' && selectedDate) {
            setDate(selectedDate);
          }
        }}
      />
    );
  }

  return (
    <Modal visible={show} transparent={true} animationType="fade">
      <TouchableOpacity
        className="flex-1 justify-end"
        style={{ backgroundColor: `${colors.background}80` }}
        activeOpacity={1}
        onPress={() => setShow(false)}>
        <TouchableOpacity
          activeOpacity={1}
          className="flex-col rounded-t-3xl pb-8 pt-4 shadow-lg"
          style={{ backgroundColor: colors.background }}>
          <View className="mb-2 flex-row justify-end px-6">
            <TouchableOpacity
              onPress={() => {
                if (!date) {
                  setDate(new Date());
                }
                setShow(false);
              }}>
              <AppText className="font-bold" style={{ color: colors.primary, fontSize: 16 }}>
                {t('forms.ready')}
              </AppText>
            </TouchableOpacity>
          </View>
          <View className="items-center">
            <DateTimePicker
              value={date || new Date()}
              mode="date"
              display="spinner"
              maximumDate={new Date()}
              onChange={(_event: any, selectedDate?: Date) => {
                if (selectedDate) {
                  setDate(selectedDate);
                }
              }}
              textColor={colors.primaryText}
            />
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export const DateSetter = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  isRange,
  style,
}: Props) => {
  const { colors } = useTheme();
  const { t, i18n } = useTranslation();

  const [showDatePickerInicio, setShowDatePickerInicio] = useState(false);
  const [showDatePickerFin, setShowDatePickerFin] = useState(false);

  if (!isRange) {
    return (
      <View className={`${style}`}>
        <TouchableOpacity
          className="flex justify-between gap-2 rounded-2xl p-2"
          style={{ backgroundColor: `${colors.primary}1A` }}
          onPress={() => setShowDatePickerInicio(true)}>
          <View className="flex-row items-center gap-2 p-1">
            <CalendarIcon />
            <AppText
              className="font-bold uppercase tracking-widest"
              style={{ color: colors.markerText, fontSize: 14 }}>
              {t('forms.lastTime')}
            </AppText>
          </View>
          <View className="flex-row justify-center">
            <AppText className="p-3 font-bold" style={{ color: colors.primaryText, fontSize: 14 }}>
              {startDate
                ? startDate.toLocaleDateString(i18n.language, {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })
                : t('forms.noDate')}
            </AppText>
          </View>
        </TouchableOpacity>
        {startDate && (
          <TouchableOpacity onPress={() => setStartDate(null)} className="mt-1 items-center">
            <AppText className="text-xs" style={{ color: colors.error, fontSize: 14 }}>
              {t('forms.clearDate')}
            </AppText>
          </TouchableOpacity>
        )}

        <PlatformDatePicker
          show={showDatePickerInicio}
          setShow={setShowDatePickerInicio}
          date={startDate}
          setDate={setStartDate}
        />
      </View>
    );
  }

  return (
    <View className={`flex-row gap-2 px-4 pt-2 ${style}`}>
      <View className="flex-1">
        <TouchableOpacity
          className="flex justify-between gap-2 rounded-2xl p-4"
          style={{ backgroundColor: `${colors.primary}1A` }}
          onPress={() => setShowDatePickerInicio(true)}>
          <View className="flex-row items-center gap-2">
            <CalendarStartIcon />
            <AppText
              className="text-sm font-bold uppercase tracking-widest"
              style={{ color: colors.markerText, fontSize: 14 }}>
              {t('forms.startingDate')}
            </AppText>
          </View>
          <View className="flex-row justify-center">
            <AppText className="font-bold text-primaryText" style={{ fontSize: 14 }}>
              {startDate
                ? startDate.toLocaleDateString(i18n.language, {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })
                : t('forms.noDate')}
            </AppText>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setStartDate(null)}
          disabled={!startDate}
          className="mt-1 items-center">
          <AppText
            style={startDate ? { color: colors.error, fontSize: 14} : { color: colors.background, fontSize: 14 }}>
            {t('forms.clearDate')}
          </AppText>
        </TouchableOpacity>
      </View>

      <View className="flex-1">
        <TouchableOpacity
          className="flex justify-between gap-2 rounded-2xl p-4"
          style={{ backgroundColor: `${colors.primary}1A` }}
          onPress={() => setShowDatePickerFin(true)}>
          <View className="flex-row items-center gap-2">
            <CalendarEndIcon />
            <AppText
              className="font-bold uppercase tracking-widest"
              style={{ color: colors.markerText, fontSize: 14 }}>
              Fecha Fin
            </AppText>
          </View>
          <View className="flex-row justify-center">
            <AppText className="font-bold text-primaryText" style={{ fontSize: 14 }}>
              {endDate
                ? endDate.toLocaleDateString(i18n.language, {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })
                : t('forms.noDate')}
            </AppText>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setEndDate(null)}
          disabled={!endDate}
          className="mt-1 items-center">
          <AppText
            className="text-xs"
            style={endDate ? { color: colors.error, fontSize: 14 } : { color: colors.background, fontSize: 14 }}>
            {t('forms.clearDate')}
          </AppText>
        </TouchableOpacity>
      </View>

      <PlatformDatePicker
        show={showDatePickerInicio}
        setShow={setShowDatePickerInicio}
        date={startDate}
        setDate={setStartDate}
      />

      <PlatformDatePicker
        show={showDatePickerFin}
        setShow={setShowDatePickerFin}
        date={endDate || null}
        setDate={setEndDate}
      />
    </View>
  );
};
