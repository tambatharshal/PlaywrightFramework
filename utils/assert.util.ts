import { expect } from '@playwright/test';

/**
 * Soft / domain assertion helpers used across UI + API tests
 */
export class AssertUtil {
  static statusIn(actual: number, allowed: number[]): void {
    expect(allowed, `Status ${actual} not in [${allowed.join(', ')}]`).toContain(actual);
  }

  static notEmpty(value: string | unknown[] | null | undefined, label = 'value'): void {
    if (Array.isArray(value)) {
      expect(value.length, `${label} should not be empty`).toBeGreaterThan(0);
    } else {
      expect(value, `${label} should not be empty`).toBeTruthy();
    }
  }

  static equalsIgnoreCase(actual: string, expected: string): void {
    expect(actual.toLowerCase()).toBe(expected.toLowerCase());
  }

  static containsAll(haystack: string, needles: string[]): void {
    for (const needle of needles) {
      expect(haystack, `Expected to contain "${needle}"`).toContain(needle);
    }
  }
}
