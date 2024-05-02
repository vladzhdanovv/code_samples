import authGuard from "@/router/guards/authGuard";

export default function (router) {
  authGuard(router);

  return router;
}
