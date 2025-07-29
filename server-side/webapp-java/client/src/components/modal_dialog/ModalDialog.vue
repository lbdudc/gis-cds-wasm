<template>
  <v-dialog persistent width="500" :value="dialog">
    <v-card>
      <v-card-title primary-title class="headline" :class="titleClass">
        <v-icon class="mr-4" v-if="titleIcon" :class="titleClass">
          {{ titleIcon }}
        </v-icon>
        {{ title }}
      </v-card-title>
      <v-card-text class="mt-4" v-html="content"> </v-card-text>
      <v-card-actions class="pb-4">
        <v-spacer></v-spacer>
        <v-btn :class="cancelClass" @click="$emit('cancel')">
          {{ cancelText || $t("cancel") }}
        </v-btn>
        <v-btn
          class="mx-4"
          :class="submitClass"
          @click="$emit('submit')"
          v-if="submitText"
        >
          {{ submitText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
/**
 * Events emitted: cancel, submit
 */
export default {
  name: "ModalDialog",
  props: {
    dialog: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      required: false,
    },
    titleIcon: {
      type: String,
      required: false,
    },
    titleClass: {
      type: String,
      required: false,
    },
    content: {
      type: String,
      required: true,
    },
    cancelText: {
      type: String,
      required: false,
    },
    cancelClass: {
      type: String,
      required: false,
    },
    submitText: {
      type: String,
      required: false,
    },
    submitClass: {
      type: String,
      required: false,
    },
  },
};
</script>
