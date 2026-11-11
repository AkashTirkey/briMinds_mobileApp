import React, { useRef, useState, useEffect, useMemo } from 'react';
import { View, ActivityIndicator, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../styles/OlympiadScreen.styles';
import { useAuthStore } from '../store/authStore';
// import ENV from "../config"

// const BASE_URL = ENV.webURL;

const OLYMPIAD_SESSION_URL = 'http://192.168.1.110:3000/olympiad/session';
const TOP_BAR_COLOR = '#c7d5eb';

export const OlympiadScreen = () => {
  const navigation = useNavigation<any>();
  const webviewRef = useRef<React.ComponentRef<typeof WebView>>(null);
  const deviceId = useAuthStore((state) => state.deviceId);
  const initDeviceId = useAuthStore((state) => state.initDeviceId);
  const user = useAuthStore((state) => state.user);

  const [isDeviceReady, setIsDeviceReady] = useState<boolean>(Boolean(deviceId));
  const [webviewLoading, setWebviewLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const prepareDevice = async () => {
      try {
        const currentId = useAuthStore.getState().deviceId;
        if (!currentId) {
          await initDeviceId();
        }
      } catch (err) {
        console.error('[OlympiadScreen] Failed to prepare device ID:', err);
      } finally {
        if (isMounted) setIsDeviceReady(true);
      }
    };
    prepareDevice();
    return () => { isMounted = false; };
  }, [initDeviceId]);

  const injectedJS = useMemo(() => {
    const activeDeviceId = deviceId || useAuthStore.getState().deviceId || '';
    const userData = user ? JSON.stringify(user) : null;
    return `
      (function() {
        try {
          var did = ${JSON.stringify(activeDeviceId)};
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

  // ─── CHANGED: handle messages from the web ───────────────────────────────
  const handleMessage = (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      // Web signals the user clicked "Start Test" — RN handles the navigation
      if (data?.type === 'START_TEST') {
        navigation.navigate('OlympiadTest', {
          olympiadId: data.olympiadId,   // passed from web
          deviceId: useAuthStore.getState().deviceId || '',
          user: useAuthStore.getState().user,
        });
        return;
      }

      if(data?.type === 'OLYMPIAD_COMPLETED'){
        navigation.replace('OlympiadCompletion',{
          olympiadId: data.olympiadId,
        });
        return;
      }

      // Legacy: web is asking for device ID via postMessage
      if (data?.type === 'GET_DEVICE_ID') {
        const currentDeviceId = useAuthStore.getState().deviceId || '';
        webviewRef.current?.postMessage(
          JSON.stringify({ type: 'DEVICE_ID_RESPONSE', deviceId: currentDeviceId })
        );
      }
    } catch {
      // Non-JSON message, safe to ignore
    }
  };
  // ─────────────────────────────────────────────────────────────────────────

  if (!isDeviceReady) {
    return (
      <SafeAreaView edges={['top']} style={[styles.container, styles.loadingContainer, { backgroundColor: TOP_BAR_COLOR }]}>
        <ActivityIndicator size="large" color="#534AB7" />
      </SafeAreaView>
    );
  }

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
          source={{ uri: OLYMPIAD_SESSION_URL }}
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