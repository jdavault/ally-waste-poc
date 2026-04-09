import { Platform } from 'react-native';

// In development, localhost on Android refers to the emulator, 
// so we use 10.0.2.2. For iOS and others, localhost is fine.
const DEFAULT_URL = Platform.select({
  android: 'http://10.0.2.2:8080/api',
  default: 'http://localhost:8080/api',
});

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || DEFAULT_URL;

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
    throw new Error(error.message || response.statusText);
  }

  return response.json();
}
