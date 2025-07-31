<template>
  <v-text-field
    :dense="dense"
    v-model="inputVal"
    :append-icon="appendIcon"
    :label="label"
    :single-line="singleLine"
    :hide-details="hideDetails"
  ></v-text-field>
</template>

<script>
var timerId = null;

export default {
  name: "DebouncedTextField",
  props: {
    debouncing: {
      type: Number,
      required: false,
      default: 300,
    },
    dense: {
      type: Boolean,
      required: false,
      default: false,
    },
    value: {},
    "append-icon": {
      type: String,
      required: false,
      default: undefined,
    },
    label: {
      type: String,
      required: false,
    },
    "single-line": {
      type: Boolean,
      required: false,
      default: false,
    },
    "hide-details": {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    inputVal: {
      get() {
        return this.value;
      },
      set(val) {
        this.debounceInput(val);
      },
    },
  },
  methods: {
    debounceInput(val) {
      // cancel pending call
      clearTimeout(timerId);

      // delay new call 'this.debouncing'ms
      timerId = setTimeout(() => {
        this.$emit("input", val);
      }, this.debouncing);
    },
  },
};
</script>
