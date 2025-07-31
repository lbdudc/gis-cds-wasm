<template>
  <div>
    <v-app-bar ref="appBar" app color="primary" dark>
      <v-app-bar-nav-icon
        @click.stop="app.drawer = !app.drawer"
        v-show="overflow"
      ></v-app-bar-nav-icon>

      <!-- We show the route name only when the screen is small -->
      <div ref="barRouteTitle" class="d-md-none">
        <router-link
          :to="currentRoutePath"
          class="v-toolbar__title d-md-none"
          custom
          v-slot="{ navigate }"
        >
          <span @click="navigate">{{ currentRouteName }}</span>
        </router-link>
      </div>

      <div ref="barTitle" class="d-none d-md-block">
        <router-link
          to="/"
          class="v-toolbar__title"
          custom
          v-slot="{ navigate }"
        >
          <span @click="navigate"> wasm </span>
        </router-link>
      </div>

      <v-spacer></v-spacer>

      <v-toolbar-items ref="bar">
        <menu-bar-items
          :collapsed="false"
          @bar-items-loaded="menuItemsLoaded"
        ></menu-bar-items>
      </v-toolbar-items>
    </v-app-bar>

    <LateralMenuBar
      :drawer="app.drawer"
      @drawer-changed="updateDrawer"
      v-if="overflow"
    ></LateralMenuBar>
  </div>
</template>

<script>
import LateralMenuBar from "./LateralMenuBar";
import MenuBarItems from "./MenuBarItems";

export default {
  name: "MenuBar",
  components: {
    LateralMenuBar,
    MenuBarItems,
  },
  data() {
    return {
      app: {
        drawer: false,
      },
      rtime: new Date(),
      timeout: false,
      delta: 100,
      margin: 50,
      overflow: false,
    };
  },
  computed: {
    currentRouteName() {
      return this.$t(this.$route.meta.label);
    },
    currentRoutePath() {
      return this.$route.path;
    },
  },
  watch: {
    currentRouteName() {
      this.resizeEnd();
    },
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeHandler);
  },
  mounted() {
    this.$refs.bar.style.visibility = "hidden";
  },
  methods: {
    menuItemsLoaded() {
      this.resizeEnd();
      window.addEventListener("resize", this.resizeHandler);
    },
    updateDrawer(newVal) {
      this.app.drawer = newVal;
    },
    resizeHandler() {
      this.rtime = new Date();
      if (this.timeout === false) {
        this.timeout = true;
        setTimeout(this.resizeEnd, this.delta);
      }
    },
    async resizeEnd() {
      if (new Date() - this.rtime < this.delta) {
        setTimeout(this.resizeEnd, this.delta);
      } else {
        // Renders the items to calculate their width
        if (this.overflow) {
          this.$refs.bar.style.visibility = "hidden";
          await sleep(this.delta);
        }

        this.overflow =
          this.$refs.barRouteTitle.clientWidth +
            this.$refs.barTitle.clientWidth +
            this.$refs.bar.clientWidth +
            this.margin >=
          this.$refs.appBar.$el.clientWidth;

        if (this.overflow) {
          this.$refs.bar.style.visibility = "hidden";
        } else {
          this.$refs.bar.style.visibility = "visible";
        }
        this.timeout = false;
      }
    },
  },
};
function sleep(ms) {
  return new Promise((resolve) => setTimeout(() => resolve()), ms);
}
</script>
<style scoped>
.container {
  display: contents;
}
</style>
<style>
.v-toolbar__title {
  cursor: pointer;
}
</style>
