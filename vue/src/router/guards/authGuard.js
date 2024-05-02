import { useAuthStore } from "@/stores/auth";
import Api from "@/services/api";

export default function (router) {
  router.beforeEach(async (to, from, next) => {
    if (to.matched.some((record) => record.meta.auth)) {
      const authStore = useAuthStore();

      if (!authStore.isAuthenticated) {
        try {
          if (!authStore.accessToken) {
            throw new Error("Not authenticated");
          }

          Api.setAccessToken(authStore.accessToken);

          await authStore.loadUser();
        } catch (Error) {
          next({ name: "login" });
          return;
        }
      }
    }

    next();
  });

  router.beforeEach(async (to, from, next) => {
    if (to.matched.some((record) => record.meta.guest)) {
      const authStore = useAuthStore();

      if (authStore.isAuthenticated || authStore.accessToken) {
        try {
          if (!authStore.isAuthenticated) {
            Api.setAccessToken(authStore.accessToken);

            await authStore.loadUser();
          }

          const redirectTo = to.params.redirectTo ?? {
            name: authStore.getUserHomeRoute(),
          };

          next(redirectTo);
          return;
        } catch (Error) {
          //
        }
      }
    }

    next();
  });
}
