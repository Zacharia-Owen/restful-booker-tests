import { test, expect } from '@playwright/test'
import { BookingPage } from '../pages/BookingPage'

test('homepage loads successfully', async ({ page }) => {
    const bookingPage = new BookingPage(page);

    await bookingPage.navigate();

    await expect(page).toHaveURL(/automationintesting.online/);
    await expect(page.locator('body')).toBeVisible();
});
