import { createRouter, createWebHashHistory } from "vue-router";

const guangdongMap = () => import("@/views/guangdongMap/index.vue");
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      redirect: "/guangdongMap",
      component: guangdongMap,
    },
    {
      path: "/guangdongMap",
      component: guangdongMap,
    },

    {
      path: "/:pathMatch(.*)",
      redirect: "/",
    },
  ],
});

export default router;
