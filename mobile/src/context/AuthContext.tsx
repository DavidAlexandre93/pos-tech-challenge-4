import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { getAuthenticatedUser, loginRequest } from '@/api/auth';
import type { AuthUser, Role } from '@/types';
import { STORAGE_KEYS } from '@/utils/constants';

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (role: Role) => boolean;
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
  hasRole: () => false
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadStoredSession() {
      try {
        const storedToken = await AsyncStorage.getItem(STORAGE_KEYS.token);
        const storedUser = await AsyncStorage.getItem(STORAGE_KEYS.user);

        if (!storedToken || !storedUser) {
          return;
        }

        let parsedUser: Omit<AuthUser, 'token'>;

        try {
          parsedUser = JSON.parse(storedUser) as Omit<AuthUser, 'token'>;
        } catch {
          await AsyncStorage.multiRemove([STORAGE_KEYS.token, STORAGE_KEYS.user]);
          return;
        }

        try {
          const refreshedUser = await getAuthenticatedUser();

          if (!isMounted) {
            return;
          }

          setUser({ ...refreshedUser, token: storedToken });
          await AsyncStorage.setItem(
            STORAGE_KEYS.user,
            JSON.stringify({ id: refreshedUser.id, name: refreshedUser.name, role: refreshedUser.role })
          );
        } catch {
          if (isMounted) {
            setUser({ ...parsedUser, token: storedToken });
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadStoredSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const authUser = await loginRequest(email, password);

    await AsyncStorage.setItem(STORAGE_KEYS.token, authUser.token);
    await AsyncStorage.setItem(
      STORAGE_KEYS.user,
      JSON.stringify({ id: authUser.id, name: authUser.name, role: authUser.role })
    );
    setUser(authUser);
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.multiRemove([STORAGE_KEYS.token, STORAGE_KEYS.user]);
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
    () => ({ user, isLoading, isAuthenticated: Boolean(user), login, logout, hasRole }),
    [user, isLoading, login, logout, hasRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
