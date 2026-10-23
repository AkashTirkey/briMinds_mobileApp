import { StyleSheet, Platform } from 'react-native';
import { colors } from './global';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#f7f9fc',
  },
  // Scrollable top section (header + stats)
  scrollSection: {
    flexShrink: 0,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: colors.textLight,
    fontWeight: '500',
    fontSize: 20,
  },
  greeting: {
    fontFamily: Platform.select({ ios: 'Georgia', android: 'sans-serif' }),
    fontSize: 16,
    color: colors.textMuted,
    marginBottom: 2,
  },
  name: {
    fontFamily: "Fraunces_72pt-Regular",
    fontSize: 24,
    // fontWeight: 'bold',
    color: colors.textDark,
  },
  meta: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 6,
  },
  track: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: 32,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.textLight,
    paddingVertical: 20,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 10,
    color: colors.textSubtle,
  },
  // ── WebView ──
  webviewContainer: {
    // paddingTop: 40,
    flex: 1,               // takes all remaining space below the stats
    // borderTopWidth: 1,
    // borderTopColor: '#efefef',
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
  },
  webviewLoader: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.warmLightBg,
    zIndex: 10,
  },
});
