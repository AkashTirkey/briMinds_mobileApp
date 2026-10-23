import ENV from '../config';

// ---------------------------------------------------------------------------
// 1. TypeScript Types & Interfaces (Matching BriMinds API Envelope & Schemas)
// ---------------------------------------------------------------------------

export type OtpDeliveryType = 'mobile' | 'email';
export type UserType = 'user' | 'school';

export interface SendOtpRequest {
  send_to: string;              // 10-digit phone number or email address
  type: OtpDeliveryType;        // 'mobile' | 'email'
  captcha_token?: string;       // Captcha token
  source?: string;              // 'mobile_app'
  user_type?: UserType;         // Defaults to 'user'
}

export interface VerifyOtpRequest {
  send_to: string;              // 10-digit phone number or email address
  otp: string;                  // 6-digit OTP code
  type: OtpDeliveryType;        // 'mobile' | 'email'
  captcha_token?: string;       // Captcha token
  user_type?: UserType;         // Defaults to 'user'
}

export interface UserProgressItem {
  module: string;
  grade: number;
  mission_id: number;
  question_id: number;
}

export interface UserProfile {
  id: number;
  site_id: number;
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  role_id: number;
  age: number;
  grade: number;
  section: string;
  status: boolean;
  country_id: number;
  state_id: number;
  city_id: number;
  token?: string;
  subscription_plan_id?: number;
  progress?: UserProgressItem[];
  modules_granted?: string[];
  [key: string]: any;
}

/**
 * Standard BriMinds API Response Structure:
 * { success, message, errors, data }
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  errors: string[] | null;
}

// ---------------------------------------------------------------------------
// 2. Base Request Helper with Error Handling
// ---------------------------------------------------------------------------

const BASE_URL = ENV.apiUrl;

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${BASE_URL}${endpoint}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-App-Platform': 'mobile',
    'X-App-Secret': 'briminds_mobile_internal_secret_2026',
    ...((options.headers as Record<string, string>) || {}),
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    console.log('[authApi] Requesting:', url, options.body);
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    console.log('[authApi] Status:', response.status);

    const data = await response.json().catch(() => null);
    console.log('[authApi] Received data:', data);

    if (!response.ok) {
      // Handles FastAPI 422 validation errors or 400/401/500 errors
      const detailError =
        Array.isArray(data?.detail)
          ? data.detail.map((d: any) => d.msg).join(', ')
          : data?.detail;

      const errorMessage =
        detailError ||
        (Array.isArray(data?.errors) && data.errors.length > 0
          ? data.errors.join(', ')
          : data?.message) ||
        `Request failed with status ${response.status}`;

      throw new Error(errorMessage);
    }

    // Backend returned 200 but marked success as false
    if (data && data.success === false) {
      const errorMessage =
        (Array.isArray(data.errors) && data.errors.length > 0
          ? data.errors.join(', ')
          : data.message) ||
        'Request was unsuccessful';
      throw new Error(errorMessage);
    }

    return data as ApiResponse<T>;
  } catch (error: any) {
    console.error(`[API Error] ${endpoint}:`, error.message);
    throw error;
  }
}

// ---------------------------------------------------------------------------
// 3. Auth API Functions
// ---------------------------------------------------------------------------

/**
 * 1. Send OTP to Phone or Email
 * POST /api/login/otp/send
 */
export async function sendOtpApi(payload: SendOtpRequest): Promise<ApiResponse<any>> {
  return request<any>('/login/otp/send', {
    method: 'POST',
    body: JSON.stringify({
      send_to: payload.send_to.trim(),
      type: payload.type,
      captcha_token: payload.captcha_token || 'stringstring',
      source: payload.source ?? 'mobile_app',
      user_type: payload.user_type ?? 'user',
    }),
  });
}

/**
 * 2. Verify 6-digit OTP
 * POST /api/login/otp/verify
 * Returns user profile with token inside data
 */
export async function verifyOtpApi(
  payload: VerifyOtpRequest
): Promise<ApiResponse<UserProfile>> {
  return request<UserProfile>('/login/otp/verify', {
    method: 'POST',
    body: JSON.stringify({
      send_to: payload.send_to.trim(),
      otp: payload.otp.trim(),
      type: payload.type,
      captcha_token: payload.captcha_token || 'stringstring',
      user_type: payload.user_type ?? 'user',
    }),
  });
}

/**
 * 3. Fetch Authenticated User Profile
 * GET /api/user/get
 */
export async function getCurrentUserApi(token: string): Promise<UserProfile> {
  const res = await request<UserProfile>('/user/get', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

/**
 * 4. User Logout
 * GET /api/user/logout
 */
export async function logoutApi(token: string): Promise<ApiResponse<any>> {
  return request<any>('/user/logout', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}