import { StyleSheet } from 'react-native';
import { colors, globalStyles } from './global';

export const styles = StyleSheet.create({
  container: {
    ...globalStyles.lightContainer,
    // padding: 24,
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

   webviewContainer: {
    // paddingTop: 40,
    flex: 1,               // takes all remaining space below the stats
    // borderTopWidth: 1,
    // borderTopColor: '#efefef',
    overflow: 'hidden',
  },

  brandText: {
    fontWeight: '400', marginTop: 4, fontSize: 18, letterSpacing: 0.4, color: 'rgba(255,255,255,0.5)'
  },
  boldBrand: {
    fontWeight: '600', color: 'rgba(255,255,255,0.8)'
  },
  accountActions: {
  minHeight: 56,
  width: '100%',
  paddingHorizontal: 16,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-evenly',
  gap: 14,
  backgroundColor: '#FFFFFF',
  borderBottomWidth: 1,
  borderBottomColor: 'rgba(83, 74, 183, 0.08)',
  borderRadius: 16,
},

supportDesk: {
  flex: 1,
  minWidth: 0,
  paddingVertical: 8,
  paddingHorizontal: 10,
  borderRightWidth: 2,
  borderRightColor: 'rgba(83, 74, 183, 0.09)',
},

supportHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  gap: 12,
},

supportLeft: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: 10,
},

supportBtn: {
  color: '#1E1A50',
  fontWeight: '600',
  fontSize: 14,
},

supportArrow: {
  color: '#1E1A50',
  fontSize: 24,
  lineHeight: 26,
},

supportArrowOpen: {
  transform: [{ rotate: '90deg' }],
},

supportDropdown: {
  width: '100%',
  paddingVertical: 8,
  paddingHorizontal: 12,
  marginTop: 8,
  backgroundColor: '#F5F4FF',
  borderRadius: 10,
},

supportEmail: {
  color: '#534AB7',
  fontSize: 14,
  fontWeight: '600',
},

logoutsection: {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 10,
  paddingVertical: 8,
  paddingHorizontal: 10,
},

logoutIcon: {
  color: '#B23A1E',
  fontSize: 20,
},

logoutBtn: {
  color: '#B23A1E',
  fontWeight: '600',
  fontSize: 14,
},
});

