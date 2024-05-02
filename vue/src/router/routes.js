const ModeratorMakersView = () =>
  import(
    /* webpackChunkName: "moderator" */
    "@/views/Moderator/ModeratorMakersView.vue"
  );

export default [
  {
    path: "/moderator",
    name: "moderator",
    component: ModeratorView,
    meta: {
      auth: true,
      role: "moderator",
    },

    children: [
      {
        path: "makers",
        name: "moderator.makers",
        component: ModeratorMakersView,
        meta: {
          title: "Makers",
        },
      },
    ],
  },
];
