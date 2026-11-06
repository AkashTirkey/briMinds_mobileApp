import React, { useRef, useState, useMemo } from 'react';
import { View, ActivityIndicator, StatusBar, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { StyleSheet,TouchableOpacity,Text } from 'react-native';
import { colors } from '../styles/global';
import { useAuthStore } from '../store/authStore';
// import ENV from "../config";


const BASE_URL = "http://192.168.1.127:3000";

const URL = BASE_URL;
const TOP_BAR_COLOR = '#c7d5eb';

export const OlympiadTestScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const webviewRef = useRef<React.ComponentRef<typeof WebView>>(null);
  const [webviewLoading, setWebviewLoading] = useState(true);

  const { olympiadId, deviceId: routeDeviceId, user: routeUser } = route.params || {};

  const deviceId = routeDeviceId || useAuthStore.getState().deviceId || '';
  const user = routeUser || useAuthStore.getState().user;

  // Build the URL — pass olympiadId as a query param so the page is self-contained
  const testUrl = olympiadId
    ? `${URL}/in/olympiad/test?oid=${olympiadId}`
    : `${URL}/in/olympiad/test`;

  // Inject auth context into the test page
  const injectedJS = useMemo(() => {
    const userData = user ? JSON.stringify(user) : null;
    return `
      (function() {
        try {
          var did = ${JSON.stringify(deviceId)};
          if (did && window.localStorage) {
            window.__BRIMINDS_DEVICE_ID__ = did;
            window.localStorage.setItem('device_id', did);
          }
          ${userData
            ? `if (window.localStorage) {
                 window.localStorage.setItem('@User', ${JSON.stringify(userData)});
               }`
            : ''}
        } catch (e) {}
      })();
      true;
    `;
  }, [deviceId, user]);

  // Handle hardware back button — exit the test and go back to session tab
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.goBack();
        return true; // prevent default back behaviour
      };
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [navigation])
  );

  // Handle messages from the test page
  const handleMessage = (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log('[OLYMPIADtESTsCREEN] Received data:', data);

      // Web signals the test is finished or user wants to exit
      if (data?.type === 'EXIT_TEST' || data?.type === 'TEST_COMPLETE') {
        navigation.goBack();
      }
      else if(data?.type=== "SUBMIT_TEST"){
        navigation.navigate("OlympiadCompletion");
      }
    } catch {
      // ignore non-JSON
    }
  };

  

return (
  <SafeAreaView
    edges={['top']}
    style={[styles.container, { backgroundColor: TOP_BAR_COLOR }]}
  >
    <StatusBar barStyle="dark-content" />

    {/* Back button */}
    {/* <TouchableOpacity
      style={styles.backButton}
      onPress={() => navigation.goBack()}
      activeOpacity={0.7}
    >
      <Text style={styles.backText}>← Back</Text>
    </TouchableOpacity> */}

    {/* WebView */}
    <View style={styles.webviewContainer}>
      {webviewLoading && (
        <View style={styles.webviewLoader}>
          <ActivityIndicator size="large" color="#534AB7" />
        </View>
      )}

      <WebView
        ref={webviewRef}
        source={{ uri: testUrl }}
        showsVerticalScrollIndicator={false}
        bounces={false}
        injectedJavaScriptBeforeContentLoaded={injectedJS}
        injectedJavaScript={injectedJS}
        onLoadStart={() => setWebviewLoading(true)}
        onLoadEnd={() => setWebviewLoading(false)}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        thirdPartyCookiesEnabled={true}
        sharedCookiesEnabled={true}
        applicationNameForUserAgent="MyApp-ReactNative"
      />
    </View>
  </SafeAreaView>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightBg,
  },
  webviewContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  webviewLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.warmLightBg,
    zIndex: 10,
  },
   backButton: {
  height: 48,
  paddingHorizontal: 16,
  justifyContent: 'center',
  alignSelf: 'flex-start',
},

backText: {
  fontSize: 17,
  fontWeight: '600',
  color: '#1E1A50',
}
});