/**
 * String / random data helpers
 */
export class StringUtil {
  static randomAlpha(length = 8): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  }

  static randomNumeric(length = 6): string {
    return Array.from({ length }, () => Math.floor(Math.random() * 10).toString()).join('');
  }

  static randomAlphanumeric(length = 10): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  }

  static randomEmail(domain = 'example.com'): string {
    return `auto_${this.randomAlphanumeric(8)}@${domain}`;
  }

  static slugify(value: string): string {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  static mask(value: string, visible = 4): string {
    if (value.length <= visible) return '*'.repeat(value.length);
    return `${'*'.repeat(value.length - visible)}${value.slice(-visible)}`;
  }
}
