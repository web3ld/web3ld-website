import { test, expect } from '@playwright/test';
import { openMenu, closeMenu, navigateToSection, sections, waitForSectionInView } from './helpers/navigation';

test.describe('Menu Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should open and close menu', async ({ page }) => {
    await openMenu(page);
    await closeMenu(page);
  });

  test('should navigate to sponsor section', async ({ page }) => {
    await navigateToSection(page, sections.sponsor);
  });

  test('should navigate to faq section', async ({ page }) => {
    await navigateToSection(page, sections.faq);
  });

  test('should navigate to contact section', async ({ page }) => {
    await navigateToSection(page, sections.contact);
  });

  test('should update URL when scrolling to sections', async ({ page }) => {
    // Scroll to sponsor
    await page.locator('#sponsor').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500); // Wait for scroll animation
    await waitForSectionInView(page, sections.sponsor);

    // Scroll to faq
    await page.locator('#faq').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await waitForSectionInView(page, sections.faq);

    // Scroll to contact
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await waitForSectionInView(page, sections.contact);
  });

  test('should highlight active menu item when section is in view', async ({ page }) => {
    await navigateToSection(page, sections.faq);
    
    // Open menu to check active state
    await openMenu(page);
    
    const activeItem = page.getByRole('navigation').getByRole('button', { 
      name: /faq/i 
    });
    
    // Check for active class (adjust selector based on your styles)
    await expect(activeItem).toHaveClass(/active/);
    
    await closeMenu(page);
  });

  test('menu navigation flow - open, close, navigate', async ({ page }) => {
    // Open menu
    await openMenu(page);
    
    // Close menu
    await closeMenu(page);
    
    // Open again and navigate
    await navigateToSection(page, sections.contact);
    
    // Verify we're at contact section
    await expect(page).toHaveURL('/#contact');
    await expect(page.locator('#contact')).toBeInViewport();
  });
});