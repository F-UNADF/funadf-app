import { createRouter, createWebHistory } from '@ionic/vue-router';

const isAuthenticated = (sessionStorage.getItem('token') !== null);

const routes = [
  {
    path: '/',
    redirect: (isAuthenticated) ? '/user' : '/login',
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import("@/components/LoginForm"),
    props: true
  },
  {
    path: '/user',
    name: 'Home',
    component: () => import("@/pages/home"),
  },
  {
    path: '/user/edit',
    name: 'UserEdit',
    component: () => import("@/components/Users/edit"),
  },
  {
    path: '/user/:id',
    name: 'UserShow',
    component: () => import("@/pages/home"),
  },
  {
    path: '/votes',
    name: 'VotesIndex',
    component: () => import("../components/Votes/index"),
  },
  {
    path: '/vote/:campaign_id',
    name: 'VoteShow',
    component: () => import("../components/Votes/show"),
  },
  {
    path: '/carte',
    name: 'UserCard',
    component: () => import("../components/Users/card"),
  },
  {
    path: '/annuaire',
    name: 'SearchIndex',
    component: () => import("../components/Search/index"),
  },
  {
    path: '/result/:type/:id',
    name: 'searchShow',
    component: () => import("../components/Search/show"),
  }
]

const router = createRouter({
  mode: 'history',
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router
