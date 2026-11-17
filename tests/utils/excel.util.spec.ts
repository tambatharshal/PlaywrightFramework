import { test, expect } from '@playwright/test';
import * as path from 'path';
import { ExcelUtil, FileUtil } from '../../utils';

/**
 * Utility self-check — generates and reads a sample Excel file
 */
test.describe('ExcelUtil @utils', () => {
  const samplePath = path.join('data', 'test-data', 'sample-products.xlsx');

  test.beforeAll(() => {
    ExcelUtil.writeSheet(
      samplePath,
      [
        { product: 'Sauce Labs Backpack', price: 29.99, inStock: true },
        { product: 'Sauce Labs Bike Light', price: 9.99, inStock: true },
        { product: 'Sauce Labs Bolt T-Shirt', price: 15.99, inStock: false },
      ],
      'Products',
    );
  });

  test('reads sheet rows as JSON', async () => {
    const rows = ExcelUtil.readSheet<{ product: string; price: number; inStock: boolean }>(
      samplePath,
      'Products',
    );
    expect(rows).toHaveLength(3);
    expect(rows[0].product).toBe('Sauce Labs Backpack');
    expect(rows[0].price).toBe(29.99);
  });

  test('lists sheet names', async () => {
    expect(ExcelUtil.getSheetNames(samplePath)).toContain('Products');
  });

  test.afterAll(() => {
    // Keep the sample file for local practice; uncomment to clean up:
    // FileUtil.deleteIfExists(samplePath);
    void FileUtil;
  });
});
