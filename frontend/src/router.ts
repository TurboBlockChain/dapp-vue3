import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Layout from '@/components/Layout.vue';
// For info on using Vue Router with the Composition API, see https://next.router.vuejs.org/guide/advanced/composition-api.html

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: '/greeting/home',
    component: Layout,
    children: [
      {
        path: "/greeting",
        redirect: '/greeting/home',
        component: Layout,
        children: [
          {
            path: '/greeting/home',
            name: "greeting-home",
            component: () =>import('@/views/greeting/Home.vue'),
          },
          {
            path: "/greeting/deploy",
            name: "greeting-deploy",
            component: () =>import('@/views/greeting/Deploy.vue'),
          },
          {
            path: "/greeting/contract",
            name: "greeting-contract",
            component: () =>import('@/views/greeting/Contract.vue'),
          },
        ]
      },
    ]
  },
  // Fallback route for handling 404s
  { path: "/:pathMatch(.*)*", name: "404", component: () => import("@/views/Error404.vue") },
];

const router = createRouter({
  // If app is not hosted at the domain root, make sure to pass the `base` input here: https://next.router.vuejs.org/api/#parameters
  history: createWebHistory(),
  routes,
});

export default router;
