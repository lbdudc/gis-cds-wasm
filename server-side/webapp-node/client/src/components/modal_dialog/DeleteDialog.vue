<template>
  <modal-dialog
    @cancel="$emit('cancel')"
    @submit="$emit('submit')"
    :dialog="dialog"
    :title="title || $t('modal.delete_title')"
    titleClass="error white--text"
    titleIcon="warning"
    submitClass="error"
    :submitText="$t('delete')"
    :content="content || $t('modal.delete_dialog')"
  ></modal-dialog>
</template>

<script>
import ModalDialog from "./ModalDialog";

export default {
  components: { ModalDialog },
  props: {
    dialog: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      required: false,
    },
    content: {
      type: String,
      required: false,
    },
  },
};
</script>
