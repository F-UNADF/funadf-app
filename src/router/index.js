import { createRouter, createWebHistory } from '@ionic/vue-router';

const isAuthenticated = (localStorage.getItem('token') !== null);

const routes = [
  {
    path: '/',
    redirect: (isAuthenticated) ? '/feed' : '/login',
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import("@/components/LoginForm"),
    props: true
  },
  {
    path: '/feed',
    name: 'Feed',
    component: () => import("@/pages/feed"),
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
    component: () => import("../components/Search/index")
  },
  {
    path: '/annuaire/:type/:id',
    name: 'SearchShow',
    component: () => import("../components/Search/show"),
  },
  {
    path: '/documents',
    name: 'DocumentsIndex',
    component: () => import("../components/Documents/index"),
  },
  {
    path: '/agenda',
    name: 'EventsIndex',
    component: () => import("../components/Events/index"),
  },
  {
    path: '/agenda/:id',
    name: 'EventsShow',
    component: () => import("../components/Events/show"),
  }
]

const router = createRouter({
  mode: 'history',
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router
