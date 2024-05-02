import Vue from "vue";

export default function (router) {
  router.afterEach((to) => {
    if (to.meta.title) {
      Vue.nextTick(() => {
        document.title = to.meta.title;
      });
    }
  });

  return router;
}
