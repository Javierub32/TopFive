import { View, TouchableOpacity, BackHandler, useWindowDimensions } from 'react-native';
import { router, useFocusEffect, useNavigation } from 'expo-router';
import { TabView } from 'react-native-tab-view';
import { Screen } from 'components/Screen';
import { useTheme } from 'context/ThemeContext';
import SiguiendoFeed from '@/Home/components/SiguiendoFeed';
import ForYouFeed from '@/Home/components/ForYouFeed';
import { SearchIcon2 } from 'components/Icons';
import { NotificationButton } from '@/Notifications/components/NotificationButton';
import { useCallback, useRef, useState } from 'react';
import { useNotification } from 'context/NotificationContext';
import { AppText } from 'components/AppText';
import Animated from 'react-native-reanimated';
import { useCollapsibleHeader } from 'hooks/useCollapsibleHeader';
import { useTranslation } from 'react-i18next';

export default function HomeScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const layout = useWindowDimensions();
  const navigation = useNavigation();
  const lastBackPress = useRef(0);
  const { showNotification } = useNotification();

  const [headerHeight, setHeaderHeight] = useState(80);
  const { scrollHandler, headerStyle, headerOpacityStyle, translateY } = useCollapsibleHeader(headerHeight);

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'siguiendo', title: 'Siguiendo' },
    { key: 'paraTi', title: 'Para ti' },
  ]);

  useFocusEffect(
    useCallback(() => {
      const action = BackHandler.addEventListener('hardwareBackPress', () => {
        if (Date.now() - lastBackPress.current <= 2000) {
          BackHandler.exitApp();
        } else {
          lastBackPress.current = Date.now();
          showNotification({
            title: t('common.attention'),
            description: t('home.pressAgainToExit'),
            isChoice: false,
            delete: false,
            success: false,
          });
        }
        return true;
      });
      const unsuscribe = navigation.addListener('beforeRemove', (e) => {
        if (e.data.action.type === 'GO_BACK') {
          e.preventDefault();
        }
      });

      return () => {
        action.remove();
        unsuscribe();
      };
    }, [navigation, showNotification, t])
  );

  const renderScene = ({ route }: { route: { key: string } }) => {
    switch (route.key) {
      case 'paraTi':
        return <ForYouFeed headerHeight={headerHeight} scrollHandler={scrollHandler} isActive={index === 0} translateY={translateY}/>;
      case 'siguiendo':
        return <SiguiendoFeed headerHeight={headerHeight} scrollHandler={scrollHandler} isActive={index === 1} translateY={translateY}/>;
      default:
        return null;
    }
  };

  return (
    <Screen>
      <Animated.View
        onLayout={(event) => {
          const { height } = event.nativeEvent.layout;
          if (Math.abs(headerHeight - height) > 1) {
            setHeaderHeight(height);
          }
        }}
        style={[
          headerStyle,
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            backgroundColor: colors.background,
          },
        ]}>
        <Animated.View style={headerOpacityStyle} className="px-4 pt-6">
          <View className="mb-4 flex-row items-center justify-between">
            <AppText className=" font-bold" style={{ color: colors.primaryText, fontSize: 28 }}>
              {t('tabs.home')}
            </AppText>
            <View className="flex-row gap-x-2">
              <NotificationButton from="Home" />
              <TouchableOpacity onPress={() => router.push('/search')} className="rounded-full p-3">
                <SearchIcon2 size={22} color={colors.primaryText} />
              </TouchableOpacity>
            </View>
          </View>

        {/* Pestañas Parati y Siguiendo */}
        <View className="flex-row justify-center px-2 pb-3">
          {routes.map((route, i) => (
            <TouchableOpacity
              key={route.key}
              onPress={() => setIndex(i)}
              className="mx-4 items-center"
              activeOpacity={0.7}>
              <AppText
                className="font-bold"
                style={{
                  fontSize: 16,
                  color: index === i ? colors.primaryText : colors.placeholderText,
                }}>
                {route.title}
              </AppText>
              {index === i && (
                <View
                  style={{
                    marginTop: 4,
                    height: 2,
                    width: 24,
                    borderRadius: 2,
                    backgroundColor: colors.primaryText,
                  }}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>
        </Animated.View>
      </Animated.View>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={() => null}
        initialLayout={{ width: layout.width }}
        swipeEnabled
        lazy
      />
    </Screen>
  );
}