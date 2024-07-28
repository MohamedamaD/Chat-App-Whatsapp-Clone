import moment from "moment";

export const formatDate = (date) => {
  const now = moment();
  const givenDate = moment(date);

  if (givenDate.isSame(now, "day")) {
    return `Today at ${givenDate.format("HH:mm")}`;
  } else if (givenDate.isSame(now.subtract(1, "day"), "day")) {
    return `Yesterday at ${givenDate.format("HH:mm")}`;
  } else {
    return givenDate.format("MMMM D, YYYY [at] HH:mm");
  }
};
