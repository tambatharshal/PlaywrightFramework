/**
 * Explicit wait / retry helpers (use sparingly; prefer Playwright auto-waiting)
 */
export class WaitUtil {
  static async sleep(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }

  static async waitUntil(
    condition: () => Promise<boolean> | boolean,
    options: { timeoutMs?: number; intervalMs?: number; message?: string } = {},
  ): Promise<void> {
    const timeoutMs = options.timeoutMs ?? 10000;
    const intervalMs = options.intervalMs ?? 250;
    const start = Date.now();

    while (Date.now() - start < timeoutMs) {
      if (await condition()) return;
      await this.sleep(intervalMs);
    }

    throw new Error(options.message || `Condition not met within ${timeoutMs}ms`);
  }

  static async retry<T>(
    fn: () => Promise<T>,
    options: { retries?: number; delayMs?: number } = {},
  ): Promise<T> {
    const retries = options.retries ?? 3;
    const delayMs = options.delayMs ?? 500;
    let lastError: unknown;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        if (attempt < retries) await this.sleep(delayMs * attempt);
      }
    }

    throw lastError;
  }
}
