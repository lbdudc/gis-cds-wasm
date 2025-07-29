export default function (items, display) {
  if (items) {
    var output = items
      .slice(0, 3)
      .map((el) => el[display])
      .join(", ");
    if (output.length == 7) output = output + " ...";
    return output;
  }
}
