import properties from "../properties";

/**
 * Gets the label from the route and sets it into the tab's title
 */
export default {
  created() {
    if (this.$route?.meta?.label) {
      document.title =
        this.$t(this.$route.meta.label) + " - " + properties.APP_NAME;
    } else {
      document.title = properties.APP_NAME;
    }
  },
};
