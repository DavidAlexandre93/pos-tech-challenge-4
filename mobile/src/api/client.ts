import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@/utils/constants';

async function getAuthHeaders() {
  const token = await AsyncStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...(await getAuthHeaders()),
    ...options.headers
  };

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
