import { StyleSheet } from 'react-native';
import { colors, globalStyles } from './global';

export const styles = StyleSheet.create({
  container: {
    ...globalStyles.lightContainer,
    padding: 24,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 32,
  },
  profileCard: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#C9973A', // Keeping original specific color
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.textLight,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 4,
  },
  role: {
    fontSize: 14,
    color: colors.textMuted,
  },
  detailsContainer: {
    backgroundColor: colors.textLight,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
  },
  detailLabel: {
    fontSize: 16,
    color: colors.textMuted,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
  },
  logoutButton: {
    marginTop: 'auto',
    marginBottom: 20,
    backgroundColor: '#FEE2E2',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  logoutButtonText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '600',
  },
});

