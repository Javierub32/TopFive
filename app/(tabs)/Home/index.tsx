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
import { Tabs } from 'react-native-collapsible-tab-view'; 
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

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

  const renderHeader = () => (
    <View style={{ backgroundColor: colors.background, height: 82}} className="px-4 pt-4">
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
    </View>
  );

const renderTabBar = (props: any) => {
    const { indexDecimal } = props;

    const indicatorStyle = useAnimatedStyle(() => {
      return {
        transform: [{ translateX: (indexDecimal?.value ?? 0) * 110 }],
      };
    }, [indexDecimal]);

    return (
      <View className="flex-row justify-center px-2 pb-4" >
        
        <View className="flex-row relative">
          
          {routes.map((route, i) => (
            <TouchableOpacity
              key={route.key}
              onPress={() => {
                setIndex(i); 
                props.onTabPress(route.key); 
              }}
              style={{ width: 110 }}
              className="items-center"
              activeOpacity={0.7}>
              <AppText
                className="font-bold"
                style={{
                  fontSize: 16,
                  color: index === i ? colors.primaryText : colors.placeholderText,
                }}>
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
      </View>
    );
  };
  return (
    <Screen>
      <Tabs.Container
        renderHeader={renderHeader}
        renderTabBar={renderTabBar} 
        onIndexChange={setIndex}   
        headerContainerStyle={{ elevation: 0, shadowOpacity: 0,backgroundColor: 'transparent' }}
        headerHeight={82}
        minHeaderHeight={0}
        revealHeaderOnScroll={false}
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