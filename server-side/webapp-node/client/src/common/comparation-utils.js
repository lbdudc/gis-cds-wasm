function compareLocalDates(localDate1, localDate2) {
  let date1Timestamp = new Date(localDate1).getTime(),
    date2Timestamp = new Date(localDate2).getTime();
  if (date1Timestamp > date2Timestamp) {
    return 1;
  }
  if (date1Timestamp < date2Timestamp) {
    return -1;
  }
  return 0;
}

export { compareLocalDates };
