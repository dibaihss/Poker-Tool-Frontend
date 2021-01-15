import { Injectable } from "@angular/core";
import * as FileSaver from "file-saver";

const CSV_EXTENSION = ".csv";
const CSV_TYPE = "text/plain;charset=utf-8";

@Injectable({
  providedIn: "root",
})
export class ExportService {
  constructor() {}

  private saveAsFile(buffer: any, fileName: string, fileType: string): void {
    const data: Blob = new Blob([buffer], { type: fileType });
    FileSaver.saveAs(data, fileName);
  }

  public exportToCsv(
    rows: object[],
    fileName: string,
    columns?: string[]
  ): string {
    if (!rows || !rows.length) {
      return;
    }
    const separator = ",";
    const keys = Object.keys(rows[0]).filter((k) => {
      console.log(k);
      // k contains all the object keys
      if (columns?.length) {
        return columns.includes(k);
      } else {
        return true;
      }
    });
    console.log(rows);
    // rows is the array
    const csvContent =
      keys.join(separator) +
      "\n" +
      rows
        .map((row) => {
          return keys
            .map((k) => {
              let cell = row[k] === null || row[k] === undefined ? "" : row[k];
              console.log(row[k]);
              // row[k] contains all the values of each object keys
              cell =
                cell instanceof Date
                  ? cell.toLocaleString()
                  : cell.toString().replace(/"/g, '""');
              if (cell.search(/("|,|\n)/g) >= 0) {
                cell = `"${cell}"`;
              }
              return cell;
            })
            .join(separator);
        })
        .join("\n");
    this.saveAsFile(csvContent, `${fileName}${CSV_EXTENSION}`, CSV_TYPE);
  }
}
