import type { Locator, Page } from '@playwright/test';

/** Alertas do motor são SweetAlert2. */
export class AlertModal {
  readonly popup: Locator;
  readonly ok: Locator;

  constructor(page: Page) {
    this.popup = page.locator('.swal2-popup');
    this.ok = page.locator('.swal2-confirm');
  }
}
