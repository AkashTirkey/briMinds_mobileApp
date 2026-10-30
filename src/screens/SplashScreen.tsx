import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, StatusBar, Pressable, Platform } from 'react-native';
import Animated, { 
  type SharedValue,
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  withDelay,
  Easing,
  useAnimatedProps,
  useReducedMotion,
  interpolate
} from 'react-native-reanimated';
import Svg, { Path, Circle, Defs, RadialGradient, LinearGradient as SvgLinearGradient, Stop, G, Rect } from 'react-native-svg';
import { SvgXml } from 'react-native-svg';
import { textLogoSvg } from '../assets/svgs';
import { useAuthStore } from '../store/authStore';


const { width: W, height: H } = Dimensions.get('window');

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedG = Animated.createAnimatedComponent(G);

const Star = ({ cx, cy, r, fill, delay, t }: any) => {
  const reducedMotion = useReducedMotion();
  const animatedProps = useAnimatedProps(() => {
    if (reducedMotion) return { opacity: 1 };
    // opacity 0.25 -> 1 -> 0.25 over 3.6s
    const cycle = 3.6;
    const time = (t.value * 30 * cycle - delay) % cycle;
    const progress = time < 0 ? cycle + time : time;
    const frac = progress / cycle;
    
    let op = 0.25;
    if (frac < 0.5) {
      op = 0.25 + (1 - 0.25) * (frac / 0.5);
    } else {
      op = 1 - (1 - 0.25) * ((frac - 0.5) / 0.5);
    }
    return { opacity: op };
  });
  return <AnimatedCircle cx={cx} cy={cy} r={r} fill={fill} animatedProps={animatedProps} />;
};

const NodeEdge = ({ d, baseColor, flowColor, delay, t }: any) => {
  const reducedMotion = useReducedMotion();
  const animatedProps = useAnimatedProps(() => {
    if (reducedMotion) return { strokeDashoffset: 0 };
    const cycle = 4.8;
    // t runs 0 to 1 over 30s.
    const elapsed = t.value * 30; 
    let time = (elapsed - delay) % cycle;
    if (time < 0) time += cycle;
    const frac = time / cycle;
    return { strokeDashoffset: -240 * frac };
  });

  return (
    <G>
      <Path d={d} stroke={baseColor} strokeWidth={1} fill="none" />
      {!reducedMotion && (
        <AnimatedPath 
          d={d} 
          stroke={flowColor} 
          strokeWidth={1.4} 
          fill="none" 
          strokeLinecap="round"
          strokeDasharray="10 230"
          animatedProps={animatedProps} 
        />
      )}
    </G>
  );
};

const LogoNode = ({ cx, cy, delay, fill, d, nodePulseT }: {
  cx: number;
  cy: number;
  delay: number;
  fill: string;
  d: string;
  nodePulseT: SharedValue<number>;
}) => {
  const reducedMotion = useReducedMotion();
  const props = useAnimatedProps(() => {
    if (reducedMotion) return { transform: 'translate(0, 0) scale(1)', opacity: 1 };
    let t = (nodePulseT.value * 2.4 - delay) % 2.4;
    if (t < 0) t += 2.4;
    const f = t / 2.4;
    let s = 0.92, o = 0.55;
    if (f < 0.5) {
      s = 0.92 + (1 - 0.92) * (f / 0.5);
      o = 0.55 + (1 - 0.55) * (f / 0.5);
    } else {
      s = 1 - (1 - 0.92) * ((f - 0.5) / 0.5);
      o = 1 - (1 - 0.55) * ((f - 0.5) / 0.5);
    }
    return { 
      transform: `translate(${cx}, ${cy}) scale(${s}) translate(${-cx}, ${-cy})`,
      opacity: o 
    };
  });
  return <AnimatedPath fill={fill} d={d} animatedProps={props} />;
};

