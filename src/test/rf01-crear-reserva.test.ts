import { describe, it, expect, beforeEach } from 'vitest';
import { Restaurant } from '../restaurant.js';

describe('RF01 - Crear Reserva', () => {

  let restaurante: Restaurant;

  beforeEach(() => {
    restaurante = new Restaurant(10);
  });

  // PRUEBA 1 ✅
  it('debe crear una reserva correctamente con datos válidos', () => {
    const reserva = restaurante.crearReserva({ nombreCliente: 'Juan Pérez', cantidadPersonas: 4, fecha: '2026-09-15', hora: '20:00' });
    expect(reserva).toBeDefined();
  });

  // PRUEBA 2 ✅
  it('debe generar un código de reserva único por cada reserva creada', () => {
    const r1 = restaurante.crearReserva({ nombreCliente: 'Ana García', cantidadPersonas: 2, fecha: '2026-09-15', hora: '20:00' });
    const r2 = restaurante.crearReserva({ nombreCliente: 'Carlos López', cantidadPersonas: 3, fecha: '2026-09-15', hora: '21:00' });
    expect(r1.codigoReserva).not.toBe(r2.codigoReserva);
  });

  // PRUEBA 3 ✅
  it('debe guardar la fecha y hora correctas en la reserva', () => {
    const reserva = restaurante.crearReserva({ nombreCliente: 'María Torres', cantidadPersonas: 5, fecha: '2026-09-20', hora: '19:30' });
    expect(reserva.fecha).toBe('2026-09-20');
    expect(reserva.hora).toBe('19:30');
  });

  // PRUEBA 4a ✅
  it('debe lanzar un error si el nombre del cliente está vacío', () => {
    expect(() => restaurante.crearReserva({ nombreCliente: '', cantidadPersonas: 3, fecha: '2026-09-15', hora: '20:00' }))
      .toThrow('El nombre del cliente es obligatorio');
  });

  // PRUEBA 4b ✅
  it('debe lanzar un error si la fecha está vacía', () => {
    expect(() => restaurante.crearReserva({ nombreCliente: 'Pedro Martínez', cantidadPersonas: 2, fecha: '', hora: '20:00' }))
      .toThrow('La fecha es obligatoria');
  });

  // PRUEBA 4c ✅
  it('debe lanzar un error si la hora está vacía', () => {
    expect(() => restaurante.crearReserva({ nombreCliente: 'Pedro Martínez', cantidadPersonas: 2, fecha: '2026-09-15', hora: '' }))
      .toThrow('La hora es obligatoria');
  });

  // PRUEBA 5a: cantidad de personas = 0
  it('debe lanzar un error si la cantidad de personas es 0', () => {
    expect(() => restaurante.crearReserva({ nombreCliente: 'Luis Ramírez', cantidadPersonas: 0, fecha: '2026-09-15', hora: '20:00' }))
      .toThrow('La cantidad de personas debe ser mayor a cero');
  });

  // PRUEBA 5b: cantidad de personas negativa
  it('debe lanzar un error si la cantidad de personas es negativa', () => {
    expect(() => restaurante.crearReserva({ nombreCliente: 'Luis Ramírez', cantidadPersonas: -3, fecha: '2026-09-15', hora: '20:00' }))
      .toThrow('La cantidad de personas debe ser mayor a cero');
  });

});
