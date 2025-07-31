<template>
  <v-container class="px-0 py-0">
    <v-row row no-gutters>
      <v-col v-if="datePicker" class="date-input">
        <v-menu
          ref="dateMenu"
          v-model="dateMenu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              class="my-0 py-0"
              prepend-icon="event"
              v-model="datePicker.innerDateFormatted"
              v-on="on"
              :label="datePicker.label || $t('calendar.date')"
              :hint="$t('calendar.dateFormat')"
              :error-messages="datePickerError || _validateDate()"
              v-on:click:clear="_clearDatePicker"
              persistent-hint
              readonly
              clearable
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="datePicker.innerData"
            no-title
            @change="_changed"
            @input="dateMenu = false"
            :locale="localeRoot"
            :first-day-of-week="$t('datePicker.firstDayOfTheWeek')"
            :nextMonthAriaLabel="$t('datePicker.nextMonthAriaLabel')"
            :prevMonthAriaLabel="$t('datePicker.prevMonthAriaLabel')"
            :nextYearAriaLabel="$t('datePicker.nextYearAriaLabel')"
            :prevYearAriaLabel="$t('datePicker.prevYearAriaLabel')"
          ></v-date-picker>
        </v-menu>
      </v-col>
      <v-col v-if="timePicker">
        <v-text-field
          class="my-0 mr-4 py-0"
          style="max-width: 150px"
          prepend-icon="access_time"
          v-model="timePicker.innerData"
          :label="timePicker.label || $t('calendar.initTime')"
          :hint="$t('calendar.timeFormat')"
          :error-messages="timePickerError || _validateTimePicker()"
          type="time"
          @input="_saveTime(timePicker, ...arguments)"
          persistent-hint
        >
        </v-text-field>
      </v-col>
      <v-col v-if="additionalTimePicker">
        <v-text-field
          class="my-0 py-0"
          style="max-width: 150px"
          prepend-icon="access_time"
          v-model="additionalTimePicker.innerData"
          :label="additionalTimePicker.label || $t('calendar.endTime')"
          :hint="$t('calendar.timeFormat')"
          :error-messages="
            additionalTimePickerError || _validateAdditionalTimePicker()
          "
          type="time"
          @input="_saveTime(additionalTimePicker, ...arguments)"
          persistent-hint
        >
        </v-text-field>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import i18n from "@/plugins/i18n";

