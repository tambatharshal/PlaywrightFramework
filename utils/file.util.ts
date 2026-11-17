import * as fs from 'fs';
import * as path from 'path';

/**
 * File system helpers for downloads, fixtures, and temp artifacts
 */
export class FileUtil {
  static ensureDir(dirPath: string): void {
    const absolute = path.resolve(dirPath);
    if (!fs.existsSync(absolute)) {
      fs.mkdirSync(absolute, { recursive: true });
    }
  }

  static readJson<T>(filePath: string): T {
    const content = fs.readFileSync(path.resolve(filePath), 'utf-8');
    return JSON.parse(content) as T;
  }

  static writeJson(filePath: string, data: unknown, pretty = true): void {
    const absolute = path.resolve(filePath);
    this.ensureDir(path.dirname(absolute));
    fs.writeFileSync(absolute, JSON.stringify(data, null, pretty ? 2 : 0), 'utf-8');
  }

  static exists(filePath: string): boolean {
    return fs.existsSync(path.resolve(filePath));
  }

  static deleteIfExists(filePath: string): void {
    const absolute = path.resolve(filePath);
    if (fs.existsSync(absolute)) fs.unlinkSync(absolute);
  }

  static listFiles(dirPath: string, extension?: string): string[] {
    const absolute = path.resolve(dirPath);
    if (!fs.existsSync(absolute)) return [];
    return fs
      .readdirSync(absolute)
      .filter((f) => (extension ? f.endsWith(extension) : true))
      .map((f) => path.join(absolute, f));
  }

  static copy(src: string, dest: string): void {
    const destAbs = path.resolve(dest);
    this.ensureDir(path.dirname(destAbs));
    fs.copyFileSync(path.resolve(src), destAbs);
  }
}
