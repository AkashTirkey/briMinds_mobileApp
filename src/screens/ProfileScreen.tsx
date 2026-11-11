import React, { useState,useRef } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator,StatusBar } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView, WebViewMessageEvent }  from 'react-native-webview';
import { styles } from '../styles/ProfileScreen.styles';
import { useAuthStore } from '../store/authStore';
import ENV from '../config';

const BASE_URL = "http://192.168.1.110:3000";

const PROFILE_URL = BASE_URL+"/profile/";
// const PROFILE_URL = "http://uat.briminds.ai/in/profile/";

const TOP_BAR_COLOR = '#c7d5eb'; // Set to match your web dashboard header color

// Keep in sync with userLogout in the web app's src/utils/common.js
const CLEAR_WEB_SESSION_JS = `
  (function() {
    try {
      [
        '@User', '@SiteUser', '@OlympiadProgress', 'olympiadQuestions',
        'olympiadAttemptId', 'olympiadId', 'olympiad_id', 'olympiadData',
        'olympiadSession', 'olympiadDeviceId', 'session_token'
      ].forEach(function(key) { window.localStorage.removeItem(key); });
    } catch (e) {}
  })();
  true;
`;


export const ProfileScreen = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuthStore();
  const webviewRef = useRef<React.ComponentRef<typeof WebView>>(null);
  const[profileLoading, setProfileLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const[isSupportOpen, setIsSupportOpen] = useState(false);
  
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
              webviewRef.current?.injectJavaScript(CLEAR_WEB_SESSION_JS);

              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: "Login" }],
                })
              );
            } catch (error) {
              Alert.alert(
                "Error",
                error instanceof Error ? error.message : "Failed to log out. Please try again."
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
      
      {profileLoading && (
        <View>
          <ActivityIndicator size="large" color="#534AB7"/>
        </View>
      )}

      <WebView
      ref={webviewRef}
      source={{uri: PROFILE_URL}}
      // this is used for hiding the scroll indicator
      showsVerticalScrollIndicator={false}
      onMessage={handleWebViewMessage}
      injectedJavaScriptBeforeContentLoaded={injectedJS}
      onLoadStart={()=> setProfileLoading(true)}
      onLoadEnd={()=> setProfileLoading(false)}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      // bounce is used for preventing scrolling past the given height
      bounces={false}
      thirdPartyCookiesEnabled={true}
      sharedCookiesEnabled={true}
      applicationNameForUserAgent='Myapp-ReactNative'
      />
      
    </View>
    
    </SafeAreaView>
    );
};