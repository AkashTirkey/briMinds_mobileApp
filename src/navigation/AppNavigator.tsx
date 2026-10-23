import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SplashScreen } from '../screens/SplashScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { TabNavigator } from './TabNavigator';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{ animation: 'fade', animationDuration: 350 }} 
      />
      <Stack.Screen name="MainTabs" component={TabNavigator} />
    </Stack.Navigator>
  );
};
