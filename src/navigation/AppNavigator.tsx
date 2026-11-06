import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SplashScreen } from '../screens/SplashScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { TabNavigator } from './TabNavigator';
import { OlympiadTestScreen } from '../screens/OlympiadTestScreen';
import { OlympiadCompletionScreen } from "../screens/OlympiadCompletionScreen"

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
      <Stack.Screen
        name="OlympiadTest"
        component={OlympiadTestScreen}
        options={{
          animation: 'slide_from_bottom',
          gestureEnabled: false, // prevent accidental swipe-back mid-test
        }}
      />
      <Stack.Screen
        name="OlympiadCompletion"
        component={OlympiadCompletionScreen}
        options={{
          animation: 'slide_from_bottom',
          gestureEnabled: false, // prevent accidental swipe-back mid-test
        }}
      />
      
    </Stack.Navigator>
  );
};
