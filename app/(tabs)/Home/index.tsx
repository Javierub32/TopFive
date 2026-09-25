import { View, TouchableOpacity, BackHandler } from 'react-native';
import { router, useFocusEffect, useNavigation } from 'expo-router';
import { Screen } from 'components/Screen';
import { useTheme } from 'context/ThemeContext';
import SiguiendoFeed from '@/Home/components/SiguiendoFeed';
import ForYouFeed from '@/Home/components/ForYouFeed';
import { SearchIcon2 } from 'components/Icons';
import { NotificationButton } from '@/Notifications/components/NotificationButton';
import { useCallback, useRef, useState } from 'react';
import { useNotification } from 'context/NotificationContext';
import { AppText } from 'components/AppText';
import { useTranslation } from 'react-i18next';
import { Tabs, useHeaderMeasurements } from 'react-native-collapsible-tab-view';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';

const HEADER_HEIGHT = 70;
const TAB_BAR_HEIGHT = 44;

function CollapsibleHeader() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { top } = useHeaderMeasurements();

  const animatedHeaderStyle = useAnimatedStyle(() => {
    const currentTop = top?.value ?? 0;
    // he puesto la opacidad sincronizada con el TabBar
    const opacity = interpolate(
      currentTop,
      [-HEADER_HEIGHT, 0],
      [0, 1],
      Extrapolation.CLAMP
    );

    return { opacity };
  });

  return (
    <Animated.View
      style={[
        { backgroundColor: colors.background, height: HEADER_HEIGHT },
        animatedHeaderStyle,
      ]}
      className="px-4 pt-4"
    >
      <View className="flex-row items-center justify-between">
        <AppText className="font-bold" style={{ color: colors.primaryText, fontSize: 28 }}>
          {t('tabs.home')}
        </AppText>
        <View className="flex-row gap-x-4">
          <NotificationButton from="Home" />
          <TouchableOpacity onPress={() => router.push('/search')} className="rounded-full p-3">
            <SearchIcon2 size={22} color={colors.primaryText} />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

function CollapsibleTabBar({
  props,
  routes,
  index,
  setIndex,
  colors,
}: {
  props: any;
  routes: { key: string; title: string }[];
  index: number;
  setIndex: (i: number) => void;
  colors: any;
}) {
  const { top } = useHeaderMeasurements();
  const { indexDecimal } = props;

  // la raya del swipe
  const indicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: (indexDecimal?.value ?? 0) * 110 }],
    };
  }, [indexDecimal]);

  // curva y rango exacto de la cabecera superior
  const animatedTabBarStyle = useAnimatedStyle(() => {
    const currentTop = top?.value ?? 0;

    const opacity = interpolate(
      currentTop,
      [-HEADER_HEIGHT, 0],
      [0, 1],
      Extrapolation.CLAMP
    );

    return {
      opacity,
    };
  });

  return (
    <Animated.View
      style={[
        {
          backgroundColor: colors.background,
          height: TAB_BAR_HEIGHT-7,
        },
        animatedTabBarStyle,
      ]}
      className="flex-row justify-center px-2 pb-5"
    >
      <View className="relative flex-row">
        {routes.map((route, i) => (
          <TouchableOpacity
            key={route.key}
            onPress={() => {
              setIndex(i);
              props.onTabPress(route.key);
            }}
            style={{ width: 110 }}
            className="items-center"
            activeOpacity={0.7}
          >
            <AppText
              className="font-bold"
              style={{
                fontSize: 16,
                color: index === i ? colors.primaryText : colors.placeholderText,
              }}
            >
              {route.title}
            </AppText>
          </TouchableOpacity>
        ))}

        <Animated.View
          style={[
            {
              position: 'absolute',
              bottom: -6,
              left: 43,
              height: 2,
              width: 24,
              borderRadius: 2,
              backgroundColor: colors.primaryText,
            },
            indicatorStyle,
          ]}
        />
      </View>
    </Animated.View>
  );
}

export default function HomeScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const lastBackPress = useRef(0);
  const { showNotification } = useNotification();
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

  return (
    <Screen>
      <Tabs.Container
        renderHeader={() => <CollapsibleHeader />}
        renderTabBar={(props) => (
          <CollapsibleTabBar
            props={props}
            routes={routes}
            index={index}
            setIndex={setIndex}
            colors={colors}
          />
        )}
        onIndexChange={setIndex}
        headerContainerStyle={{
          elevation: 0,
          shadowOpacity: 0,
          backgroundColor: 'transparent',
        }}
        headerHeight={HEADER_HEIGHT}
        minHeaderHeight={0}
        revealHeaderOnScroll={true}
      >
        <Tabs.Tab name="siguiendo">
          <SiguiendoFeed />
        </Tabs.Tab>
        <Tabs.Tab name="paraTi">
          <ForYouFeed />
        </Tabs.Tab>
      </Tabs.Container>
    </Screen>
  );
}