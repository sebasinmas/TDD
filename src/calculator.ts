/**
 * Módulo de ejemplo para TDD
 */

export class StringCalculator {
  /**
   * Suma los números contenidos en una cadena separados por coma o salto de línea.
   * 
   * @param numbers Cadena de números (ej. "1,2,3")
   * @returns La suma de los números
   */
  add(numbers: string): number {
    if (!numbers || numbers.trim() === '') {
      return 0;
    }

    const normalizedInput = numbers.replace(/\n/g, ',');
    const numberArray = normalizedInput.split(',');

    const parsedNumbers = numberArray.map((num) => {
      const parsed = Number(num);
      if (isNaN(parsed)) {
        throw new Error(`Número inválido: "${num}"`);
      }
      return parsed;
    });

    const negatives = parsedNumbers.filter((n) => n < 0);
    if (negatives.length > 0) {
      throw new Error(`Números negativos no permitidos: ${negatives.join(', ')}`);
    }

    return parsedNumbers.reduce((sum, n) => sum + n, 0);
  }
}
