import { beforeEach, describe, expect, it } from 'vitest';
import { Restaurant } from './restaurant.js';

describe('Restaurant reservations', () => {
  let restaurant: Restaurant;

  beforeEach(() => {
    restaurant = new Restaurant(30);
  });

  it('creates a reservation with a unique reservation code', () => {
    const firstReservation = restaurant.createReservation({
      customerName: 'Ana Perez',
      partySize: 4,
      date: '2026-09-01',
      time: '20:00',
    });
    const secondReservation = restaurant.createReservation({
      customerName: 'Luis Diaz',
      partySize: 2,
      date: '2026-09-01',
      time: '21:00',
    });

    expect(firstReservation).toMatchObject({
      customerName: 'Ana Perez',
      partySize: 4,
      date: '2026-09-01',
      time: '20:00',
      status: 'active',
    });
    expect(firstReservation.code).toMatch(/^RES-\d{4}$/);
    expect(secondReservation.code).not.toBe(firstReservation.code);
  });

  it.each([
    {
      caseName: 'empty customer name',
      input: { customerName: '', partySize: 2, date: '2026-09-01', time: '20:00' },
      message: 'El nombre del cliente es obligatorio',
    },
    {
      caseName: 'party size equal to zero',
      input: { customerName: 'Ana Perez', partySize: 0, date: '2026-09-01', time: '20:00' },
      message: 'La cantidad de personas debe ser mayor que cero',
    },
    {
      caseName: 'negative party size',
      input: { customerName: 'Ana Perez', partySize: -1, date: '2026-09-01', time: '20:00' },
      message: 'La cantidad de personas debe ser mayor que cero',
    },
    {
      caseName: 'empty date',
      input: { customerName: 'Ana Perez', partySize: 2, date: '', time: '20:00' },
      message: 'La fecha es obligatoria',
    },
    {
      caseName: 'empty time',
      input: { customerName: 'Ana Perez', partySize: 2, date: '2026-09-01', time: '' },
      message: 'La hora es obligatoria',
    },
  ])('rejects invalid reservation data: $caseName', ({ input, message }) => {
    expect(() => restaurant.createReservation(input)).toThrow(message);
  });
});
