import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Svg, { Rect } from 'react-native-svg';
import { HomeScreen } from '../screens/HomeScreen';
import { OlympiadScreen } from '../screens/OlympiadScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const TabIcon = ({ name, color }: { name: string; color: string }) => {
  if (name === 'Home') {
    return (
      <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <Rect x="4" y="4" width="16" height="16" rx="2" stroke={color} strokeWidth="2" />
      </Svg>
    );
  }
  if (name === 'Olympiad') {
    return (
      <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <Rect x="6" y="4" width="12" height="16" rx="2" stroke={color} strokeWidth="2" />
      </Svg>
    );
  }
  if (name === 'Profile') {
    return (
      <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <Rect x="5" y="5" width="14" height="14" rx="7" stroke={color} strokeWidth="2" />
      </Svg>
    );
  }
  return null;
};

const renderHomeIcon = ({ color }: { color: string }) => <TabIcon name="Home" color={color} />;
const renderOlympiadIcon = ({ color }: { color: string }) => <TabIcon name="Olympiad" color={color} />;
const renderProfileIcon = ({ color }: { color: string }) => <TabIcon name="Profile" color={color} />;

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1D9E75',
        tabBarInactiveTintColor: '#B0B0B0',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: -4,
          marginBottom: 8,
        },
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F0F0F0',
          elevation: 0,
          shadowOpacity: 0,
          height: 60,
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ tabBarLabel: 'Home', tabBarIcon: renderHomeIcon }} 
      />
      <Tab.Screen 
        name="Olympiad" 
        component={OlympiadScreen} 
        options={{ tabBarLabel: 'Olympiad', tabBarIcon: renderOlympiadIcon }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ tabBarLabel: 'Profile', tabBarIcon: renderProfileIcon }} 
      />
    </Tab.Navigator>
  );
};
