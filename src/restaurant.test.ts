import { describe, it, expect, beforeEach } from 'vitest';
import {
  Restaurant,
  Reserva,
  Customer,
  InvalidReservationIdError,
  ReservationNotFoundError,
  ReservationAlreadyCancelledError,
} from './restaurant.js';

// ==========================================
// Test Data Builders (Mejora de DX y Legibilidad)
// ==========================================
function createCustomer(id = 'c-1', name = 'Cliente Test'): Customer {
  return new Customer(id, name);
}

function createReservation(options: {
  id?: string;
  customerCount?: number;
  date?: string;
  status?: 'active' | 'cancelled';
} = {}): Reserva {
  const {
    id = 'res-1',
    customerCount = 1,
    date = '2026-09-01',
    status = 'active',
  } = options;

  const customers = Array.from({ length: customerCount }, (_, i) =>
    createCustomer(`cust-${i + 1}`, `Cliente ${i + 1}`)
  );

  return new Reserva(id, customers, date, status);
}

describe('Restaurant - RF03: Cancelar Reserva (Ciclo TDD - Refactor)', () => {
  let restaurant: Restaurant;

  beforeEach(() => {
    restaurant = new Restaurant(10);
  });

  describe('1. Cancelación con código válido', () => {
    it('debe cancelar una reserva existente y cambiar su estado a "cancelled"', () => {
      const reserva = createReservation({ id: 'res-100' });
      restaurant.addReservation(reserva);

      const cancelled = restaurant.cancelReservation('res-100');

      expect(cancelled.id).toBe('res-100');
      expect(cancelled.isCancelled()).toBe(true);
      expect(cancelled.status).toBe('cancelled');
    });

    it('debe permitir cancelar pasando un código con espacios en blanco en los extremos (trim)', () => {
      const reserva = createReservation({ id: 'res-trim' });
      restaurant.addReservation(reserva);

      const cancelled = restaurant.cancelReservation('   res-trim   ');

      expect(cancelled.id).toBe('res-trim');
      expect(cancelled.isCancelled()).toBe(true);
    });
  });

  describe('2. Manejo de código inexistente', () => {
    it('debe lanzar ReservationNotFoundError cuando el código no existe', () => {
      expect(() => restaurant.cancelReservation('res-no-existe')).toThrow(
        ReservationNotFoundError
      );
      expect(() => restaurant.cancelReservation('res-no-existe')).toThrow(
        'Reserva no encontrada con ID: res-no-existe'
      );
    });
  });

  describe('3. Manejo de reserva previamente cancelada', () => {
    it('debe lanzar ReservationAlreadyCancelledError al intentar cancelar por segunda vez', () => {
      const reserva = createReservation({ id: 'res-200' });
      restaurant.addReservation(reserva);

      restaurant.cancelReservation('res-200');

      expect(() => restaurant.cancelReservation('res-200')).toThrow(
        ReservationAlreadyCancelledError
      );
      expect(() => restaurant.cancelReservation('res-200')).toThrow(
        'La reserva ya fue cancelada'
      );
    });
  });

  describe('4. Liberación de capacidad y disponibilidad', () => {
    it('debe liberar exactamente la capacidad correspondiente tras cancelar una reserva', () => {
      const rest = new Restaurant(10);
      const reserva = createReservation({ id: 'res-4p', customerCount: 4, date: '2026-09-01' });
      rest.addReservation(reserva);

      expect(rest.getAvailableCapacity('2026-09-01')).toBe(6);

      rest.cancelReservation('res-4p');

      expect(rest.getAvailableCapacity('2026-09-01')).toBe(10);
    });

    it('debe permitir nuevas reservas al liberar capacidad tras la cancelación', () => {
      const rest = new Restaurant(4);
      const reserva = createReservation({ id: 'res-llena', customerCount: 4, date: '2026-09-01' });
      rest.addReservation(reserva);

      expect(rest.hasAvailability('2026-09-01', 2)).toBe(false);

      rest.cancelReservation('res-llena');

      expect(rest.hasAvailability('2026-09-01', 2)).toBe(true);
    });

    it('debe retornar false si la cantidad de personas solicitada es menor o igual a cero', () => {
      expect(restaurant.hasAvailability('2026-09-01', 0)).toBe(false);
      expect(restaurant.hasAvailability('2026-09-01', -2)).toBe(false);
    });

    it('no debe afectar la capacidad de otras fechas al cancelar una reserva', () => {
      const rest = new Restaurant(10);
      const reservaHoy = createReservation({ id: 'res-hoy', customerCount: 3, date: '2026-09-01' });
      const reservaManana = createReservation({ id: 'res-manana', customerCount: 4, date: '2026-09-02' });

      rest.addReservation(reservaHoy);
      rest.addReservation(reservaManana);

      rest.cancelReservation('res-hoy');

      expect(rest.getAvailableCapacity('2026-09-01')).toBe(10);
      expect(rest.getAvailableCapacity('2026-09-02')).toBe(6);
    });
  });

  describe('5. Validaciones de entrada y casos límite', () => {
    it('debe lanzar InvalidReservationIdError cuando el ID es una cadena vacía', () => {
      expect(() => restaurant.cancelReservation('')).toThrow(
        InvalidReservationIdError
      );
      expect(() => restaurant.cancelReservation('')).toThrow(
        'ID de reserva inválido'
      );
    });

    it('debe lanzar InvalidReservationIdError cuando el ID contiene solo espacios en blanco', () => {
      expect(() => restaurant.cancelReservation('   ')).toThrow(
        InvalidReservationIdError
      );
      expect(() => restaurant.cancelReservation('   ')).toThrow(
        'ID de reserva inválido'
      );
    });

    it('debe lanzar InvalidReservationIdError cuando el ID es nulo o indefinido', () => {
      expect(() =>
        restaurant.cancelReservation(null as unknown as string)
      ).toThrow(InvalidReservationIdError);
      expect(() =>
        restaurant.cancelReservation(undefined as unknown as string)
      ).toThrow(InvalidReservationIdError);
    });

    it('no debe permitir crear un restaurante con capacidad negativa', () => {
      expect(() => new Restaurant(-1)).toThrow(
        'La capacidad no puede ser negativa'
      );
    });
  });
});
