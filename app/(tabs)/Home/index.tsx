import { View, TouchableOpacity, BackHandler, useWindowDimensions } from 'react-native';
import { router, useFocusEffect, useNavigation } from 'expo-router';
import { TabView } from 'react-native-tab-view';
import { Screen } from 'components/Screen';
import { useTheme } from 'context/ThemeContext';
import SiguiendoFeed from '@/Home/components/SiguiendoFeed';
import ParaTiFeed from '@/Home/components/ForYouFeed';
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
  const { scrollHandler, headerStyle, headerOpacityStyle } = useCollapsibleHeader(headerHeight);

  // índice 0 = Para ti (por defecto), 1 = Siguiendo
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'paraTi', title: t('home.forYou') },
    { key: 'siguiendo', title: t('home.following') },
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
        return <ParaTiFeed headerHeight={headerHeight} scrollHandler={scrollHandler} />;
      case 'siguiendo':
        return <SiguiendoFeed headerHeight={headerHeight} scrollHandler={scrollHandler} />;
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
        </Animated.View>

        {/* Pestañas Para ti / Siguiendo, estilo TikTok */}
        <View className="flex-row justify-center px-8 pb-3">
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
                    marginTop: 6,
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