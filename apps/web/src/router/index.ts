import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import LoginView from '../views/LoginView.vue';
import DashboardView from '../views/DashboardView.vue';
import DevicesView from '../views/DevicesView.vue';
import PlatformsView from '../views/PlatformsView.vue';
import OperationsView from '../views/OperationsView.vue';
import AlertsView from '../views/AlertsView.vue';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: LoginView },
    { path: '/', redirect: '/dashboard' },
    { path: '/dashboard', component: DashboardView },
    { path: '/devices', component: DevicesView },
    { path: '/platforms', component: PlatformsView },
    { path: '/operations', component: OperationsView },
    { path: '/alerts', component: AlertsView }
  ]
});

router.beforeEach((to) => {
  const auth = useAuthStore();
  if (to.path !== '/login' && !auth.token) {
    return '/login';
  }
  if (to.path === '/login' && auth.token) {
    return '/dashboard';
  }
});
