import React, { useRef, useState, useMemo, useCallback } from 'react';
import { View, ActivityIndicator, StatusBar, BackHandler, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { colors } from '../styles/global';
import { useAuthStore } from '../store/authStore';
// import ENV from '../config';

const BASE_URL = "http://192.168.1.110:3000";
const TOP_BAR_COLOR = '#c7d5eb';

export const OlympiadTestScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const webviewRef = useRef<React.ComponentRef<typeof WebView>>(null);
  const [webviewLoading, setWebviewLoading] = useState(true);

  const { olympiadId, deviceId: routeDeviceId, user: routeUser, sessionToken: routeSessionToken } = route.params || {};

  const deviceId = routeDeviceId || useAuthStore.getState().deviceId || '';
  const sessionToken = routeSessionToken || '';
  const user = routeUser || useAuthStore.getState().user;

  // Build URL — pass olympiadId as query param so the page is self-contained
  const testUrl = olympiadId
    ? `${BASE_URL}/olympiad/test?oid=${olympiadId}`
    : `${BASE_URL}/olympiad/test`;

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
          // var sid = ${JSON.stringify(sessionToken)};
          // if (sid && window.localStorage) {
          //   window.__BRIMINDS_SESSION_TOKEN__ = sid;
          //   window.localStorage.setItem('olympiadSession', sid);
          // }
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

  // Disable Android hardware back button and gesture navigation
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        // Return true to block/consume the back gesture without exiting
        return true;
      };
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [])
  );

  // Handle messages from the test page
  const handleMessage = (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data?.type === 'EXIT_TEST' || data?.type === 'GO_BACK' || data?.type === 'TEST_COMPLETE') {
        navigation.goBack();
      }
      else if (data?.type === "SUBMIT_TEST") {
        // replace, so the finished test can't be reached with Back
        navigation.replace('OlympiadCompletion');
      }
    } catch {
      // ignore non-JSON messages
    }
  };

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: TOP_BAR_COLOR }]}>
      <StatusBar barStyle="dark-content" />
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
          allowsBackForwardNavigationGestures={false}
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
});