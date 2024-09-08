import axios from "axios";
import { dateFormatter } from "../date";

const focusDynamicInput = (className: string) => {
  setTimeout(() => {
    const input = document.querySelector(`${className}`) as HTMLInputElement;
    input.focus();
    if (className.includes(".ant-picker-input")) {
      input.click();
    }
  }, 100);
};

const scrollToView = ({ data, id, dataId, listRef }: any) => {
  // scroll need only first time, so we check viewData?.customerRelationInfoId should equal params id
  setTimeout(() => {
    if (listRef.current && data?.[dataId] && data?.[dataId] == id) {
      const selectedItem = document.getElementById(data?.[dataId]);
      if (selectedItem) {
        listRef.current.scrollTop = selectedItem.offsetTop - 150;
      }
    }
  }, 200);
};

const downloadFile = (url: any, extension: any, setLoading: any) => {
  setLoading && setLoading(true);
  axios({
    url: url,
    method: "GET",
    responseType: "blob" // important
  })
    .then((response) => {
      const splitByUnderscore = url?.split("_");
      const splitByDot = splitByUnderscore?.[1]?.split(".");
      const actualFileName = splitByDot?.[0];
      const urlTwo = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = urlTwo;
      //   const fileExtension = imageView?.type.split('/')[1];
      link.setAttribute("download", actualFileName);
      link.setAttribute("download", `${actualFileName}.${extension}`);
      document.body.appendChild(link);
      setLoading && setLoading(false);
      link.click();
    })
    .catch((err) => {
      setLoading && setLoading(false);
    });
};

const convertToAbbreviation = (input : string) => {
  // Split the input into words and convert the first letter of each word to uppercase
  const words = input.split(' ');
  const abbreviation = words.map(word => word.charAt(0).toUpperCase()).join('');

  return abbreviation;
};

const calculateAge = (dateString : any) => {
  const date = dateFormatter(dateString)
  console.log("date", date)
  const currentDate = new Date();
  const givenDate = new Date(date);

  const timeDifference = currentDate.getTime() - givenDate.getTime();
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const daysDifference = Math.floor(timeDifference / millisecondsPerDay);

  const years = Math.floor(daysDifference / 365);
  const remainingDays = daysDifference % 365;

  let result = '';
  if (years > 0) {
    result += `${years} year${years > 1 ? 's' : ''}`;
  }
  if (remainingDays > 0) {
    if (result !== '') {
      result += ' / ';
    }
    result += `${remainingDays} day${remainingDays > 1 ? 's' : ''}`;
  }

  return result || "0 Day";
};
 const getYearDDL = (countYear:number) => {
  const yearArr = [];
  for (let i = 0; i < countYear; i++) {
    yearArr.push({
      value: new Date().getFullYear() - 2 + i,
      label: "" + (new Date().getFullYear() - 2 + i),
    });
  }
  return yearArr;
}; 
const monthDDL = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];
export { focusDynamicInput, scrollToView, downloadFile, convertToAbbreviation,calculateAge,getYearDDL,monthDDL };
