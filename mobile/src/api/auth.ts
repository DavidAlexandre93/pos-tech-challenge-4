import { apiRequest } from '@/api/client';
import type { AuthUser, Role } from '@/types';

interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    role: Role;
  };
}

export async function loginRequest(email: string, password: string): Promise<AuthUser> {
  const response = await apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });

  return {
    id: response.user.id,
    name: response.user.name,
    role: response.user.role,
    token: response.token
  };
}

export async function getAuthenticatedUser(): Promise<AuthUser> {
  const response = await apiRequest<AuthResponse['user']>('/auth/me');

  return {
    ...response,
    token: ''
  };
}
