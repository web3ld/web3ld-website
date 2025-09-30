import { test, expect } from '@playwright/test';
import { navigateToSection, sections } from './helpers/navigation';

test.describe('Contact Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await navigateToSection(page, sections.contact);
  });

  test('should render all form fields', async ({ page }) => {
    await expect(page.getByLabel(/name.*alias/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/org.*project/i)).toBeVisible();
    await expect(page.getByLabel(/title.*role/i)).toBeVisible();
    await expect(page.getByLabel(/message/i)).toBeVisible();
    
    // Turnstile widget
    await expect(page.frameLocator('iframe[src*="turnstile"]')).toBeTruthy();
  });

  test('should validate required fields', async ({ page }) => {
    const submitBtn = page.getByRole('button', { name: /send message/i });
    await submitBtn.click();
    
    // Should show validation errors
    await expect(page.getByText(/name is required/i)).toBeVisible();
    await expect(page.getByText(/email is required/i)).toBeVisible();
  });

  test('should validate email format', async ({ page }) => {
    const emailInput = page.getByLabel(/email/i);
    await emailInput.fill('invalid-email');
    
    const messageInput = page.getByLabel(/message/i);
    await messageInput.fill('Test message here with enough characters');
    
    // Click away to remove focus and dismiss native tooltip
    await page.locator('body').click({ position: { x: 0, y: 0 } });
    
    // Trigger validation by clicking submit
    const submitBtn = page.getByRole('button', { name: /send message/i });
    await submitBtn.click();
    
    // Wait for validation to complete
    await page.waitForTimeout(100);
    
    // Find the error span by its ID and scroll into view
    const errorSpan = page.locator('#email-error');
    await errorSpan.scrollIntoViewIfNeeded();
    await expect(errorSpan).toBeVisible();
    await expect(errorSpan).toHaveText(/please enter a valid email address/i);
  });

  test('should show character count for message', async ({ page }) => {
    const message = 'Hello world!';
    await page.getByLabel(/message/i).fill(message);
    
    await expect(page.getByText(`${message.length} / 3000`)).toBeVisible();
  });

  test('should respect maxLength on inputs', async ({ page }) => {
    const longName = 'a'.repeat(100);
    await page.getByLabel(/name.*alias/i).fill(longName);
    
    const value = await page.getByLabel(/name.*alias/i).inputValue();
    expect(value.length).toBeLessThanOrEqual(50);
  });
});

// Full integration test - only runs when RUN_CONTACT_TESTS is set
test.describe('Contact Form - Local Worker Integration', () => {
  test.skip(() => {
    return !process.env.RUN_CONTACT_TESTS;
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await navigateToSection(page, sections.contact);
  });

  test('should submit form to local worker', async ({ page }) => {
    await page.getByLabel(/name.*alias/i).fill('Local Test');
    await page.getByLabel(/email/i).fill('local@test.com');
    await page.getByLabel(/message/i).fill('Testing against local Cloudflare Worker instance.');
    
    // Wait for Turnstile to load and auto-complete (test key auto-passes)
    await page.waitForTimeout(3000);
    
    await page.getByRole('button', { name: /send message/i }).click();
    
    // Use getByRole for the dialog and scroll into view
    const dialog = page.getByRole('dialog');
    await dialog.scrollIntoViewIfNeeded();
    await expect(dialog).toBeVisible({ timeout: 10000 });
    
    // Check the modal message text
    const modalMessage = page.locator('[class*="modalMessage"]');
    await expect(modalMessage).toBeVisible();
    const modalText = await modalMessage.textContent();
    expect(modalText).toMatch(/success|dev mode|thank you/i);
  });
});
