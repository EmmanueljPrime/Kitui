import { createRouter, createWebHistory } from 'vue-router';
import Landing from '../views/LandingView.vue';
import Login from '../views/LoginView.vue';
import Dashboard from '../views/DashboardView.vue'
import kitEditor from "../views/KitEditorView.vue";

const routes = [
  { path: '/', component: Landing },
  { path: '/login', component: Login },
  { path: '/dashboard', component: Dashboard },
  { path: '/kit-editor', component: kitEditor },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;