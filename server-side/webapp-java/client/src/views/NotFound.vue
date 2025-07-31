<template>
  <v-container>
    <v-row row>
      <v-col cols="12" class="text-center">
        <v-card color="transparent" flat>
          <v-card-title>
            <v-col class="display-3 text-center">
              <span v-if="resource">{{ $t("resource_not_found.title") }}</span>
              <span v-else>{{ $t("page_not_found.title") }}</span>
            </v-col>
          </v-card-title>
          <v-card-subtitle>
            <v-col class="grey--text lighten-5">
              <span v-if="resource">{{
                $t("resource_not_found.subtitle")
              }}</span>
              <span v-else>{{ $t("page_not_found.subtitle") }}</span>
            </v-col>
          </v-card-subtitle>
          <v-card-text>
            <v-col class="paragraph-text">
              <br />
              <br />
              <span v-if="resource">{{ $t("resource_not_found.body") }}</span>
              <span v-else>{{ $t("page_not_found.body") }}</span>
            </v-col>
          </v-card-text>
          <v-card-actions>
            <v-col class="text-center">
              <v-btn color="primary" :to="{ name: 'Home' }">
                <span v-if="resource">{{
                  $t("resource_not_found.button")
                }}</span>
                <span v-else>{{ $t("page_not_found.button") }}</span>
              </v-btn>
            </v-col>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  props: {
    resource: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
};
</script>
<style>
.paragraph-text {
  font-size: 18px;
}
</style>
