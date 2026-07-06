import { Page } from '@playwright/test'

export class BookingPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigate() {
        await this.page.goto('/');
    }

    async clickBookButton() {
        await this.page.locator('[data-testid="book-button"]').first().click();
    }

    async fillBookingForm(data: {
        firstname: string;
        lastname: string;
        email: string;
        phone: string;
        checkin: string;
        checkout: string;
        }) {
        await this.page.locator('[data-testid="firstname"]').waitFor();
        await this.page.locator('[data-testid="firstname"]').fill(data.firstname);
        await this.page.locator('[data-testid="lastname"]').fill(data.lastname);
        await this.page.locator('[data-testid="email"]').fill(data.email);
        await this.page.locator('[data-testid="phone"]').fill(data.phone);
        await this.page.locator('[data-testid="checkin"]').fill(data.checkin);
        await this.page.locator('[data-testid="checkout"]').fill(data.checkout);
        }

    async submitBooking() {
        await this.page.locator('[data-testid="submit-booking"]').click();
    }

    async getErrorMessage(field: string) {
        return await this.page.locator(`[data-testid="${field}-error"]`).textContent();
    }
}