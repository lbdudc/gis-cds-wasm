import i18n from "@/plugins/i18n";

function _getStringFromI18n(text) {
  return " " + i18n.t(text) + " ";
}

function _setToFixedNDigits(number, nDigits = 2) {
  let r = "" + number;
  while (r.length < nDigits) {
    r = "0" + r;
  }
  return r;
}

function _DHMFormatSymbol(d, h, m, showAlwaysEmptyUnits) {
  let result = "";
  if (d > 0 || showAlwaysEmptyUnits) {
    result += _setToFixedNDigits(d) + " d ";
  }
  if (h > 0 || showAlwaysEmptyUnits) {
    result += _setToFixedNDigits(h) + " h ";
  }
  if (m > 0 || result == "" || showAlwaysEmptyUnits) {
    result += _setToFixedNDigits(m) + " min ";
  }
  return result;
}

function _DHMFormatText(d, h, m, showAlwaysEmptyUnits) {
  let result = "";
  if (d > 0 || showAlwaysEmptyUnits) {
    result +=
      _setToFixedNDigits(d) +
      (d == 1
        ? _getStringFromI18n("trajectory_exploitation.day")
        : _getStringFromI18n("trajectory_exploitation.days"));
  }
  if (h > 0 || showAlwaysEmptyUnits) {
    result +=
      _setToFixedNDigits(h) +
      (h == 1
        ? _getStringFromI18n("trajectory_exploitation.hour")
        : _getStringFromI18n("trajectory_exploitation.hours"));
  }
  if (m > 0 || result == "" || showAlwaysEmptyUnits) {
    result +=
      _setToFixedNDigits(m) +
      (m == 1
        ? _getStringFromI18n("trajectory_exploitation.minute")
        : _getStringFromI18n("trajectory_exploitation.minutes"));
  }
  return result;
}

function formatToDHM(ms, symbol, showAlwaysEmptyUnits = false) {
  var cd = 24 * 60 * 60 * 1000,
    ch = 60 * 60 * 1000,
    d = Math.floor(ms / cd),
    h = Math.floor((ms - d * cd) / ch),
    m = Math.round((ms - d * cd - h * ch) / 60000);
  return symbol
    ? _DHMFormatSymbol(d, h, m, showAlwaysEmptyUnits)
    : _DHMFormatText(d, h, m, showAlwaysEmptyUnits);
}

function formatToKm(meters, showAlwaysKm = false) {
  if (meters >= 1000 || showAlwaysKm) {
    meters = meters / 1000;
    return meters.toFixed(2) + " Km";
  } else {
    return meters.toFixed(2) + " m";
  }
}

// return date in 'dd-mm-yyyy hh:mm' format
function formatDateWithHours(milliseconds) {
  if (milliseconds) {
    milliseconds =
      typeof milliseconds == "string" ? parseInt(milliseconds) : milliseconds;
    let date = new Date(milliseconds);
    return (
      _setToFixedNDigits(date.getDate()) +
      "-" +
      _setToFixedNDigits(date.getMonth() + 1) +
      "-" +
      date.getFullYear() +
      " " +
      _setToFixedNDigits(date.getHours()) +
      ":" +
      _setToFixedNDigits(date.getMinutes())
    );
  }
}

// return date in 'dd-mm-yyyy' format
function formatDate(milliseconds) {
  if (milliseconds) {
    milliseconds =
      typeof milliseconds == "string" ? parseInt(milliseconds) : milliseconds;
    let date = new Date(milliseconds);
    return (
      _setToFixedNDigits(date.getDate()) +
      "-" +
      _setToFixedNDigits(date.getMonth() + 1) +
      "-" +
      date.getFullYear()
    );
  }
}

// return date in 'yyyy-mm-dd' format
function formatDateInverse(date) {
  if (date) {
    let currentDate = date;
    // if date is in milliseconds
    if (!(date instanceof Date)) {
      let milliseconds = typeof date == "string" ? parseInt(date) : date;
      currentDate = new Date(milliseconds);
    }
    let year = currentDate.getFullYear();
    let month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
    let day = ("0" + currentDate.getDate()).slice(-2);
    return year + "-" + month + "-" + day;
  }
}

function formatDateOnlyHours(milliseconds) {
  if (milliseconds) {
    milliseconds =
      typeof milliseconds == "string" ? parseInt(milliseconds) : milliseconds;
    let date = new Date(milliseconds);
    return (
      _setToFixedNDigits(date.getHours()) +
      ":" +
      _setToFixedNDigits(date.getMinutes())
    );
  }
}

function toMilliSeconds(date) {
  const dateParts = date.split("-");
  return new Date(dateParts[0], dateParts[1] - 1, dateParts[2]).getTime();
}

function localDateToVCalendarString(localDate) {
  const year = localDate[0];
  const month = ("0" + localDate[1]).slice(-2);
  const day = ("0" + localDate[2]).slice(-2);
  if (localDate.length < 4) return year + "-" + month + "-" + day;
  const hour = localDate.length >= 4 ? ("0" + localDate[3]).slice(-2) : "00";
  const min = localDate.length >= 5 ? ("0" + localDate[4]).slice(-2) : "00";
  return year + "-" + month + "-" + day + " " + hour + ":" + min;
}

function localDateToISOString(localDate) {
  const date = localDate
    ? localDate[3] != null
      ? new Date(
          localDate[0],
          localDate[1] - 1,
          localDate[2],
          localDate[3],
          localDate[4],
          localDate[5] != null ? localDate[5] : 0
        )
      : new Date(localDate[0], localDate[1] - 1, localDate[2])
    : null;
  // This fixes the time difference
  const dateTimeZone = new Date(
    date.getTime() - date.getTimezoneOffset() * 60000
  );
  return dateTimeZone.toISOString();
}

function firstToLowerCase(str) {
  return str.substr(0, 1).toLowerCase() + str.substr(1);
}

export {
  formatToDHM,
  formatToKm,
  formatDateWithHours,
  formatDate,
  formatDateInverse,
  formatDateOnlyHours,
  toMilliSeconds,
  localDateToVCalendarString,
  localDateToISOString,
  firstToLowerCase,
};
