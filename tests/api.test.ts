import { test, expect } from '@playwright/test';

test.describe('Tier 2 - API Tests', () => {

  test('GET /api/rooms returns 3 rooms', async ({ request }) => {
    const response = await request.get('http://localhost:5000/api/rooms');

    expect(response.status()).toBe(200);

    const rooms = await response.json();
    expect(rooms).toHaveLength(3);
    expect(rooms[0]).toHaveProperty('name');
    expect(rooms[0]).toHaveProperty('price');
  });

  test('POST /api/bookings creates a booking successfully', async ({ request }) => {
    const response = await request.post('http://localhost:5000/api/bookings', {
      data: {
        firstname: 'Jane',
        lastname: 'Smith',
        email: 'jane@example.com',
        phone: '0987654321',
        checkin: '2027-07-01',
        checkout: '2027-07-05',
        roomID: 1
      }
    });

    expect(response.status()).toBe(201);

    const booking = await response.json();
    expect(booking).toHaveProperty('id');
    expect(booking.firstname).toBe('Jane');
    expect(booking.email).toBe('jane@example.com');
  });

  test('POST /api/bookings returns 400 when fields are missing', async ({ request }) => {
    const response = await request.post('http://localhost:5000/api/bookings', {
      data: {
        firstname: 'Jane',
        lastname: 'Smith'
      }
    });

    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body).toHaveProperty('error');
  });

  test('DELETE /api/bookings/:id removes a booking', async ({ request }) => {
    // First create a booking to delete
    const createResponse = await request.post('http://localhost:5000/api/bookings', {
      data: {
        firstname: 'Delete',
        lastname: 'Me',
        email: 'delete@example.com',
        phone: '1111111111',
        checkin: '2027-08-01',
        checkout: '2027-08-05',
        roomID: 1
      }
    });

    const booking = await createResponse.json();

    // Then delete it
    const deleteResponse = await request.delete(
      `http://localhost:5000/api/bookings/${booking.id}`
    );

    expect(deleteResponse.status()).toBe(204);
  });

});