import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Excel utility — read/write .xlsx for data-driven tests
 */
export class ExcelUtil {
  static readSheet<T extends Record<string, unknown> = Record<string, unknown>>(
    filePath: string,
    sheetName?: string,
  ): T[] {
    const absolute = path.resolve(filePath);
    if (!fs.existsSync(absolute)) {
      throw new Error(`Excel file not found: ${absolute}`);
    }

    const workbook = XLSX.readFile(absolute);
    const name = sheetName || workbook.SheetNames[0];
    const sheet = workbook.Sheets[name];
    if (!sheet) {
      throw new Error(`Sheet "${name}" not found. Available: ${workbook.SheetNames.join(', ')}`);
    }
    return XLSX.utils.sheet_to_json<T>(sheet, { defval: '' });
  }

  static readCell(filePath: string, sheetName: string, cellAddress: string): string | number | boolean | Date | undefined {
    const workbook = XLSX.readFile(path.resolve(filePath));
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) throw new Error(`Sheet "${sheetName}" not found`);
    const cell = sheet[cellAddress];
    return cell?.v;
  }

  static writeSheet(
    filePath: string,
    data: Record<string, unknown>[],
    sheetName = 'Sheet1',
  ): void {
    const absolute = path.resolve(filePath);
    const dir = path.dirname(absolute);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const workbook = XLSX.utils.book_new();
    const sheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, sheet, sheetName);
    XLSX.writeFile(workbook, absolute);
  }

  static appendRows(
    filePath: string,
    rows: Record<string, unknown>[],
    sheetName = 'Sheet1',
  ): void {
    const absolute = path.resolve(filePath);
    let existing: Record<string, unknown>[] = [];
    if (fs.existsSync(absolute)) {
      existing = this.readSheet(absolute, sheetName);
    }
    this.writeSheet(absolute, [...existing, ...rows], sheetName);
  }

  static getSheetNames(filePath: string): string[] {
    const workbook = XLSX.readFile(path.resolve(filePath));
    return workbook.SheetNames;
  }
}
