'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import api, { setAccessToken, clearAccessToken } from '@/lib/api';
import type { User } from '@/lib/auth';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (u: User | null) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    const { data } = await api.post<{ user: User; accessToken: string }>('/auth/login', {
      email,
      password,
    });
    setAccessToken(data.accessToken);
    setUser(data.user);
  };

  const register = async (email: string, password: string) => {
    const { data } = await api.post<{ user: User; accessToken: string }>('/auth/register', {
      email,
      password,
    });
    setAccessToken(data.accessToken);
    setUser(data.user);
  };

  const logout = async () => {
    await api.post('/auth/logout').catch(() => {});
    clearAccessToken();
    setUser(null);
  };

  useEffect(() => {
    // On load: try refresh to restore session, then fetch current user
    api
      .post<{ accessToken: string }>('/auth/refresh', {}, { withCredentials: true })
      .then(({ data }) => {
        setAccessToken(data.accessToken);
        return api.get<{ user: User }>('/auth/me');
      })
      .then((res) => setUser(res.data.user))
      .catch(() => {
        clearAccessToken();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // Listen for logout from interceptor (e.g. refresh failed)
  useEffect(() => {
    const onLogout = () => {
      setUser(null);
    };
    window.addEventListener('auth:logout', onLogout);
    return () => window.removeEventListener('auth:logout', onLogout);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
