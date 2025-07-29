import Vue from "vue";
import vuetify from "./plugins/vuetify";
import "./plugins/filters";
import i18n from "./plugins/i18n";
import "./plugins/leaflet";

import "./App.scss";
import "./custom.scss";
import App from "./App.vue";
import router from "./router";
import "./registerServiceWorker";
import "./plugins/leaflet";
import Notifications from "vue-notification";
Vue.use(Notifications);

Vue.config.productionTip = false;

import tabTitleGenerator from "./components/tabTitleGenerator";
Vue.mixin(tabTitleGenerator);

import logger from "@/plugins/logger";
Vue.prototype.$logger = logger;

Vue.$router = router;

new Vue({
  router,
  vuetify,
  i18n,
  render: (h) => h(App),
}).$mount("#app");
