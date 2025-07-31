import Vue from "vue";
import i18n from "@/plugins/i18n";
import { formatToDHM, formatToKm } from "../common/conversion-utils";

// Date filter
const dateFormat = function (date) {
  if (!date) return "";
  return date.slice().reverse().join("/");
};

const rolesFormat = function (roles) {
  if (!roles) return "";
  return roles.join(", ");
};

const zonedDateFormat = function timeConverter(UNIX_timestamp) {
  if (!UNIX_timestamp) return "";
  return new Intl.DateTimeFormat("es-ES").format(
    new Date(UNIX_timestamp * 1000)
  );
};

const millisecondtoDate = function (milliseconds) {
  if (!milliseconds) return "";
  return new Date(milliseconds).toLocaleDateString();
};

const millisecondtoDateWithHour = function (milliseconds) {
  if (!milliseconds) return "";
  return new Date(milliseconds).toLocaleString();
};

const dateTimeFormat = function (dateTime) {
  if (!dateTime) return "";
  return new Date(
    dateTime[0],
    dateTime[1] - 1,
    dateTime[2],
    dateTime[3],
    dateTime[4]
  ).toLocaleString();
};

const timeFormat = function (time) {
  if (!time) return "";
  return ("0" + time[0]).slice(-2) + ":" + ("0" + time[1]).slice(-2);
};

const kmFormat = function (meters) {
  return formatToKm(meters);
};

const dhmFormat = function (milliseconds) {
  return formatToDHM(milliseconds);
};

function popupFormat(value, format, formatUnits) {
  if (value == null) return i18n.t("map-views.legend.no-data");
  const valueFormatted = new Intl.NumberFormat().format(Number(value));
  const formatFormatted = format?.split("_")[0] || format;

  // iterate formatUnits object and return the key in lowercase
  const formatUnitsLower = Object.keys(formatUnits).reduce((acc, key) => {
    acc[key.toLowerCase()] = formatUnits[key];
    return acc;
  }, {});

  if (formatUnitsLower[formatFormatted] != null)
    return `${valueFormatted} ${formatUnitsLower[formatFormatted]}`;
  else return new Intl.NumberFormat().format(Number(value));
}

const filters = [
  { name: "dateFormat", execute: dateFormat },
  { name: "dateTimeFormat", execute: dateTimeFormat },
  { name: "timeFormat", execute: timeFormat },
  { name: "rolesFormat", execute: rolesFormat },
  { name: "zonedDateFormat", execute: zonedDateFormat },
  { name: "millisecondtoDate", execute: millisecondtoDate },
  { name: "millisecondtoDateWithHour", execute: millisecondtoDateWithHour },
  { name: "kmFormat", execute: kmFormat },
  { name: "dhmFormat", execute: dhmFormat },
  { name: "popupFormat", execute: popupFormat },
];

filters.forEach((f) => {
  Vue.filter(f.name, f.execute);
});
