import React from 'react';
import {useRef,useEffect} from 'react'
import { View } from 'react-native';
import WebView from 'react-native-webview';
import { styles } from '../styles/OlympiadScreen.styles';
import { useAuthStore } from '../store/authStore';
import DeviceInfo from 'react-native-device-info';
// import AsyncStorage from '@react-native-async-storage/async-storage';


const OLYMPIAD_URL = "http://192.168.1.113:3000/in/olympiad/session"

export const OlympiadScreen = () => {
    const webviewRef = useRef<React.ComponentRef<typeof WebView>>(null);
    const deviceId = useAuthStore((state) => state.deviceId);
    const setDeviceId = useAuthStore((state) => state.setDeviceId);
    const initDeviceId = useAuthStore((state) => state.initDeviceId);

    useEffect(()=>{
      const loadDevice = async()=>{
        await initDeviceId();

        const existingId = useAuthStore.getState().deviceId;

        if(!existingId){
          const id = await DeviceInfo.getUniqueId();
          await setDeviceId(id);
          console.log("setDeviceId",deviceId)
        }
      };

      loadDevice();
    },[])

    const injectedJS = `
      window.__BRIMINDS_DEVICE_ID__ = ${JSON.stringify(deviceId)};
      localStorage.setItem("device_id", ${JSON.stringify(deviceId)});
      true;
    `
  
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
      // this is used for hiding the scroll indicator
      showsVerticalScrollIndicator={false}
      bounces={false}
      injectedJavaScriptBeforeContentLoaded={injectedJS}
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

