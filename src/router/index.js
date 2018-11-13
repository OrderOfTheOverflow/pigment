import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      components: {
        aside: () => import(/* webpackChunkName: "home" */ '@/components/TabNav.vue'),
        default: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
      },
    },
    {
      path: '/settings',
      name: 'settings',
      components: {
        aside: () => import(/* webpackChunkName: "settings" */ '@/views/Settings.vue'),
        default: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
      },
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ '@/views/About.vue'),
    },
  ],
});
