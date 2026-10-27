import { StyleSheet } from 'react-native';
import { colors, globalStyles } from './global';

export const styles = StyleSheet.create({
  container: {
    ...globalStyles.lightContainer,
    justifyContent: 'center',
    // padding: 24,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: colors.textMuted,
    lineHeight: 28,
  },
   webviewContainer: {
    // paddingTop: 40,
    flex: 1,               // takes all remaining space below the stats
    // borderTopWidth: 1,
    // borderTopColor: '#efefef',
    overflow: 'hidden',
  },
});
