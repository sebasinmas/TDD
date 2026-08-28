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
});
