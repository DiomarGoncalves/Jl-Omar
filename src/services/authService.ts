import { api } from './api';
import { User } from '../types';

export const authService = {
  async login(username: string, password: string): Promise<{ token: string; user: User }> {
    const response = await api.login(username, password);
    return response as { token: string; user: User };
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  setToken(token: string) {
    localStorage.setItem('token', token);
  },

  getUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  setUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
