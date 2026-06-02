import { defineStore } from 'pinia';
import { http } from '../api/http';

interface LoginUser {
  id: string;
  username: string;
  role: 'admin' | 'agent';
  agentId?: string;
  displayName: string;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('pcdn_token') || '',
    user: JSON.parse(localStorage.getItem('pcdn_user') || 'null') as LoginUser | null
  }),
  actions: {
    async login(username: string, password: string) {
      const { data } = await http.post('/auth/login', { username, password });
      this.token = data.token;
      this.user = data.user;
      localStorage.setItem('pcdn_token', data.token);
      localStorage.setItem('pcdn_user', JSON.stringify(data.user));
    },
    logout() {
      this.token = '';
      this.user = null;
      localStorage.removeItem('pcdn_token');
      localStorage.removeItem('pcdn_user');
    }
  }
});
