import React ,{useRef,useState,useMemo}from 'react'
import { View, ActivityIndicator, StatusBar, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import { colors } from '../styles/global';
import { useAuthStore } from '../store/authStore';
import { StyleSheet,TouchableOpacity,Text } from 'react-native';
// import ENV from '../config';

// const BASE_URL = ENV.webUrl;

const OLYMPIAD_COMPLETION_URL = "http://192.168.1.110:3000/olympiad/completion"
const TOP_BAR_COLOR = '#c7d5eb';


export const OlympiadCompletionScreen = () => {
      const navigation = useNavigation<any>();
        const route = useRoute<any>();
      
    
  const webviewRef = useRef<React.ComponentRef<typeof WebView>>(null);
    const [webviewLoading, setWebviewLoading] = useState(true);
  const user = useAuthStore((state) => state.user);

  // The page needs @User to pass the private route check
  const injectedJS = useMemo(() => {
    const userData = user ? JSON.stringify(user) : null;
    return userData
      ? `
        (function() {
          try {
            window.localStorage.setItem('@User', ${JSON.stringify(userData)});
          } catch (e) {}
        })();
        true;
      `
      : 'true;';
  }, [user]);

  return (
  <SafeAreaView
    edges={['top']}
    style={[styles.container, { backgroundColor: TOP_BAR_COLOR }]}
  >
    <StatusBar barStyle="dark-content" />

    {/* Back button */}
    <TouchableOpacity
      style={styles.backButton}
      onPress={() => navigation.navigate('MainTabs', { screen: 'Home' })}
      activeOpacity={0.7}
    >
      <Text style={styles.backText}>← Back</Text>
    </TouchableOpacity>

    {/* WebView */}
    <View style={styles.webviewContainer}>
      {webviewLoading && (
        <View style={styles.webviewLoader}>
          <ActivityIndicator size="large" color="#534AB7" />
        </View>
      )}

      <WebView
        ref={webviewRef}
        source={{ uri: OLYMPIAD_COMPLETION_URL }}
        showsVerticalScrollIndicator={false}
        bounces={false}
        injectedJavaScriptBeforeContentLoaded={injectedJS}
        onLoadStart={() => setWebviewLoading(true)}
        onLoadEnd={() => setWebviewLoading(false)}
        // onMessage={handleMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        thirdPartyCookiesEnabled={true}
        sharedCookiesEnabled={true}
        applicationNameForUserAgent="MyApp-ReactNative"
      />
    </View>
  </SafeAreaView>
);
}
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