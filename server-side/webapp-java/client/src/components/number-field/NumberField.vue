<template>
  <v-text-field
    :dense="dense"
    type="text"
    :label="label"
    :rules="[onlyNumber, ...rules]"
    :value="value"
    @input="onInput"
    :autocomplete="autocomplete"
  ></v-text-field>
</template>

<script>
const decimalTypes = ["float", "double", "bigdecimal"];
var timerId = null;

export default {
  name: "NumberField",
  props: {
    debouncing: {
      type: Number,
      required: false,
      default: 0,
    },
    autocomplete: {
      type: String,
      required: false,
      default: "on",
    },
    label: {
      type: String,
      required: false,
      default: "",
    },
    type: {
      type: String,
      required: false,
      default: "Integer",
    },
    value: {},
    dense: {
      type: Boolean,
      required: false,
      default: true,
    },
    rules: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  computed: {
    onlyNumber() {
      if (decimalTypes.includes(this.type.toLowerCase()))
        return (v) =>
          !v ||
          /^-?\d*\.?\d*$/.test(v) ||
          this.$t("numberField.validation.decimal");
      else
        return (v) =>
          !v || /^\d+$/.test(v) || this.$t("numberField.validation.integer");
    },
  },
  methods: {
    onInput(val) {
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
