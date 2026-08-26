import { describe, it, expect, beforeEach } from 'vitest';
import { StringCalculator } from './calculator.js';

describe('StringCalculator (Ciclo TDD)', () => {
  let calculator: StringCalculator;

  beforeEach(() => {
    calculator = new StringCalculator();
  });

  it('debe retornar 0 para una cadena vacía', () => {
    // 1. RED -> 2. GREEN -> 3. REFACTOR
    expect(calculator.add('')).toBe(0);
  });

  it('debe retornar el mismo número si la cadena contiene solo un número', () => {
    expect(calculator.add('5')).toBe(5);
  });

  it('debe sumar dos números separados por coma', () => {
    expect(calculator.add('1,2')).toBe(3);
  });

  it('debe manejar múltiples números separados por coma', () => {
    expect(calculator.add('1,2,3,4,5')).toBe(15);
  });

  it('debe permitir saltos de línea como separadores', () => {
    expect(calculator.add('1\n2,3')).toBe(6);
  });

  it('debe lanzar un error cuando hay números negativos', () => {
    expect(() => calculator.add('1,-2,3,-4')).toThrow(
      'Números negativos no permitidos: -2, -4'
    );
  });

  it('debe lanzar un error si la entrada no es numérica', () => {
    expect(() => calculator.add('1,abc')).toThrow('Número inválido: "abc"');
  });
});
