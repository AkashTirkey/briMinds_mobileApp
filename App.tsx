import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { AppNavigator } from './src/navigation/AppNavigator';

function App(): React.JSX.Element | null {
  const [fontsLoaded] = useFonts({
    'Fraunces_72pt-Regular': require('./src/assets/fonts/Fraunces_72pt-Regular.ttf'),
    'Fraunces_72pt-SemiBold': require('./src/assets/fonts/Fraunces_72pt-SemiBold.ttf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FAF9F6' }}>
        <ActivityIndicator size="large" color="#1D9E75" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
