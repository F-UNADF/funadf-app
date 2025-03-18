import { createRouter, createWebHistory } from '@ionic/vue-router';
import BottomMenu from '@/components/BottomMenu.vue';

const routes = [
  {
    path: '/',
    redirect: '/tabs/feed', // Retire ici la vérification statique
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import("@/components/LoginForm"),
  },
  {
    path: '/tabs/',
    component: BottomMenu,
    children: [
      { path: '', redirect: '/tabs/feed' },
      { path: 'user/edit', name: 'UserEdit', component: () => import("@/components/Users/edit") },
      { path: 'annuaire', name: 'SearchIndex', component: () => import("@/components/Search/index") },
      { path: 'annuaire/:type/:id', name: 'SearchShow', component: () => import("@/components/Search/show") },
      { path: 'carte', name: 'UserCard', component: () => import("@/components/Users/card") },
      { path: 'feed', name: 'Feed', component: () => import("@/components/Pages/feed") },
      { path: 'user', name: 'Home', component: () => import("@/components/Pages/home") },
      { path: 'user/:id', name: 'UserShow', component: () => import("@/components/Pages/home") },
      { path: 'votes', name: 'VotesIndex', component: () => import("@/components/Votes/index") },
      { path: 'vote/:campaign_id', name: 'VoteShow', component: () => import("@/components/Votes/show") },
      { path: 'documents', name: 'DocumentsIndex', component: () => import("@/components/Documents/index") }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 🚀 Ajout d'un **guard** pour vérifier l'authentification avant chaque navigation
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token') !== null;

  if (!isAuthenticated && to.path.startsWith('/tabs')) {
    next('/login'); // Redirige vers login si non connecté
  } else if (isAuthenticated && to.path === '/login') {
    next('/tabs/feed'); // Redirige vers feed si déjà connecté
  } else {
    next(); // Autorise la navigation
  }
});

export default router;