/**
 * Date / time helpers for daily test use
 */
export class DateUtil {
  static nowIso(): string {
    return new Date().toISOString();
  }

  static today(format: 'YYYY-MM-DD' | 'DD-MM-YYYY' = 'YYYY-MM-DD'): string {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return format === 'YYYY-MM-DD' ? `${yyyy}-${mm}-${dd}` : `${dd}-${mm}-${yyyy}`;
  }

  static addDays(days: number, from = new Date()): Date {
    const d = new Date(from);
    d.setDate(d.getDate() + days);
    return d;
  }

  static format(date: Date, format: 'YYYY-MM-DD' | 'DD-MM-YYYY' | 'YYYY-MM-DD HH:mm:ss' = 'YYYY-MM-DD'): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const mi = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');

    switch (format) {
      case 'DD-MM-YYYY':
        return `${dd}-${mm}-${yyyy}`;
      case 'YYYY-MM-DD HH:mm:ss':
        return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
      default:
        return `${yyyy}-${mm}-${dd}`;
    }
  }

  static timestamp(): string {
    return Date.now().toString();
  }

  static isPast(date: Date | string): boolean {
    return new Date(date).getTime() < Date.now();
  }
}
