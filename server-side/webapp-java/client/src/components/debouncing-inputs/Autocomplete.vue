<template>
  <v-autocomplete
    v-model="inputVal"
    :dense="dense"
    :items="items"
    :loading="loading"
    :search-input="searchInput"
    @update:search-input="updateSearchInput"
    @change="(val) => $emit('change', val)"
    :no-filter="noFilter"
    :no-data-text="noDataText"
    :cache-items="cacheItems"
    :clearable="clearable"
    :item-text="itemText"
    :item-value="itemValue"
    :return-object="returnObject"
    :label="label"
    :solo="solo"
    :multiple="multiple"
    :rules="rules"
    :autocomplete="autocomplete"
  >
    <template v-if="selectAll && items.length >= 1" v-slot:prepend-item>
      <v-list-item @click="handleSelectAll">
        <v-list-item-action>
          <v-checkbox
            @click="handleSelectAll"
            :value="inputVal.length == items.length"
          />
        </v-list-item-action>
        <v-list-item-title>{{
          $t("autocomplete.select_all")
        }}</v-list-item-title>
      </v-list-item>
      <v-divider class="mt-2" />
    </template>
    <template v-if="abreviate" v-slot:selection="{ item, index }">
      <v-chip v-if="index === 0">
        <span>{{ item[itemText] }}</span>
      </v-chip>
      <span v-if="index === 1" class="grey--text caption">{{
        $t("autocomplete.items_selected", { count: inputVal.length - 1 })
      }}</span>
    </template>
  </v-autocomplete>
</template>
<script>
var timerId = null;

export default {
  name: "Autocomplete",
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
    "select-all": {
      type: Boolean,
      required: false,
      default: false,
    },
    abreviate: {
      type: Boolean,
      required: false,
      default: false,
    },
    "cache-items": {
      type: Boolean,
      required: false,
      default: false,
    },
    clearable: {
      type: Boolean,
      required: false,
      default: true,
    },
    dense: {
      type: Boolean,
      required: false,
      default: false,
    },
    items: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      required: false,
      default: false,
    },
    "search-input": {
      required: false,
      default: undefined,
    },
    "item-text": {
      type: [String, Array, Function],
      required: true,
    },
    "item-value": {
      type: [String, Array, Function],
      required: false,
      default: "value",
    },
    "return-object": {
      type: Boolean,
      required: false,
      default: false,
    },
    "no-data-text": {
      type: String,
      required: false,
      default: "$vuetify.noDataText",
    },
    error: {
      type: Boolean,
      required: false,
      default: false,
    },
    label: {
      type: String,
      required: false,
      default: "",
    },
    multiple: {
      type: Boolean,
      required: false,
      default: false,
    },
    "no-filter": {
      type: Boolean,
      required: false,
      default: false,
    },
    rules: {
      type: Array,
      required: false,
      default: () => [],
    },
    solo: {
      type: Boolean,
      required: false,
      default: false,
    },
    value: {},
  },
  computed: {
    inputVal: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
  },
  methods: {
    updateSearchInput(val) {
      // cancel pending call
      clearTimeout(timerId);

      // delay new call 'this.debouncing'ms
      timerId = setTimeout(() => {
        this.$emit("update:search-input", val);
      }, this.debouncing);
    },
    handleSelectAll() {
      let allValues = this.returnObject
        ? JSON.parse(JSON.stringify(this.items))
        : JSON.parse(
            JSON.stringify(this.items.map((el) => el[this.itemValue]))
          );
      if (this.inputVal.length == this.items.length) {
        // All values were previously selected: uncheck all values
        this.inputVal.splice(0, this.inputVal.length);
      } else {
        this.inputVal = allValues;
      }
      this.$emit("change", this.inputVal);
    },
  },
};
</script>
