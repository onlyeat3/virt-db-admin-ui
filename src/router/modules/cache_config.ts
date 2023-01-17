import { $t } from "@/plugins/i18n";
const Layout = () => import("@/layout/index.vue");

export default {
  path: "/cache",
  name: "Cache",
  component: Layout,
  redirect: "/cache_config",
  meta: {
    icon: "octicon:cache-16",
    title: $t("menus.hscache_config"),
    rank: 0
  },
  children: [
    {
      path: "/cache_config",
      name: "CacheConfig",
      component: () => import("@/views/cache_config/index.vue"),
      meta: {
        title: $t("menus.hscache_config")
      }
    }
  ]
} as RouteConfigsTable;
