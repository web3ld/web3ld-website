import { Page, expect } from '@playwright/test';

export const sections = {
  sponsor: 'sponsor',
  faq: 'faq',
  contact: 'contact',
} as const;

export type Section = typeof sections[keyof typeof sections];

export async function openMenu(page: Page) {
  await page.getByRole('button', { name: /open menu/i }).click();
  await expect(page.getByRole('navigation', { name: /main navigation/i })).toBeVisible();
}

export async function closeMenu(page: Page) {
  // Click the X button inside the menu (not the hamburger)
  await page.getByRole('navigation', { name: /main navigation/i })
    .getByRole('button', { name: /close menu/i }).click();
  
  // Wait for animation to complete (0.4s transition in CSS)
  await page.waitForTimeout(600);
  
  // Check that .open class is removed (menu slides off-screen but stays in DOM)
  await expect(page.getByRole('navigation', { name: /main navigation/i }))
    .not.toHaveClass(/open/);
}

export async function navigateToSection(page: Page, section: Section) {
  await openMenu(page);
  
  // Click the section link in the menu
  const menuButton = page.getByRole('navigation').getByRole('button', { 
    name: new RegExp(section, 'i') 
  });
  await menuButton.click();
  
  // Wait for animation to complete and menu to close
  await page.waitForTimeout(800);
  
  // Wait for section to be in view and URL to update
  await expect(page).toHaveURL(`/#${section}`, { timeout: 3000 });
  await expect(page.locator(`#${section}`)).toBeInViewport({ timeout: 3000 });
}

export async function waitForSectionInView(page: Page, section: Section) {
  await expect(page.locator(`#${section}`)).toBeInViewport({ timeout: 5000 });
  await expect(page).toHaveURL(`/#${section}`, { timeout: 5000 });
}