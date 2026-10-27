import React from 'react';
import {useRef} from 'react'
import { View, Text } from 'react-native';
import WebView from 'react-native-webview';
import { styles } from '../styles/OlympiadScreen.styles';

const OLYMPIAD_URL = "http://192.168.1.111:3000/in/olympiad/session"

export const OlympiadScreen = () => {
    const webviewRef = useRef<React.ComponentRef<typeof WebView>>(null);
  
  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Coming{"\n"}soon.</Text>
      <Text style={styles.subtitle}>
        The BriMinds AI Olympiad is on its way. Stay tuned!
      </Text> */}
      <View style={styles.webviewContainer}>
      <WebView
      ref={webviewRef}
      source={{uri: OLYMPIAD_URL}}
      showsVerticalScrollIndicator={false}
      // injectedJavaScriptBeforeContentLoaded={{injectedJS}}
      // onLoadStart={()=> setProfileLoading(true)}
      // onLoadEnd={()=> setProfileLoading(false)}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      thirdPartyCookiesEnabled={true}
      sharedCookiesEnabled={true}
      applicationNameForUserAgent='Myapp-ReactNative'
      />
      </View>
      
    </View>
  );
};

