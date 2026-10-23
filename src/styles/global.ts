import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#1D9E75',      // Teal
  secondary: '#534AB7',    // Purple
  darkBg: '#15123D',       // Dark purple (Splash)
  lightBg: '#FAF9F6',      // Off-white (Login, Olympiad, Profile)
  warmLightBg: '#F9F8F4',  // Slightly warm off-white (Home)
  textDark: '#1A1A2E',
  textLight: '#FFFFFF',
  textMuted: '#666666',
  textSubtle: '#999999',
  border: '#E8E8E8',
};

export const globalStyles = StyleSheet.create({
  flexContainer: {
    flex: 1,
  },
  lightContainer: {
    flex: 1,
    backgroundColor: colors.lightBg,
  },
  darkContainer: {
    flex: 1,
    backgroundColor: colors.darkBg,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
