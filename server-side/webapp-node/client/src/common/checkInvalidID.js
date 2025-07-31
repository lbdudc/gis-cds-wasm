/**
 * Redirects to NotFound if resource doesn't exists or invalid ID provided
 */
import router from "@/router.js";
export default function (err) {
  const notFound = err.response.status === 404;
  const invalidID = err.response.headers["x-app-error"] === "invalid_id_type";
  if (notFound || invalidID)
    router.push({
      name: "NotFound",
      params: {
        // passing route due redirection to an asterisk named route
        // more info at https://github.com/vuejs/vue-router/issues/724#issuecomment-349966378
        0: router.currentRoute.fullPath,
        resource: true,
      },
    });
}
