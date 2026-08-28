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

  it('checks available capacity for a date and time', () => {
    restaurant.createReservation({
      customerName: 'Ana Perez',
      partySize: 26,
      date: '2026-09-01',
      time: '20:00',
    });

    expect(restaurant.hasAvailability('2026-09-01', '20:00', 4)).toBe(true);
    expect(restaurant.hasAvailability('2026-09-01', '20:00', 5)).toBe(false);
  });

  it.each([
    {
      caseName: 'empty date',
      date: '',
      time: '20:00',
      message: 'La fecha es obligatoria',
    },
    {
      caseName: 'empty time',
      date: '2026-09-01',
      time: '',
      message: 'La hora es obligatoria',
    },
  ])('rejects invalid availability query data: $caseName', ({ date, time, message }) => {
    expect(() => restaurant.hasAvailability(date, time, 1)).toThrow(message);
  });

  it('rejects a reservation when requested capacity is insufficient', () => {
    restaurant.createReservation({
      customerName: 'Ana Perez',
      partySize: 26,
      date: '2026-09-01',
      time: '20:00',
    });

    expect(() =>
      restaurant.createReservation({
        customerName: 'Luis Diaz',
        partySize: 5,
        date: '2026-09-01',
        time: '20:00',
      }),
    ).toThrow('No hay disponibilidad para la fecha y hora solicitada');
  });

  it('cancels an active reservation', () => {
    const reservation = restaurant.createReservation({
      customerName: 'Ana Perez',
      partySize: 4,
      date: '2026-09-01',
      time: '20:00',
    });

    const cancelledReservation = restaurant.cancelReservation(reservation.code);

    expect(cancelledReservation.status).toBe('cancelled');
  });

  it('rejects cancellation with a non-existing reservation code', () => {
    expect(() => restaurant.cancelReservation('RES-9999')).toThrow('Reserva no encontrada');
  });

  it('rejects cancellation without a reservation code', () => {
    expect(() => restaurant.cancelReservation('')).toThrow('El código de reserva es obligatorio');
  });

  it('rejects cancellation of an already cancelled reservation', () => {
    const reservation = restaurant.createReservation({
      customerName: 'Ana Perez',
      partySize: 4,
      date: '2026-09-01',
      time: '20:00',
    });

    restaurant.cancelReservation(reservation.code);

    expect(() => restaurant.cancelReservation(reservation.code)).toThrow(
      'La reserva ya fue cancelada',
    );
  });

  it('recovers capacity after a reservation is cancelled', () => {
    const reservation = restaurant.createReservation({
      customerName: 'Ana Perez',
      partySize: 30,
      date: '2026-09-01',
      time: '20:00',
    });

    restaurant.cancelReservation(reservation.code);

    expect(restaurant.hasAvailability('2026-09-01', '20:00', 30)).toBe(true);
  });

  it('lists active reservations for a requested date', () => {
    const firstReservation = restaurant.createReservation({
      customerName: 'Ana Perez',
      partySize: 2,
      date: '2026-09-01',
      time: '20:00',
    });
    const secondReservation = restaurant.createReservation({
      customerName: 'Luis Diaz',
      partySize: 3,
      date: '2026-09-01',
      time: '19:00',
    });
    restaurant.createReservation({
      customerName: 'Marta Soto',
      partySize: 4,
      date: '2026-09-02',
      time: '20:00',
    });

    expect(restaurant.getReservationsByDate('2026-09-01')).toEqual([
      secondReservation,
      firstReservation,
    ]);
  });

  it('rejects reservation listing without a date', () => {
    expect(() => restaurant.getReservationsByDate('')).toThrow('La fecha es obligatoria');
  });

  it('normalizes the requested date before listing reservations', () => {
    const reservation = restaurant.createReservation({
      customerName: 'Ana Perez',
      partySize: 2,
      date: '2026-09-01',
      time: '20:00',
    });

    expect(restaurant.getReservationsByDate(' 2026-09-01 ')).toEqual([reservation]);
  });

  it('excludes cancelled reservations from the date listing by default', () => {
    const reservation = restaurant.createReservation({
      customerName: 'Ana Perez',
      partySize: 2,
      date: '2026-09-01',
      time: '20:00',
    });
    restaurant.cancelReservation(reservation.code);

    expect(restaurant.getReservationsByDate('2026-09-01')).toEqual([]);
    expect(restaurant.getReservationsByDate('2026-09-01', { includeCancelled: true })).toEqual([
      { ...reservation, status: 'cancelled' },
    ]);
  });
});
