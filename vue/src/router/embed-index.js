import VueRouter from "vue-router";
import routes from "./routes";
import guards from "./guards";
import hooks from "./hooks";

const router = new VueRouter({
  mode: "abstract",
  routes: routes,
});

guards(router);
hooks(router);

export default router;
