import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class CheckoutInfoPage extends BasePage {
  readonly title: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.locator('.title');
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async expectLoaded(): Promise<void> {
    await this.waitForUrl(/checkout-step-one/);
    await expect(this.title).toHaveText('Checkout: Your Information');
  }

  async fillInformation(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.fill(this.firstNameInput, firstName);
    await this.fill(this.lastNameInput, lastName);
    await this.fill(this.postalCodeInput, postalCode);
  }

  async continue(): Promise<void> {
    await this.click(this.continueButton);
  }

  async fillAndContinue(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.fillInformation(firstName, lastName, postalCode);
    await this.continue();
  }
}