export const SplashScreen = ({ navigation }: any) => {
  const { isAuthenticated, initAuth } = useAuthStore();
  const reducedMotion = useReducedMotion();
  
  // Master timer 0 -> 1 over 30s
  const masterT = useSharedValue(0);
  
  // Drift A: (0,0) -> (6,-8) -> (0,0) over 12s
  const driftAT = useSharedValue(0);
  // Drift B: (0,0) -> (-7,6) -> (0,0) over 14s
  const driftBT = useSharedValue(0);

  // Logo Ring rotation 14s
  const logoRot = useSharedValue(0);
  
  // Halo 1 scale & opacity 2.8s
  const halo1T = useSharedValue(0);
  // Halo 2 scale & opacity 2.8s
  const halo2T = useSharedValue(0);

  // Logo nodes pulse 2.4s
  const nodePulseT = useSharedValue(0);
  
  // UI enter animation
  const uiEnter = useSharedValue(0);
  const footerEnter = useSharedValue(0);
  const progressT = useSharedValue(0);

  useEffect(() => {
    if (Platform.OS === 'android') {
      (StatusBar as any).setBackgroundColor?.('transparent', true);
      (StatusBar as any).setTranslucent?.(true);
    }

    if (!reducedMotion) {
      masterT.value = withRepeat(withTiming(1, { duration: 30000, easing: Easing.linear }), -1, false);
      driftAT.value = withRepeat(withTiming(1, { duration: 12000, easing: Easing.inOut(Easing.ease) }), -1, true);
      driftBT.value = withRepeat(withTiming(1, { duration: 14000, easing: Easing.inOut(Easing.ease) }), -1, true);
      logoRot.value = withRepeat(withTiming(1, { duration: 14000, easing: Easing.linear }), -1, false);
      
      halo1T.value = withRepeat(withTiming(1, { duration: 2800, easing: Easing.out(Easing.ease) }), -1, false);
      halo2T.value = withDelay(1400, withRepeat(withTiming(1, { duration: 2800, easing: Easing.out(Easing.ease) }), -1, false));

      nodePulseT.value = withRepeat(withTiming(1, { duration: 2400, easing: Easing.inOut(Easing.ease) }), -1, false);
      
      // Footer progress
      progressT.value = withRepeat(
        withSequence(
          withTiming(0.55, { duration: 1760, easing: Easing.bezier(0.4, 0, 0.2, 1) }),
          withTiming(1, { duration: 1440, easing: Easing.bezier(0.4, 0, 0.2, 1) })
        ), -1, false
      );
      // Enter animations
      uiEnter.value = withDelay(100, withTiming(1, { duration: 600, easing: Easing.bezier(0.2, 0.7, 0.2, 1) }));
      footerEnter.value = withDelay(300, withTiming(1, { duration: 600, easing: Easing.bezier(0.2, 0.7, 0.2, 1) }));
    } else {
      progressT.value = 1;
      uiEnter.value = 1;
      footerEnter.value = 1;
    }
    
    const timer = setTimeout(async () => {
      await initAuth();
      // After initAuth resolves, isAuthenticated is updated in the store.
      // Re-read directly from the store to get the latest value.
      const authed = useAuthStore.getState().isAuthenticated;
      navigation.replace(authed ? 'MainTabs' : 'Login');
    }, 2000);
    return () => clearTimeout(timer);
  }, [reducedMotion, navigation, initAuth, driftAT, driftBT, footerEnter, halo1T, halo2T, logoRot, masterT, nodePulseT, progressT, uiEnter]);

  // Store Device Id
  // const storeDeviceId = async()=>{
  //     const deviceId = await DeviceInfo.getUniqueId();
  //   AsyncStorage.setItem("device-id",deviceId);
  // }

  // useEffect(()=>{
  //   storeDeviceId();
  // },[])
  


  const driftAProps = useAnimatedProps(() => {
    if (reducedMotion) return { x: 0, y: 0 };
    return { x: interpolate(driftAT.value, [0,1], [0,6]), y: interpolate(driftAT.value, [0,1], [0,-8]) };
  });
  
  const driftBProps = useAnimatedProps(() => {
    if (reducedMotion) return { x: 0, y: 0 };
    return { x: interpolate(driftBT.value, [0,1], [0,-7]), y: interpolate(driftBT.value, [0,1], [0,6]) };
  });

  const wave1Props = useAnimatedProps(() => {
    if (reducedMotion) return { strokeDashoffset: 0 };
    // 0 -> -600 over 22s. masterT is 30s.
    const time = (masterT.value * 30) % 22;
    return { strokeDashoffset: -600 * (time/22) };
  });

  const wave2Props = useAnimatedProps(() => {
    if (reducedMotion) return { strokeDashoffset: 0 };
    const time = (masterT.value * 30) % 22;
    // Reverse direction: 0 -> +600
    return { strokeDashoffset: 600 * (time/22) };
  });

  const wave3Props = useAnimatedProps(() => {
    if (reducedMotion) return { strokeDashoffset: 0 };
    return { strokeDashoffset: -600 * masterT.value }; // 30s exact match
  });

  // UI Enter Styles
  const uiStyle = useAnimatedStyle(() => ({
    opacity: uiEnter.value,
    transform: [{ translateY: interpolate(uiEnter.value, [0,1], [10, 0]) }]
  }));

  const footerStyle = useAnimatedStyle(() => ({
    opacity: footerEnter.value,
    transform: [{ translateY: interpolate(footerEnter.value, [0,1], [10, 0]) }]
  }));

  // Progress Bar
  const progStyle = useAnimatedStyle(() => {
    let w = 6;
    if (progressT.value <= 0.55) {
      w = interpolate(progressT.value, [0, 0.55], [6, 68]);
    } else {
      w = interpolate(progressT.value, [0.55, 1], [68, 100]);
    }
    return { width: `${w}%` };
  });

  const halo1Style = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(halo1T.value, [0,1], [0.8, 1.55]) }],
    opacity: interpolate(halo1T.value, [0,1], [0.5, 0]),
    position: 'absolute',
    width: 132, height: 132, borderRadius: 66,
    borderWidth: 1, borderColor: 'rgba(93,202,165,0.45)'
  }));

  const halo2Style = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(halo2T.value, [0,1], [0.8, 1.55]) }],
    opacity: interpolate(halo2T.value, [0,1], [0.5, 0]),
    position: 'absolute',
    width: 132, height: 132, borderRadius: 66,
    borderWidth: 1, borderColor: 'rgba(127,119,221,0.45)'
  }));

  const logoRingStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${logoRot.value * 360}deg` }]
  }));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* BACKGROUND SVG */}
      <View style={styles.bgContainer}>
        <Svg width={W} height={H} viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice">
          <Defs>
            <RadialGradient id="blobA" cx="100" cy="120" r="280" gradientUnits="userSpaceOnUse">
              <Stop offset="0%" stopColor="#534AB7" stopOpacity={0.55} />
              <Stop offset="42%" stopColor="#534AB7" stopOpacity={0.12} />
              <Stop offset="70%" stopColor="#534AB7" stopOpacity={0} />
              <Stop offset="100%" stopColor="#534AB7" stopOpacity={0} />
            </RadialGradient>
            <RadialGradient id="blobB" cx="330" cy="704" r="280" gradientUnits="userSpaceOnUse">
              <Stop offset="0%" stopColor="#1D9E75" stopOpacity={0.38} />
              <Stop offset="42%" stopColor="#1D9E75" stopOpacity={0.08} />
              <Stop offset="70%" stopColor="#1D9E75" stopOpacity={0} />
              <Stop offset="100%" stopColor="#1D9E75" stopOpacity={0} />
            </RadialGradient>
            <RadialGradient id="blobC" cx="200" cy="440" r="140" gradientUnits="userSpaceOnUse">
              <Stop offset="0%" stopColor="#C9973A" stopOpacity={0.14} />
              <Stop offset="65%" stopColor="#C9973A" stopOpacity={0} />
              <Stop offset="100%" stopColor="#C9973A" stopOpacity={0} />
            </RadialGradient>
          </Defs>

          <Circle cx="100" cy="120" r="280" fill="url(#blobA)" />
          <Circle cx="330" cy="704" r="280" fill="url(#blobB)" />
          <Circle cx="200" cy="440" r="140" fill="url(#blobC)" />

          {/* Waves */}
          <Path d="M-20 160 C 80 120, 150 220, 250 170 S 380 120, 420 150" stroke="rgba(93,202,165,0.10)" strokeWidth={1} fill="none" />
          <AnimatedPath d="M-20 160 C 80 120, 150 220, 250 170 S 380 120, 420 150" stroke="rgba(93,202,165,0.35)" strokeWidth={1} fill="none" strokeDasharray="3 9" animatedProps={wave1Props} />

          <Path d="M-20 690 C 70 640, 170 720, 260 680 S 360 620, 420 660" stroke="rgba(127,119,221,0.12)" strokeWidth={1} fill="none" />
          <AnimatedPath d="M-20 690 C 70 640, 170 720, 260 680 S 360 620, 420 660" stroke="rgba(127,119,221,0.40)" strokeWidth={1} fill="none" strokeDasharray="3 9" animatedProps={wave2Props} />

          <Path d="M-20 470 C 90 430, 160 520, 260 480 S 370 440, 420 470" stroke="rgba(232,181,90,0.07)" strokeWidth={1} fill="none" />
          <AnimatedPath d="M-20 470 C 90 430, 160 520, 260 480 S 370 440, 420 470" stroke="rgba(232,181,90,0.22)" strokeWidth={1} fill="none" strokeDasharray="3 9" animatedProps={wave3Props} />

          {/* Clusters */}
          <AnimatedG animatedProps={driftAProps}>
            <NodeEdge d="M40 240 L 96 300" delay={0.0} baseColor="rgba(255,255,255,0.08)" flowColor="rgba(93,202,165,0.75)" t={masterT} />
            <NodeEdge d="M96 300 L 70 380" delay={0.7} baseColor="rgba(255,255,255,0.08)" flowColor="rgba(93,202,165,0.75)" t={masterT} />
            <NodeEdge d="M96 300 L 150 250" delay={1.4} baseColor="rgba(255,255,255,0.08)" flowColor="rgba(93,202,165,0.75)" t={masterT} />
            <NodeEdge d="M150 250 L 40 240" delay={2.1} baseColor="rgba(255,255,255,0.08)" flowColor="rgba(93,202,165,0.75)" t={masterT} />
            <NodeEdge d="M70 380 L 130 420" delay={2.8} baseColor="rgba(255,255,255,0.08)" flowColor="rgba(93,202,165,0.75)" t={masterT} />
            
            <Star cx={40} cy={240} r={2.2} fill="#5DCAA5" delay={0.0} t={masterT} />
            <Star cx={96} cy={300} r={2.6} fill="#7F77DD" delay={0.45} t={masterT} />
            <Star cx={70} cy={380} r={1.8} fill="#5DCAA5" delay={0.90} t={masterT} />
            <Star cx={150} cy={250} r={1.6} fill="#E8B55A" delay={1.35} t={masterT} />
            <Star cx={130} cy={420} r={1.5} fill="#7F77DD" delay={1.80} t={masterT} />
          </AnimatedG>

          <AnimatedG animatedProps={driftBProps}>
            <NodeEdge d="M250 170 L 310 130" delay={0.0} baseColor="rgba(255,255,255,0.07)" flowColor="rgba(232,181,90,0.75)" t={masterT} />
            <NodeEdge d="M310 130 L 350 190" delay={0.7} baseColor="rgba(255,255,255,0.07)" flowColor="rgba(232,181,90,0.75)" t={masterT} />
            <NodeEdge d="M350 190 L 290 230" delay={1.4} baseColor="rgba(255,255,255,0.07)" flowColor="rgba(232,181,90,0.75)" t={masterT} />
            <NodeEdge d="M250 170 L 290 230" delay={2.1} baseColor="rgba(255,255,255,0.07)" flowColor="rgba(232,181,90,0.75)" t={masterT} />
            
            <Star cx={250} cy={170} r={2} fill="#E8B55A" delay={0.0} t={masterT} />
            <Star cx={310} cy={130} r={1.6} fill="#5DCAA5" delay={0.45} t={masterT} />
            <Star cx={350} cy={190} r={2.2} fill="#7F77DD" delay={0.90} t={masterT} />
            <Star cx={290} cy={230} r={1.6} fill="#FFFFFF" delay={1.35} t={masterT} />
          </AnimatedG>

          <AnimatedG animatedProps={driftAProps}>
            <NodeEdge d="M320 560 L 290 620" delay={0.0} baseColor="rgba(255,255,255,0.07)" flowColor="rgba(127,119,221,0.85)" t={masterT} />
            <NodeEdge d="M290 620 L 340 700" delay={0.7} baseColor="rgba(255,255,255,0.07)" flowColor="rgba(127,119,221,0.85)" t={masterT} />
            <NodeEdge d="M340 700 L 370 630" delay={1.4} baseColor="rgba(255,255,255,0.07)" flowColor="rgba(127,119,221,0.85)" t={masterT} />
            <NodeEdge d="M370 630 L 320 560" delay={2.1} baseColor="rgba(255,255,255,0.07)" flowColor="rgba(127,119,221,0.85)" t={masterT} />
            
            <Star cx={320} cy={560} r={2} fill="#7F77DD" delay={0.0} t={masterT} />
            <Star cx={290} cy={620} r={1.5} fill="#5DCAA5" delay={0.45} t={masterT} />
            <Star cx={340} cy={700} r={2.2} fill="#E8B55A" delay={0.90} t={masterT} />
            <Star cx={370} cy={630} r={1.6} fill="#5DCAA5" delay={1.35} t={masterT} />
          </AnimatedG>

          <AnimatedG animatedProps={driftBProps}>
            <NodeEdge d="M40 640 L 120 690" delay={0.0} baseColor="rgba(255,255,255,0.06)" flowColor="rgba(93,202,165,0.75)" t={masterT} />
            <NodeEdge d="M120 690 L 80 760" delay={0.7} baseColor="rgba(255,255,255,0.06)" flowColor="rgba(93,202,165,0.75)" t={masterT} />
            <NodeEdge d="M40 640 L 80 760" delay={1.4} baseColor="rgba(255,255,255,0.06)" flowColor="rgba(93,202,165,0.75)" t={masterT} />

            <Star cx={40} cy={640} r={1.8} fill="#E8B55A" delay={0.0} t={masterT} />
            <Star cx={120} cy={690} r={1.6} fill="#5DCAA5" delay={0.45} t={masterT} />
            <Star cx={80} cy={760} r={2} fill="#7F77DD" delay={0.90} t={masterT} />
          </AnimatedG>

          <Star cx={350} cy={110} r={1.4} fill="#FFFFFF" delay={2.6} t={masterT} />
          <Star cx={30} cy={520} r={1.3} fill="#FFFFFF" delay={1.1} t={masterT} />
        </Svg>
      </View>

      <View style={styles.centerCol}>
        <View style={styles.iconBlock}>
          <Animated.View style={halo1Style} />
          <Animated.View style={halo2Style} />
          
          <Svg width="104" height="104" style={styles.innerGlowSvg}>
            <Defs>
              <RadialGradient id="innerGlow" cx="52" cy="52" r="52" gradientUnits="userSpaceOnUse">
                <Stop offset="0%" stopColor="#573BC5" stopOpacity={0.35} />
                <Stop offset="70%" stopColor="#573BC5" stopOpacity={0} />
                <Stop offset="100%" stopColor="#573BC5" stopOpacity={0} />
              </RadialGradient>
            </Defs>
            <Circle cx="52" cy="52" r="52" fill="url(#innerGlow)" />
          </Svg>

          <Animated.View style={[styles.ringContainer, logoRingStyle]}>
            <Svg width="112" height="112" viewBox="0 0 45 45">
              <Defs>
                <SvgLinearGradient id="spRing" x1="22.3" y1="0" x2="22.3" y2="44.6" gradientUnits="userSpaceOnUse">
                  <Stop offset="0" stopColor="#7F77DD" />
                  <Stop offset="1" stopColor="#48C2AD" />
                </SvgLinearGradient>
              </Defs>
              
              {/* Origin is 22.3258, 22.326. But style={transform:[rotate]} applies to center of component. Wait! */}
              <Circle cx="22.3258" cy="22.326" r="22" stroke="url(#spRing)" strokeWidth="0.7" strokeDasharray="3 1.6" fill="none" />
              
            </Svg>
          </Animated.View>

          <Svg width="112" height="112" viewBox="0 0 45 45">

            <LogoNode cx={22.214} cy={9.764} delay={0} fill="#1DB386" nodePulseT={nodePulseT} d="M22.2144 10.2153C24.2583 10.2153 25.9152 8.55839 25.9152 6.51449C25.9152 4.47059 24.2583 2.81368 22.2144 2.81368C20.1705 2.81368 18.5135 4.47058 18.5135 6.51449C18.5135 8.55839 20.1705 10.2153 22.2144 10.2153ZM22.2144 16.7148L22.9083 16.7148L22.9083 6.51449L22.2144 6.51449L21.5205 6.51449L21.5205 16.7148L22.2144 16.7148Z" />
            <LogoNode cx={33.228} cy={15.043} delay={0.4} fill="#48C2AD" nodePulseT={nodePulseT} d="M32.5004 16.1565C33.5223 17.9265 35.7857 18.533 37.5558 17.5111C39.3258 16.4891 39.9323 14.2257 38.9103 12.4557C37.8884 10.6856 35.625 10.0791 33.8549 11.1011C32.0849 12.123 31.4784 14.3864 32.5004 16.1565ZM26.8716 19.4062L27.2185 20.0072L36.0523 14.907L35.7053 14.3061L35.3584 13.7051L26.5246 18.8053L26.8716 19.4062Z" />
            <LogoNode cx={33.229} cy={29.144} delay={0.8} fill="#48C2AD" nodePulseT={nodePulseT} d="M32.5008 28.031C31.4789 29.8011 32.0854 32.0645 33.8554 33.0864C35.6255 34.1084 37.8889 33.5019 38.9108 31.7318C39.9328 29.9618 39.3263 27.6984 37.5563 26.6764C35.7862 25.6545 33.5228 26.261 32.5008 28.031ZM26.8721 24.7812L26.5251 25.3822L35.3589 30.4824L35.7058 29.8814L36.0528 29.2805L27.219 24.1803L26.8721 24.7812Z" />
            <LogoNode cx={22.214} cy={34.421} delay={1.2} fill="#1DB386" nodePulseT={nodePulseT} d="M22.2144 33.9703C24.2583 33.9703 25.9152 35.6272 25.9152 37.6711C25.9152 39.715 24.2583 41.3719 22.2144 41.3719C20.1705 41.3719 18.5135 39.715 18.5135 37.6711C18.5135 35.6272 20.1705 33.9703 22.2144 33.9703ZM22.2144 27.4707L22.9083 27.4707L22.9083 37.6711L22.2144 37.6711L21.5205 37.6711L21.5205 27.4707L22.2144 27.4707Z" />
            <LogoNode cx={11.200} cy={29.146} delay={1.6} fill="#48C2AD" nodePulseT={nodePulseT} d="M11.9284 28.033C12.9503 29.803 12.3438 32.0664 10.5738 33.0884C8.80369 34.1103 6.54031 33.5039 5.51836 31.7338C4.49641 29.9637 5.10288 27.7003 6.87295 26.6784C8.64302 25.6564 10.9064 26.2629 11.9284 28.033ZM17.5571 24.7832L17.9041 25.3841L9.07031 30.4843L8.72336 29.8834L8.37641 29.2824L17.2102 24.1823L17.5571 24.7832Z" />
            <LogoNode cx={11.201} cy={15.041} delay={2.0} fill="#48C2AD" nodePulseT={nodePulseT} d="M11.9288 16.1545C10.9069 17.9246 8.64352 18.5311 6.87345 17.5091C5.10338 16.4872 4.49691 14.2238 5.51886 12.4537C6.54081 10.6836 8.80419 10.0772 10.5743 11.0991C12.3443 12.1211 12.9508 14.3845 11.9288 16.1545ZM17.5576 19.4043L17.2107 20.0052L8.3769 14.9051L8.72385 14.3041L9.0708 13.7032L17.9046 18.8034L17.5576 19.4043Z" />
            
            <Path fill="#6C4FE0" d="M21.064 16.7188C21.8257 16.5518 22.6148 16.549 23.3774 16.7109C24.8685 17.0275 26.1604 17.9503 26.9438 19.2578C27.3036 19.8584 27.5447 20.5226 27.6548 21.2139C27.7758 21.9745 27.736 22.7521 27.5366 23.4961C27.3665 24.1312 27.0836 24.7306 26.7017 25.2656C25.9072 26.3772 24.7259 27.1525 23.3901 27.4395C22.6399 27.6006 21.8639 27.6028 21.1128 27.4453C19.781 27.166 18.6 26.4016 17.8003 25.3008C17.4055 24.7572 17.1138 24.145 16.9399 23.4961C16.74 22.7498 16.7003 21.9698 16.8228 21.207C16.9335 20.5178 17.1749 19.8556 17.5337 19.2568C18.3106 17.9607 19.5878 17.0423 21.064 16.7188Z"/>
          </Svg>
        </View>

        <Animated.View style={[styles.textBlock, uiStyle]}>
          <SvgXml xml={textLogoSvg} width="208" height="31.9" />
          <View style={styles.taglineRow}>
            <View style={styles.taglineDash} />
            <Text style={styles.tagline}>AI LEARNING FOR A GLOBAL FUTURE</Text>
            <View style={styles.taglineDash} />
          </View>
        </Animated.View>
      </View>

      <Animated.View style={[styles.footer, footerStyle]}>
        <View style={styles.progTrack}>
          <Animated.View style={[styles.progFill, progStyle]}>
            <Svg width="148" height="4">
              <Defs>
                <SvgLinearGradient id="pg" x1="0" y1="0" x2="1" y2="0">
                  <Stop offset="0" stopColor="#7F77DD" />
                  <Stop offset="1" stopColor="#48C2AD" />
                </SvgLinearGradient>
              </Defs>
              <Rect x="0" y="0" width="148" height="4" fill="url(#pg)" />
            </Svg>
          </Animated.View>
        </View>
        <Text style={styles.progText}>Getting your missions ready…</Text>
        <Text style={styles.brandText}>A <Text style={styles.boldBrand}>BriBooks</Text> product</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#15123D',
  },
  bgContainer: {
    position: 'absolute', width: '100%', height: '100%'
  },
  centerCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 28,
  },
  iconBlock: {
    width: 132, height: 132,
    alignItems: 'center', justifyContent: 'center'
  },
  innerGlowSvg: {
    position: 'absolute',
  },
  textBlock: {
    alignItems: 'center', gap: 14
  },
  taglineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  taglineDash: {
    width: 22,
    height: 1,
    backgroundColor: 'rgba(93,202,165,0.7)',
  },
  tagline: {
    fontWeight: '500',
    fontSize: 10.5,
    letterSpacing: 2.2,
    color: 'rgba(255,255,255,0.72)'
  },
  footer: {
    position: 'absolute', left: 0, right: 0, bottom: 64,
    alignItems: 'center', gap: 14
  },
  progTrack: {
    width: 148, height: 4, borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.12)', overflow: 'hidden'
  },
  progFill: {
    height: '100%',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progText: {
    fontWeight: '400', fontSize: 13, color: 'rgba(255,255,255,0.7)'
  },
  brandText: {
    fontWeight: '400', marginTop: 4, fontSize: 11, letterSpacing: 0.4, color: 'rgba(255,255,255,0.5)'
  },
  boldBrand: {
    fontWeight: '600', color: 'rgba(255,255,255,0.8)'
  },
    ringContainer: {
    position: 'absolute',
    width: 112,
    height: 112,
    alignItems: 'center',
    justifyContent: 'center',
  },

});