export default {
  name: "DateAndHourPicker",
  /**
   * You can pass 3 objects to it, each one for a specific selector. Each contains three properties: data
   * (the date or time in LocalDateTime / LocalDate), label (the label that the selector will show) and mandatory
   * (indicates if the field cannot be null).
   *
   * @prop {Object} datePickerProp: The data property can be of type LocalDateTime or LocalDate.
   * @prop {Object} timePickerProp: The data property must be of type LocalDateTime or LocalTime.
   * @prop {Object} additionalTimePickerProp: The data property must be of type LocalDateTime or LocalTime.
   */
  props: {
    datePickerProp: {
      data: Array,
      label: String,
      mandatory: Boolean,
    },
    timePickerProp: {
      data: Array,
      label: String,
      mandatory: Boolean,
    },
    additionalTimePickerProp: {
      data: Array,
      label: String,
      mandatory: Boolean,
    },
  },
  data() {
    return {
      dateMenu: false,
      datePicker: this.datePickerProp,
      timePicker: this.timePickerProp,
      additionalTimePicker: this.additionalTimePickerProp,
      datePickerError: [],
      timePickerError: [],
      additionalTimePickerError: [],
    };
  },
  beforeMount() {
    if (this.datePicker) {
      if (this.datePicker.data) {
        this.datePicker["innerData"] =
          this.datePicker.data[0] +
          "-" +
          ("0" + this.datePicker.data[1]).slice(-2) +
          "-" +
          this.datePicker.data[2];
        this.datePicker["innerDateFormatted"] = this._formatDate(
          this.datePicker.innerData
        );
      }
      this.datePickerError = this._validateDate();
    }
    if (this.timePicker) {
      if (this.timePicker.data) {
        if (this.timePicker.data.length == 2) {
          this.timePicker["innerData"] = this.timePicker.data.join(":");
        } else {
          this.timePicker["innerData"] = this.timePicker.data
            .slice(3, 5)
            .join(":");
        }
      }
      this.timePickerError = this._validateTimePicker();
    }
    if (this.additionalTimePicker) {
      if (this.additionalTimePicker.data) {
        if (this.additionalTimePicker.data.length == 2) {
          this.additionalTimePicker["innerData"] =
            this.additionalTimePicker.data.join(":");
        } else {
          this.additionalTimePicker["innerData"] =
            this.additionalTimePicker.data.slice(3, 5).join(":");
        }
      }
      this.additionalTimePickerError = this._validateAdditionalTimePicker();
    }
  },
  computed: {
    localeRoot() {
      return i18n.locale;
    },
  },
  methods: {
    _formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    },
    _clearDatePicker() {
      this.datePicker.innerData = null;
      this.datePickerError = this._validateDate();
      this._changed();
    },
    _validateDate() {
      // If the field is empty and it is mandatory it shows an error
      // If the field is empty and although it is not mandatory, a time has been selected, it shows an error
      return !this.datePicker
        ? []
        : (!this.datePicker.innerData && this.datePicker.mandatory) ||
          (((this.timePicker != null &&
            this.timePicker.innerData != null &&
            this.timePicker.innerData != "") ||
            (this.additionalTimePicker != null &&
              this.additionalTimePicker.innerData != null &&
              this.additionalTimePicker.innerData != "")) &&
            !this.datePicker.innerData)
        ? this.$t("calendar.dateNotNull")
        : [];
    },
    _validateTimePicker() {
      return !this.timePicker
        ? []
        : ((!this.timePicker.innerData || this.timePicker.innerData == "") &&
            this.timePicker.mandatory) ||
          (this.datePicker != null &&
            this.datePicker.innerData != null &&
            this.datePicker.innerData.length > 1 &&
            !this.timePicker.innerData)
        ? this.$t("calendar.timeNotNull")
        : [];
    },
    _validateAdditionalTimePicker() {
      return !this.additionalTimePicker
        ? []
        : ((!this.additionalTimePicker.innerData ||
            this.additionalTimePicker.innerData == "") &&
            this.additionalTimePicker.mandatory) ||
          (this.datePicker != null &&
            this.datePicker.innerData != null &&
            this.datePicker.innerData.length > 1 &&
            !this.additionalTimePicker.innerData)
        ? this.$t("calendar.timeNotNull")
        : !this.timePicker ||
          !this.timePicker.innerData ||
          !this.additionalTimePicker ||
          !this.additionalTimePicker.innerData
        ? []
        : parseInt(this.timePicker.innerData.split(":").join()) <=
          parseInt(this.additionalTimePicker.innerData.split(":").join())
        ? []
        : this.$t("calendar.endTimeValidationError");
    },
    _saveTime(obj, time) {
      // When a time is selected, it is verified that a date is selected in case of having a date picker
      this.datePickerError = this._validateDate();

      obj.innerData = time;
      this._changed();
    },
    /**
     * Returns, through the event "update-time", an object with the following properties:
     *
     * date: {LocalDate} the value of the datePicker selector.
     * time: {LocalTime} the value of the timePicker selector.
     * additionalTime: {LocalTime} the value of the additionalTimePicker selector.
     */
    _changed() {
      let dateParts = null;

      this.datePickerError = null;
      this.timePickerError = this._validateTimePicker();
      this.additionalTimePickerError = this._validateAdditionalTimePicker();

      if (this.datePicker && this.datePicker.innerData) {
        this.datePicker.innerDateFormatted = this._formatDate(
          this.datePicker.innerData
        );
        dateParts = this.datePicker.innerData
          .split("-")
          .map((str) => parseInt(str));
      }

      const timePickerParts =
        this.timePicker &&
        this.timePicker.innerData &&
        this.timePicker.innerData != ""
          ? this.timePicker.innerData.split(":").map((str) => parseInt(str))
          : null;
      const additionalTimePickerParts =
        this.additionalTimePicker &&
        this.additionalTimePicker.innerData &&
        this.additionalTimePicker.innerData != ""
          ? this.additionalTimePicker.innerData
              .split(":")
              .map((str) => parseInt(str))
          : null;

      this.$emit("update-time", {
        date: dateParts,
        time: timePickerParts,
        additionalTime: additionalTimePickerParts,
      });
    },
    setDatePickerErrorMessage(value) {
      this.datePickerError = value;
    },
  },
};
</script>
<style scoped>
.date-input {
  min-width: 150px;
}
</style>
