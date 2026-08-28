import { describe, it, expect, beforeEach } from 'vitest';
import { Restaurant } from './restaurant.js';

describe('Restaurant - RF02 Consultar disponibilidad', () => {
  let restaurant: Restaurant;

  beforeEach(() => {
    restaurant = new Restaurant(30); // capacidad máxima por horario
  });

  it('debe haber disponibilidad cuando no existen reservas previas', () => {
    const disponible = restaurant.hasAvailability('2026-08-28', '20:00', 6);
    expect(disponible).toBe(true);
  });

  it('debe rechazar una reserva cuando se supera la capacidad máxima del horario', () => {
    restaurant.addReservation('2026-08-28', '20:00', 26);

    const disponible = restaurant.hasAvailability('2026-08-28', '20:00', 6);

    expect(disponible).toBe(false);
  });

  it('debe permitir una reserva cuando la ocupación llega exactamente a la capacidad máxima', () => {
    restaurant.addReservation('2026-08-28', '20:00', 26);

    const disponible = restaurant.hasAvailability('2026-08-28', '20:00', 4);

    expect(disponible).toBe(true);
  });

  it('debe sumar varias reservas existentes del mismo horario para calcular la ocupación total', () => {
    restaurant.addReservation('2026-08-28', '20:00', 10);
    restaurant.addReservation('2026-08-28', '20:00', 16);

    const disponible = restaurant.hasAvailability('2026-08-28', '20:00', 6);

    expect(disponible).toBe(false);
  });

  it('debe ignorar reservas de otro horario al calcular la disponibilidad', () => {
    restaurant.addReservation('2026-08-28', '21:00', 26);

    const disponible = restaurant.hasAvailability('2026-08-28', '20:00', 6);

    expect(disponible).toBe(true);
  });

  it('debe ignorar reservas de otra fecha al calcular la disponibilidad', () => {
    restaurant.addReservation('2026-08-27', '20:00', 26);

    const disponible = restaurant.hasAvailability('2026-08-28', '20:00', 6);

    expect(disponible).toBe(true);
  });
});
