/**
 * Generates a string compatible with SpringBoot pagination
 * @param pagination: pagination object received from v-data-table
 * @param sortMapping: object with a custom mapping to convert DTO names to entity path (ex. productTitle -> edition.product.title)
 * @returns {string|undefined}: Pagination in string format (field1,asc&field2,desc&...)
 */

function generateSort(pagination, sortMapping = {}) {
  let sort = [];
  if (pagination.sortBy && pagination.sortDesc) {
    for (let index = 0; index < pagination.sortBy.length; index++) {
      const direction = pagination.sortDesc[index] ? "desc" : "asc";
      const element =
        (sortMapping[pagination.sortBy[index]] || pagination.sortBy[index]) +
        "," +
        direction;
      sort.push(element);
    }
  }
  return sort.length > 0 ? sort.join("&") : undefined;
}

function parseStringToSortBy(sortString) {
  if (!sortString || sortString === "") {
    return [];
  }
  return sortString.split("&").map((sort) => sort.split(",")[0]);
}

function parseStringToSortDesc(sortString) {
  if (!sortString || sortString === "") {
    return [];
  }
  return sortString.split("&").map((sort) => sort.split(",")[1] === "desc");
}

export { generateSort, parseStringToSortBy, parseStringToSortDesc };
