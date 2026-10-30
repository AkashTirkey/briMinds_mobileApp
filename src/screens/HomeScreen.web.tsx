import React, { useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// const DASHBOARD_URL = 'https://uat.briminds.ai/in/dashboard';
const DASHBOARD_URL = 'http://192.168.1.113:3000/in/olympiad';

const TOP_BAR_COLOR = '#c7d5eb';

export const HomeScreen = () => {
  const [iframeLoading, setIframeLoading] = useState(true);

  return (
    <SafeAreaView edges={['top']} style={[webStyles.container, { backgroundColor: TOP_BAR_COLOR }]}>
      <View style={webStyles.webviewContainer}>
        {iframeLoading && (
          <View style={webStyles.loader}>
            <ActivityIndicator size="large" color="#534AB7" />
          </View>
        )}
        <iframe
          src={DASHBOARD_URL}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
          }}
          onLoad={() => setIframeLoading(false)}
          title="BriMinds Dashboard"
        />
      </View>
    </SafeAreaView>
  );
};

const webStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webviewContainer: {
    flex: 1,
    position: 'relative',
  },
  loader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAF9F6',
    zIndex: 1,
  },
});
