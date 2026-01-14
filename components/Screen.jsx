import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function Screen({ children }) {
  // Usamos 'bg-background' que definimos en tailwind.config.js
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-1 px-[5px]"> 
        {children}
      </View>
    </SafeAreaView>
  );
}
