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
  }
]

const router = createRouter({
  mode: 'history',
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router
