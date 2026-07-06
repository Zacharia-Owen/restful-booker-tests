import { test, expect } from '@playwright/test';
import { BookingPage } from '../pages/BookingPage';

test.describe('Tier 3 - Edge Cases and Validation', () => {

  test('submitting empty form shows all required field errors', async ({ page }) => {
    const bookingPage = new BookingPage(page);

    await bookingPage.navigate();
    await bookingPage.clickBookButton();
    await bookingPage.submitBooking();

    await expect(page.locator('[data-testid="firstname-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="lastname-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="email-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="phone-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="checkin-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="checkout-error"]')).toBeVisible();
  });

  test('invalid email format shows email error', async ({ page }) => {
    const bookingPage = new BookingPage(page);

    await bookingPage.navigate();
    await bookingPage.clickBookButton();

    await page.locator('[data-testid="firstname"]').waitFor();
    await page.locator('[data-testid="firstname"]').fill('John');
    await page.locator('[data-testid="lastname"]').fill('Doe');
    await page.locator('[data-testid="email"]').fill('test@com');
    await page.locator('[data-testid="phone"]').fill('1234567890');
    await page.locator('[data-testid="checkin"]').fill('2027-06-01');
    await page.locator('[data-testid="checkout"]').fill('2027-06-05');

    await bookingPage.submitBooking();

    await expect(page.locator('[data-testid="email-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="email-error"]')).toHaveText('Please enter a valid email address');
    await expect(page.locator('[data-testid="confirmation-modal"]')).not.toBeVisible();
  });

  test('letters in phone number shows phone error', async ({ page }) => {
    const bookingPage = new BookingPage(page);

    await bookingPage.navigate();
    await bookingPage.clickBookButton();

    await page.locator('[data-testid="firstname"]').waitFor();
    await page.locator('[data-testid="firstname"]').fill('John');
    await page.locator('[data-testid="lastname"]').fill('Doe');
    await page.locator('[data-testid="email"]').fill('john@example.com');
    await page.locator('[data-testid="phone"]').fill('123abc456');
    await page.locator('[data-testid="checkin"]').fill('2027-06-01');
    await page.locator('[data-testid="checkout"]').fill('2027-06-05');

    await bookingPage.submitBooking();

    await expect(page.locator('[data-testid="phone-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="phone-error"]')).toHaveText('Phone number must contain numbers only');
    await expect(page.locator('[data-testid="confirmation-modal"]')).not.toBeVisible();
  });

  test('checkout before checkin shows date error', async ({ page }) => {
    const bookingPage = new BookingPage(page);

    await bookingPage.navigate();
    await bookingPage.clickBookButton();

    await page.locator('[data-testid="firstname"]').waitFor();
    await page.locator('[data-testid="firstname"]').fill('John');
    await page.locator('[data-testid="lastname"]').fill('Doe');
    await page.locator('[data-testid="email"]').fill('john@example.com');
    await page.locator('[data-testid="phone"]').fill('1234567890');
    await page.locator('[data-testid="checkin"]').fill('2027-06-10');
    await page.locator('[data-testid="checkout"]').fill('2027-06-01');

    await bookingPage.submitBooking();

    await expect(page.locator('[data-testid="checkout-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="checkout-error"]')).toHaveText('Check-out date must be after check-in date');
  });

  test('API rejects booking with missing fields', async ({ request }) => {
    const response = await request.post('http://localhost:5000/api/bookings', {
      data: {
        firstname: 'John'
      }
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toBe('All fields are required');
  });

  test('API rejects booking with invalid room ID', async ({ request }) => {
    const response = await request.post('http://localhost:5000/api/bookings', {
      data: {
        firstname: 'John',
        lastname: 'Doe',
        email: 'john@example.com',
        phone: '1234567890',
        checkin: '2027-06-01',
        checkout: '2027-06-05',
        roomID: 99999
      }
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toBe('Room does not exist');
  });

});