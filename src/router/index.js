import { createRouter, createWebHistory } from '@ionic/vue-router';

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import("../components/LoginForm"),
    props: true
  },
  {
    path: '/user',
    name: 'UserShow',
    component: () => import("../components/Users/show"),
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router
