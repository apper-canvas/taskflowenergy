import Dashboard from '@/components/pages/Dashboard';
import Archive from '@/components/pages/Archive';
import Analytics from '@/components/pages/Analytics';

export const routes = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
    component: Dashboard
  },
  archive: {
    id: 'archive',
    label: 'Archive',
    path: '/archive',
    icon: 'Archive',
    component: Archive
  },
  analytics: {
    id: 'analytics',
    label: 'Analytics',
    path: '/analytics',
    icon: 'BarChart3',
    component: Analytics
  }
};

export const routeArray = Object.values(routes);
export default routes;