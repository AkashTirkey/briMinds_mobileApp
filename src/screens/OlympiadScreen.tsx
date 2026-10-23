import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles/OlympiadScreen.styles';

export const OlympiadScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Coming{"\n"}soon.</Text>
      <Text style={styles.subtitle}>
        The BriMinds AI Olympiad is on its way. Stay tuned!
      </Text>
    </View>
  );
};

