import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, STORAGE_KEYS } from '@/utils/constants';

async function getAuthHeaders() {
  const token = await AsyncStorage.getItem(STORAGE_KEYS.token);
  return token ? { Authorization: `Bearer ${token}` } : undefined;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers);

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const authHeaders = await getAuthHeaders();
  if (authHeaders?.Authorization) {
    headers.set('Authorization', authHeaders.Authorization);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Erro ao comunicar com o servidor.');
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}
