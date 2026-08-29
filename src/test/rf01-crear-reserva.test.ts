import { describe, it, expect, beforeEach } from 'vitest';
import { Restaurant } from '../restaurant.js';

describe('RF01 - Crear Reserva', () => {

  let restaurante: Restaurant;

  beforeEach(() => {
    restaurante = new Restaurant(10);
  });

  // PRUEBA 1 ✅
  it('debe crear una reserva correctamente con datos válidos', () => {
    const reserva = restaurante.crearReserva({
      nombreCliente: 'Juan Pérez',
      cantidadPersonas: 4,
      fecha: '2026-09-15',
      hora: '20:00',
    });
    expect(reserva).toBeDefined();
  });

  // PRUEBA 2 ✅
  it('debe generar un código de reserva único por cada reserva creada', () => {
    const reserva1 = restaurante.crearReserva({
      nombreCliente: 'Ana García',
      cantidadPersonas: 2,
      fecha: '2026-09-15',
      hora: '20:00',
    });
    const reserva2 = restaurante.crearReserva({
      nombreCliente: 'Carlos López',
      cantidadPersonas: 3,
      fecha: '2026-09-15',
      hora: '21:00',
    });
    expect(reserva1.codigoReserva).toBeDefined();
    expect(reserva2.codigoReserva).toBeDefined();
    expect(reserva1.codigoReserva).not.toBe(reserva2.codigoReserva);
  });

  // PRUEBA 3: Datos preservados correctamente
  it('debe guardar la fecha y hora correctas en la reserva', () => {
    const reserva = restaurante.crearReserva({
      nombreCliente: 'María Torres',
      cantidadPersonas: 5,
      fecha: '2026-09-20',
      hora: '19:30',
    });
    expect(reserva.fecha).toBe('2026-09-20');
    expect(reserva.hora).toBe('19:30');
  });

});
