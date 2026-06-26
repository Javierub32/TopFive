import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Alert, Platform } from 'react-native';
import { supabase } from './supabase';

// Comportamiento de la notificación cuando la app está en primer plano
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotificationsAsync(userId: string) {
  if (Platform.OS === 'web') return;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#5781b3',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status; 
    } 
    
    if (finalStatus !== 'granted') {
      console.log('Permiso denegado para notificaciones push');
      return;
    }
    const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
    
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({ projectId })
      ).data;
      
	  Alert.alert('Token de notificación obtenido:', pushTokenString);
      // Guardamos el token en la tabla usuario de Supabase
      if (pushTokenString && userId) {
        await supabase
          .from('usuario')
          .update({ push_token: pushTokenString })
          .eq('id', userId);
      }
    } catch (e: unknown) {
      console.log('Error obteniendo el push token:', e);
    }
  } else {
    console.log('Debes usar un dispositivo físico para las notificaciones Push');
  }
}