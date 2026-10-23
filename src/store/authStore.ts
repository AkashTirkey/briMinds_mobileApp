import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  sendOtpApi,
  verifyOtpApi,
  getCurrentUserApi,
  logoutApi,
  OtpDeliveryType,
  UserProfile,
} from '../api/authApi';

const AUTH_TOKEN_KEY = '@briminds_auth_token';

// ---------------------------------------------------------------------------
// Store State & Actions Interface
// ---------------------------------------------------------------------------

export interface AuthState {
  // State
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  sendOtp: (
    sendTo: string,
    type: OtpDeliveryType,
    captchaToken?: string
  ) => Promise<boolean>;

  verifyOtp: (
    sendTo: string,
    otp: string,
    type: OtpDeliveryType,
    captchaToken?: string
  ) => Promise<boolean>;

  fetchProfile: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  setAuth: (token: string, user: UserProfile) => void;
  /**
   * Restores auth session from AsyncStorage on cold start.
   * Returns true if a valid saved token was found, false otherwise.
   */
  initAuth: () => Promise<boolean>;
}

// ---------------------------------------------------------------------------
// Zustand Store Implementation
// ---------------------------------------------------------------------------

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  /**
   * Clear active error message
   */
  clearError: () => set({ error: null }),

  /**
   * Set authentication state directly and persist token.
   */
  setAuth: (token: string, user: UserProfile) => {
    AsyncStorage.setItem(AUTH_TOKEN_KEY, token).catch(() => {});
    set({
      token,
      user,
      isAuthenticated: true,
      error: null,
    });
  },

  /**
   * 1. Send OTP to Phone or Email
   * Returns true on success, false on failure (sets error string).
   */
  sendOtp: async (sendTo, type, captchaToken = 'stringstring') => {
    console.log('[authStore] sendOtp start:', { sendTo, type, captchaToken });
    set({ isLoading: true, error: null });
    try {
      const response = await sendOtpApi({
        send_to: sendTo,
        type,
        captcha_token: captchaToken,
        source: 'mobile_app',
        user_type: 'user',
      });
      console.log('[authStore] sendOtp API response:', response);

      set({ isLoading: false });
      return response.success ?? true;
    } catch (err: any) {
      console.error('[authStore] sendOtp caught error:', err.message);
      set({
        isLoading: false,
        error: err.message || 'Failed to send OTP. Please try again.',
      });
      return false;
    }
  },

  /**
   * 2. Verify 6-digit OTP
   * Receives user profile with JWT token in data, updates auth state.
   */
  verifyOtp: async (sendTo, otp, type, captchaToken = 'stringstring') => {
    set({ isLoading: true, error: null });
    try {
      const response = await verifyOtpApi({
        send_to: sendTo,
        otp,
        type,
        captcha_token: captchaToken,
        user_type: 'user',
      });

      const userProfile = response.data;
      const authToken = userProfile?.token;

      if (!authToken) {
        throw new Error('No authentication token received from server.');
      }

      await AsyncStorage.setItem(AUTH_TOKEN_KEY, authToken);

      set({
        token: authToken,
        user: userProfile,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return true;
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.message || 'Verification failed. Please check the OTP.',
      });
      return false;
    }
  },

  /**
   * 3. Fetch latest user profile using current token
   */
  fetchProfile: async () => {
    const { token } = get();
    if (!token) return;

    try {
      const user = await getCurrentUserApi(token);
      set({ user });
    } catch (err: any) {
      console.warn('Failed to refresh profile:', err.message);
    }
  },

  /**
   * 4. Logout and reset authentication state
   */
  logout: async () => {
    const { token } = get();
    if (token) {
      try {
        await logoutApi(token);
      } catch (err: any) {
        console.warn('Backend logout call failed:', err.message);
      }
    }

    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);

    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

  /**
   * 5. Restore auth session from AsyncStorage on cold start.
   * Call this in SplashScreen before deciding which route to navigate to.
   * Returns true if a saved token was found and restored.
   */
  initAuth: async () => {
    try {
      const savedToken = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      if (savedToken) {
        set({ token: savedToken, isAuthenticated: true });
        // Optionally fetch the latest profile in the background
        try {
          const user = await getCurrentUserApi(savedToken);
          set({ user });
        } catch {
          // Profile fetch failed — token may be expired. Clear it.
          await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
          set({ token: null, isAuthenticated: false });
          return false;
        }
        return true;
      }
    } catch (err: any) {
      console.warn('[authStore] initAuth error:', err.message);
    }
    return false;
  },
}));