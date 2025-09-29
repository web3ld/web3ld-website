import { test, expect } from '@playwright/test';
import { navigateToSection, sections } from './helpers/navigation';

test.describe('FAQ Accordion', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await navigateToSection(page, sections.faq);
  });

  test('should open and close accordion items smoothly', async ({ page }) => {
    // Get first accordion trigger button directly
    const firstTrigger = page.locator('[data-radix-collection-item]').first();
    await expect(firstTrigger).toBeVisible();
    
    // Get corresponding content wrapper
    const firstContent = page.locator('[class*="contentWrapper"]').first();
    
    // Initially should not have content visible (AnimatePresence removes it)
    const initialContentCount = await firstContent.count();
    expect(initialContentCount).toBe(0);
    
    // Click to open
    await firstTrigger.click();
    await page.waitForTimeout(400); // Wait for animation
    
    // Content should now exist and be visible
    await expect(firstContent).toBeVisible();
    
    // Verify content is rendered
    const contentText = await firstContent.textContent();
    expect(contentText?.trim()).not.toBe('');
    
    // Click to close
    await firstTrigger.click();
    await page.waitForTimeout(400); // Wait for exit animation
    
    // Content should be removed by AnimatePresence
    const finalContentCount = await page.locator('[class*="contentWrapper"]').first().count();
    expect(finalContentCount).toBe(0);
  });

  test('should allow multiple accordions open simultaneously', async ({ page }) => {
    const allTriggers = page.locator('[data-radix-collection-item]');
    const triggerCount = await allTriggers.count();
    
    if (triggerCount >= 2) {
      // Open first accordion
      await allTriggers.nth(0).click();
      await page.waitForTimeout(400);
      
      // Open second accordion
      await allTriggers.nth(1).click();
      await page.waitForTimeout(400);
      
      // Both should be visible
      const contents = page.locator('[class*="contentWrapper"]');
      const visibleCount = await contents.count();
      expect(visibleCount).toBeGreaterThanOrEqual(2);
    }
  });

  test('should display content with proper formatting', async ({ page }) => {
    const firstTrigger = page.locator('[data-radix-collection-item]').first();
    await firstTrigger.click();
    await page.waitForTimeout(400);
    
    const content = page.locator('[class*="contentWrapper"]').first();
    await expect(content).toBeVisible();
    
    // Check for formatted content
    const hasHeading = await content.locator('h4').count() > 0;
    const hasParagraph = await content.locator('p').count() > 0;
    
    expect(hasHeading || hasParagraph).toBeTruthy();
  });

  test('should handle rapid open/close actions', async ({ page }) => {
    const firstTrigger = page.locator('[data-radix-collection-item]').first();
    
    // Rapidly click 3 times
    await firstTrigger.click();
    await firstTrigger.click();
    await firstTrigger.click();
    
    await page.waitForTimeout(500);
    
    // After odd number of clicks, should be open
    const contentCount = await page.locator('[class*="contentWrapper"]').first().count();
    expect(contentCount).toBe(1);
    
    // Click once more to close
    await firstTrigger.click();
    await page.waitForTimeout(400);
    
    // Should be closed now
    const finalCount = await page.locator('[class*="contentWrapper"]').first().count();
    expect(finalCount).toBe(0);
  });
});