import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Svg, { Path } from 'react-native-svg';
import { HomeScreen } from '../screens/HomeScreen';
import { OlympiadScreen } from '../screens/OlympiadScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const TabIcon = ({ name, color }: { name: string; color: string }) => {
  if (name === 'Home') {
    return (
      <Svg
     width={22}
     height={22}
     viewBox="0 0 24 24"
     fill="none"
   >
<Path
       d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"
       stroke={color}
       strokeWidth={1.9}
       strokeLinecap="round"
       strokeLinejoin="round"
     />
</Svg>
    );
  }
  if (name === 'Olympiad') {
    return (
      <Svg
      width={22}
      height={22}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
      <Path d="M12 15v4M8 22h8M6 5H3.5a2.5 2.5 0 0 0 2.5 4M18 5h2.5a2.5 2.5 0 0 1-2.5 4" />
    </Svg>
    );
  }
  if (name === 'Profile') {
    return (
        <Svg
      width={22}
      height={22}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M20 21a8 8 0 0 0-16 0" />
      <Path d="M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10z" />
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
        tabBarActiveTintColor: '#534AB7',
        tabBarInactiveTintColor: '#B0B0B0',
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '600',
          marginTop: -4,
          marginBottom: 8,
        },
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F0F0F0',
          elevation: 0,
          shadowOpacity: 0,
          height: 65,
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
