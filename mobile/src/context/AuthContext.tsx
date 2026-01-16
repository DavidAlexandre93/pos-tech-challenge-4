import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { apiRequest } from '@/api/client';
import type { AuthUser, Role } from '@/types';

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (role: Role) => boolean;
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  hasRole: () => false
});

interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    role: Role;
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStoredSession() {
      const storedToken = await AsyncStorage.getItem('token');
      const storedUser = await AsyncStorage.getItem('user');

      if (storedToken && storedUser) {
        const parsedUser = JSON.parse(storedUser) as Omit<AuthUser, 'token'>;
        setUser({ ...parsedUser, token: storedToken });
      }
      setIsLoading(false);
    }

    loadStoredSession();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    const authUser: AuthUser = {
      id: response.user.id,
      name: response.user.name,
      role: response.user.role,
      token: response.token
    };

    await AsyncStorage.setItem('token', response.token);
    await AsyncStorage.setItem('user', JSON.stringify(response.user));
    setUser(authUser);
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    setUser(null);
  }, []);

  const hasRole = useCallback(
    (role: Role) => {
      if (!user) return false;
      return user.role === role;
    },
    [user]
  );

  const value = useMemo(
    () => ({ user, isLoading, login, logout, hasRole }),
    [user, isLoading, login, logout, hasRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
