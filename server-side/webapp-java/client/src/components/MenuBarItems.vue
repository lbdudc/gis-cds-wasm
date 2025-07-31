<template>
  <v-container>
    <v-menu offset-y transition="slide-y-transition" class="dropdown-content">
      <template v-slot:activator="{ on }">
        <v-btn text v-on="on" :class="{ 'button-on-collapse': collapsed }" tile>
          {{ $t("menu.language") }}
          <v-icon>arrow_drop_down</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item @click="changeLocale('EN')">
          <v-list-item-title>{{ $t("languages.en") }}</v-list-item-title>
        </v-list-item>
        <v-list-item @click="changeLocale('ES')">
          <v-list-item-title>{{ $t("languages.es") }}</v-list-item-title>
        </v-list-item>
        <v-list-item @click="changeLocale('GL')">
          <v-list-item-title>{{ $t("languages.gl") }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-menu offset-y transition="slide-y-transition" class="dropdown-content">
      <template v-slot:activator="{ on }">
        <v-btn text v-on="on" :class="{ 'button-on-collapse': collapsed }">
          {{ $t("menu.components") }}
          <v-icon>arrow_drop_down</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item :to="{ name: 'MapViewer', params: { id: 'default' } }">
          <v-list-item-title>
            {{ $t("menu.mapViewer") }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-container>
</template>

<script>
export default {
  name: "MenuBarItems",
  props: {
    collapsed: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  mounted() {
    window.addEventListener("load", () => this.$emit("bar-items-loaded"));
  },
  beforeDestroy() {
    window.removeEventListener("load", this.resizeHandler);
  },
  computed: {},
  methods: {
    changeLocale(locale) {
      this.$i18n.locale = locale;
    },
  },
};
</script>
<style scoped>
.container {
  padding: 0px;
  height: 100%;
}
.v-btn:not(.v-btn--round).v-size--default {
  height: 100%;
}
.button-on-collapse {
  display: list-item;
  padding: 5px;
  justify-content: left;
}
.v-list {
  text-align: center;
  max-height: 70vh;
  overflow-y: auto;
}
.dropdown-content {
  max-height: 70vh;
  overflow-y: auto;
}
</style>
