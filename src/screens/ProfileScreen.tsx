import React, { useState,useRef } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator,StatusBar } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import{ WebView , WebViewMessageEvent }from 'react-native-webview';
import { styles } from '../styles/ProfileScreen.styles';
import { useAuthStore } from '../store/authStore';

const PROFILE_URL = "http://192.168.1.111:3000/in/profile/";
// const PROFILE_URL = "http://uat.briminds.ai/in/profile/";

const TOP_BAR_COLOR = '#c7d5eb'; // Set to match your web dashboard header color


export const ProfileScreen = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuthStore();
  const webviewRef = useRef<React.ComponentRef<typeof WebView>>(null);
  const[profileLoading, setProfileLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const[isSupportOpen, setIsSupportOpen] = useState(false);


  // const handleLogout = () => {}
  //   Alert.alert(
  //     'Log Out',
  //     'Are you sure you want to log out of your account?',
  //     [
  //       { text: 'Cancel', style: 'cancel' },
  //       {
  //         text: 'Log Out',
  //         style: 'destructive',
  //         onPress: async () => {
  //           try {
  //             setIsLoggingOut(true);
  //             await logout();

  //             // Reset navigation history so the user cannot navigate back
  //             navigation.dispatch(
  //               CommonActions.reset({
  //                 index: 0,
  //                 routes: [{ name: 'Login' }],
  //               })
  //             );
  //           } catch (err: any) {
  //             Alert.alert('Error', err.message || 'Failed to log out. Please try again.');
  //           } finally {
  //             setIsLoggingOut(false);
  //           }
  //         },
  //       },
  //     ]
  //   );
  // };

  // const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(' ') || 'User';
  // const initials = `${user?.first_name?.[0] || 'U'}${user?.last_name?.[0] || ''}`.toUpperCase();
  
const handleWebViewMessage = (event: WebViewMessageEvent) => {
  let message;

  try {
    message = JSON.parse(event.nativeEvent.data);
  } catch (error) {
    console.log("Invalid WebView message:", error);
    return;
  }

  if (message.type !== "LOGOUT") return;

  Alert.alert(
    "Log Out",
    "Are you sure you want to log out of your account?",
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          if (isLoggingOut) return;

          setIsLoggingOut(true);

          try {
            await logout();

            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: "Login" }],
              })
            );
          } catch (error) {
            Alert.alert(
              "Error",
              error instanceof Error ? error.message :  "Failed to log out. Please try again."
            );
          } finally {
            setIsLoggingOut(false);
          }
        },
      },
    ]
  );
};


   const injectedJS = user
    ? `
      (function() {
        try {
          var userData = ${JSON.stringify(JSON.stringify(user))};
          localStorage.setItem('@User', userData);
        } catch(e) {}
      })();
      true;
    `
    : `true;`;

  return (
     <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: TOP_BAR_COLOR }]}>
          <StatusBar
            barStyle="dark-content"
            // backgroundColor={TOP_BAR_COLOR}
            // translucent={false}
          />
    <View style={styles.webviewContainer}>
      {/* <Text style={styles.header}>My profile</Text>

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
      </View> */}

      {/* Logout Action Button */}
      {/* <TouchableOpacity
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
      </TouchableOpacity> */}

      
      {profileLoading && (
        <View>
          <ActivityIndicator size="large" color="#534AB7"/>
        </View>
      )}

      <WebView
      ref={webviewRef}
      source={{uri: PROFILE_URL}}
      showsVerticalScrollIndicator={false}
      onMessage={handleWebViewMessage}
      injectedJavaScriptBeforeContentLoaded={injectedJS}
      onLoadStart={()=> setProfileLoading(true)}
      onLoadEnd={()=> setProfileLoading(false)}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      thirdPartyCookiesEnabled={true}
      sharedCookiesEnabled={true}
      applicationNameForUserAgent='Myapp-ReactNative'
      />
     
    </View>
    
    </SafeAreaView>
  );
};