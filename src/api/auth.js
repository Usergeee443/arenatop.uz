import { api, clearTokens, setTokens } from './client';

export function normalizePhone(input) {
  const digits = String(input || '').replace(/\D/g, '');
  if (digits.startsWith('998') && digits.length === 12) return digits;
  if (digits.length === 9) return `998${digits}`;
  return digits;
}

export function initiateAuth(phone_number) {
  return api('/auth/initiate', {
    method: 'POST',
    body: { phone_number: normalizePhone(phone_number) },
  });
}

export function sendOtp(phone_number) {
  return api('/auth/send-otp', {
    method: 'POST',
    body: { phone_number: normalizePhone(phone_number) },
  });
}

export async function loginOtp(phone_number, otp_code) {
  const data = await api('/auth/login/otp', {
    method: 'POST',
    body: { phone_number: normalizePhone(phone_number), otp_code },
  });
  setTokens(data);
  return data;
}

export async function register({ phone_number, otp_code, name }) {
  const data = await api('/auth/register', {
    method: 'POST',
    body: {
      phone_number: normalizePhone(phone_number),
      otp_code,
      name,
      role_slug: 'client',
    },
  });
  // register may return tokens or require login — handle both
  if (data?.access_token) setTokens(data);
  return data;
}

export async function logout() {
  const refresh = localStorage.getItem('arenatop_refresh');
  try {
    if (refresh) {
      await api('/auth/logout', { method: 'POST', body: { refresh_token: refresh }, auth: true });
    }
  } catch {
    /* ignore */
  }
  clearTokens();
}

export function getMe() {
  return api('/users/me', { auth: true });
}
