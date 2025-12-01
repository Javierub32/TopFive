import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function Screen({ children }) {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View className="flex-1">
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#18122B',
	paddingHorizontal: 5,
  },
});
