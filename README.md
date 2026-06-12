#  Restful Booker Tests

A Playwright/TypeScript automated test suite for the Booking Hotels application. This project covers three tiers of testing: UI end-to-end flows, REST API testing, and edge case validation.

## Tech Stack

- Playwright (browser automation and API testing)
- TypeScript
- Node.js

## Test Coverage

### Tier 1 — UI Flows
End to end tests that control a real browser and simulate user journeys.

- Homepage loads and displays available rooms
- Clicking Book navigates to the booking form
- Completing a valid booking redirects to confirmation page
- Confirmation page displays a unique booking ID

### Tier 2 — API Testing
Direct HTTP tests against the REST API using Playwright's request utilities.

- GET /api/rooms returns all rooms
- POST /api/bookings creates a booking successfully
- POST /api/bookings returns 400 when fields are missing
- DELETE /api/bookings/:id removes a booking

### Tier 3 — Edge Cases and Validation
Tests that verify the application handles invalid input correctly.

- Submitting blank form fields shows correct error messages
- Invalid email format (e.g. test@com) shows email error
- Letters in phone number field shows phone error
- Check-out date before check-in date shows date error

## Getting Started

### Prerequisites

- Node.js v18 or higher
- The Booking Hotels app running locally (see companion repo)

### Installation

```bash
npm install
npx playwright install chromium
```

### Running the Tests

Run all tests:
```bash
npx playwright test
```

Run a specific tier:
```bash
npx playwright test booking.test.ts
npx playwright test api.test.ts
npx playwright test validation.test.ts
```

Run in headed mode (watch the browser):
```bash
npx playwright test --headed
```

View the test report:
```bash
npx playwright show-report
```

## Configuration

Tests run against `http://localhost:5173` by default. The backend is expected at `http://localhost:5000`.

To change the target URL update `baseURL` in `playwright.config.ts`.

## Design Decisions

**Page Object Model:** All UI locators live in the `pages/` folder rather than scattered across test files. This means if a selector changes, it only needs updating in one place.

**data-testid selectors:** Tests use `data-testid` attributes rather than CSS classes or text content. This makes tests resilient to UI redesigns — a button can be restyled or renamed without breaking any tests.

**API tests alongside UI tests:** Testing the API directly catches bugs that UI tests might miss, such as missing field validation or incorrect HTTP status codes.

## Companion Repository

The application being tested lives here:
[booking-hotels](https://github.com/Zacharia-Owen/booking-hotels)