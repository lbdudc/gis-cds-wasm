import Vue from "vue";
import Router from "vue-router";
import NotFound from "@/views/NotFound.vue";
import Home from "./views/Home.vue";

import MapViewer from "@/components/map-viewer/MapViewer.vue";

import rasterRouter from "./modules/raster/router";

Vue.use(Router);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      label: "menu.home",
    },
  },
  {
    path: "/map-viewer/:id?",
    name: "MapViewer",
    meta: {
      label: "menu.mapViewer",
    },
    component: MapViewer,
  },
  {
    path: "/about",
    name: "about",
    meta: {
      label: "menu.about",
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import("./views/About.vue"),
  },
  {
    path: "*",
    name: "NotFound",
    component: NotFound,
    props: true,
    meta: {
      label: "page_not_found.title",
    },
  },
];

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: routes.concat(rasterRouter),
});

const backPreviousStack = [];

const checkRedirectToPrevious = (to, from, next) => {
  // if backPrevious prop, add from route to stack and go next
  if (to.params.backPrevious) {
    if (to.params.backAction) {
      // eslint-disable-next-line
      console.warn(
        "Set route with backAction and backPrevious flags is not allowed"
      );
    } else {
      backPreviousStack.push(from);
    }
    next();
  } else if (to.params.backAction) {
    // if backAction prop (should only be present when route from back button)
    // get last item from stack if not empty
    let length = backPreviousStack.length;
    if (length < 1) next();
    else {
      let stackTop = {};
      Object.assign(stackTop, backPreviousStack[length - 1]);
      // check if redirecting to stack top route and if so,
      // remove it from the stack
      if (to.fullPath == stackTop.fullPath) {
        backPreviousStack.pop();
        next();
      } else {
        // call router.push() will trigger again this function
        // so is necessary set backAction and backPrevious params
        // in order to reach this block again
        stackTop.params.backAction = true;
        stackTop.params.backPrevious = false;
        router.push(stackTop); // calling router.push() instead of next() to prevent console error
      }
    }
  } else {
    // clean stack if no backPrevious neither backAction props are present and route next
    backPreviousStack.splice(0, backPreviousStack.length);
    next();
  }
};
router.beforeEach(checkRedirectToPrevious);

export default router;
