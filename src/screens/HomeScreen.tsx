import React, { useRef, useState } from 'react';
import { View, ActivityIndicator, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';
import { styles } from '../styles/HomeScreen.styles';
import { useAuthStore } from '../store/authStore';

// const DASHBOARD_URL = 'https://uat.briminds.ai/in/dashboard';
const DASHBOARD_URL = 'http://uat.briminds.ai/in/olympiad';

const TOP_BAR_COLOR = '#c7d5eb'; // Set to match your web dashboard header color

export const HomeScreen = () => {
  const { user } = useAuthStore();
  const webviewRef = useRef<React.ComponentRef<typeof WebView>>(null);
  const [webviewLoading, setWebviewLoading] = useState(true);

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
        {webviewLoading && (
          <View style={styles.webviewLoader}>
            <ActivityIndicator size="large" color="#534AB7" />
          </View>
        )}
        <WebView
          ref={webviewRef}
          source={{ uri: DASHBOARD_URL }}
          injectedJavaScriptBeforeContentLoaded={injectedJS}
          showsVerticalScrollIndicator={false}
          onLoadStart={() => setWebviewLoading(true)}
          onLoadEnd={() => setWebviewLoading(false)}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          thirdPartyCookiesEnabled={true}
          sharedCookiesEnabled={true}
          style={styles.webview}
          applicationNameForUserAgent="MyApp-ReactNative"
        />
      </View>
    </SafeAreaView>
  );
};