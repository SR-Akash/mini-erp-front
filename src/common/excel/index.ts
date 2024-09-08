import { Workbook } from "exceljs";
import { toast } from "react-toastify";

function createObject(keys: any, values: any): Record<string, any> {
  let obj: Record<string, any> = {};
  for (let index = 0; index < keys.length; index++) {
    if (keys[index] != null && keys[index] != undefined) {
      obj[keys[index]] = values[index];
    }
  }
  return obj;
}

export const excelFileToArray = (file: any, sheetName: string) => {
  return new Promise((resolve, reject) => {
    const workbook = new Workbook();
    const data: any = [];
    workbook.xlsx
      .load(file)
      .then(function () {
        const worksheet = workbook.getWorksheet(sheetName);
        if (!worksheet) return toast.warning("Sheet name does not match");
        const firstRowValues = worksheet.getRow(1).values;

        worksheet.eachRow((row, rowIndex) => {
          if (rowIndex !== 1) {
            data.push(createObject(firstRowValues, row.values));
          }
        });
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
