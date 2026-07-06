import { test, expect } from '@playwright/test';
import { BookingPage } from '../pages/BookingPage';

test.describe('Tier 1 - UI Flows', () => {

  test('homepage loads and displays room cards', async ({ page }) => {
    const bookingPage = new BookingPage(page);

    await bookingPage.navigate();

    const roomCards = page.locator('[data-testid="room-card"]');
    await expect(roomCards).toHaveCount(3);
  });

  test('clicking book button navigates to booking form', async ({ page }) => {
    const bookingPage = new BookingPage(page);

    await bookingPage.navigate();
    await bookingPage.clickBookButton();

    await expect(page).toHaveURL(/\/booking\//);
    await expect(page.locator('[data-testid="submit-booking"]')).toBeVisible();
  });

  test('completing a valid booking shows confirmation page', async ({ page }) => {
    const bookingPage = new BookingPage(page);

    await bookingPage.navigate();
    await bookingPage.clickBookButton();

    await bookingPage.fillBookingForm({
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      phone: '1234567890',
      checkin: '2027-06-01',
      checkout: '2027-06-05',
    });

    await bookingPage.submitBooking();

    await expect(page).toHaveURL(/\/confirmation/);
    await expect(page.locator('[data-testid="confirmation-modal"]')).toBeVisible();
    await expect(page.locator('[data-testid="booking-id"]')).toBeVisible();
  });

});