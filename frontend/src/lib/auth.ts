/**
 * Auth helpers: login, register, logout, get current user
 * Tokens: access in memory (api.setAccessToken), refresh in HTTP-only cookie
 */

import api, { setAccessToken, clearAccessToken } from './api';

export type User = { id: string; email: string };

export async function register(email: string, password: string) {
  const { data } = await api.post<{
    user: User;
    accessToken: string;
    expiresIn: number;
  }>('/auth/register', { email, password });
  setAccessToken(data.accessToken);
  return data;
}

export async function login(email: string, password: string) {
  const { data } = await api.post<{
    user: User;
    accessToken: string;
    expiresIn: number;
  }>('/auth/login', { email, password });
  setAccessToken(data.accessToken);
  return data;
}

export async function logout() {
  try {
    await api.post('/auth/logout');
  } finally {
    clearAccessToken();
  }
}
