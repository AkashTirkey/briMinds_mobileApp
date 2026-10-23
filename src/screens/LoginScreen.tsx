import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Linking,
  StatusBar,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, {
  Path,
  Circle,
  Defs,
  RadialGradient,
  Stop,
  Rect,
  SvgXml,
} from 'react-native-svg';
import { styles } from '../styles/LoginScreen.styles';
import { brandLogoIconSvg, brandLogoTextDarkSvg } from '../assets/svgs';
import { useAuthStore } from '../store/authStore';

export const LoginScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { sendOtp, verifyOtp, isLoading, error, clearError } = useAuthStore();
  const [tab, setTab] = useState<'phone' | 'email'>('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(30);

  console.log('[LoginScreen RENDER] isOtpMode:', isOtpMode, 'tab:', tab, 'isLoading:', isLoading);

  const otpInputsRef = useRef<any[]>([]);

  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [focusedOtpIndex, setFocusedOtpIndex] = useState<number | null>(null);

  const isPhoneValid = phone.trim().length === 10;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
  const isSendOtpEnabled = tab === 'phone' ? isPhoneValid : isEmailValid;
  const isOtpComplete = otp.every((digit) => digit.length === 1);

  useEffect(() => {
    if (Platform.OS === 'android') {
      (StatusBar as any).setBackgroundColor?.('#FAF9F6', true);
    }
  }, []);

  useEffect(() => {
    let timer: any = null;
    if (isOtpMode && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isOtpMode, resendTimer]);

  const handleTabSwitch = (selectedTab: 'phone' | 'email') => {
    // if(selectedTab === tab || isLoading) return;
    console.log("selectedTab:", selectedTab);
    Keyboard.dismiss();
    setTab(selectedTab);
    setIsOtpMode(false);
    setOtp(['', '', '', '', '', '']);
    setResendTimer(30);
    clearError();
  };

  const handleSendOtp = async () => {
    console.log('[LoginScreen] handleSendOtp called. isSendOtpEnabled:', isSendOtpEnabled, 'isLoading:', isLoading);
    if (!isSendOtpEnabled || isLoading) return;
    Keyboard.dismiss();
    clearError();
    const target = tab === 'phone' ? "91"+phone.trim() : email.trim();
    const deliveryType = tab === 'phone' ? 'mobile' : 'email';
    console.log('[LoginScreen] Invoking sendOtp for:', target, deliveryType);
    const success = await sendOtp(target, deliveryType);
    console.log('[LoginScreen] sendOtp returned:', success);
    if (success) {
      console.log('[LoginScreen] Setting isOtpMode to TRUE');
      setIsOtpMode(true);
      setOtp(['', '', '', '', '', '']);
      setResendTimer(30);
      setTimeout(() => {
        try {
          otpInputsRef.current[0]?.focus();
        } catch (e) {
          console.warn('Could not focus OTP input:', e);
        }
      }, 250);
    }
  };

  const handleOtpChange = (text: string, index: number) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned.length > 1) {
      const newOtp = [...otp];
      for (let i = 0; i < 6; i++) {
        if (i >= index && cleaned[i - index]) {
          newOtp[i] = cleaned[i - index];
        }
      }
      setOtp(newOtp);
      const nextIndex = Math.min(index + cleaned.length, 5);
      otpInputsRef.current[nextIndex]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = cleaned;
    setOtp(newOtp);

    if (cleaned && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    if (!isOtpComplete || isLoading) return;
    clearError();
    const target = tab === 'phone' ? "91"+phone.trim() : email.trim();
    const deliveryType = tab === 'phone' ? 'mobile' : 'email';
    const otpCode = otp.join('');
    const success = await verifyOtp(target, otpCode, deliveryType);
    if (success) {
      navigation.replace('MainTabs');
    }
  };

  const handleResend = async () => {
    if (isLoading) return;
    clearError();
    const target = tab === 'phone' ? phone.trim() : email.trim();
    const deliveryType = tab === 'phone' ? 'mobile' : 'email';
    const success = await sendOtp(target, deliveryType);
    if (success) {
      setResendTimer(30);
      setOtp(['', '', '', '', '', '']);
      otpInputsRef.current[0]?.focus();
    }
  };

  const getMaskedTarget = () => {
    if (tab === 'phone') {
      const d = phone.trim();
      return `+91 ${d.slice(0, 2)}xxxxx${d.slice(7)}`;
    }
    const e = email.trim();
    const at = e.indexOf('@');
    if (at <= 0) return e;
    return `${e.slice(0, Math.min(2, at))}••••${e.slice(at)}`;
  };

  const handleRegisterPress = () => {
    Linking.openURL('https://www.briminds.ai/nacl/signup/').catch((err) =>
      console.error('Failed to open URL:', err)
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Background Graphic with Gradients and Constellations */}
      <View style={styles.bgGraphics} pointerEvents="none">
        <Svg width="100%" height="100%" viewBox="0 0 390 320" preserveAspectRatio="xMidYMin slice">
          <Defs>
            <RadialGradient id="purpleGlow" cx="0" cy="0" r="260" gradientUnits="userSpaceOnUse">
              <Stop offset="0%" stopColor="#534AB7" stopOpacity={0.16} />
              <Stop offset="40%" stopColor="#534AB7" stopOpacity={0.05} />
              <Stop offset="70%" stopColor="#534AB7" stopOpacity={0} />
            </RadialGradient>
            <RadialGradient id="tealGlow" cx="370" cy="180" r="230" gradientUnits="userSpaceOnUse">
              <Stop offset="0%" stopColor="#1D9E75" stopOpacity={0.14} />
              <Stop offset="40%" stopColor="#1D9E75" stopOpacity={0.04} />
              <Stop offset="70%" stopColor="#1D9E75" stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Rect x="0" y="0" width="390" height="320" fill="url(#purpleGlow)" />
          <Rect x="0" y="0" width="390" height="320" fill="url(#tealGlow)" />
          <Path
            d="M-10 120 C 70 80, 140 170, 230 120 S 360 70, 400 100"
            stroke="rgba(83,74,183,0.10)"
            strokeWidth={1}
            fill="none"
          />
          <Path
            d="M300 30 L 340 74 L 322 140"
            stroke="rgba(29,158,117,0.14)"
            strokeWidth={1}
            fill="none"
          />
          <Circle cx="300" cy="30" r="2.4" fill="#1D9E75" fillOpacity={0.5} />
          <Circle cx="340" cy="74" r="2" fill="#534AB7" fillOpacity={0.45} />
          <Circle cx="322" cy="140" r="2.4" fill="#C9973A" fillOpacity={0.5} />
          <Circle cx="230" cy="120" r="1.8" fill="#534AB7" fillOpacity={0.35} />
        </Svg>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: Math.max(insets.top + 16, 48),
              paddingBottom: Math.max(insets.bottom + 16, 28),
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topSection}>
            {/* Logo */}
            <View style={styles.brandHeader}>
              <SvgXml xml={brandLogoIconSvg} width={36} height={36} />
              <SvgXml xml={brandLogoTextDarkSvg} width={118} height={18} />
            </View>

            {/* Title & Subtitle */}
            <View style={styles.titleSection}>
              <Text style={styles.kicker}>Student login</Text>
              <Text style={styles.headline}>
                Welcome back,{"\n"}
                <Text style={styles.headlineItalic}>young innovator.</Text>
              </Text>
              <Text style={styles.subtitle}>
                Log in to enter the world of AI olympiad.
              </Text>
            </View>

            {/* Segmented Tab Switcher */}
            <View style={styles.tabContainer}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.tabButton,
                  tab === 'phone' && styles.tabButtonActive,
                ]}
                onPress={() => handleTabSwitch('phone')}
              >
                <Text
                  style={[
                    styles.tabText,
                    tab === 'phone' && styles.tabTextActive,
                  ]}
                >
                  Mobile OTP
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.tabButton,
                  tab === 'email' && styles.tabButtonActive,
                ]}
                onPress={() => handleTabSwitch('email')}
              >
                <Text
                  style={[
                    styles.tabText,
                    tab === 'email' && styles.tabTextActive,
                  ]}
                >
                  Email OTP
                </Text>
              </TouchableOpacity>
            </View>

            {/* Error Banner */}
            {error ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorBannerText}>{error}</Text>
              </View>
            ) : null}

            {/* Form Area — key={tab} forces full unmount/remount on tab switch,
                preventing React from reconciling structurally different phone vs
                email panel trees in place (which caused stale native views). */}
            <View key={tab}>
              {!isOtpMode ? (
                tab === 'phone' ? (
                  /* Mobile Phone Panel */
                  <View key="panel-phone" style={styles.formContainer}>
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Mobile number</Text>
                      <View style={styles.phoneRow}>
                        <View
                          style={[
                            styles.countryCodeContainer,
                            isPhoneFocused && styles.inputFocused,
                          ]}
                        >
                          <Text style={styles.countryCodeText}>+91 </Text>
                          <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                            <Path
                              d="m6 9 6 6 6-6"
                              stroke="#6B6A84"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </Svg>
                    </View>
                        <TextInput
                          style={[
                            styles.phoneInput,
                            isPhoneFocused && styles.inputFocused,
                          ]}
                          placeholder="10-digit number"
                          placeholderTextColor="#9C9BB0"
                          keyboardType="phone-pad"
                          maxLength={10}
                          value={phone}
                          onFocus={() => setIsPhoneFocused(true)}
                          onBlur={() => setIsPhoneFocused(false)}
                          onChangeText={(txt) => setPhone(txt.replace(/[^0-9]/g, ''))}
                        />
                      </View>
                      <Text style={styles.helperText}>
                        Enter Your Registered Mobile Number.
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={[
                        styles.submitButton,
                        (!isSendOtpEnabled || isLoading) && styles.submitButtonDisabled,
                      ]}
                      disabled={!isSendOtpEnabled || isLoading}
                      onPress={handleSendOtp}
                      activeOpacity={0.85}
                    >
                      {isLoading ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                          <ActivityIndicator color="#FFFFFF" size="small" />
                          <Text style={styles.submitButtonText}>Sending OTP...</Text>
                        </View>
                      ) : (
                        <Text
                          style={[
                            styles.submitButtonText,
                            !isSendOtpEnabled && styles.submitButtonTextDisabled,
                          ]}
                        >
                          Send OTP
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                ) : (
                  /* Email Panel */
                  <View key="panel-email" style={styles.formContainer}>
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Email address</Text>
                      <View style={styles.emailInputWrapper}>
                        <View style={styles.emailIcon}>
                          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                            <Rect
                              x={3}
                              y={5}
                              width={18}
                              height={14}
                              rx={2.5}
                              stroke="#6B6A84"
                              strokeWidth={1.8}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <Path
                              d="m4 7 8 6 8-6"
                              stroke="#6B6A84"
                              strokeWidth={1.8}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </Svg>
                        </View>
                        <TextInput
                          style={[
                            styles.emailInput,
                            isEmailFocused && styles.inputFocused,
                          ]}
                          placeholder="you@example.com"
                          placeholderTextColor="#9C9BB0"
                          keyboardType="email-address"
                          autoCapitalize="none"
                          autoCorrect={false}
                          value={email}
                          onFocus={() => setIsEmailFocused(true)}
                          onBlur={() => setIsEmailFocused(false)}
                          onChangeText={setEmail}
                        />
                      </View>
                      <Text style={styles.helperText}>
                        Enter Your Registered Email.
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={[
                        styles.submitButton,
                        (!isSendOtpEnabled || isLoading) && styles.submitButtonDisabled
                      ]}
                      disabled={!isSendOtpEnabled || isLoading}
                      onPress={handleSendOtp}
                      activeOpacity={0.85}
                    >
                      {isLoading ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                          <ActivityIndicator color="#FFFFFF" size="small" />
                          <Text style={styles.submitButtonText}>Sending OTP...</Text>
                        </View>
                      ) : (
                        <Text
                          style={[
                            styles.submitButtonText,
                            !isSendOtpEnabled && styles.submitButtonTextDisabled,
                          ]}
                        >
                          Send OTP
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                )
              ) : (
                /* OTP Verification Panel */
                <View key="panel-otp" style={styles.formContainer}>
                  <View style={styles.otpHeader}>
                    <Text style={styles.otpTitle}>Enter the 6-digit code</Text>
                    <View style={styles.otpSubRow}>
                      <Text style={styles.otpSubtitle}>
                        Sent to {getMaskedTarget()} ·{' '}
                      </Text>
                      <TouchableOpacity onPress={() => setIsOtpMode(false)}>
                        <Text style={styles.changeLink}>Change</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* 6 Digit Inputs */}
                  <View style={styles.otpInputsContainer}>
                    {otp.map((digit, idx) => (
                      <TextInput
                        key={idx}
                        ref={(el) => {
                          otpInputsRef.current[idx] = el;
                        }}
                        style={[
                          styles.otpInput,
                          digit.length > 0 && styles.otpInputFilled,
                          focusedOtpIndex === idx && styles.inputFocused,
                        ]}
                        keyboardType="numeric"
                        maxLength={1}
                        value={digit}
                        onFocus={() => setFocusedOtpIndex(idx)}
                        onBlur={() => setFocusedOtpIndex(null)}
                        onChangeText={(val) => handleOtpChange(val, idx)}
                        onKeyPress={(e) => handleOtpKeyPress(e, idx)}
                        selectTextOnFocus
                      />
                    ))}
                  </View>

                  {/* Resend Countdown */}
                  <View>
                    {resendTimer > 0 ? (
                      <Text style={styles.resendText}>
                        Didn't get it? You can resend in{' '}
                        <Text style={styles.resendTimer}>
                          0:{resendTimer < 10 ? `0${resendTimer}` : resendTimer}
                        </Text>
                      </Text>
                    ) : (
                      <Text style={styles.resendText}>
                        Didn't get it?{' '}
                        <Text style={styles.resendLink} onPress={handleResend}>
                          Resend code
                        </Text>
                      </Text>
                    )}
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.submitButton,
                      (!isOtpComplete || isLoading) && styles.submitButtonDisabled,
                    ]}
                    disabled={!isOtpComplete || isLoading}
                    onPress={handleVerifyOtp}
                    activeOpacity={0.85}
                  >
                    {isLoading ? (
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <ActivityIndicator color="#FFFFFF" size="small" />
                        <Text style={styles.submitButtonText}>Verifying...</Text>
                      </View>
                    ) : (
                      <>
                        <Text
                          style={[
                            styles.submitButtonText,
                            !isOtpComplete && styles.submitButtonTextDisabled,
                          ]}
                        >
                          Verify & continue
                        </Text>
                        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                          <Path
                            d="M5 12h14"
                            stroke={isOtpComplete ? '#FFFFFF' : '#534AB7'}
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <Path
                            d="m13 6 6 6-6 6"
                            stroke={isOtpComplete ? '#FFFFFF' : '#534AB7'}
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </Svg>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          {/* Bottom Divider & Register Link */}
          <View style={styles.bottomSection}>
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <Text style={styles.footerText}>
              New to BriMinds?{' '}
              <Text style={styles.registerLink} onPress={handleRegisterPress}>
                Register Now
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};
