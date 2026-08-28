import { describe, it, expect, beforeEach } from 'vitest';
import { Restaurant } from '../restaurant.js';

// =============================================================================
// RF01 - CREAR RESERVA
// Ciclo TDD: Fase RED → estas pruebas deben FALLAR inicialmente
// porque la lógica del método crearReserva() aún no está implementada.
// =============================================================================

describe('RF01 - Crear Reserva', () => {

  let restaurante: Restaurant;

  beforeEach(() => {
    // Se crea una instancia nueva del restaurante antes de cada prueba.
    // La capacidad máxima por horario es configurable; usamos 10 personas.
    restaurante = new Restaurant(10);
  });

  // ---------------------------------------------------------------------------
  // PRUEBA 1: Creación exitosa de una reserva con datos válidos
  // Verifica que el método crearReserva existe y retorna un objeto reserva.
  // ---------------------------------------------------------------------------
  it('debe crear una reserva correctamente con datos válidos', () => {
    const reserva = restaurante.crearReserva({
      nombreCliente: 'Juan Pérez',
      cantidadPersonas: 4,
      fecha: '2026-09-15',
      hora: '20:00',
    });

    expect(reserva).toBeDefined();
  });
});
