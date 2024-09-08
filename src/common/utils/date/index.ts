import moment from "moment";

const dateFormatterView = (dateTimeString: any) => {
  if(!dateTimeString) return ""
  const options: any = { year: "numeric", month: "short", day: "2-digit" };
  const date = new Date(dateTimeString);
  return date.toLocaleDateString("en-US", options);
};

const todayDate = (isMoment?: false) => {
  var today = new Date();
  const todayDate =
    today.getFullYear() +
    "-" +
    ("0" + (today.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + today.getDate()).slice(-2);
  return isMoment ? moment(todayDate) : todayDate;
};

export const dateFormatter = (date: any) => {
  const newDate = new Date(date);
  const year = newDate.getFullYear();
  const month = `${newDate.getMonth() + 1}`.padStart(2, "0");
  const day = `${newDate.getDate()}`.padStart(2, "0");
  return [year, month, day].join("-");
};

const timeFormatter = (date: any) => {
  const newDate = new Date(date);
  const hour = newDate.getHours();
  const minutes = newDate.getMinutes();
  const seconds = newDate.getSeconds();
  return [hour, minutes, seconds].join(":");
};

const formatDateTimeForSave = (date: any, time: any) => {
  try {
    const dateObj = new Date(date);
    const timeParts = time.split(":");

    dateObj.setUTCHours(timeParts[0]);
    dateObj.setUTCMinutes(timeParts[1]);
    dateObj.setUTCSeconds(timeParts[2]);
    dateObj.setUTCMilliseconds(0);

    const formattedDateTime = dateObj.toISOString();
    return formattedDateTime;
  } catch (error) {
    return null;
  }
};

const timeFormatterView = (dateTimeString: any) => {
  const dateObj = new Date(dateTimeString);
  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();
  const period = hours >= 12 ? "pm" : "am";
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  const formattedMinutes = minutes.toString().padStart(2, "0");

  return `${formattedHours}:${formattedMinutes} ${period}`;
};

export {
  dateFormatterView,
  timeFormatter,
  formatDateTimeForSave,
  timeFormatterView,
  todayDate
};
