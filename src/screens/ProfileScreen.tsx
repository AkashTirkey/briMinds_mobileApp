import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { styles } from '../styles/ProfileScreen.styles';
import { useAuthStore } from '../store/authStore';

export const ProfileScreen = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuthStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out of your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoggingOut(true);
              await logout();

              // Reset navigation history so the user cannot navigate back
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'Login' }],
                })
              );
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Failed to log out. Please try again.');
            } finally {
              setIsLoggingOut(false);
            }
          },
        },
      ]
    );
  };

  const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(' ') || 'User';
  const initials = `${user?.first_name?.[0] || 'U'}${user?.last_name?.[0] || ''}`.toUpperCase();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My profile</Text>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.name}>{fullName}</Text>
        <Text style={styles.role}>{user?.mobile || user?.email || 'Student account'}</Text>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Grade</Text>
          <Text style={styles.detailValue}>Grade {user?.grade ?? '-'}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Section</Text>
          <Text style={styles.detailValue}>{user?.section ?? '-'}</Text>
        </View>
      </View>

      {/* Logout Action Button */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
        disabled={isLoggingOut}
        activeOpacity={0.8}
      >
        {isLoggingOut ? (
          <ActivityIndicator color="#E53935" />
        ) : (
          <Text style={styles.logoutButtonText}>Log Out</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};