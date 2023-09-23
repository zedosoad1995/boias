import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

interface DataObject {
  sheetName: string;
  data: any[];
}

export const downloadExcel = (multiData: DataObject[]) => {
  const wb: XLSX.WorkBook = XLSX.utils.book_new();

  multiData.forEach((dataObj, index) => {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataObj.data);
    XLSX.utils.book_append_sheet(wb, ws, dataObj.sheetName || `Sheet${index + 1}`);
  });

  const excelBuffer: any = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob: Blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  });
  saveAs(blob, "boias-do-algarve.xlsx");
};

export const downloadSelectedExcel = (data: any[]) => {
  const wb: XLSX.WorkBook = XLSX.utils.book_new();

  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, "Pág. 1");

  const excelBuffer: any = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob: Blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  });
  saveAs(blob, "boias-do-algarve.xlsx");
};

export const subsample = <T = any>(data: T[], maxSize = 100) => {
  const sampleFactor = Math.ceil(data.length / maxSize);

  return data.filter((_, index) => index % sampleFactor === 0);
};

export const filterByDate = (array: any[], option: string) => {
  const now = new Date();
  const nowTime = now.getTime();
  let startDate: Date;

  switch (option) {
    case "today":
      startDate = new Date(nowTime - 1 * 24 * 60 * 60 * 1000);
      break;
    case "last_week":
      startDate = new Date(nowTime - 7 * 24 * 60 * 60 * 1000);
      break;
    case "last_month":
      startDate = new Date(nowTime - 30 * 24 * 60 * 60 * 1000);
      break;
    case "last_year":
      startDate = new Date(nowTime - 365 * 24 * 60 * 60 * 1000);
      break;
    case "total":
      return array;
  }

  return array.filter((item) => {
    const itemDate = new Date(item.SDATA);
    return itemDate >= startDate && itemDate <= now;
  });
};
