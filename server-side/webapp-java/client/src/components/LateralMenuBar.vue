<template>
  <!-- Menú lateral -->
  <v-navigation-drawer v-model="localDrawer" app>
    <v-list dense>
      <v-list-group no-action>
        <template v-slot:activator>
          <v-list-item-icon>
            <v-icon>mdi-web</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ $t("menu.language") }}</v-list-item-title>
          </v-list-item-content>
        </template>
        <v-list-item @click="changeLocale('EN')">
          <v-list-item-title>{{ $t("languages.en") }}</v-list-item-title>
        </v-list-item>
        <v-list-item @click="changeLocale('ES')">
          <v-list-item-title>{{ $t("languages.es") }}</v-list-item-title>
        </v-list-item>
        <v-list-item @click="changeLocale('GL')">
          <v-list-item-title>{{ $t("languages.gl") }}</v-list-item-title>
        </v-list-item>
      </v-list-group>

      <v-list-group no-action>
        <template v-slot:activator>
          <v-list-item-icon>
            <v-icon>category</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ $t("menu.components") }}</v-list-item-title>
          </v-list-item-content>
        </template>
        <v-list-item :to="{ name: 'MapViewer', params: { id: 'default' } }">
          <v-list-item-icon>
            <v-icon>mdi-map</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            {{ $t("menu.mapViewer") }}
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "LateralMenuBar",
  props: {
    drawer: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    localDrawer: {
      get() {
        return this.drawer;
      },
      set(val) {
        this.$emit("drawer-changed", val);
      },
    },
  },
  methods: {
    changeLocale(locale) {
      this.$i18n.locale = locale;
    },
  },
};
</script>
<style scoped>
.v-list-item__title,
.v-list-item__subtitle {
  white-space: normal;
}
</style>
