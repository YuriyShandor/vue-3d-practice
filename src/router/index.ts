import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/cube',
      name: 'cube',
      component: () => import('../views/CubeView.vue')
    },
    {
      path: '/model',
      name: 'model',
      component: () => import('../views/ModelView.vue')
    },
    {
      path: '/leaf',
      name: 'leaf',
      component: () => import('../views/LeafView.vue')
    },
    {
      path: '/tube',
      name: 'tube',
      component: () => import('../views/TubeView.vue')
    },
    {
      path: '/shoe',
      name: 'shoe',
      component: () => import('../views/ShoeView.vue')
    },
    {
      path: '/chair',
      name: 'chair',
      component: () => import('../views/ChairView.vue')
    },
    {
      path: '/chair-v2',
      name: 'chair-v2',
      component: () => import('../views/ChairV2View.vue')
    },
    {
      path: '/cube-model',
      name: 'cube-model',
      component: () => import('../views/CubeModelView.vue')
    }
  ]
});

export default router;
