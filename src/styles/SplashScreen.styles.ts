import { StyleSheet } from 'react-native';
import { colors } from './global';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkBg,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 60,
  },
  bgContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  logoContainer: {
    width: 132,
    height: 132,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  textLogoContainer: {
    marginBottom: 16,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  line: {
    width: 22,
    height: 1,
    backgroundColor: 'rgba(93,202,165,0.7)',
    marginHorizontal: 10,
  },
  subtitle: {
    fontSize: 10.5,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.72)',
    letterSpacing: 2.2,
    textTransform: 'uppercase',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 20,
    zIndex: 10,
  },
  progressBarBg: {
    width: 148,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.12)',
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressBarFill: {
    width: '60%',
    height: '100%',
    backgroundColor: colors.primary,
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 13,
    marginBottom: 18,
  },
  brandText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 11,
    letterSpacing: 0.4,
  },
});
