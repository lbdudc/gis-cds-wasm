<template>
  <v-app>
    <notifications :max="3" :width="350" position="top center">
      <template v-slot:body="props">
        <div class="notification d-inline-flex">
          <v-col cols="2" align-self="center" class="px-0 py-0">
            <v-icon :color="props.item.type || 'info'" large>
              {{ getIcon(props.item.type) }}
            </v-icon>
          </v-col>
          <v-col cols="10">
            <v-row>
              <span class="title">
                {{ props.item.title }}
              </span>
            </v-row>
            <v-row>
              <div v-html="props.item.text"></div>
            </v-row>
          </v-col>
        </div>
      </template>
    </notifications>
    <MenuBar>
      <!-- -->
    </MenuBar>
    <v-main>
      <router-view class="content">
        <!-- -->
      </router-view>
    </v-main>
  </v-app>
</template>

<script>
import MenuBar from "./components/MenuBar";

export default {
  name: "App",
  components: { MenuBar },
  methods: {
    getIcon(type) {
      const icons = {
        success: "done",
        warning: "warning",
        error: "error",
        info: "info",
      };
      return icons[type] || "info";
    },
  },
};
</script>
